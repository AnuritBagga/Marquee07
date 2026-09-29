"""
Profile management API routes for Marquee 2.0
Handles user profiles, interview history, statistics, and settings
"""
from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime, date, timedelta
from supabase_client import get_supabase, get_supabase_admin
import logging
import uuid

logger = logging.getLogger(__name__)
profile_router = APIRouter(prefix="/api/profile", tags=["profile"])


# ═══════════════════════════════════════════════════════════════════════════════
# PYDANTIC MODELS
# ═══════════════════════════════════════════════════════════════════════════════

class ProfileCreate(BaseModel):
    """Model for creating a new user profile"""
    user_id: str
    username: str
    email: EmailStr
    full_name: Optional[str] = None


class ProfileUpdate(BaseModel):
    """Model for updating user profile"""
    username: Optional[str] = None
    full_name: Optional[str] = None
    bio: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    website_url: Optional[str] = None
    is_profile_public: Optional[bool] = None


class InterviewSessionCreate(BaseModel):
    """Model for recording a completed interview session"""
    user_id: str
    session_type: str = "practice"  # practice, mock, real
    interview_mode: str  # behavioral, technical, mixed
    interviewer_name: Optional[str] = None
    
    overall_score: Optional[float] = None
    communication_score: Optional[float] = None
    technical_score: Optional[float] = None
    problem_solving_score: Optional[float] = None
    
    total_questions: int = 0
    questions_answered: int = 0
    dsa_problems_solved: int = 0
    sql_problems_solved: int = 0
    
    duration_seconds: int
    started_at: datetime
    completed_at: datetime
    
    feedback_summary: Optional[str] = None
    strengths: Optional[List[str]] = None
    improvements: Optional[List[str]] = None


class DailyActivityUpdate(BaseModel):
    """Model for updating daily activity"""
    user_id: str
    activity_date: date
    interviews_completed: int = 0
    practice_time_seconds: int = 0
    problems_solved: int = 0


# ═══════════════════════════════════════════════════════════════════════════════
# PROFILE ROUTES
# ═══════════════════════════════════════════════════════════════════════════════

