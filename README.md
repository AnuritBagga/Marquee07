# 🎬 Marquee 2.0 - AI-Powered Interview Platform

<div align="center">

![Marquee Banner](https://img.shields.io/badge/Marquee-2.0-gold?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-Private-red?style=for-the-badge)

**Practice. Perfect. Perform.**

An AI-powered interview simulation platform featuring realistic interview scenarios with adaptive AI interviewers, real-time transcription, code execution, and comprehensive performance analytics.

[Features](#-features) • [Quick Start](#-quick-start) • [Deployment](#-deployment) • [Tech Stack](#-tech-stack) • [Documentation](#-documentation)

</div>

---

## ✨ Features

### 🎯 Interview Modes

- **Technical Interviews** - DSA, System Design, and CS Fundamentals
- **Domain Interviews** - Deep dive into specific technologies and projects
- **UPSC/Civil Services** - Personality test simulations
- **Defence Services** - SSB/NDA interview preparation

### 🤖 AI-Powered Experience

- **Adaptive AI Interviewers** - Persona-based interviewers with distinct styles
- **Real-time Audio Transcription** - Powered by Groq Whisper
- **Dynamic Question Generation** - Context-aware follow-up questions
- **Cross-questioning** - Probes deeper into candidate responses

### 💻 Code Practice

- **Multi-language Support** - Python, Java, C++, JavaScript, SQL
- **Integrated Code Editor** - Monaco-based editor with syntax highlighting
- **Real-time Execution** - Judge0 integration for code testing
- **Test Case Validation** - Automated test case execution and feedback

### 📊 Analytics & Feedback

- **Comprehensive Scorecards** - AI-generated performance analysis
- **Multi-metric Evaluation** - Communication, technical depth, confidence, fluency
- **Filler Word Analysis** - Tracks and analyzes speech patterns
- **Code Review** - AI-powered code quality assessment

### 🎨 User Experience

- **3D Interview Room** - Three.js-powered immersive environment
- **Cinematic Camera System** - Dynamic camera angles and transitions
- **Resume Analysis** - PDF parsing and skill extraction
- **Responsive Design** - Works across all devices

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ and npm/yarn
- **Python** 3.9+
- **MongoDB** (local or Atlas)
- **API Keys**: Groq, Gemini, OpenRouter, Supabase

### Local Development

#### 1. Clone Repository

```bash
git clone <your-repo-url>
cd Marquee2.0-main
```

#### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your API keys

# Start backend server
uvicorn server:app --reload --port 8000
```

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
# or
yarn install

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm start
# or
yarn start
```

#### 4. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/
- **API Docs**: http://localhost:8000/docs

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

Marquee 2.0 is optimized for Vercel deployment with serverless functions.

#### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

#### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Or use the deployment script
.\deploy.ps1        # Windows
./deploy.sh         # Mac/Linux
```

#### Detailed Guides

- **[Quick Start Guide](VERCEL_QUICKSTART.md)** - Step-by-step Vercel deployment
- **[Deployment Summary](DEPLOYMENT_SUMMARY.md)** - Overview of deployment configuration
- **[Full Documentation](README_DEPLOYMENT.md)** - Comprehensive deployment guide

### Environment Variables

#### Backend (`api/index.py`)

```env
MONGO_URL=mongodb+srv://...
DB_NAME=marquee_db
GROQ_API_KEY=gsk_...
OPENROUTER_API_KEY=sk-or-...
GEMINI_API_KEY=AIzaSy...
SMTP_EMAIL=your@gmail.com
SMTP_PASSWORD=your-app-password
ALLOWED_ORIGINS=https://your-domain.vercel.app
```

#### Frontend (React)

```env
REACT_APP_API_URL=https://your-domain.vercel.app/api
REACT_APP_SUPABASE_URL=https://xxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGc...
```

---

## 🛠 Tech Stack

### Frontend

- **React 19** - UI framework
- **React Router 7** - Routing
- **Three.js** - 3D graphics and interview room
- **Monaco Editor** - Code editor
- **Tailwind CSS** - Styling
- **Radix UI** - UI components
- **Framer Motion** - Animations
- **Supabase** - Authentication

### Backend

- **FastAPI** - Python web framework
- **Motor** - Async MongoDB driver
- **Groq API** - AI interviews and Whisper transcription
- **Google Gemini** - AI scorecards and code review
- **OpenRouter** - AI fallback
- **Judge0** - Code execution
- **SMTP** - Email notifications

### Infrastructure

- **Vercel** - Hosting and serverless functions
- **MongoDB Atlas** - Database
- **Supabase** - Authentication
- **Judge0 CE** - Code execution sandbox

---

## 📁 Project Structure

```
Marquee2.0-main/
├── api/
│   └── index.py              # Vercel serverless entry point
├── backend/
│   ├── server.py             # FastAPI application
│   ├── problem_bank.py       # DSA and SQL problems
│   ├── prompts/              # AI interviewer prompts
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Backend environment variables
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   └── App.js           # Main app component
│   ├── public/              # Static assets
│   ├── package.json         # Node dependencies
│   └── .env                 # Frontend environment variables
├── vercel.json              # Vercel configuration
├── .vercelignore           # Vercel deployment exclusions
├── deploy.sh               # Bash deployment script
├── deploy.ps1              # PowerShell deployment script
└── README.md               # This file
```

---

## 📚 Documentation

- **[Vercel Quick Start](VERCEL_QUICKSTART.md)** - Deploy to Vercel in minutes
- **[Deployment Guide](README_DEPLOYMENT.md)** - Comprehensive deployment instructions
- **[Deployment Summary](DEPLOYMENT_SUMMARY.md)** - Overview of deployment setup
- **[Authentication Setup](AUTHENTICATION_SUMMARY.md)** - Supabase authentication guide
- **[Email Setup](EMAIL_SIGNUP_SETUP.md)** - Email notification configuration
- **[Complete Setup](COMPLETE_SETUP_SUMMARY.md)** - Full application setup guide
- **[DSA/SQL Implementation](DSA_SQL_IMPLEMENTATION_SUMMARY.md)** - Coding problem setup

---

## 🔑 Required API Keys

### Groq API (Required)

- **Purpose**: AI interviews + Whisper transcription
- **Get Key**: https://console.groq.com/keys
- **Models Used**: `llama-3.3-70b-versatile`, `whisper-large-v3-turbo`

### Google Gemini API (Required)

- **Purpose**: Scorecard generation + Code review
- **Get Key**: https://makersuite.google.com/app/apikey
- **Model Used**: `gemini-2.5-flash`

### OpenRouter API (Optional but Recommended)

- **Purpose**: Fallback when Groq rate limit reached
- **Get Key**: https://openrouter.ai/keys
- **Model Used**: `meta-llama/llama-3.3-70b-instruct`

### MongoDB (Required)

- **Purpose**: Store interviews, scorecards, user data
- **Setup**: https://www.mongodb.com/cloud/atlas
- **Free Tier**: Available

### Supabase (Required)

- **Purpose**: User authentication
- **Setup**: https://supabase.com/dashboard
- **Free Tier**: Available

### Judge0 (Automatic)

- **Purpose**: Code execution
- **Endpoint**: https://ce.judge0.com
- **Note**: Uses public API endpoint (no key required)

---

## 🎯 Features in Detail

### Interview Flow

1. **Resume Upload** - Extract skills and experiences
2. **Interview Type Selection** - Choose domain
3. **AI Introduction** - Personalized greeting
4. **Verbal Q&A** - 8-11 adaptive questions
5. **Coding Challenges** - 2-3 DSA/SQL problems
6. **Scorecard Generation** - Comprehensive feedback

### AI Interviewer Personas

- **Riya Menon** - Senior Engineer, Technical interviews
- **Karan Iyer** - Staff Engineer, Domain interviews
- **Dr. R. Mehta** - UPSC Board Chairperson
- **Col. Arjun Singh** - Defence Services Officer

### Scoring Metrics

- **Communication** - Clarity, articulation, structure
- **Technical Depth** - Accuracy and understanding
- **Problem Solving** - Structured thinking, trade-offs
- **Confidence** - Tone, conviction, composure
- **Fluency & Delivery** - Pacing, filler words, pauses

### Code Execution

- **Languages**: Python, Java, C++, JavaScript, SQL
- **Test Cases**: 4 automated test cases per problem
- **Real-time Feedback**: Pass/fail status, execution time, memory usage
- **AI Code Review**: Complexity analysis and improvement hints

---

## 🔒 Security & Privacy

- **Environment Variables**: All secrets stored securely in Vercel
- **CORS Protection**: Restricted to allowed origins only
- **MongoDB Security**: Connection string encryption
- **Supabase Auth**: Industry-standard authentication
- **No Data Sharing**: Your interview data stays private

---

## 📊 Performance

- **Frontend Build**: ~2 minutes
- **Backend Cold Start**: <2 seconds
- **API Response Time**: <500ms (average)
- **Code Execution**: <5 seconds per test case
- **Audio Transcription**: ~10 seconds per minute of audio

---

## 🤝 Contributing

This is a private project. For collaboration inquiries, contact the maintainers.

---

## 📝 License

Private and proprietary. All rights reserved.

---

## 🙏 Acknowledgments

- **Groq** - For lightning-fast AI inference
- **Google** - For Gemini AI models
- **Vercel** - For seamless deployment
- **Judge0** - For code execution infrastructure
- **Supabase** - For authentication services

---

## 📞 Support

For questions or issues:

- **Email**: marqueesupport@gmail.com
- **Documentation**: Check the docs folder
- **Deployment Issues**: See [VERCEL_QUICKSTART.md](VERCEL_QUICKSTART.md)

---

<div align="center">

**Made with ❤️ for the quietly ambitious**

⭐ Star this repo if you find it helpful!

[🚀 Deploy Now](https://vercel.com/new) • [📖 Read Docs](VERCEL_QUICKSTART.md) • [💬 Get Support](mailto:marqueesupport@gmail.com)

</div>
