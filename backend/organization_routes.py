"""
Organization Portal API Routes
Handles exam creation, question banks, and AI chatbot interactions
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime
from langchain.schema import HumanMessage, SystemMessage
import os
import json
import pandas as pd
from supabase import create_client, Client

from ai_chatbot import ExamCreatorChatbot, Question, ExamConfiguration

router = APIRouter(prefix="/api/organization", tags=["Organization Portal"])

# ============================================
# Request/Response Models
# ============================================

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    organization_id: str

class ChatResponse(BaseModel):
    success: bool
    message: str
    conversation_id: str
    suggestions: Optional[List[str]] = None
    extracted_intent: Optional[Dict[str, Any]] = None

class GenerateQuestionsRequest(BaseModel):
    subject: str
    topic: str
    num_questions: int = 10
    difficulty: str = "medium"  # easy, medium, hard, mixed
    question_type: str = "mcq"  # mcq, coding, multiple_select, descriptive
    syllabus: Optional[str] = None
    organization_id: str

class QuestionBankRequest(BaseModel):
    name: str
    description: str
    subject: str
    difficulty: str
    organization_id: str

class ExamCreateRequest(BaseModel):
    title: str
    description: str
    exam_type: str = "placement"
    duration_minutes: int
    question_bank_ids: List[str]  # IDs of question banks to include
    organization_id: str
    start_time: str  # ISO format
    end_time: str
    proctoring_enabled: bool = True
    shuffle_questions: bool = True
    negative_marking: bool = False

class AnalyzeSyllabusRequest(BaseModel):
    syllabus_text: str
    organization_id: str

# ============================================
# Dependencies
# ============================================

def get_supabase_client() -> Client:
    """Get Supabase client"""
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_KEY")
    return create_client(url, key)

def get_chatbot() -> ExamCreatorChatbot:
    """Get AI chatbot instance"""
    groq_key = os.getenv("GROQ_API_KEY")
    if not groq_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY not configured")
    return ExamCreatorChatbot(groq_key)

# ============================================
# AI Chatbot Endpoints
# ============================================

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    request: ChatRequest,
    chatbot: ExamCreatorChatbot = Depends(get_chatbot),
    db: Client = Depends(get_supabase_client)
):
    """
    Chat with AI to create exams
    """
    try:
        # Get chat response
        response = chatbot.chat(request.message, request.conversation_id)
        
        # Save conversation to database
        conversation_id = request.conversation_id or f"conv_{datetime.now().timestamp()}"
        
        # Fetch existing conversation
        existing = db.table("chatbot_conversations").select("*").eq("id", conversation_id).execute()
        
        messages = []
        if existing.data:
            messages = existing.data[0].get("messages", [])
        
        # Append new messages
        messages.append({"role": "user", "content": request.message, "timestamp": datetime.now().isoformat()})
        messages.append({"role": "assistant", "content": response["message"], "timestamp": datetime.now().isoformat()})
        
        # Upsert conversation
        if existing.data:
            db.table("chatbot_conversations").update({
                "messages": messages,
                "updated_at": datetime.now().isoformat()
            }).eq("id", conversation_id).execute()
        else:
            db.table("chatbot_conversations").insert({
                "id": conversation_id,
                "organization_id": request.organization_id,
                "conversation_type": "exam_creation",
                "messages": messages,
                "created_at": datetime.now().isoformat()
            }).execute()
        
        # Try to extract intent
        intent = chatbot.extract_exam_intent(messages)
        
        return ChatResponse(
            success=True,
            message=response["message"],
            conversation_id=conversation_id,
            extracted_intent=intent
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-questions")
async def generate_questions(
    request: GenerateQuestionsRequest,
    chatbot: ExamCreatorChatbot = Depends(get_chatbot),
    db: Client = Depends(get_supabase_client)
):
    """
    Generate questions using AI
    """
    try:
        # Generate questions
        questions = await chatbot.generate_questions(
            subject=request.subject,
            topic=request.topic,
            num_questions=request.num_questions,
            difficulty=request.difficulty,
            question_type=request.question_type,
            syllabus=request.syllabus
        )
        
        if not questions:
            raise HTTPException(status_code=500, detail="Failed to generate questions")
        
        # Create question bank
        bank_result = db.table("question_banks").insert({
            "organization_id": request.organization_id,
            "name": f"{request.subject} - {request.topic}",
            "description": f"Auto-generated {request.difficulty} {request.question_type} questions",
            "subject": request.subject,
            "difficulty": request.difficulty,
            "total_questions": len(questions),
            "created_at": datetime.now().isoformat()
        }).execute()
        
        bank_id = bank_result.data[0]["id"]
        
        # Insert questions
        question_records = []
        for q in questions:
            record = {
                "question_bank_id": bank_id,
                "question_type": q.question_type,
                "question_text": q.question_text,
                "difficulty": q.difficulty,
                "marks": q.marks,
                "negative_marks": q.negative_marks,
                "explanation": q.explanation,
                "topic_tags": q.topic_tags,
                "created_at": datetime.now().isoformat()
            }
            
            # Add type-specific fields
            if q.options:
                record["options"] = [opt.dict() for opt in q.options]
            if q.correct_answers:
                record["correct_answers"] = q.correct_answers
            if q.coding_language:
                record["coding_language"] = q.coding_language
            if q.test_cases:
                record["test_cases"] = q.test_cases
            if q.starter_code:
                record["starter_code"] = q.starter_code
            if q.constraints:
                record["constraints"] = q.constraints
            
            question_records.append(record)
        
        db.table("questions").insert(question_records).execute()
        
        return {
            "success": True,
            "message": f"Successfully generated {len(questions)} questions",
            "question_bank_id": bank_id,
            "questions": [q.dict() for q in questions]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-syllabus")
async def analyze_syllabus(
    request: AnalyzeSyllabusRequest,
    chatbot: ExamCreatorChatbot = Depends(get_chatbot)
):
    """
    Analyze syllabus and suggest exam structure
    """
    try:
        suggestion = await chatbot.analyze_syllabus_and_suggest(request.syllabus_text)
        
        return {
            "success": True,
            "suggestion": suggestion,
            "message": "Syllabus analyzed successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# Question Bank Management
# ============================================

@router.get("/question-banks/{organization_id}")
async def get_question_banks(
    organization_id: str,
    db: Client = Depends(get_supabase_client)
):
    """Get all question banks for an organization"""
    try:
        result = db.table("question_banks")\
            .select("*")\
            .eq("organization_id", organization_id)\
            .order("created_at", desc=True)\
            .execute()
        
        return {
            "success": True,
            "question_banks": result.data
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/question-bank/{bank_id}/questions")
async def get_questions_from_bank(
    bank_id: str,
    db: Client = Depends(get_supabase_client)
):
    """Get all questions from a specific bank"""
    try:
        result = db.table("questions")\
            .select("*")\
            .eq("question_bank_id", bank_id)\
            .execute()
        
        return {
            "success": True,
            "questions": result.data
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/question-bank/upload")
async def upload_question_bank(
    file: UploadFile = File(...),
    organization_id: str = None,
    subject: str = None,
    db: Client = Depends(get_supabase_client),
    chatbot: ExamCreatorChatbot = Depends(get_chatbot)
):
    """
    Upload question bank from CSV/Excel/PDF/Word file
    For PDF/Word: AI extracts questions using Groq
    For CSV/Excel: Direct parsing
    """
    try:
        content = await file.read()
        questions = []
        
        # Handle CSV/Excel (structured data)
        if file.filename.endswith('.csv'):
            df = pd.read_csv(pd.io.common.BytesIO(content))
            questions = parse_structured_questions(df)
            
        elif file.filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(pd.io.common.BytesIO(content))
            questions = parse_structured_questions(df)
        
        # Handle PDF (extract text and use AI)
        elif file.filename.endswith('.pdf'):
            import PyPDF2
            pdf_reader = PyPDF2.PdfReader(pd.io.common.BytesIO(content))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
            
            # Use AI to extract questions from text
            questions = await extract_questions_from_text(chatbot, text, subject or "General")
        
        # Handle Word (extract text and use AI)
        elif file.filename.endswith(('.docx', '.doc')):
            import docx2txt
            text = docx2txt.process(pd.io.common.BytesIO(content))
            
            # Use AI to extract questions from text
            questions = await extract_questions_from_text(chatbot, text, subject or "General")
        
        else:
            raise HTTPException(
                status_code=400, 
                detail="Unsupported file format. Use CSV, Excel, PDF, or Word."
            )
        
        if not questions:
            raise HTTPException(
                status_code=400,
                detail="No questions could be extracted from the file."
            )
        
        # Create question bank
        bank_result = db.table("question_banks").insert({
            "organization_id": organization_id,
            "name": file.filename,
            "description": f"Uploaded from {file.filename}",
            "subject": subject or "General",
            "difficulty": "mixed",
            "total_questions": len(questions),
            "created_at": datetime.now().isoformat()
        }).execute()
        
        bank_id = bank_result.data[0]["id"]
        
        # Insert questions
        for q in questions:
            q["question_bank_id"] = bank_id
            q["created_at"] = datetime.now().isoformat()
        
        db.table("questions").insert(questions).execute()
        
        return {
            "success": True,
            "message": f"Successfully uploaded {len(questions)} questions",
            "question_bank_id": bank_id,
            "questions_count": len(questions)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def parse_structured_questions(df: pd.DataFrame) -> List[Dict]:
    """Parse questions from structured CSV/Excel"""
    questions = []
    for _, row in df.iterrows():
        question = {
            "question_type": row.get("question_type", "mcq"),
            "question_text": row.get("question_text"),
            "difficulty": row.get("difficulty", "medium"),
            "marks": float(row.get("marks", 1)),
            "negative_marks": float(row.get("negative_marks", 0)),
            "explanation": row.get("explanation", ""),
            "topic_tags": [row.get("topic", "general")]
        }
        
        # Add MCQ options
        if "option_a" in row:
            question["options"] = [
                {"id": "A", "text": str(row.get("option_a", ""))},
                {"id": "B", "text": str(row.get("option_b", ""))},
                {"id": "C", "text": str(row.get("option_c", ""))},
                {"id": "D", "text": str(row.get("option_d", ""))}
            ]
            question["correct_answers"] = [str(row.get("correct_answer", "A"))]
        
        questions.append(question)
    
    return questions

async def extract_questions_from_text(
    chatbot: ExamCreatorChatbot, 
    text: str, 
    subject: str
) -> List[Dict]:
    """Extract questions from PDF/Word text using AI"""
    
    prompt = f"""Extract all questions from this text and convert them to structured format.

