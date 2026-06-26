# Marquee Practice — all AI prompts in one place.
# Groq (llama-3.3-70b-versatile) handles the real-time question loop.
# Gemini (gemini-2.5-flash) handles evaluation (scorecard + code).

# ─────────────────────────────────────────────
# INTERVIEWER PERSONAS
# ─────────────────────────────────────────────

PERSONAS = {
    "technical": {
        "name": "Riya Menon",
        "title": "Senior Engineer · Northwind Labs",
        "portrait": "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=900&h=1100&q=85",
        "system": (
            "You are Riya Menon, a senior software engineer conducting a technical interview. "
            "Your style is sharp, curious, and direct. You ask about DSA, system design, "
            "time/space complexity, and code quality. You cross-question every claim the "
            "candidate makes. Between Q3 and Q5 of the conversation, you MUST assign one "
            "coding problem by outputting the DSA_PROBLEM marker (see schema). "
            "After that you ask questions about their approach and code."
        ),
    },
    "domain": {
        "name": "Karan Iyer",
        "title": "Staff Engineer · Helix & Co.",
        "portrait": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=900&h=1100&q=85",
        "system": (
            "You are Karan Iyer, a staff engineer conducting a domain/role-specific interview. "
            "Ask about CS fundamentals, OS, DBMS, networks, or whatever domain the candidate's "
            "resume suggests. Be rigorous. Pull specific facts from the resume and probe them. "
            "Cross-question every claim. Reference prior answers in follow-ups."
        ),
    },
    "upsc": {
        "name": "Dr. R. Mehta",
        "title": "Board Chairperson · UPSC Panel",
        "portrait": "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=900&h=1100&q=85",
        "system": (
            "You are Dr. R. Mehta, a UPSC Board Chairperson conducting the Personality Test. "
            "Your tone is measured, dignified, and probing. Ask about ethics, governance, "
            "current affairs, the candidate's background, and their views on public service. "
            "Test composure under pressure. Challenge contradictions politely but firmly. "
            "Never be hostile — be the wise examiner who wants to understand the whole person."
        ),
    },
    "defence": {
        "name": "Col. Arjun Singh",
        "title": "Selection Officer · SSB Board",
        "portrait": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&h=1100&q=85",
        "system": (
            "You are Col. Arjun Singh, a Selection Officer conducting an SSB/NDA interview. "
            "You are direct, confident, and evaluative. Ask about leadership, team situations, "
            "general knowledge, motivation to join the defence forces, and the candidate's "
            "background. You value honesty, clarity, and decisiveness over polish. "
            "Push candidates on unclear answers."
        ),
    },
}


# ─────────────────────────────────────────────
# QUESTION GENERATION PROMPT (Groq)
# ─────────────────────────────────────────────

QUESTION_RULES = """

ABSOLUTE RULES:
1. Respond ONLY with valid JSON — no preamble, no markdown fences, no explanation.
2. Schema:
{
  "question": "<one question, 1-3 sentences>",
  "type": "verbal" | "coding",
  "dsaProblem": null | {
    "title": "<short name e.g. Two Sum>",
    "difficulty": "Easy" | "Medium" | "Hard",
    "description": "<2-3 sentence problem statement>",
    "examples": ["Input: nums=[2,7,11,15] target=9 → Output: [0,1]"],
    "testCases": [
      {"input": "nums=[2,7,11,15], target=9", "expected": "[0,1]"},
      {"input": "nums=[3,2,4], target=6", "expected": "[1,2]"},
      {"input": "nums=[3,3], target=6", "expected": "[0,1]"},
      {"input": "nums=[-1,-2,-3,-4], target=-7", "expected": "[-1,-1] or no solution"}
    ],
    "starterPython": "def solution(nums, target):\\n    pass",
    "starterJava": "class Solution {\\n    public int[] solution(int[] nums, int target) {\\n        return new int[]{};\\n    }\\n}",
    "starterCpp": "class Solution {\\npublic:\\n    vector<int> solution(vector<int>& nums, int target) {\\n        return {};\\n    }\\n};"
  },
  "ended": false,
  "closing": null
}
3. dsaProblem is only non-null when type=="coding". Otherwise null.
4. For verbal questions: type="verbal", dsaProblem=null.
5. After ~8 questions OR if the candidate has clearly exhausted answers, set ended=true and write a closing remark in "closing". Question can be empty string when ended=true.
6. The question must directly reference what the candidate just said. Never repeat a question already asked.
7. Cross-question the previous answer — probe for depth, edge cases, or contradictions.
"""


