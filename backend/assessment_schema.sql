-- ============================================
-- ASSESSMENT PLATFORM DATABASE SCHEMA
-- ============================================

-- ============================================
-- 1. ORGANIZATIONS TABLE
-- ============================================
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('company', 'college', 'institute')),
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  logo_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'premium', 'enterprise')),
  contact_person TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 2. ORGANIZATION USERS TABLE (Admins/Managers)
-- ============================================
CREATE TABLE organization_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('admin', 'manager', 'viewer')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- ============================================
-- 3. QUESTION BANKS TABLE
-- ============================================
CREATE TABLE question_banks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  subject TEXT, -- 'coding', 'aptitude', 'reasoning', 'technical', etc.
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard', 'mixed')),
  total_questions INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 4. QUESTIONS TABLE
-- ============================================
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_bank_id UUID REFERENCES question_banks(id) ON DELETE CASCADE,
  question_type TEXT CHECK (question_type IN ('mcq', 'multiple_select', 'coding', 'descriptive', 'true_false')),
  question_text TEXT NOT NULL,
  question_image_url TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  marks DECIMAL NOT NULL DEFAULT 1,
  negative_marks DECIMAL DEFAULT 0,
  time_limit_seconds INTEGER, -- Per question time limit (optional)
  
  -- For MCQ/Multiple Select
  options JSONB, -- [{"id": "A", "text": "Option 1"}, ...]
  correct_answers JSONB, -- ["A"] or ["A", "C"] for multiple select
  
  -- For Coding Questions
  coding_language TEXT[], -- ['python', 'java', 'cpp']
  test_cases JSONB, -- [{"input": "...", "output": "...", "hidden": false}]
  starter_code JSONB, -- {"python": "def solve():\n    pass", "java": "..."}
  constraints TEXT,
  
  explanation TEXT, -- Detailed explanation
  topic_tags TEXT[], -- ['arrays', 'dynamic-programming']
  company_tags TEXT[], -- ['google', 'amazon']
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 5. EXAMS TABLE
-- ============================================
CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  exam_code TEXT UNIQUE NOT NULL, -- e.g., "EXAM-2024-ABC123"
  title TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  
  -- Exam Configuration
  exam_type TEXT CHECK (exam_type IN ('placement', 'practice', 'mock', 'contest')),
  duration_minutes INTEGER NOT NULL,
  total_marks DECIMAL NOT NULL,
  passing_marks DECIMAL,
  
  -- Scheduling
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  
  -- Proctoring Settings
  proctoring_enabled BOOLEAN DEFAULT true,
  face_detection BOOLEAN DEFAULT true,
  tab_switch_allowed INTEGER DEFAULT 0, -- Number of allowed tab switches
  mobile_detection BOOLEAN DEFAULT true,
  audio_monitoring BOOLEAN DEFAULT false,
  screenshot_interval_seconds INTEGER DEFAULT 30,
  
  -- Exam Behavior
  shuffle_questions BOOLEAN DEFAULT true,
  shuffle_options BOOLEAN DEFAULT true,
  show_results_immediately BOOLEAN DEFAULT false,
  allow_review BOOLEAN DEFAULT true,
  negative_marking_enabled BOOLEAN DEFAULT false,
  
  -- Offline Settings
  offline_mode_enabled BOOLEAN DEFAULT true,
  offline_download_window_hours INTEGER DEFAULT 2, -- Hours before exam to download
  
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'ongoing', 'completed', 'archived')),
  
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 6. EXAM QUESTIONS MAPPING TABLE
-- ============================================
CREATE TABLE exam_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  question_order INTEGER NOT NULL,
  marks_override DECIMAL, -- Override default question marks
  negative_marks_override DECIMAL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(exam_id, question_id)
);

-- ============================================
-- 7. STUDENTS TABLE
-- ============================================
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  roll_number TEXT,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  college_name TEXT,
  branch TEXT,
  year INTEGER,
  photo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 8. EXAM REGISTRATIONS TABLE
-- ============================================
CREATE TABLE exam_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  registration_date TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'started', 'submitted', 'cancelled')),
  UNIQUE(exam_id, student_id)
);

-- ============================================
-- 9. EXAM ATTEMPTS TABLE
-- ============================================
CREATE TABLE exam_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  registration_id UUID REFERENCES exam_registrations(id) ON DELETE CASCADE,
  
  -- Attempt Info
  start_time TIMESTAMP DEFAULT NOW(),
  end_time TIMESTAMP,
  submission_time TIMESTAMP,
  time_taken_seconds INTEGER,
  
  -- Scores
  total_score DECIMAL DEFAULT 0,
  percentage DECIMAL DEFAULT 0,
  rank INTEGER,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'auto_submitted', 'disqualified')),
  
  -- Proctoring Data
  proctoring_violations JSONB DEFAULT '[]', -- [{"type": "tab_switch", "time": "...", "count": 1}]
  screenshots JSONB DEFAULT '[]', -- [{"url": "...", "timestamp": "..."}]
  face_detection_logs JSONB DEFAULT '[]',
  
  -- System Info
  browser_info JSONB,
  ip_address TEXT,
  device_info JSONB,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 10. STUDENT ANSWERS TABLE
