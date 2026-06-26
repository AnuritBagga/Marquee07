from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import json
import logging
import httpx
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Any
import uuid
from datetime import datetime, timezone
from groq import Groq
import google.generativeai as genai
from problem_bank import get_random_dsa_problem, get_random_sql_problem

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# ── DB ──────────────────────────────────────────────────────────────────────
mongo_url = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
client_db = AsyncIOMotorClient(mongo_url)
db = client_db[os.environ.get("DB_NAME", "marquee_db")]

# ── Groq  (real-time questions + Whisper transcription) ─────────────────────
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None
GROQ_AUDIO_URL = "https://api.groq.com/openai/v1/audio/transcriptions"

# ── OpenRouter (fallback for Groq when rate limit reached) ─────────────────
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

# ── Gemini  (scorecard + code AI review) ────────────────────────────────────
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel("gemini-2.5-flash")
else:
    gemini_model = None

# ── Judge0  (compiler) ──────────────────────────────────────────────────────
JUDGE0_BASE = "https://ce.judge0.com"
JUDGE0_LANG_MAP = {"javascript": 63, "python": 71, "java": 62, "cpp": 54}

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


# ═══════════════════════════════════════════════════════════════════════════════
# HELPERS
# ═══════════════════════════════════════════════════════════════════════════════

def extract_json(text: str) -> dict:
    text = text.strip()
    if text.startswith("```"):
        lines = text.split("\n")
        lines = [l for l in lines if not l.strip().startswith("```")]
        text = "\n".join(lines).strip()
    start = text.find("{")
    end = text.rfind("}") + 1
    if start == -1 or end == 0:
        raise ValueError(f"No JSON object found in: {text[:200]}")
    return json.loads(text[start:end])


async def _judge0_run(language_id: int, source_code: str, stdin: str = "") -> dict:
    async with httpx.AsyncClient(timeout=45.0) as http:
        r = await http.post(
            f"{JUDGE0_BASE}/submissions?base64_encoded=false&wait=true",
            json={
                "language_id":    language_id,
                "source_code":    source_code,
                "stdin":          stdin,
                "cpu_time_limit": 5,
                "memory_limit":   256000,
            },
        )
        r.raise_for_status()
        return r.json()


# ═══════════════════════════════════════════════════════════════════════════════
# STATUS ROUTES
# ═══════════════════════════════════════════════════════════════════════════════

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

@api_router.get("/")
async def root():
    return {
        "message": "Marquee API",
        "groq_enabled": groq_client is not None,
        "gemini_enabled": gemini_model is not None,
        "openrouter_enabled": OPENROUTER_API_KEY is not None,
    }

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    obj = StatusCheck(**input.model_dump())
    doc = obj.model_dump()
    doc["timestamp"] = doc["timestamp"].isoformat()
    await db.status_checks.insert_one(doc)
    return obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    rows = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for r in rows:
        if isinstance(r["timestamp"], str):
            r["timestamp"] = datetime.fromisoformat(r["timestamp"])
    return rows


# ═══════════════════════════════════════════════════════════════════════════════
# DEMO INTERVIEWER  (unchanged)
# ═══════════════════════════════════════════════════════════════════════════════

DOMAIN_PERSONAS = {
    "dsa": (
        "You are Riya Menon, a senior software engineer at Northwind Labs conducting a "
        "data-structures-and-algorithms interview. Ask sharp, focused questions about coding, "
        "complexity analysis, and trade-offs. Cross-question the candidate's reasoning. "
        "Probe for edge cases. Stay calm, professional, occasionally warm."
    ),
    "system": (
        "You are Karan Iyer, a staff engineer at Helix & Co. conducting a system-design "
        "interview. Ask about scale, trade-offs, bottlenecks, and failure modes. Push the "
        "candidate to justify every choice. Reference earlier answers in your follow-ups."
    ),
    "upsc": (
        "You are Dr. Mehta, a poised UPSC Board Chairperson conducting the personality test. "
        "Ask thoughtful questions on ethics, governance, current affairs, and the candidate's "
        "background. Cross-question composure under pressure. Speak with measured gravitas."
    ),
    "behavioral": (
        "You are Anya Kapoor, VP of People at Atlas Dynamics, conducting a behavioral interview. "
        "Use STAR-style probing. Cross-question for specificity and self-awareness. Be empathic "
        "but rigorous."
    ),
}

