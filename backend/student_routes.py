"""
Student Exam Routes - API endpoints for students taking exams
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import random
import string

router = APIRouter()

# Pydantic models
class ExamValidationRequest(BaseModel):
    examCode: str
    studentName: str
    studentEmail: str
    studentId: Optional[str] = None

class ExamStartRequest(BaseModel):
    examId: str
    studentEmail: str

class ExamSubmissionRequest(BaseModel):
    examId: str
    studentName: str
    studentEmail: str
    answers: Dict[str, Any]
    timeTaken: int
    violations: List[Dict[str, Any]]
    tabSwitches: int
    autoSubmit: bool = False
    autoSubmitReason: Optional[str] = None
    submittedAt: str

class ViolationLogRequest(BaseModel):
    examId: str
    studentEmail: str
    violationType: str
    description: str
    timestamp: str

@router.post("/exam/validate")
async def validate_exam_code(request: ExamValidationRequest):
    """
    Validate exam code and student details
    Returns exam details if valid
    """
    try:
        # TODO: Replace with actual database query
        # For now, accept any 6-character code as valid for testing
        
        if len(request.examCode) != 6:
            raise HTTPException(status_code=400, detail="Invalid exam code format")
        
        # Mock exam data - in production, fetch from database
        mock_exam = {
            "id": f"exam_{request.examCode}",
            "title": f"Sample Exam {request.examCode}",
            "exam_type": "placement",
            "duration_minutes": 120,
            "total_questions": 20,
            "start_time": datetime.now().isoformat(),
            "end_time": (datetime.now().replace(hour=23, minute=59)).isoformat(),
            "proctoring_enabled": True,
            "face_detection": True,
            "mobile_detection": True,
            "tab_switch_allowed": 0,
            "shuffle_questions": True,
            "shuffle_options": True,
            "negative_marking": False,
            "show_results_immediately": True,
            "offline_mode_enabled": True
        }
        
        return {
            "success": True,
            "message": "Exam code validated successfully",
            "exam": mock_exam
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error validating exam: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/exam/{exam_id}/questions")
async def get_exam_questions(exam_id: str, student_email: str):
    """
    Get questions for an exam
    Returns shuffled questions if exam settings require it
    """
    try:
        # TODO: Replace with actual database query
        # For now, return mock questions
        
        mock_questions = []
        for i in range(20):
            mock_questions.append({
                "id": f"q{i+1}",
                "question_text": f"This is question {i+1}. Select the correct answer from the options below.",
                "question_type": "mcq",
                "options": [
                    f"Option A for question {i+1}",
                    f"Option B for question {i+1}",
                    f"Option C for question {i+1}",
                    f"Option D for question {i+1}"
                ],
                "correct_answer": f"Option A for question {i+1}",  # Hidden from student in production
                "marks": 1,
                "difficulty": ["easy", "medium", "hard"][i % 3]
            })
        
        return {
            "success": True,
            "questions": mock_questions
        }
        
    except Exception as e:
        print(f"Error fetching questions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/exam/start")
async def start_exam_attempt(request: ExamStartRequest):
    """
    Create a new exam attempt when student starts
    """
    try:
        # TODO: Replace with actual database insert
        
        attempt_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
        
        return {
            "success": True,
            "attemptId": attempt_id,
            "message": "Exam attempt started"
        }
        
    except Exception as e:
        print(f"Error starting exam: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/exam/submit")
async def submit_exam(request: ExamSubmissionRequest):
    """
    Submit exam answers and calculate results
    """
    try:
        # TODO: Replace with actual database operations
        
        # Calculate score (mock implementation)
        total_questions = len(request.answers)
        # In production, compare with correct answers from database
        correct_answers = total_questions // 2  # Mock: assume 50% correct
        score = (correct_answers / total_questions * 100) if total_questions > 0 else 0
        
        result = {
            "attemptId": ''.join(random.choices(string.ascii_uppercase + string.digits, k=10)),
            "score": round(score, 2),
            "correctAnswers": correct_answers,
            "totalQuestions": total_questions,
            "timeTaken": request.timeTaken,
            "violations": len(request.violations),
            "passed": score >= 60
        }
        
        # TODO: Save to database
        # - exam_attempts table
        # - exam_answers table
        # - proctoring_logs table
        # - violation_events table
        
        return {
            "success": True,
            "message": "Exam submitted successfully",
            "result": result
        }
        
    except Exception as e:
        print(f"Error submitting exam: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/exam/violation")
async def log_violation(request: ViolationLogRequest):
    """
    Log a proctoring violation during exam
    """
    try:
        # TODO: Replace with actual database insert
        
        violation_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
        
        # TODO: Save to violation_events table
        
        return {
            "success": True,
            "violationId": violation_id,
            "message": "Violation logged"
        }
        
    except Exception as e:
        print(f"Error logging violation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/exam/heartbeat")
async def exam_heartbeat(exam_id: str, student_email: str):
    """
    Periodic heartbeat to track active exam sessions
    Used for live monitoring
    """
    try:
        # TODO: Update last_seen timestamp in database
        
        return {
            "success": True,
            "message": "Heartbeat recorded"
        }
        
    except Exception as e:
        print(f"Error recording heartbeat: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/exam/{exam_id}/status")
async def get_exam_status(exam_id: str):
    """
    Check if exam is available and get current status
    """
    try:
        # TODO: Check exam timing and availability
        
        return {
            "success": True,
            "status": "active",  # active, upcoming, completed, cancelled
            "message": "Exam is available"
        }
        
    except Exception as e:
        print(f"Error checking exam status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