@profile_router.post("/create")
async def create_profile(profile: ProfileCreate):
    """Create a new user profile"""
    try:
        supabase = get_supabase()
        
        # Check if profile already exists
        existing = supabase.table("user_profiles").select("*").eq("user_id", profile.user_id).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="Profile already exists")
        
        # Create profile
        data = {
            "user_id": profile.user_id,
            "username": profile.username,
            "email": profile.email,
            "full_name": profile.full_name,
        }
        
        result = supabase.table("user_profiles").insert(data).execute()
        
        return {
            "success": True,
            "message": "Profile created successfully",
            "profile": result.data[0] if result.data else None
        }
    except Exception as e:
        logger.error(f"Error creating profile: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@profile_router.get("/{user_id}")
async def get_profile(user_id: str):
    """Get user profile by user_id"""
    try:
        supabase = get_supabase()
        
        result = supabase.table("user_profiles").select("*").eq("user_id", user_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching profile: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@profile_router.get("/username/{username}")
async def get_profile_by_username(username: str):
    """Get user profile by username (public profiles only)"""
    try:
        supabase = get_supabase()
        
        result = supabase.table("user_profiles").select("*").eq("username", username).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        profile = result.data[0]
        
        # Check if profile is public
        if not profile.get("is_profile_public"):
            raise HTTPException(status_code=403, detail="This profile is private")
        
        return profile
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching profile: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@profile_router.patch("/{user_id}")
async def update_profile(user_id: str, profile_update: ProfileUpdate):
    """Update user profile"""
    try:
        supabase = get_supabase()
        
        # Build update data (only include fields that are provided)
        update_data = {k: v for k, v in profile_update.dict().items() if v is not None}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        result = supabase.table("user_profiles").update(update_data).eq("user_id", user_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        return {
            "success": True,
            "message": "Profile updated successfully",
            "profile": result.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating profile: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@profile_router.post("/avatar/upload")
async def upload_avatar(user_id: str, file: UploadFile = File(...)):
    """Upload user avatar to Supabase Storage"""
    try:
        supabase = get_supabase()
        
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Generate unique filename
        file_ext = file.filename.split(".")[-1]
        file_name = f"{user_id}/avatar.{file_ext}"
        
        # Read file content
        file_content = await file.read()
        
        # Upload to Supabase Storage
        storage = supabase.storage.from_("avatars")
        storage.upload(file_name, file_content, {"content-type": file.content_type, "upsert": "true"})
        
        # Get public URL
        avatar_url = storage.get_public_url(file_name)
        
        # Update profile with avatar URL
        supabase.table("user_profiles").update({"avatar_url": avatar_url}).eq("user_id", user_id).execute()
        
        return {
            "success": True,
            "message": "Avatar uploaded successfully",
            "avatar_url": avatar_url
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading avatar: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ═══════════════════════════════════════════════════════════════════════════════
# INTERVIEW HISTORY ROUTES
# ═══════════════════════════════════════════════════════════════════════════════

@profile_router.post("/interview/record")
async def record_interview_session(session: InterviewSessionCreate):
    """Record a completed interview session"""
    try:
        supabase = get_supabase()
        
        # Prepare session data
        session_data = {
            "user_id": session.user_id,
            "session_type": session.session_type,
            "interview_mode": session.interview_mode,
            "interviewer_name": session.interviewer_name,
            "overall_score": session.overall_score,
            "communication_score": session.communication_score,
            "technical_score": session.technical_score,
            "problem_solving_score": session.problem_solving_score,
            "total_questions": session.total_questions,
            "questions_answered": session.questions_answered,
            "dsa_problems_solved": session.dsa_problems_solved,
            "sql_problems_solved": session.sql_problems_solved,
            "duration_seconds": session.duration_seconds,
            "started_at": session.started_at.isoformat(),
            "completed_at": session.completed_at.isoformat(),
            "feedback_summary": session.feedback_summary,
            "strengths": session.strengths,
            "improvements": session.improvements,
        }
        
        # Insert interview session
        result = supabase.table("interview_sessions").insert(session_data).execute()
        
        # Update daily activity
        activity_date = session.completed_at.date()
        await update_daily_activity(
            user_id=session.user_id,
            activity_date=activity_date,
            interviews_completed=1,
            practice_time_seconds=session.duration_seconds,
            problems_solved=session.dsa_problems_solved + session.sql_problems_solved
        )
        
        return {
            "success": True,
            "message": "Interview session recorded successfully",
            "session": result.data[0] if result.data else None
        }
    except Exception as e:
        logger.error(f"Error recording interview session: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@profile_router.get("/interview/history/{user_id}")
async def get_interview_history(
    user_id: str,
    limit: int = 20,
    offset: int = 0,
    session_type: Optional[str] = None
):
    """Get user's interview history"""
    try:
        supabase = get_supabase()
        
        query = supabase.table("interview_sessions").select("*").eq("user_id", user_id)
        
        if session_type:
            query = query.eq("session_type", session_type)
        
        result = query.order("completed_at", desc=True).limit(limit).offset(offset).execute()
        
        return {
            "success": True,
            "sessions": result.data,
            "count": len(result.data)
        }
    except Exception as e:
        logger.error(f"Error fetching interview history: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ═══════════════════════════════════════════════════════════════════════════════
# STATISTICS ROUTES
# ═══════════════════════════════════════════════════════════════════════════════

@profile_router.get("/stats/{user_id}")
async def get_user_statistics(user_id: str):
    """Get comprehensive user statistics"""
    try:
        supabase = get_supabase()
        
        # Get profile stats
        profile = supabase.table("user_profiles").select("*").eq("user_id", user_id).execute()
        
        if not profile.data:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        profile_data = profile.data[0]
        
        # Get recent activity (last 365 days for heatmap)
        one_year_ago = (datetime.now() - timedelta(days=365)).date()
        activity = supabase.table("daily_activity").select("*").eq("user_id", user_id).gte("activity_date", one_year_ago.isoformat()).execute()
        
        # Get score distribution
        sessions = supabase.table("interview_sessions").select("overall_score,completed_at,session_type").eq("user_id", user_id).execute()
        
        # Calculate additional stats
        score_distribution = {"0-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0}
        for session in sessions.data:
            score = session.get("overall_score", 0) or 0
            if score <= 20:
                score_distribution["0-20"] += 1
            elif score <= 40:
                score_distribution["21-40"] += 1
            elif score <= 60:
                score_distribution["41-60"] += 1
            elif score <= 80:
                score_distribution["61-80"] += 1
            else:
                score_distribution["81-100"] += 1
        
        return {
            "success": True,
            "profile_stats": {
                "total_interviews": profile_data.get("total_interviews", 0),
                "total_practice_time": profile_data.get("total_practice_time", 0),
                "current_streak": profile_data.get("current_streak", 0),
                "longest_streak": profile_data.get("longest_streak", 0),
                "average_score": profile_data.get("average_score", 0.0),
            },
            "daily_activity": activity.data,
            "score_distribution": score_distribution,
            "recent_sessions": sessions.data[:10] if sessions.data else []
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching user statistics: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@profile_router.get("/activity/heatmap/{user_id}")
async def get_activity_heatmap(user_id: str, days: int = 365):
    """Get activity heatmap data (like GitHub contribution graph)"""
    try:
        supabase = get_supabase()
        
        start_date = (datetime.now() - timedelta(days=days)).date()
        
        result = supabase.table("daily_activity").select("activity_date,interviews_completed,problems_solved").eq("user_id", user_id).gte("activity_date", start_date.isoformat()).execute()
        
        # Format for heatmap visualization
        heatmap_data = {}
        for activity in result.data:
            date_str = activity["activity_date"]
            heatmap_data[date_str] = {
                "interviews": activity["interviews_completed"],
                "problems": activity["problems_solved"],
                "level": min(4, activity["interviews_completed"])  # 0-4 intensity level
            }
        
        return {
            "success": True,
            "heatmap_data": heatmap_data,
            "start_date": start_date.isoformat(),
            "end_date": datetime.now().date().isoformat()
        }
    except Exception as e:
        logger.error(f"Error fetching activity heatmap: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ═══════════════════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════

async def update_daily_activity(
    user_id: str,
    activity_date: date,
    interviews_completed: int = 0,
    practice_time_seconds: int = 0,
    problems_solved: int = 0
):
    """Update or create daily activity record"""
    try:
        supabase = get_supabase()
        
        # Check if record exists
        existing = supabase.table("daily_activity").select("*").eq("user_id", user_id).eq("activity_date", activity_date.isoformat()).execute()
        
        if existing.data:
            # Update existing record
            current = existing.data[0]
            update_data = {
                "interviews_completed": current["interviews_completed"] + interviews_completed,
                "practice_time_seconds": current["practice_time_seconds"] + practice_time_seconds,
                "problems_solved": current["problems_solved"] + problems_solved,
            }
            supabase.table("daily_activity").update(update_data).eq("id", current["id"]).execute()
        else:
            # Create new record
            insert_data = {
                "user_id": user_id,
                "activity_date": activity_date.isoformat(),
                "interviews_completed": interviews_completed,
                "practice_time_seconds": practice_time_seconds,
                "problems_solved": problems_solved,
            }
            supabase.table("daily_activity").insert(insert_data).execute()
        
        logger.info(f"Daily activity updated for user {user_id} on {activity_date}")
    except Exception as e:
        logger.error(f"Error updating daily activity: {str(e)}")
        # Don't raise exception to avoid breaking the main flow
