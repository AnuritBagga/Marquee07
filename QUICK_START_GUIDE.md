# ⚡ Quick Start Guide - Assessment Platform

## 🚀 Start the Application

### Backend
```bash
cd backend
pip install -r requirements.txt
python server.py
```
**Backend runs on:** `http://localhost:8000`

### Frontend
```bash
cd frontend
npm install
npm start
```
**Frontend runs on:** `http://localhost:3000`

---

## 🎯 Test Routes

### Organization Portal (For Admins)
```
http://localhost:3000/organization/dashboard      - Main dashboard
http://localhost:3000/organization/ai-chat        - AI Chatbot
http://localhost:3000/organization/question-banks - Question banks
http://localhost:3000/organization/exam/create    - Create exam
http://localhost:3000/organization/exams          - View exams
http://localhost:3000/organization/monitoring     - Live monitoring
http://localhost:3000/organization/reports        - Analytics
```

### Student Portal (For Exam Takers)
```
http://localhost:3000/exam/login                  - Enter exam code
http://localhost:3000/exam/system-check           - Camera/system test
http://localhost:3000/exam/instructions           - Read rules
http://localhost:3000/exam/interface              - Take exam
http://localhost:3000/exam/results                - View results
```

---

## 📋 Quick Test Flow

### As Organization Admin

1. **Go to Dashboard**
   - View stats overview

2. **Create Question Bank**
   - Navigate to Question Banks
   - Click "Create Question Bank"
   - Name: "Sample DSA Questions"
   - Upload CSV or use AI

3. **Use AI Chatbot**
   - Navigate to AI Chat
   - Type: "Generate 10 easy coding questions"
   - Review generated questions

4. **Create Exam**
   - Navigate to Exams → Create
   - Fill basic info
   - Select question banks
   - Configure proctoring
   - Create and get exam code

5. **Share Code**
   - Copy 6-digit exam code
   - Share with students

### As Student

1. **Login**
   - Go to `/exam/login`
   - Enter exam code (e.g., ABC123)
   - Enter name and email

2. **System Check**
   - Allow camera access
   - Test fullscreen
   - Continue

3. **Read Instructions**
   - Review all rules
   - Agree to terms

4. **Take Exam**
   - (Optional) Turn off internet for offline mode
   - Answer questions
   - Submit

5. **View Results**
   - See score and breakdown

---

## 🎨 Key Features to Demo

### ✨ AI Question Generation
- Upload PDF syllabus
- AI generates relevant questions
- Automatic difficulty assignment

### 📡 Offline Exam Mode
- Turn off internet
- Take exam offline
- Turn on internet to submit

### 🎥 AI Proctoring
- Draggable camera feed
- Tab switch detection
- Fullscreen enforcement
- Violation logging

### 📊 Live Monitoring
- See active students
- Track progress
- View violations in real-time

### 📈 Analytics
- Score distribution
- Performance metrics
- Export reports

---

## 🔑 Test Credentials

For testing, use:
- **Organization ID:** `temp-org-id` (hardcoded for now)
- **Exam Code:** Any 6-character code (e.g., TEST01)
- **Student Email:** Any valid email

---

## 📁 Important Files

```
backend/
├── assessment_schema.sql      - Database schema
├── ai_chatbot.py             - AI question generation
├── organization_routes.py    - Org APIs
├── student_routes.py         - Student APIs
└── server.py                 - Main server

frontend/src/components/assessment/
├── OrganizationPortal/       - 10 components
└── StudentPortal/            - 6 components
```

---

## 🐛 Common Issues

### Camera Not Working
- Allow browser permissions
- Check browser compatibility (Chrome/Edge/Firefox)

### Fullscreen Not Working
- Click "Test" button in system check
- Press F11 manually if needed

### Offline Mode
- Use Chrome DevTools Network tab
- Switch to "Offline" to test

### API Errors
- Check backend is running on port 8000
- Verify CORS settings
- Check console for errors

---

## 💡 Pro Tips

1. **Use Chrome DevTools**
   - Network tab for API calls
   - Console for errors
   - Application tab for localStorage

2. **Test Offline Mode**
   - DevTools → Network → Offline
   - Or turn off WiFi

3. **Monitor Console**
   - All violations logged
   - API responses visible

4. **Clear Cache**
   - Clear localStorage between tests
   - Hard refresh (Ctrl+Shift+R)

---

## 📞 Need Help?

Check these docs:
- `ASSESSMENT_PLATFORM_COMPLETE.md` - Full documentation
- `ORGANIZATION_PORTAL_STATUS.md` - Component status
- `BUILD_SUMMARY.txt` - Quick overview

---

**Status:** ✅ Ready to Test  
**Platform:** 100% Complete  
**Enjoy your AI-proctored assessment platform! 🎓🚀**
