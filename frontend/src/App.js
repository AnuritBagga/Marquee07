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
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;