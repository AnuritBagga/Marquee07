import "@/App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import Practice from "@/pages/Practice";
import PracticeSession from "@/pages/PracticeSession";
import Campuses from "@/pages/Campuses";
import Companies from "@/pages/Companies";
import CompanyRegister from "@/pages/CompanyRegister";
import UniversityRegister from "@/pages/UniversityRegister";
import Careers from "@/pages/Careers";
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
    <div className="App grain">
      {intro && <IntroSequence onDone={() => setIntro(false)} />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/practice/session" element={<PracticeSession />} />
          <Route path="/campuses" element={<Campuses />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/company-register" element={<CompanyRegister />} />
          <Route path="/university-register" element={<UniversityRegister />} />
          <Route path="/careers" element={<Careers />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;