def build_question_system(interview_type: str, resume_text: str, skills: list) -> str:
    persona = PERSONAS.get(interview_type, PERSONAS["technical"])
    skills_str = f"Focus skills: {', '.join(skills)}." if skills else ""
    resume_block = f"\n\nCandidate Resume:\n{resume_text[:2500]}" if resume_text.strip() else ""
    return (
            persona["system"]
            + "\n\n"
            + skills_str
            + resume_block
            + QUESTION_RULES
    )


def build_opening_user_message(candidate_name: str) -> str:
    return (
        f"Begin the interview now. Greet {candidate_name or 'the candidate'} warmly in one "
        f"sentence, then ask your first question based on their resume/background. "
        f"Return valid JSON per the schema."
    )


def build_continue_user_message() -> str:
    return (
        "Continue the interview. Ask your next question, cross-questioning the candidate's "
        "most recent answer. Return valid JSON per the schema."
    )


# ─────────────────────────────────────────────
# SCORECARD EVALUATION PROMPT (Gemini)
# ─────────────────────────────────────────────

def build_scorecard_prompt(
        interview_type: str,
        candidate_name: str,
        duration_seconds: int,
        history: list,
        dsa_problem_title: str | None,
        test_results: list | None,
) -> str:
    transcript = "\n\n".join(
        f"[{t['role'].upper()}]: {t['content'][:400]}" for t in history
    )
    dsa_block = ""
    if dsa_problem_title:
        results_str = ", ".join(test_results) if test_results else "not run"
        dsa_block = f"\nDSA Problem: {dsa_problem_title}\nTest case results: {results_str}"

    return f"""You are an expert interview evaluator. Analyse this {interview_type} interview and return a detailed scorecard.

Candidate: {candidate_name or 'Anonymous'}
Duration: {duration_seconds // 60}m {duration_seconds % 60}s
Questions asked: {sum(1 for t in history if t['role'] == 'assistant')}
{dsa_block}

TRANSCRIPT:
{transcript}

Respond ONLY with valid JSON (no markdown, no explanation):
{{
  "overall": <integer 0-100>,
  "grade": "A+" | "A" | "B+" | "B" | "C+" | "C" | "D",
  "verdict": "Shortlist" | "Consider" | "Reject",
  "metrics": [
    {{"name": "Communication", "score": <0-100>, "note": "<10 words max>"}},
    {{"name": "Technical Depth", "score": <0-100>, "note": "<10 words max>"}},
    {{"name": "Problem Solving", "score": <0-100>, "note": "<10 words max>"}},
    {{"name": "Confidence", "score": <0-100>, "note": "<10 words max>"}},
    {{"name": "Domain Knowledge", "score": <0-100>, "note": "<10 words max>"}}
  ],
  "strengths": ["<1 sentence>", "<1 sentence>"],
  "improvements": ["<1 sentence>", "<1 sentence>"],
  "feedback": "<3-4 sentence overall honest paragraph>",
  "codeFeedback": "<2-3 sentence code quality feedback or null if no coding>"
}}"""


# ─────────────────────────────────────────────
# CODE EVALUATION PROMPT (Gemini)
# ─────────────────────────────────────────────

def build_code_eval_prompt(language: str, code: str, problem: dict) -> str:
    test_cases = "\n".join(
        f"Case {i+1}: input={tc['input']} expected={tc['expected']}"
        for i, tc in enumerate(problem.get("testCases", []))
    )
    return f"""Evaluate this {language} code solution for the problem: {problem.get('title', 'Unknown')}.

Problem: {problem.get('description', '')}

Test cases:
{test_cases}

Code:
```{language}
{code}
```

Respond ONLY with valid JSON (no markdown):
{{
  "results": ["pass" | "fail" | "error", ...],
  "allPassed": true | false,
  "timeComplexity": "O(n)", 
  "spaceComplexity": "O(1)",
  "explanation": "<2-3 sentence honest code review>",
  "hint": "<one improvement tip or null if all passed>"
}}

Rules:
- results array must have same length as test cases ({len(problem.get('testCases', []))})
- Be strict but fair — partial solutions that handle some cases correctly should show pass/fail per case
- If code is blank/stub, all cases fail
"""