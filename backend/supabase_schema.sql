-- ═══════════════════════════════════════════════════════════════════════════════
-- MARQUEE 2.0 - SUPABASE DATABASE SCHEMA
-- User profiles, interview history, activity tracking, and achievements
-- ═══════════════════════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── User Profiles Table ───────────────────────────────────────────────────────
-- Stores user profile information, settings, and metadata
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    
    -- Privacy & Social
    is_profile_public BOOLEAN DEFAULT false,
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    website_url VARCHAR(255),
    
    -- Statistics (cached for performance)
    total_interviews INTEGER DEFAULT 0,
    total_practice_time INTEGER DEFAULT 0, -- in seconds
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0.0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity_at TIMESTAMP WITH TIME ZONE
);

-- Index for faster queries
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_username ON user_profiles(username);
CREATE INDEX idx_user_profiles_public ON user_profiles(is_profile_public);

-- ─── Interview Sessions Table ──────────────────────────────────────────────────
-- Stores completed interview session details and scores
CREATE TABLE IF NOT EXISTS interview_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Session Details
    session_type VARCHAR(50) NOT NULL, -- 'practice', 'mock', 'real'
    interview_mode VARCHAR(50) NOT NULL, -- 'behavioral', 'technical', 'mixed'
    interviewer_name VARCHAR(100),
    
    -- Performance Metrics
    overall_score DECIMAL(5,2),
    communication_score DECIMAL(5,2),
    technical_score DECIMAL(5,2),
    problem_solving_score DECIMAL(5,2),
    
    -- Question Breakdown
    total_questions INTEGER DEFAULT 0,
    questions_answered INTEGER DEFAULT 0,
    dsa_problems_solved INTEGER DEFAULT 0,
    sql_problems_solved INTEGER DEFAULT 0,
    
    -- Timing
    duration_seconds INTEGER, -- total interview duration
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Additional Data
    feedback_summary TEXT,
    strengths JSONB, -- array of strength areas
    improvements JSONB, -- array of improvement areas
    transcript JSONB, -- full conversation if needed
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX idx_interview_sessions_user_id ON interview_sessions(user_id);
CREATE INDEX idx_interview_sessions_completed_at ON interview_sessions(completed_at);
CREATE INDEX idx_interview_sessions_user_completed ON interview_sessions(user_id, completed_at DESC);

-- ─── Daily Activity Table ──────────────────────────────────────────────────────
-- Tracks daily activity for streak calculation and heatmap visualization
CREATE TABLE IF NOT EXISTS daily_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL,
    
    -- Activity Metrics
    interviews_completed INTEGER DEFAULT 0,
    practice_time_seconds INTEGER DEFAULT 0,
    problems_solved INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one record per user per day
    UNIQUE(user_id, activity_date)
);

-- Indexes for streak calculation
CREATE INDEX idx_daily_activity_user_date ON daily_activity(user_id, activity_date DESC);

-- ─── Achievements Table ────────────────────────────────────────────────────────
-- Stores unlocked achievements and badges
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    achievement_type VARCHAR(50) NOT NULL, -- 'streak', 'interviews', 'score', 'special'
    achievement_name VARCHAR(100) NOT NULL,
    achievement_description TEXT,
    icon_url TEXT,
    
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_achievements_user_id ON achievements(user_id);

-- ─── Question Responses Table ──────────────────────────────────────────────────
-- Stores individual question responses within sessions
CREATE TABLE IF NOT EXISTS question_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    question_number INTEGER NOT NULL,
    question_type VARCHAR(50) NOT NULL, -- 'verbal', 'dsa', 'sql'
    question_text TEXT NOT NULL,
    user_answer TEXT,
    
    -- For coding questions
    problem_title VARCHAR(255),
    problem_difficulty VARCHAR(20),
    code_submitted TEXT,
    language_used VARCHAR(50),
    test_cases_passed INTEGER,
    total_test_cases INTEGER,
    
    -- Scoring
    score DECIMAL(5,2),
    time_spent_seconds INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_question_responses_session_id ON question_responses(session_id);
CREATE INDEX idx_question_responses_user_id ON question_responses(user_id);