INTERVIEWER_RULES = (
    "\n\nRules: (1) Ask ONE concise follow-up question, 1-3 sentences max. "
    "(2) Reference the candidate's last answer specifically. "
    "(3) Do not summarise. Do not preamble. Just ask the next question. "
    "(4) When the conversation reaches ~5 turns, deliver a brief closing remark and end with [END]."
)


class Turn(BaseModel):
    role: str
    content: str

class NextQuestionRequest(BaseModel):
    domain: str
    history: List[Turn]
    candidate_name: Optional[str] = "the candidate"

class NextQuestionResponse(BaseModel):
    question: str
    ended: bool


@api_router.post("/sessions/next-question", response_model=NextQuestionResponse)
async def next_question(payload: NextQuestionRequest):
    if not groq_client:
        raise HTTPException(status_code=503, detail="GROQ_API_KEY not configured")

    persona = DOMAIN_PERSONAS.get(payload.domain, DOMAIN_PERSONAS["behavioral"])
    system_prompt = persona + INTERVIEWER_RULES

    messages = [{"role": "system", "content": system_prompt}]
    for t in payload.history[-12:]:
        role = t.role if t.role in ("assistant", "user") else "user"
        messages.append({"role": role, "content": t.content})

    if not payload.history:
        messages.append({
            "role": "user",
            "content": (
                f"Begin the interview. Greet {payload.candidate_name} briefly and ask your "
                f"opening question."
            ),
        })

    try:
        completion = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.7,
            max_tokens=220,
        )
        text = (completion.choices[0].message.content or "").strip()
    except Exception as e:
        logger.exception("Groq chat failed")
        raise HTTPException(status_code=502, detail=f"Groq chat failed: {e}")

    ended = "[END]" in text
    text = text.replace("[END]", "").strip().strip('"').strip()

    return NextQuestionResponse(question=text, ended=ended)


# ═══════════════════════════════════════════════════════════════════════════════
# TRANSCRIBE  (Groq Whisper)
# ═══════════════════════════════════════════════════════════════════════════════