-- ============================================
CREATE TABLE student_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID REFERENCES exam_attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  
  -- Answer Data
  answer_mcq TEXT[], -- Selected option IDs ['A'] or ['A', 'C']
  answer_code TEXT, -- Coding answer
  answer_text TEXT, -- Descriptive answer
  
  -- Metadata
  time_spent_seconds INTEGER,
  is_marked_for_review BOOLEAN DEFAULT false,
  is_correct BOOLEAN,
  marks_obtained DECIMAL DEFAULT 0,
  
  -- Coding Specific
  test_cases_passed INTEGER,
  test_cases_failed INTEGER,
  code_execution_output JSONB,
  
  answered_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(attempt_id, question_id)
);

-- ============================================
-- 11. PROCTORING EVENTS TABLE
-- ============================================
CREATE TABLE proctoring_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID REFERENCES exam_attempts(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'tab_switch', 
    'fullscreen_exit', 
    'multiple_faces', 
    'no_face', 
    'mobile_detected', 
    'looking_away',
    'audio_detected',
    'suspicious_object'
  )),
  event_data JSONB, -- Additional data like screenshot URL, confidence score
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  timestamp TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 12. AI CHATBOT CONVERSATIONS TABLE
-- ============================================
CREATE TABLE chatbot_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  conversation_type TEXT CHECK (conversation_type IN ('question_generation', 'exam_creation', 'support')),
  messages JSONB DEFAULT '[]', -- [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]
  generated_exam_id UUID REFERENCES exams(id),
  generated_question_bank_id UUID REFERENCES question_banks(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 13. MOCK EXAMS TABLE
-- ============================================
CREATE TABLE mock_exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL DEFAULT 'System Compatibility Check',
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  duration_minutes INTEGER DEFAULT 5,
  questions JSONB, -- Sample questions embedded
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 14. SYSTEM COMPATIBILITY CHECKS TABLE
-- ============================================
CREATE TABLE compatibility_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id),
  browser TEXT,
  browser_version TEXT,
  os TEXT,
  camera_working BOOLEAN,
  microphone_working BOOLEAN,
  internet_speed_mbps DECIMAL,
  fullscreen_supported BOOLEAN,
  indexeddb_supported BOOLEAN,
  service_worker_supported BOOLEAN,
  check_status TEXT CHECK (check_status IN ('passed', 'failed', 'warning')),
  issues JSONB DEFAULT '[]',
  checked_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_exams_organization ON exams(organization_id);
CREATE INDEX idx_exams_code ON exams(exam_code);
CREATE INDEX idx_exams_status ON exams(status);
CREATE INDEX idx_exam_attempts_student ON exam_attempts(student_id);
CREATE INDEX idx_exam_attempts_exam ON exam_attempts(exam_id);
CREATE INDEX idx_student_answers_attempt ON student_answers(attempt_id);
CREATE INDEX idx_proctoring_events_attempt ON proctoring_events(attempt_id);
CREATE INDEX idx_questions_bank ON questions(question_bank_id);
CREATE INDEX idx_exam_questions_exam ON exam_questions(exam_id);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Organizations can only see their own data
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_attempts ENABLE ROW LEVEL SECURITY;

-- Policy: Organizations can only access their own exams
CREATE POLICY org_exams_policy ON exams
  FOR ALL
  USING (organization_id IN (
    SELECT organization_id FROM organization_users WHERE user_id = auth.uid()
  ));

-- Policy: Students can only see their own attempts
CREATE POLICY student_attempts_policy ON exam_attempts
  FOR SELECT
  USING (student_id IN (
    SELECT id FROM students WHERE user_id = auth.uid()
  ));

-- ============================================
-- TRIGGERS FOR AUTO-UPDATE
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON exams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_question_banks_updated_at BEFORE UPDATE ON question_banks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA FOR TESTING
-- ============================================

-- Insert a mock exam for testing
INSERT INTO mock_exams (title, description, duration_minutes, questions) VALUES (
  'System Compatibility Check',
  'Quick test to verify your system is ready for the exam',
  5,
  '[
    {
      "id": "mock1",
      "type": "mcq",
      "text": "What is 2 + 2?",
      "options": [
        {"id": "A", "text": "3"},
        {"id": "B", "text": "4"},
        {"id": "C", "text": "5"}
      ],
      "correct": ["B"]
    },
    {
      "id": "mock2",
      "type": "coding",
      "text": "Write a function that returns the sum of two numbers",
      "language": "python",
      "starter": "def sum(a, b):\\n    # Write your code here\\n    pass"
    }
  ]'
);