Text:
{text[:4000]}  # Limit to avoid token limit

Subject: {subject}

For each question found, extract:
- Question text
- Options (if MCQ)
- Correct answer
- Difficulty level (easy/medium/hard)
- Topic

Return as JSON array:
[{{
    "question_type": "mcq",
    "question_text": "...",
    "difficulty": "medium",
    "marks": 1,
    "negative_marks": 0.25,
    "options": [{{"id": "A", "text": "..."}}, ...],
    "correct_answers": ["A"],
    "explanation": "...",
    "topic_tags": ["topic1"]
}}]

If text contains question numbers, remove them. Return ONLY the JSON array."""

    try:
        response = chatbot.llm.invoke([
            SystemMessage(content="You are a question extraction expert. Return only valid JSON."),
            HumanMessage(content=prompt)
        ])
        
        json_str = response.content.strip()
        if "```" in json_str:
            json_str = json_str.split("```")[1].replace("json", "").strip()
        
        questions_data = json.loads(json_str)
        return questions_data if isinstance(questions_data, list) else questions_data.get("questions", [])
        
    except Exception as e:
        print(f"Error extracting questions from text: {e}")
        return []

# ============================================
# Exam Management
# ============================================

@router.post("/exam/create")
async def create_exam(
    request: ExamCreateRequest,
    db: Client = Depends(get_supabase_client)
):
    """Create a new exam"""
    try:
        # Generate unique exam code
        exam_code = f"EXAM-{datetime.now().strftime('%Y%m%d')}-{os.urandom(4).hex().upper()}"
        
        # Calculate total marks
        total_marks = 0
        for bank_id in request.question_bank_ids:
            bank = db.table("question_banks").select("*").eq("id", bank_id).execute()
            if bank.data:
                questions = db.table("questions").select("marks").eq("question_bank_id", bank_id).execute()
                total_marks += sum([q["marks"] for q in questions.data])
        
        # Create exam
        exam_result = db.table("exams").insert({
            "organization_id": request.organization_id,
            "exam_code": exam_code,
            "title": request.title,
            "description": request.description,
            "exam_type": request.exam_type,
            "duration_minutes": request.duration_minutes,
            "total_marks": total_marks,
            "passing_marks": total_marks * 0.4,  # 40% passing
            "start_time": request.start_time,
            "end_time": request.end_time,
            "proctoring_enabled": request.proctoring_enabled,
            "shuffle_questions": request.shuffle_questions,
            "negative_marking_enabled": request.negative_marking,
            "status": "published",
            "created_at": datetime.now().isoformat()
        }).execute()
        
        exam_id = exam_result.data[0]["id"]
        
        # Map questions to exam
        question_order = 1
        for bank_id in request.question_bank_ids:
            questions = db.table("questions").select("id, marks, negative_marks").eq("question_bank_id", bank_id).execute()
            
            for q in questions.data:
                db.table("exam_questions").insert({
                    "exam_id": exam_id,
                    "question_id": q["id"],
                    "question_order": question_order,
                    "marks_override": q["marks"],
                    "negative_marks_override": q["negative_marks"],
                    "created_at": datetime.now().isoformat()
                }).execute()
                question_order += 1
        
        return {
            "success": True,
            "message": "Exam created successfully",
            "exam_id": exam_id,
            "exam_code": exam_code,
            "total_questions": question_order - 1
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/exams/{organization_id}")
async def get_organization_exams(
    organization_id: str,
    db: Client = Depends(get_supabase_client)
):
    """Get all exams for an organization"""
    try:
        result = db.table("exams")\
            .select("*")\
            .eq("organization_id", organization_id)\
            .order("created_at", desc=True)\
            .execute()
        
        return {
            "success": True,
            "exams": result.data
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/exam/{exam_id}/details")
async def get_exam_details(
    exam_id: str,
    db: Client = Depends(get_supabase_client)
):
    """Get detailed exam information"""
    try:
        exam = db.table("exams").select("*").eq("id", exam_id).single().execute()
        
        # Get questions count
        questions = db.table("exam_questions").select("*").eq("exam_id", exam_id).execute()
        
        # Get registrations count
        registrations = db.table("exam_registrations").select("*").eq("exam_id", exam_id).execute()
        
        return {
            "success": True,
            "exam": exam.data,
            "total_questions": len(questions.data),
            "total_registrations": len(registrations.data)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# Dashboard Stats
# ============================================

@router.get("/dashboard/{organization_id}")
async def get_dashboard_stats(
    organization_id: str,
    db: Client = Depends(get_supabase_client)
):
    """Get organization dashboard statistics"""
    try:
        # Count exams
        exams = db.table("exams").select("*", count="exact").eq("organization_id", organization_id).execute()
        
        # Count question banks
        banks = db.table("question_banks").select("*", count="exact").eq("organization_id", organization_id).execute()
        
        # Count total students across all exams
        exam_ids = [e["id"] for e in exams.data]
        total_students = 0
        if exam_ids:
            registrations = db.table("exam_registrations").select("*", count="exact").in_("exam_id", exam_ids).execute()
            total_students = registrations.count
        
        # Recent exams
        recent_exams = db.table("exams")\
            .select("*")\
            .eq("organization_id", organization_id)\
            .order("created_at", desc=True)\
            .limit(5)\
            .execute()
        
        return {
            "success": True,
            "stats": {
                "total_exams": exams.count,
                "total_question_banks": banks.count,
                "total_students": total_students,
                "recent_exams": recent_exams.data
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