@api_router.post("/sessions/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    if not GROQ_API_KEY:
        raise HTTPException(status_code=503, detail="GROQ_API_KEY not configured")

    audio_bytes = await file.read()
    if not audio_bytes or len(audio_bytes) < 500:
        return {"text": ""}

    headers = {"Authorization": f"Bearer {GROQ_API_KEY}"}
    files = {
        "file": (
            file.filename or "audio.webm",
            audio_bytes,
            file.content_type or "audio/webm",
        )
    }
    data = {"model": "whisper-large-v3-turbo", "response_format": "json"}

    try:
        async with httpx.AsyncClient(timeout=90.0) as http:
            resp = await http.post(GROQ_AUDIO_URL, headers=headers, files=files, data=data)
    except Exception as e:
        logger.exception("Whisper request failed")
        raise HTTPException(status_code=502, detail=f"Whisper request failed: {e}")

    if resp.status_code != 200:
        logger.error(f"Whisper API error (status {resp.status_code}): {resp.text[:300]}")
        raise HTTPException(status_code=resp.status_code, detail=f"Whisper error: {resp.text}")

    result = resp.json()
    return {"text": (result.get("text") or "").strip()}


# ═══════════════════════════════════════════════════════════════════════════════
# PRACTICE MODULE
# ═══════════════════════════════════════════════════════════════════════════════

PRACTICE_PERSONAS = {
    "technical": (
        "You are Riya Menon, a senior software engineer conducting a technical interview. "
        "Your style is sharp, curious, and direct. "
        "\n\nINTERVIEW FLOW (STRICT - EXACTLY 11 QUESTIONS):"
        "\n- Q1: ALWAYS start with 'Tell me about yourself' or 'Introduce yourself'"
        "\n- Q2: Pick ONE specific thing from their introduction and ask a follow-up. Add natural acknowledgments like 'Hmm, interesting' or 'I see' or 'Okay' before the question."
        "\n- Q3-4: Ask about their resume — specific projects, technologies, or experiences they mentioned. Add acknowledgments ('Hmm', 'Okay', 'Got it') to show you're listening. Cross-question their technical choices."
        "\n- Q5-6: Ask about their domain knowledge (CS fundamentals, system design, etc.) related to their background. Use acknowledgments naturally."
        "\n- Q7: Deep dive into ONE project from their resume. Ask about challenges, architecture, trade-offs. Show engagement with acknowledgments."
        "\n- Q8: Ask about OOP, DBMS, or OS concepts based on their background."
        "\n- Q9: FIRST DSA coding problem - set type='coding' and fill dsaProblem with a random LeetCode-style problem (Easy/Medium) with exactly 4 test cases."
        "\n- Q10: SECOND DSA coding problem - set type='coding' with another DSA problem (Medium difficulty) with exactly 4 test cases."
        "\n- Q11: BONUS SQL question - set type='coding' with an SQL query problem and exactly 4 test cases. After this, say 'Thank you for your time. Have a great day!' and set ended=true."
        "\n\nNATURAL CONVERSATION: Between questions, occasionally use natural acknowledgments like 'Hmm', 'I see', 'Okay', 'Interesting', 'Got it' to show active listening."
        "\nCROSS-QUESTIONING: Always probe deeper. Don't accept surface-level answers. Ask 'Why?', 'How?', 'What if...?'"
        "\nAFTER Q11: Set ended=true with closing message 'Thank you for your time today. Have a great day!'"
    ),
    "domain": (
        "You are Karan Iyer, a staff engineer conducting a domain interview. "
        "\n\nINTERVIEW FLOW (STRICT - EXACTLY 11 QUESTIONS):"
        "\n- Q1: ALWAYS start with 'Tell me about yourself' or 'Introduce yourself'"
        "\n- Q2: Pick ONE thing from introduction and ask follow-up. Add acknowledgment ('Hmm', 'I see')."
        "\n- Q3-7: Ask about CS fundamentals (OS, DBMS, Networks, OOP) based on their resume. Use natural acknowledgments."
        "\n- Q8: Deep dive into their domain/projects with cross-questioning. Show engagement."
        "\n- Q9: DSA coding problem with 4 test cases."
        "\n- Q10: Second DSA problem with 4 test cases."
        "\n- Q11: SQL question with 4 test cases. Then end with 'Thank you! Have a great day!' and set ended=true."
        "\n\nBe rigorous. Pull specific facts from the resume and probe them. "
        "Cross-question every claim. Reference prior answers in follow-ups. "
        "Use natural acknowledgments ('Okay', 'Hmm', 'Got it') to show active listening."
    ),
    "upsc": (
        "You are Dr. R. Mehta, a UPSC Board Chairperson conducting the Personality Test. "
        "\n\nINTERVIEW FLOW (STRICT - EXACTLY 8 QUESTIONS):"
        "\n- Q1: ALWAYS start with 'Tell me about yourself' or 'Introduce yourself'"
        "\n- Q2: Pick something from introduction. Add dignified acknowledgment."
        "\n- Q3-4: Questions on ethics, governance based on their background."
        "\n- Q5-6: Current affairs and public service motivation. Show engagement."
        "\n- Q7-8: Test composure with challenging questions on contradictions."
        "\nAFTER Q8: End with dignified closing and set ended=true."
        "\n\nYour tone is measured, dignified, and probing. "
        "Challenge contradictions politely but firmly. Use measured acknowledgments."
    ),
    "defence": (
        "You are Col. Arjun Singh, a Selection Officer conducting an SSB/NDA interview. "
        "\n\nINTERVIEW FLOW (STRICT - EXACTLY 8 QUESTIONS):"
        "\n- Q1: ALWAYS start with 'Tell me about yourself' or 'Introduce yourself'"
        "\n- Q2: Pick something from introduction. Direct acknowledgment."
        "\n- Q3-5: Leadership situations, team experiences from their background."
        "\n- Q6-7: General knowledge and defence forces motivation. Show engagement."
        "\n- Q8: Decisive scenario-based question."
        "\nAFTER Q8: End with military-style closing and set ended=true."
        "\n\nYou are direct, confident, and evaluative. Value honesty, clarity, and decisiveness. "
        "Use brief military-style acknowledgments ('Understood', 'Right')."
    ),
}

PRACTICE_PERSONAS_INFO = {
    "technical": {
        "name": "Riya Menon",
        "title": "Senior Engineer · Northwind Labs",
        "portrait": "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=900&h=1100&q=85",
    },
    "domain": {
        "name": "Karan Iyer",
        "title": "Staff Engineer · Helix & Co.",
        "portrait": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=900&h=1100&q=85",
    },
    "upsc": {
        "name": "Dr. R. Mehta",
        "title": "Board Chairperson · UPSC Panel",
        "portrait": "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=900&h=1100&q=85",
    },
    "defence": {
        "name": "Col. Arjun Singh",
        "title": "Selection Officer · SSB Board",
        "portrait": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&h=1100&q=85",
    },
}

QUESTION_JSON_RULES = '''

ABSOLUTE RULES — read carefully:
1. Respond ONLY with valid JSON. No preamble, no markdown fences, no explanation outside JSON.
2. Use exactly this schema:
{
  "question": "<your single question, 1-3 sentences>",
  "type": "verbal",
  "dsaProblem": null,
  "ended": false,
  "closing": null
}
3. For a DSA coding question (Q9, Q10) or SQL question (Q11), you MUST provide with EXACTLY 4 test cases:
{
  "question": "Let's move to coding. I'm sharing a problem with you. Read it and start coding.",
  "type": "coding",
  "dsaProblem": {
    "title": "Valid Problem Title",
    "difficulty": "Easy" or "Medium" or "Hard",
    "description": "Clear problem statement explaining what needs to be solved",
    "examples": ["Input: example1 -> Output: result1", "Input: example2 -> Output: result2"],
    "testCases": [
      {"input": "test input 1", "expected": "expected output 1"},
      {"input": "test input 2", "expected": "expected output 2"},
      {"input": "test input 3", "expected": "expected output 3"},
      {"input": "test input 4", "expected": "expected output 4"}
    ],
    "starterPython": "def solution(params):\\n    pass",
    "starterJava": "public class Solution {\\n    public ReturnType solution(params) {\\n        return null;\\n    }\\n}",
    "starterCpp": "class Solution {\\npublic:\\n    ReturnType solution(params) {\\n        return {};\\n    }\\n};",
    "starterSQL": "-- Write your SQL query here\\nSELECT * FROM table_name;"
  },
  "ended": false,
  "closing": null
}
4. After Q11 (11th question), you MUST set ended=true and closing="Thank you for your time today. Have a great day!"
5. For Q1, ALWAYS ask "Tell me about yourself" or similar introduction question.
6. For Q2-Q8, reference their previous answer specifically. Use acknowledgments naturally.
7. Never repeat a question already asked. Keep questions focused and clear.
8. testCases must use stdin format strings — what the program reads from input — so they can run on Judge0.
'''


def build_practice_system(interview_type: str, resume_text: str, skills: list) -> str:
    persona = PRACTICE_PERSONAS.get(interview_type, PRACTICE_PERSONAS["technical"])
    skills_str = f"Candidate's highlighted skills: {', '.join(skills)}." if skills else ""
    resume_block = (
        f"\n\nCandidate Resume (MANDATORY - use this to personalize ALL questions):\n{resume_text[:2500]}"
        if resume_text and resume_text.strip()
        else "\n\nWARNING: No resume provided. Ask for resume first, then start with introduction question."
    )
    return persona + "\n\n" + skills_str + resume_block + QUESTION_JSON_RULES


def build_scorecard_prompt(
        interview_type: str,
        candidate_name: str,
        duration_seconds: int,
        history: list,
        dsa_problem_title=None,
        test_results=None,
) -> str:
    transcript = "\n\n".join(
        f"[{t['role'].upper()}]: {t['content'][:400]}" for t in history
    )
    dsa_block = ""
    if dsa_problem_title:
        results_str = ", ".join(test_results) if test_results else "not run"
        dsa_block = f"\nDSA Problem attempted: {dsa_problem_title}\nTest case results: {results_str}"

    mins = duration_seconds // 60
    secs = duration_seconds % 60
    q_count = sum(1 for t in history if t["role"] == "assistant")

    return f"""You are an expert interview evaluator. Analyse this {interview_type} interview comprehensively and return a detailed scorecard.

Candidate: {candidate_name or "Anonymous"}
Duration: {mins}m {secs}s
Questions asked: {q_count}
{dsa_block}

TRANSCRIPT:
{transcript}

EVALUATION CRITERIA:
1. **Answer Quality**: Relevance, depth, structure (STAR format), concrete examples with measurable impact
2. **Communication**: Clarity, articulation, logical flow, ability to explain complex concepts
3. **Filler Words**: Count and impact of "um", "uh", "like", "you know", "basically", "actually", etc.
4. **Pauses & Hesitations**: Frequency of long pauses, awkward silences, or stuttering that disrupts flow
5. **Confidence**: Tone, conviction, ability to handle follow-up questions without excessive hedging
6. **Technical Depth**: Accuracy, understanding of fundamentals, practical knowledge
7. **Problem-Solving**: Structured thinking, trade-off analysis, edge case consideration

Respond ONLY with valid JSON (no markdown, no explanation):
{{
  "overall": <integer 0-100>,
  "grade": "A+" or "A" or "B+" or "B" or "C+" or "C" or "D",
  "verdict": "Shortlist" or "Consider" or "Reject",
  "metrics": [
    {{"name": "Communication", "score": <0-100>, "note": "<10 words>"}},
    {{"name": "Technical Depth", "score": <0-100>, "note": "<10 words>"}},
    {{"name": "Problem Solving", "score": <0-100>, "note": "<10 words>"}},
    {{"name": "Confidence", "score": <0-100>, "note": "<10 words>"}},
    {{"name": "Fluency & Delivery", "score": <0-100>, "note": "<10 words - assess fillers, pauses>"}}
  ],
  "strengths": ["<1 sentence>", "<1 sentence>"],
  "improvements": ["<1 sentence - mention specific fillers/pauses if excessive>", "<1 sentence>"],
  "feedback": "<3-4 sentence overall honest paragraph analyzing answer quality, communication style, filler usage, and delivery>",
  "codeFeedback": "<2-3 sentence code feedback or null>",
  "fillerAnalysis": "<1 sentence noting frequency of filler words like um, uh, like, etc. or 'Minimal fillers'>",
  "deliveryNotes": "<1 sentence on pacing, pauses, and overall verbal fluency>"
}}"""


def build_code_eval_prompt(language: str, code: str, problem: dict) -> str:
    test_cases = "\n".join(
        f"Case {i+1}: input={tc.get('input','')} expected={tc.get('expected','')}"
        for i, tc in enumerate(problem.get("testCases", []))
    )
    return f"""Review this {language} code for the problem: {problem.get("title", "Unknown")}.

Problem: {problem.get("description", "")}

Test cases:
{test_cases}

Code:
```{language}
{code}
Respond ONLY with valid JSON (no markdown): {{ "timeComplexity": "O(n)", "spaceComplexity": "O(1)", "explanation": "<2-3 sentence honest code review>", "hint": "<one improvement tip or null if good>" }} """

# Pydantic models
class PracticeTurn(BaseModel):
    role: str
    content: str

class PracticeQuestionRequest(BaseModel):
    interviewType: str = "technical"
    history: List[PracticeTurn] = []
    resumeText: Optional[str] = ""
    skills: Optional[List[str]] = []
    candidateName: Optional[str] = "the candidate"
    questionType: Optional[str] = None  # "dsa", "sql", or None for verbal
    questionIndex: Optional[int] = None
    usedDsaTitles: Optional[List[str]] = []  # Track which DSA problems were already used

class PracticeQuestionResponse(BaseModel):
    question: str
    type: str
    dsaProblem: Optional[Any] = None
    sqlProblem: Optional[Any] = None
    ended: bool = False
    closing: Optional[str] = None

class PracticeEvaluateRequest(BaseModel):
    interviewType: str = "technical"
    candidateName: Optional[str] = "the candidate"
    durationSeconds: int = 0
    history: List[PracticeTurn]
    dsaProblemTitle: Optional[str] = None
    testResults: Optional[List[str]] = None

class PracticeRunCodeRequest(BaseModel):
    language: str
    code: str
    problem: Any
    judge0Result: Optional[Any] = None

# POST /api/practice/question — Groq → OpenRouter fallback
@api_router.post("/practice/question", response_model=PracticeQuestionResponse)
async def practice_question(payload: PracticeQuestionRequest):
    if not groq_client and not OPENROUTER_API_KEY:
        raise HTTPException(status_code=503, detail="No AI API keys configured")

    # ── HANDLE DSA QUESTIONS ────────────────────────────────────────────────
    if payload.questionType == "dsa":
        problem = get_random_dsa_problem(exclude_titles=payload.usedDsaTitles or [])
        return PracticeQuestionResponse(
            question=f"Great! Now let's move to a coding problem. I'll give you a {problem['difficulty']} difficulty problem. Take your time to think through it and write your solution in the code editor.",
            type="dsa",
            dsaProblem=problem,
            sqlProblem=None,
            ended=False,
            closing=None
        )
    
    # ── HANDLE SQL QUESTIONS ────────────────────────────────────────────────
    if payload.questionType == "sql":
        problem = get_random_sql_problem()
        return PracticeQuestionResponse(
            question=f"Excellent! For the final question, let's test your SQL skills. Here's a {problem['difficulty']} difficulty database problem. Write your SQL query in the editor.",
            type="sql",
            sqlProblem=problem,
            dsaProblem=None,
            ended=False,
            closing=None
        )

    # ── HANDLE VERBAL QUESTIONS (original AI flow) ─────────────────────────
    system = build_practice_system(
        payload.interviewType,
        payload.resumeText or "",
        payload.skills or [],
    )

    messages = [{"role": "system", "content": system}]
    for t in payload.history[-14:]:
        role = "assistant" if t.role == "assistant" else "user"
        messages.append({"role": role, "content": t.content})

    if not payload.history:
        messages.append({
            "role": "user",
            "content": (
                f"Begin the interview now. This is Question 1. "
                f"Greet {payload.candidateName or 'the candidate'} warmly in one brief sentence, "
                f"then ask them to introduce themselves. "
                f"Your first question MUST be 'Tell me about yourself' or similar. "
                f"Return valid JSON per the schema."
            ),
        })
    else:
        q_num = len([m for m in messages if m.get('role') == 'assistant']) + 1
        messages.append({
            "role": "user",
            "content": (
                f"Continue the interview. This is Question {q_num}. "
                "Follow the interview flow strictly. Cross-question my last answer or ask the next "
                "relevant question based on the flow. Use natural acknowledgments when appropriate. "
                "Return valid JSON per the schema."
            ),
        })

    raw = None

    if groq_client:
        try:
            completion = groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages,
                temperature=0.72,
                max_tokens=800,
            )
            raw = (completion.choices[0].message.content or "").strip()
            logger.info(f"Groq practice raw: {raw[:300]}")
        except Exception as e:
            logger.warning(f"Groq failed, trying OpenRouter fallback: {e}")
            if OPENROUTER_API_KEY:
                try:
                    async with httpx.AsyncClient(timeout=60.0) as client:
                        response = await client.post(
                            OPENROUTER_API_URL,
                            headers={
                                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                                "Content-Type": "application/json",
                            },
                            json={
                                "model": "meta-llama/llama-3.3-70b-instruct",
                                "messages": messages,
                                "temperature": 0.72,
                                "max_tokens": 800,
                            }
                        )
                        if response.status_code == 200:
                            raw = response.json().get("choices", [{}])[0].get("message", {}).get("content", "").strip()
                            logger.info(f"OpenRouter fallback success: {raw[:300]}")
                        else:
                            raise HTTPException(status_code=502, detail=f"OpenRouter failed: {response.status_code}")
                except Exception as or_error:
                    logger.exception("OpenRouter fallback failed")
                    raise HTTPException(status_code=502, detail=f"Both APIs failed. Groq: {e}, OR: {or_error}")
            else:
                raise HTTPException(status_code=502, detail=f"Groq failed and no OpenRouter key: {e}")
    elif OPENROUTER_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    OPENROUTER_API_URL,
                    headers={"Authorization": f"Bearer {OPENROUTER_API_KEY}", "Content-Type": "application/json"},
                    json={
                        "model": "meta-llama/llama-3.3-70b-instruct",
                        "messages": messages,
                        "temperature": 0.72,
                        "max_tokens": 800,
                    },
                )
                if response.status_code == 200:
                    raw = response.json().get("choices", [{}])[0].get("message", {}).get("content", "").strip()
                else:
                    raise HTTPException(status_code=502, detail=f"OpenRouter failed: {response.text[:200]}")
        except Exception as e:
            logger.exception("OpenRouter request failed")
            raise HTTPException(status_code=502, detail=f"OpenRouter failed: {e}")

    if not raw:
        raise HTTPException(status_code=502, detail="Failed to get response from any API")

    try:
        data = extract_json(raw)
    except Exception as e:
        logger.warning(f"JSON parse failed, using raw text. Error: {e}")
        data = {
            "question": raw.strip().strip('"'),
            "type": "verbal",
            "dsaProblem": None,
            "sqlProblem": None,
            "ended": False,
            "closing": None,
        }

    return PracticeQuestionResponse(
        question=data.get("question", ""),
        type=data.get("type", "verbal"),
        dsaProblem=data.get("dsaProblem"),
        sqlProblem=data.get("sqlProblem"),
        ended=bool(data.get("ended", False)),
        closing=data.get("closing"),
    )


