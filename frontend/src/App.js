import "@/App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Landing from "@/pages/Landing";
import Practice from "@/pages/Practice";
import InterviewMode from "@/pages/InterviewMode";
import PracticeSetup from "@/pages/PracticeSetup";
import PracticeSession from "@/pages/PracticeSession";
import Campuses from "@/pages/Campuses";
import Companies from "@/pages/Companies";
import CompanyRegister from "@/pages/CompanyRegister";
import UniversityRegister from "@/pages/UniversityRegister";
import Careers from "@/pages/Careers";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import AuthCallback from "@/pages/AuthCallback";
import Profile from "@/pages/Profile";
import IntroSequence from "@/components/brand/IntroSequence";

// Assessment/Organization Portal Components
import OrganizationLayout from "@/components/assessment/OrganizationPortal/OrganizationLayout";
import Dashboard from "@/components/assessment/OrganizationPortal/Dashboard";
import AIChatbot from "@/components/assessment/OrganizationPortal/AIChatbot";
import QuestionBankManager from "@/components/assessment/OrganizationPortal/QuestionBankManager";
import QuestionBankDetails from "@/components/assessment/OrganizationPortal/QuestionBankDetails";
import ExamsList from "@/components/assessment/OrganizationPortal/ExamsList";
import ExamCreator from "@/components/assessment/OrganizationPortal/ExamCreator";
import ExamDetails from "@/components/assessment/OrganizationPortal/ExamDetails";
import StudentReports from "@/components/assessment/OrganizationPortal/StudentReports";
import LiveMonitoring from "@/components/assessment/OrganizationPortal/LiveMonitoring";

// Assessment/Student Portal Components
import ExamLogin from "@/components/assessment/StudentPortal/ExamLogin";
import SystemCheck from "@/components/assessment/StudentPortal/SystemCheck";
import ExamInstructions from "@/components/assessment/StudentPortal/ExamInstructions";
import ExamInterface from "@/components/assessment/StudentPortal/ExamInterface";
import OfflineSubmitHandler from "@/components/assessment/StudentPortal/OfflineSubmitHandler";
import ExamResults from "@/components/assessment/StudentPortal/ExamResults";
import DemoExam from "@/components/assessment/StudentPortal/DemoExam";

function App() {
  const [intro, setIntro] = useState(false);

  useEffect(() => {
    // Play intro once per browser session
    try {
      if (!sessionStorage.getItem("marquee.introShown")) {
        setIntro(true);
        sessionStorage.setItem("marquee.introShown", "1");
      }
    } catch (e) {
      // sessionStorage unavailable — skip
    }
  }, []);

  return (
    <AuthProvider>
      <div className="App grain">
        {intro && <IntroSequence onDone={() => setIntro(false)} />}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Practice Routes - Protected (Login Required) */}
            <Route path="/practice" element={<ProtectedRoute><Practice /></ProtectedRoute>} />
            <Route path="/practice/mode/:type" element={<ProtectedRoute><InterviewMode /></ProtectedRoute>} />
            <Route path="/practice/setup/:type/:mode" element={<ProtectedRoute><PracticeSetup /></ProtectedRoute>} />
            <Route path="/practice/session" element={<ProtectedRoute><PracticeSession /></ProtectedRoute>} />
            
            <Route path="/campuses" element={<Campuses />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/company-register" element={<CompanyRegister />} />
            <Route path="/university-register" element={<UniversityRegister />} />
            <Route path="/careers" element={<Careers />} />
            
            {/* Organization Portal Routes - Protected */}
            <Route path="/organization" element={<ProtectedRoute><OrganizationLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<Dashboard organizationId="temp-org-id" />} />
              <Route path="ai-chat" element={<AIChatbot organizationId="temp-org-id" />} />
              <Route path="question-banks" element={<QuestionBankManager organizationId="temp-org-id" />} />
              <Route path="question-bank/:bankId" element={<QuestionBankDetails organizationId="temp-org-id" />} />
              <Route path="exams" element={<ExamsList organizationId="temp-org-id" />} />
              <Route path="exam/create" element={<ExamCreator organizationId="temp-org-id" />} />
              <Route path="exam/:examId" element={<ExamDetails organizationId="temp-org-id" />} />
              <Route path="reports" element={<StudentReports organizationId="temp-org-id" />} />
              <Route path="monitoring" element={<LiveMonitoring organizationId="temp-org-id" />} />
            </Route>

            {/* Student Exam Portal Routes - Public */}
            <Route path="/exam/login" element={<ExamLogin />} />
            <Route path="/exam/demo" element={<DemoExam />} />
            <Route path="/exam/system-check" element={<SystemCheck />} />
            <Route path="/exam/instructions" element={<ExamInstructions />} />
            <Route path="/exam/interface" element={<ExamInterface />} />
            <Route path="/exam/offline-submit" element={<OfflineSubmitHandler />} />
            <Route path="/exam/results" element={<ExamResults />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;