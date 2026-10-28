# 🔧 Backend Setup Required for Exam Submission

## ⚠️ IMPORTANT

Your exam submission **REQUIRES** a backend server to be running!

Currently, when students submit exams, the frontend tries to send answers to:
```
http://your-backend-url/api/student/exam/submit
```

---

## 📊 THE CORRECT FLOW

### **1. Student Takes Exam (WiFi OFF)**
- Student loads exam while online
- Turns WiFi OFF (prevents cheating - no Google/ChatGPT access)
- Answers questions offline
- Clicks "Submit Exam"
- Answers saved to localStorage

### **2. Student Connects to Internet**
- Exam tells student: "Turn ON WiFi to submit"
- Student turns WiFi ON
- Page `/exam/offline-submit` appears
- Shows "Submitting..." with spinner

### **3. Frontend Submits to Backend**
```javascript
POST /api/student/exam/submit
{
  examId: "exam-001",
  studentName: "John Doe",
  studentEmail: "john@example.com",
  answers: { q1: "option A", q2: "option B" },
  timeTaken: 1800,
  violations: [],
  tabSwitches: 0,
  submittedAt: "2024-01-01T12:00:00Z"
}
```

### **4. Backend Saves to Database**
- Your Python backend (`backend/student_routes.py`) receives submission
- Saves to Supabase database
- Calculates score
- Returns result

### **5. Frontend Shows Results**
- Navigates to `/exam/results`
- Shows score, percentage, grade

---

## 🚀 HOW TO SET UP BACKEND

### **Option 1: Run Backend Locally**

```bash
# 1. Go to backend folder
cd d:\down\Marquee07-main\backend

# 2. Install dependencies
pip install -r requirements.txt

# 3. Set up environment variables
# Create .env file with Supabase credentials

# 4. Run server
python server.py

# Server runs at: http://localhost:5000
```

### **Option 2: Deploy Backend to Production**

Deploy your Python backend to:
- **Railway.app** (Recommended - easy Python deployment)
- **Render.com** (Free tier available)
- **Heroku** (If you have account)
- **AWS/GCP/Azure** (More complex)

---

## ⚙️ CONFIGURE FRONTEND TO USE BACKEND

### **Step 1: Create .env file**

```bash
cd d:\down\Marquee07-main\frontend
```

Create file `.env`:
```env
REACT_APP_BACKEND_URL=http://localhost:5000
```

For production:
```env
REACT_APP_BACKEND_URL=https://your-backend-domain.com
```

### **Step 2: Restart Frontend**

```bash
npm start
```

---

## 🔍 VERIFY BACKEND IS WORKING

### **Test the Submit Endpoint:**

```bash
curl -X POST http://localhost:5000/api/student/exam/submit \
  -H "Content-Type: application/json" \
  -d '{
    "examId": "test-001",
    "studentName": "Test User",
    "studentEmail": "test@example.com",
    "answers": {"q1": "A", "q2": "B"},
    "timeTaken": 120,
    "violations": [],
    "tabSwitches": 0,
    "autoSubmit": false,
    "submittedAt": "2024-01-01T12:00:00Z"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Exam submitted successfully",
  "result": {
    "score": 10,
    "percentage": 100,
    "passed": true
  }
}
```

---

## 🐛 TROUBLESHOOTING

### **Problem: "No response from server"**

**Cause:** Backend is not running

**Solution:**
```bash
cd backend
python server.py
```

### **Problem: "CORS error"**

**Cause:** Backend doesn't allow frontend domain

**Solution:** Add to `server.py`:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://marquee07.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### **Problem: "Request timeout"**

**Cause:** Backend is slow or unreachable

**Solution:**
- Check backend is running
- Check firewall settings
- Check network connectivity

---

## 📝 FOR DEMO/TESTING WITHOUT BACKEND

If you want to test the frontend **without** backend:

1. Take exam with WiFi ON (don't enable offline mode)
2. Submit exam
3. It will still try to hit backend but will show error
4. For now, results are calculated locally

---

## 🎯 PRODUCTION DEPLOYMENT CHECKLIST

### **Frontend (Vercel):**
- [x] Deployed to Vercel
- [ ] Add environment variable: `REACT_APP_BACKEND_URL`
- [ ] Point to production backend URL

### **Backend (Railway/Render):**
- [ ] Deploy Python backend
- [ ] Set up Supabase credentials
- [ ] Test `/api/student/exam/submit` endpoint
- [ ] Update CORS to allow Vercel domain

### **Database (Supabase):**
- [ ] Exam submissions table created
- [ ] Student results table created
- [ ] Proper indexes for performance

---

## 🔗 API ENDPOINT REFERENCE

Your backend already has this endpoint implemented!

**File:** `backend/student_routes.py`  
**Endpoint:** `POST /api/student/exam/submit`  
**Full URL:** `http://your-backend/api/student/exam/submit`

The code is ready - you just need to:
1. Run the backend server
2. Configure frontend with backend URL
3. Test submission

---

## ⚡ QUICK START

```bash
# Terminal 1 - Backend
cd backend
python server.py

# Terminal 2 - Frontend  
cd frontend
echo "REACT_APP_BACKEND_URL=http://localhost:5000" > .env
npm start

# Now test exam submission - it will work!
```

---

**✅ Your backend code is already written! Just need to run it and configure the URL!**