# POST /api/practice/evaluate — Gemini → OpenRouter fallback
@api_router.post("/practice/evaluate")
async def practice_evaluate(payload: PracticeEvaluateRequest):
    if not gemini_model and not OPENROUTER_API_KEY:
        raise HTTPException(status_code=503, detail="No AI API keys configured for evaluation")

    prompt = build_scorecard_prompt(
        interview_type=payload.interviewType,
        candidate_name=payload.candidateName or "Anonymous",
        duration_seconds=payload.durationSeconds,
        history=[t.model_dump() for t in payload.history],
        dsa_problem_title=payload.dsaProblemTitle,
        test_results=payload.testResults,
    )

    raw = None

    # Try Gemini first
    if gemini_model:
        try:
            response = gemini_model.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(temperature=0.4, max_output_tokens=1200),
            )
            raw = response.text.strip()
            logger.info(f"Gemini scorecard raw: {raw[:300]}")
        except Exception as e:
            logger.warning(f"Gemini evaluate failed, trying OpenRouter fallback: {e}")
            raw = None

    # Fallback to OpenRouter if Gemini failed or not available
    if not raw and OPENROUTER_API_KEY:
        try:
            logger.info("Using OpenRouter for scorecard generation")
            async with httpx.AsyncClient(timeout=90.0) as client:
                response = await client.post(
                    OPENROUTER_API_URL,
                    headers={
                        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": "meta-llama/llama-3.3-70b-instruct",
                        "messages": [
                            {"role": "system", "content": "You are an expert interview evaluator. Analyze interviews and provide detailed scorecards in JSON format."},
                            {"role": "user", "content": prompt}
                        ],
                        "temperature": 0.4,
                        "max_tokens": 1200,
                    }
                )
                if response.status_code == 200:
                    raw = response.json().get("choices", [{}])[0].get("message", {}).get("content", "").strip()
                    logger.info(f"OpenRouter scorecard raw: {raw[:300]}")
                else:
                    logger.error(f"OpenRouter evaluate failed: {response.status_code}")
        except Exception as e:
            logger.exception("OpenRouter evaluate failed")

    # If both failed, return error
    if not raw:
        raise HTTPException(status_code=502, detail="Failed to generate scorecard from any AI service")

    try:
        data = extract_json(raw)
    except Exception as e:
        logger.warning(f"JSON parse failed: {e}")
        data = {
            "overall": 65, "grade": "B", "verdict": "Consider",
            "metrics": [
                {"name": "Communication", "score": 65, "note": "Decent flow"},
                {"name": "Technical Depth", "score": 60, "note": "Room to grow"},
                {"name": "Problem Solving", "score": 65, "note": "Structured thinking"},
                {"name": "Confidence", "score": 70, "note": "Solid presence"},
                {"name": "Domain Knowledge", "score": 60, "note": "Needs depth"},
            ],
            "strengths": ["Engaged throughout the session.", "Communicated clearly."],
            "improvements": ["Go deeper on technical fundamentals.", "Provide more concrete examples."],
            "feedback": "The candidate showed good engagement. Work on more specific technical depth. Promising performance with clear areas to strengthen.",
            "codeFeedback": None,
        }

    return data
    return data