-- ─── Row Level Security (RLS) Policies ─────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_responses ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view their own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view public profiles"
    ON user_profiles FOR SELECT
    USING (is_profile_public = true);

CREATE POLICY "Users can update their own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
    ON user_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Interview Sessions Policies
CREATE POLICY "Users can view their own interview sessions"
    ON interview_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interview sessions"
    ON interview_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Daily Activity Policies
CREATE POLICY "Users can view their own daily activity"
    ON daily_activity FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert/update their own daily activity"
    ON daily_activity FOR ALL
    USING (auth.uid() = user_id);

-- Achievements Policies
CREATE POLICY "Users can view their own achievements"
    ON achievements FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view achievements of public profiles"
    ON achievements FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.user_id = achievements.user_id 
            AND user_profiles.is_profile_public = true
        )
    );

-- Question Responses Policies
CREATE POLICY "Users can view their own question responses"
    ON question_responses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own question responses"
    ON question_responses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ─── Functions & Triggers ──────────────────────────────────────────────────────

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user_profiles
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for daily_activity
CREATE TRIGGER update_daily_activity_updated_at
    BEFORE UPDATE ON daily_activity
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate current streak
CREATE OR REPLACE FUNCTION calculate_current_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    streak INTEGER := 0;
    check_date DATE := CURRENT_DATE;
BEGIN
    -- Start from today and count backwards
    LOOP
        IF EXISTS (
            SELECT 1 FROM daily_activity 
            WHERE user_id = p_user_id 
            AND activity_date = check_date
            AND interviews_completed > 0
        ) THEN
            streak := streak + 1;
            check_date := check_date - INTERVAL '1 day';
        ELSE
            -- Check if yesterday had activity (grace period)
            IF check_date = CURRENT_DATE AND EXISTS (
                SELECT 1 FROM daily_activity 
                WHERE user_id = p_user_id 
                AND activity_date = CURRENT_DATE - INTERVAL '1 day'
                AND interviews_completed > 0
            ) THEN
                check_date := check_date - INTERVAL '1 day';
                CONTINUE;
            END IF;
            EXIT;
        END IF;
    END LOOP;
    
    RETURN streak;
END;
$$ LANGUAGE plpgsql;

-- Function to update profile statistics after interview
CREATE OR REPLACE FUNCTION update_profile_stats_after_interview()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_profiles
    SET 
        total_interviews = total_interviews + 1,
        total_practice_time = total_practice_time + NEW.duration_seconds,
        average_score = (
            SELECT AVG(overall_score) 
            FROM interview_sessions 
            WHERE user_id = NEW.user_id
        ),
        last_activity_at = NEW.completed_at,
        current_streak = calculate_current_streak(NEW.user_id),
        longest_streak = GREATEST(
            longest_streak, 
            calculate_current_streak(NEW.user_id)
        )
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update profile stats when interview is completed
CREATE TRIGGER update_profile_after_interview
    AFTER INSERT ON interview_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_profile_stats_after_interview();

-- ═══════════════════════════════════════════════════════════════════════════════
-- STORAGE BUCKET FOR PROFILE PHOTOS
-- Run this in Supabase dashboard under Storage
-- ═══════════════════════════════════════════════════════════════════════════════

-- Create storage bucket for avatars (run in Supabase Dashboard > Storage)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage policies (run in Supabase Dashboard > Storage > avatars > Policies)
-- CREATE POLICY "Avatar images are publicly accessible"
--     ON storage.objects FOR SELECT
--     USING (bucket_id = 'avatars');

-- CREATE POLICY "Users can upload their own avatar"
--     ON storage.objects FOR INSERT
--     WITH CHECK (
--         bucket_id = 'avatars' AND 
--         auth.uid()::text = (storage.foldername(name))[1]
--     );

-- CREATE POLICY "Users can update their own avatar"
--     ON storage.objects FOR UPDATE
--     USING (
--         bucket_id = 'avatars' AND 
--         auth.uid()::text = (storage.foldername(name))[1]
--     );

-- CREATE POLICY "Users can delete their own avatar"
--     ON storage.objects FOR DELETE
--     USING (
--         bucket_id = 'avatars' AND 
--         auth.uid()::text = (storage.foldername(name))[1]
--     );
