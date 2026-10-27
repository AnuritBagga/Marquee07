# 🎯 AI-Proctored Assessment Platform - Implementation Guide

## 📋 Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Implementation Phases](#implementation-phases)
5. [Tech Stack](#tech-stack)
6. [Folder Structure](#folder-structure)
7. [Getting Started](#getting-started)

---

## 🎯 Overview

Building a comprehensive AI-proctored assessment platform with:
- ✅ **Offline Exam Capability** (Internet OFF during exam)
- ✅ **AI Proctoring** (Face detection, tab tracking, mobile detection)
- ✅ **Organization Portal** (Create exams via AI chatbot)
- ✅ **Auto Question Generation** (AI creates questions from syllabus)
- ✅ **Mock Exams** (Test system compatibility)
- ✅ **Real-time Monitoring** (Admin dashboard)

---

## 🏗️ Architecture

### Data Flow:

```
ORGANIZATION PORTAL
       ↓
[AI Chatbot] → Generate Questions → Question Bank
       ↓
Create Exam → Configure Settings → Generate Exam Code
       ↓
STUDENT PORTAL
       ↓
Enter Code → Verify Identity → Compatibility Check
       ↓
Download Exam (Offline Package) → Turn OFF Internet
       ↓
Start Exam (AI Proctoring Active)
       ↓
Answer Questions (Saved Locally)
       ↓
Submit → Turn ON Internet → Upload Answers
       ↓
Get Results
```

---

## ✨ Features Breakdown

### 1. Organization Portal

#### A. AI Chatbot for Exam Creation
```javascript
// Example conversation flow:
Org: "I want to create a placement drive exam"
AI: "Great! What subjects would you like to include?"
Org: "Coding and Aptitude"
AI: "How many questions for each?"
Org: "20 coding, 30 aptitude"
AI: "What difficulty level?"
Org: "Medium for coding, mixed for aptitude"
AI: "Would you like negative marking?"
Org: "Yes, -0.25 for wrong answers"
AI: *Generates exam with questions*
```

#### B. Question Bank Management
- Upload CSV/JSON/PDF
- Paste questions manually
- Import from syllabus (AI generates)
- Tag questions by topic/difficulty/company

#### C. Exam Configuration
- Duration, marks, passing criteria
- Proctoring settings
- Negative marking rules
- Question shuffling

#### D. Mock Exam Generator
- Auto-creates sample exam
- Tests student's system compatibility

### 2. Student Portal

#### A. Pre-Exam Checks
```javascript
Compatibility Check:
✓ Camera: Working
✓ Microphone: Working  
✓ Internet: 10 Mbps
✓ Browser: Chrome 120
✓ Fullscreen: Supported
✓ IndexedDB: Available
✓ Service Worker: Registered
```

#### B. Exam Download (Offline Package)
```javascript
Downloaded Package Contains:
- All questions (encrypted)
- Images (base64 encoded)
- Exam instructions
- Timer configuration
- Proctoring models (TensorFlow.js)
- Answer submission endpoint
```

#### C. Offline Exam Mode
```
Internet OFF → Exam Starts
↓
Questions loaded from IndexedDB
Answers saved to IndexedDB
Timer runs locally
AI Proctoring runs locally (TensorFlow.js)
↓
Submit Button → Instructions to turn ON internet
↓
Internet ON → Upload all answers
```

#### D. AI Proctoring Features

| Feature | Detection Method | Action |
|---------|-----------------|--------|
| **Face Detection** | TensorFlow BlazeFace | Alert if no face detected for 5s |
| **Multiple Faces** | Face count > 1 | Log violation + screenshot |
| **Tab Switch** | Page Visibility API | Count violations, auto-submit if > limit |
| **Fullscreen Exit** | Fullscreen API event | Force back to fullscreen or end exam |
| **Mobile Detection** | COCO-SSD object detection | Detect phone in frame |
| **Looking Away** | Eye gaze estimation | Alert if eyes off-screen > 10s |
| **Audio Detection** | Web Audio API | Detect voice/noise |
| **Screen Recording** | Periodic screenshots | Store for review |

---

## 📂 Folder Structure

```
marquee07-main/
│
├── backend/
│   ├── assessment_schema.sql          # Database schema
│   ├── ai_chatbot.py                  # AI chatbot for question generation
│   ├── question_generator.py          # Auto-generate questions from syllabus
│   ├── proctoring_analyzer.py         # Analyze proctoring violations
│   ├── exam_routes.py                 # API routes for exams
│   ├── student_routes.py              # API routes for students
│   └── organization_routes.py         # API routes for organizations
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── assessment/
│   │   │   │   ├── OrganizationPortal/
│   │   │   │   │   ├── Dashboard.jsx
│   │   │   │   │   ├── AIChatbot.jsx            # Chat with AI to create exams
│   │   │   │   │   ├── QuestionBankManager.jsx  # Manage questions
│   │   │   │   │   ├── ExamCreator.jsx          # Create new exam
│   │   │   │   │   ├── ExamsList.jsx            # List all exams
│   │   │   │   │   ├── StudentReports.jsx       # View student performance
│   │   │   │   │   └── LiveMonitoring.jsx       # Real-time proctoring view
│   │   │   │   │
│   │   │   │   ├── StudentPortal/
│   │   │   │   │   ├── ExamLogin.jsx            # Enter exam code
│   │   │   │   │   ├── CompatibilityCheck.jsx   # System check
│   │   │   │   │   ├── ExamInstructions.jsx     # Rules & instructions
│   │   │   │   │   ├── OfflineDownload.jsx      # Download exam package
│   │   │   │   │   ├── ExamInterface.jsx        # Main exam screen (offline)
│   │   │   │   │   ├── QuestionNav.jsx          # Question navigation
│   │   │   │   │   ├── SubmitExam.jsx           # Submit & upload answers
│   │   │   │   │   └── ResultsPage.jsx          # View results
│   │   │   │   │
│   │   │   │   ├── Proctoring/
│   │   │   │   │   ├── ProctoringMonitor.jsx    # Main proctoring component
│   │   │   │   │   ├── FaceDetection.jsx        # Face tracking
│   │   │   │   │   ├── TabTracker.jsx           # Track tab switches
│   │   │   │   │   ├── FullscreenEnforcer.jsx   # Force fullscreen
│   │   │   │   │   ├── MobileDetector.jsx       # Detect phones
│   │   │   │   │   ├── AudioMonitor.jsx         # Monitor audio
│   │   │   │   │   └── ViolationLogger.jsx      # Log all violations
│   │   │   │   │
│   │   │   │   └── MockExam/
│   │   │   │       ├── MockExamInterface.jsx    # Test exam
│   │   │   │       └── SystemReport.jsx         # Compatibility report
│   │   │   │
│   │   ├── hooks/
│   │   │   ├── useOfflineExam.js         # Handle offline exam logic
│   │   │   ├── useProctoring.js          # AI proctoring hook
│   │   │   ├── useFaceDetection.js       # Face detection
│   │   │   ├── useTabTracker.js          # Tab switch tracking
│   │   │   ├── useFullscreen.js          # (Already exists)
│   │   │   └── useIndexedDB.js           # IndexedDB operations
│   │   │
│   │   ├── services/
│   │   │   ├── offlineStorage.js         # IndexedDB service
│   │   │   ├── examDownloader.js         # Download exam package
│   │   │   ├── answerUploader.js         # Upload answers after exam
│   │   │   ├── proctoringService.js      # Proctoring AI models
│   │   │   └── chatbotService.js         # AI chatbot API
│   │   │
│   │   └── workers/
│   │       ├── service-worker.js         # Cache exam for offline
│   │       └── proctoring-worker.js      # Run AI models in worker
│   │
│   └── public/
│       ├── models/                       # TensorFlow.js models
│       │   ├── blazeface/               # Face detection
│       │   ├── cocossd/                 # Object detection
│       │   └── posenet/                 # Pose estimation
│       │
│       └── manifest.json                 # PWA manifest
│
└── docs/
    ├── ASSESSMENT_PLATFORM_IMPLEMENTATION.md  # (This file)
    ├── API_DOCUMENTATION.md
    ├── PROCTORING_GUIDE.md
    └── OFFLINE_EXAM_FLOW.md
```

---

## 🚀 Implementation Phases

### **Phase 1: Database & Backend Setup** (Week 1)
- ✅ Create Supabase tables (schema provided)
- ✅ Set up authentication (org users & students)
- ✅ Create API routes for exams, questions, answers
- ✅ Implement AI chatbot backend (OpenAI integration)

### **Phase 2: Organization Portal** (Week 2-3)
- ✅ Organization dashboard
- ✅ AI chatbot interface
- ✅ Question bank manager
- ✅ Exam creator wizard
- ✅ Auto question generation from syllabus
- ✅ Mock exam generator

### **Phase 3: Student Portal - Online Features** (Week 4)
- ✅ Student registration/login
- ✅ Exam code entry
- ✅ System compatibility check
- ✅ Exam instructions display
- ✅ Download exam package

### **Phase 4: Offline Exam Mode** (Week 5-6)
- ✅ IndexedDB implementation
- ✅ Service worker setup
- ✅ Offline exam interface
- ✅ Local answer storage
- ✅ Timer management
- ✅ Answer upload after exam

### **Phase 5: AI Proctoring** (Week 7-8)
- ✅ TensorFlow.js integration
- ✅ Face detection (BlazeFace)
- ✅ Mobile detection (COCO-SSD)
- ✅ Tab switch tracking
- ✅ Fullscreen enforcement
- ✅ Audio monitoring
- ✅ Screenshot capture
- ✅ Violation logging

### **Phase 6: Results & Analytics** (Week 9)
- ✅ Auto-grading (MCQ, coding)
- ✅ Results page
- ✅ Admin dashboard with analytics
- ✅ Proctoring report generation
- ✅ Rank calculation

### **Phase 7: Testing & Deployment** (Week 10)
- ✅ End-to-end testing
- ✅ Performance optimization
- ✅ Security hardening
- ✅ Production deployment

---

## 🛠️ Tech Stack

### Frontend:
- **React** - UI framework
- **TensorFlow.js** - AI models (face detection, object detection)
- **MediaPipe** - Pose/hand tracking
- **IndexedDB** - Offline storage
- **Service Workers** - PWA capabilities
- **WebRTC** - Camera/mic access
- **Chart.js** - Analytics graphs

### Backend:
- **Python/FastAPI** - API server
- **Supabase** - Database, auth, storage
- **OpenAI GPT-4** - AI chatbot & question generation
- **PostgreSQL** - Primary database
- **Redis** - Caching & real-time features

### AI/ML:
- **TensorFlow.js BlazeFace** - Face detection
- **COCO-SSD** - Object detection (mobile phones)
- **PoseNet** - Body pose estimation
- **Web Audio API** - Audio analysis

### DevOps:
- **Vercel** - Frontend hosting
- **Railway/Render** - Backend hosting
- **GitHub Actions** - CI/CD
- **Sentry** - Error tracking

---

## 📖 Key Implementation Details

### 1. Offline Exam Flow

```javascript
// Step 1: Download exam package
async function downloadExamPackage(examCode) {
  const exam = await fetchExam(examCode);
  
  // Store in IndexedDB
  await indexedDB.put('exams', {
    id: exam.id,
    questions: exam.questions,
    duration: exam.duration,
    instructions: exam.instructions,
    downloadedAt: new Date()
  });
  
  // Download AI models
  await loadTensorFlowModels();
  
  return true;
}

// Step 2: Start offline exam
async function startOfflineExam() {
  // Check internet is OFF
  if (navigator.onLine) {
    alert("Please turn OFF your internet to start the exam");
    return;
  }
  
  // Load exam from IndexedDB
  const exam = await indexedDB.get('exams', examId);
  
  // Start timer
  startTimer(exam.duration);
  
  // Start proctoring
  startProctoring();
  
  // Show first question
  renderQuestion(exam.questions[0]);
}

// Step 3: Save answers locally
async function saveAnswer(questionId, answer) {
  await indexedDB.put('answers', {
    questionId,
    answer,
    timestamp: new Date(),
    timeTaken: calculateTimeTaken()
  });
}

// Step 4: Submit exam
async function submitExam() {
  // Show instruction to turn ON internet
  showInternetOnInstructions();
  
  // Wait for internet
  await waitForInternet();
  
  // Upload all answers
  const answers = await indexedDB.getAll('answers');
  const violations = await indexedDB.getAll('violations');
  
  await uploadExamData({
    answers,
    violations,
    timeTaken,
    screenshots
  });
  
  // Show results
  showResults();
}
```

### 2. AI Proctoring Implementation

```javascript
// Initialize proctoring
async function initProctoring() {
  // Load TensorFlow models
  const faceModel = await tf.loadGraphModel('/models/blazeface/model.json');
  const objectModel = await cocoSsd.load();
  
  // Start monitoring
  setInterval(async () => {
    const frame = captureVideoFrame();
    
    // Face detection
    const faces = await detectFaces(frame, faceModel);
    if (faces.length === 0) {
      logViolation('NO_FACE', 'high');
    } else if (faces.length > 1) {
      logViolation('MULTIPLE_FACES', 'critical');
      captureScreenshot();
    }
    
    // Mobile detection
    const objects = await objectModel.detect(frame);
    const mobile = objects.find(obj => obj.class === 'cell phone');
    if (mobile && mobile.score > 0.6) {
      logViolation('MOBILE_DETECTED', 'critical');
      captureScreenshot();
    }
  }, 1000); // Check every second
}

// Tab switch detection
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    tabSwitchCount++;
    logViolation('TAB_SWITCH', 'medium');
    
    if (tabSwitchCount > maxTabSwitches) {
      autoSubmitExam('Too many tab switches');
    }
  }
});

// Fullscreen exit detection
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) {
    logViolation('FULLSCREEN_EXIT', 'high');
    
    // Force back to fullscreen
    document.documentElement.requestFullscreen();
  }
});
```

### 3. AI Chatbot for Question Generation

```python
# Backend: ai_chatbot.py

from openai import OpenAI
import json

client = OpenAI(api_key="your-api-key")

async def generate_questions_from_syllabus(syllabus: str, 
                                          num_questions: int,
                                          difficulty: str,
                                          question_type: str):
    prompt = f"""
    Generate {num_questions} {difficulty} level {question_type} questions 
    based on this syllabus:
    
    {syllabus}
    
    Return as JSON array with format:
    [{{
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "correct_answer": "A",
      "explanation": "Why A is correct",
      "difficulty": "medium",
      "topic": "arrays"
    }}]
    """
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an expert exam question generator."},
            {"role": "user", "content": prompt}
        ],
        response_format={"type": "json_object"}
    )
    
    questions = json.loads(response.choices[0].message.content)
    return questions
```

---

## 🎯 Getting Started

### Prerequisites:
```bash
# Install dependencies
cd frontend
npm install

# Install additional packages
npm install @tensorflow/tfjs @tensorflow-models/blazeface @tensorflow-models/coco-ssd
npm install dexie  # IndexedDB wrapper
npm install workbox-webpack-plugin  # Service worker

cd ../backend
pip install -r requirements.txt
```

### Run Database Migrations:
```bash
# Apply schema to Supabase
psql -h your-supabase-url -U postgres -d postgres -f backend/assessment_schema.sql
```

### Environment Variables:
```env
# Frontend (.env)
REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
REACT_APP_BACKEND_URL=http://localhost:8000

# Backend (.env)
OPENAI_API_KEY=your-openai-key
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-service-key
DATABASE_URL=postgresql://...
```

### Start Development:
```bash
# Terminal 1: Backend
cd backend
uvicorn server:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm start
```

---

## 📊 Success Metrics

After implementation, track:
- ✅ **Exam Completion Rate**: % of students who finish exams
- ✅ **Proctoring Accuracy**: False positive rate < 5%
- ✅ **Offline Success Rate**: % of successful offline exams
- ✅ **System Compatibility**: % of students who pass compatibility check
- ✅ **Question Generation Quality**: Organization satisfaction rating
- ✅ **Platform Uptime**: 99.9% availability

---

## 🔒 Security Considerations

1. **Exam Data Encryption**: Encrypt exam packages before download
2. **Answer Integrity**: Hash answers to prevent tampering
3. **Screenshot Watermarking**: Add invisible watermarks to screenshots
4. **IP Whitelisting**: Optional IP restrictions for organizations
5. **Secure Upload**: Use presigned URLs for answer uploads
6. **Rate Limiting**: Prevent brute force exam code attempts

---

## 🎉 Next Steps

1. Review this document with your team
2. Set up Supabase project
3. Run database migration
4. Start with Phase 1 (Backend setup)
5. I'll create the components as we proceed through each phase

Ready to start implementation? Let me know which phase you want to begin with! 🚀