# POST /api/practice/judge0 — Code execution proxy (kills CORS)
@api_router.post("/practice/judge0")
async def judge0_proxy(body: dict):
    lang = body.get("language", "python")
    code = body.get("code", "")
    stdin = body.get("stdin", "")
    lang_id = JUDGE0_LANG_MAP.get(lang)
    if not lang_id:
        raise HTTPException(400, f"Unsupported language: {lang}")
    try:
        return await _judge0_run(lang_id, code, stdin)
    except Exception as e:
        logger.error(f"Judge0 proxy error: {e}")
        raise HTTPException(502, "Judge0 execution failed")


# POST /api/practice/run-code — Judge0 testcases + Gemini review
@api_router.post("/practice/run-code")
async def practice_run_code(payload: PracticeRunCodeRequest):
    problem = payload.problem or {}
    test_cases = problem.get("testCases", []) or []
    n = len(test_cases)

    # Empty code guard
    if not payload.code or not payload.code.strip():
        return {
            "results": [
                {"passed": False, "input": tc.get("input", ""),
                 "expected": tc.get("expected", ""), "output": "(no code submitted)"}
                for tc in test_cases
            ],
            "allPassed": False,
            "timeComplexity": "N/A",
            "spaceComplexity": "N/A",
            "explanation": "No code submitted.",
            "hint": "Write your solution first.",
        }

    # ── SQL → Gemini AI eval only ──────────────────────────────────────────
    if payload.language == "sql":
        if not gemini_model:
            raise HTTPException(503, "GEMINI_API_KEY not configured")
        prompt = f"""Evaluate this SQL query for the problem: {problem.get('title','')}.
Problem: {problem.get('description','')}
Test cases: {json.dumps(test_cases)}
Query: {payload.code}

Respond ONLY with valid JSON: {{ "results": ["pass" or "fail" for each of {n} test cases as strings], "explanation": "<2-3 sentence review>", "hint": "<one tip or null>", "timeComplexity": "—", "spaceComplexity": "—" }}"""
        try:
            raw = gemini_model.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(temperature=0.2, max_output_tokens=500),
            ).text.strip()
            data = extract_json(raw)
        except Exception as e:
            logger.exception("Gemini SQL eval failed")
            data = {
                "results": ["error"] * n,
                "explanation": "Could not evaluate.",
                "hint": None,
                "timeComplexity": "—",
                "spaceComplexity": "—"
            }

        rich = []
        statuses = data.get("results", []) + ["error"] * n
        for i, tc in enumerate(test_cases):
            rich.append({
                "passed":   statuses[i] == "pass",
                "input":    tc.get("input", ""),
                "expected": tc.get("expected", ""),
                "output":   statuses[i],
            })
        return {
            "results":         rich,
            "allPassed":       all(r["passed"] for r in rich) and len(rich) > 0,
            "timeComplexity":  data.get("timeComplexity", "—"),
            "spaceComplexity": data.get("spaceComplexity", "—"),
            "explanation":     data.get("explanation", ""),
            "hint":            data.get("hint"),
        }

    # ── JS / Python / Java / C++ → Judge0 real execution ──────────────────
    lang_id = JUDGE0_LANG_MAP.get(payload.language)
    if not lang_id:
        raise HTTPException(400, f"Unsupported language: {payload.language}")

    rich = []
    pass_count = 0
    for tc in test_cases[:6]:
        stdin    = str(tc.get("input", ""))
        expected = str(tc.get("expected", "")).strip()
        try:
            res = await _judge0_run(lang_id, payload.code, stdin)
        except Exception as e:
            rich.append({"passed": False, "input": stdin,
                         "expected": expected, "output": f"Judge0 error: {e}"})
            continue

        stdout = (res.get("stdout") or "").strip()
        err    = (res.get("compile_output") or res.get("stderr") or "").strip()
        passed = bool(stdout) and stdout == expected
        if passed:
            pass_count += 1
        rich.append({
            "passed":   passed,
            "input":    stdin,
            "expected": expected or "(none)",
            "output":   stdout or err or "(no output)",
        })

    # Optional Gemini review (non-blocking)
    explanation, hint, tc_time, tc_space = "Test execution complete.", None, "—", "—"
    if gemini_model:
        try:
            raw = gemini_model.generate_content(
                build_code_eval_prompt(payload.language, payload.code, problem),
                generation_config=genai.GenerationConfig(temperature=0.2, max_output_tokens=400),
            ).text.strip()
            ai = extract_json(raw)
            explanation = ai.get("explanation", explanation)
            hint        = ai.get("hint", hint)
            tc_time     = ai.get("timeComplexity", tc_time)
            tc_space    = ai.get("spaceComplexity", tc_space)
        except Exception as e:
            logger.warning(f"Gemini review skipped: {e}")

    return {
        "results":         rich,
        "allPassed":       pass_count == len(rich) and len(rich) > 0,
        "timeComplexity":  tc_time,
        "spaceComplexity": tc_space,
        "explanation":     explanation,
        "hint":            hint,
    }


# GET /api/practice/persona/:type
@api_router.get("/practice/persona/{interview_type}")
async def get_persona(interview_type: str):
    p = PRACTICE_PERSONAS_INFO.get(interview_type)
    if not p:
        raise HTTPException(status_code=404, detail="Unknown interview type")
    return p


# APP CONFIG
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.on_event("shutdown")
async def shutdown_db_client():
    client_db.close()

