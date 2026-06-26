import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ResumeUpload from "../components/practice/ResumeUpload";
import { INTERVIEW_TYPES } from "../data/practiceConfig";
import Lion from "../components/brand/Lion";
import lionLogo from "../assets/brand/lion-mascot-lg.png";

export default function Practice() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("technical");
  const [resumeText, setResumeText] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [name, setName] = useState("");

  const typeConfig = INTERVIEW_TYPES.find((t) => t.id === selectedType);

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleTypeChange = (id) => {
    setSelectedType(id);
    setSelectedSkills([]);
  };

  const handleResume = (text, file) => {
    setResumeText(text);
    setResumeFile(file);
  };

  const handleStart = () => {
    // Persist config in sessionStorage so PracticeSession can read it
    sessionStorage.setItem(
      "practiceConfig",
      JSON.stringify({
        interviewType: selectedType,
        resumeText,
        skills: selectedSkills,
        candidateName: name.trim() || "the candidate",
      })
    );
    navigate("/practice/session");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      {/* Animated lion logo watermark background */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-0"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.04, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          backgroundImage: `url(${lionLogo})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '40%',
          mixBlendMode: 'luminosity',
        }}
      />

      {/* Animated golden glow behind lion */}
      <motion.div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: [0.15, 0.25, 0.15],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-[600px] h-[600px] rounded-full bg-[#D4AF37]/20 blur-[120px]" />
      </motion.div>

      {/* Large decorative lion in corner */}
      <motion.div
        className="fixed top-20 right-0 pointer-events-none z-0 opacity-5"
        initial={{ x: 100, opacity: 0, rotate: -15 }}
        animate={{ x: 0, opacity: 0.08, rotate: 0 }}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <Lion size={400} glow={false} animate={false} className="opacity-40" />
      </motion.div>
      
      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 gap-3 sm:gap-0 border-b border-white/7 bg-[#050505]/90 backdrop-blur-md relative">
        <motion.a 
          href="/" 
          className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Lion size={40} glow={true} animate={true} />
          <div className="font-serif text-lg sm:text-xl tracking-widest text-[#D4AF37]">
            Marquee <span className="text-white/30 text-[10px] sm:text-xs tracking-[0.3em] font-sans ml-2">PRACTICE</span>
          </div>
        </motion.a>
        <motion.span 
          className="text-[10px] tracking-widest uppercase text-white/30 border border-white/10 px-3 py-1 whitespace-nowrap"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Self Assessment
        </motion.span>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 flex flex-col gap-14 relative z-10">
        {/* ── Hero ── */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Centered Lion Logo */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ 
              duration: 1, 
              delay: 0.5,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <Lion size={120} glow={true} animate={true} />
          </motion.div>

          <motion.p 
            className="text-[10px] tracking-[0.35em] uppercase text-[#D4AF37] mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            AI-Powered Practice
          </motion.p>
          <motion.h1 
            className="font-serif text-5xl font-light leading-tight text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            Your Personal<br /><em>Interview Room</em>
          </motion.h1>
          <motion.p 
            className="text-white/40 leading-relaxed max-w-md mx-auto text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            Upload your resume. The AI reads it, asks personalized questions, and cross-examines
            your answers — exactly like a real interviewer. 10–15 minutes.
          </motion.p>
        </motion.div>

        {/* ── Step 1: Interview Type ── */}
        <div>
          <StepLabel n="01" label="Choose Interview Type" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {INTERVIEW_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => handleTypeChange(t.id)}
                className={`text-left p-5 border transition-all duration-150 relative ${
                  selectedType === t.id
                    ? "border-[#D4AF37] bg-[#D4AF37]/8"
                    : "border-white/8 bg-[#0A0A0A] hover:border-white/15"
                }`}
              >
                <div className="text-2xl mb-3">{t.icon}</div>
                <div className="text-sm font-medium text-white mb-1">{t.label}</div>
                <div className="text-xs text-white/40 leading-relaxed">{t.desc}</div>
                {selectedType === t.id && (
                  <div className="absolute top-3.5 right-3.5 w-4 h-4 rounded-full bg-[#D4AF37] flex items-center justify-center">
                    <span className="text-black text-[9px] font-bold">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Step 2: Resume ── */}
        <div>
          <StepLabel n="02" label="Upload Your Resume" />
          <div className="mt-4">
            <ResumeUpload onResume={handleResume} />
            {!resumeFile && (
              <p className="text-red-400/60 text-xs mt-2 text-center font-medium">
                ⚠ Resume is required for a personalized interview experience
              </p>
            )}
            {resumeFile && (
              <p className="text-[#D4AF37]/60 text-xs mt-2 text-center">
                ✓ Resume uploaded • Questions will be personalized to your background
              </p>
            )}
          </div>
        </div>

        {/* ── Step 3: Skills ── */}
        <div>
          <StepLabel n="03" label="Highlight Skills" optional />
          <div className="flex flex-wrap gap-2 mt-4">
            {typeConfig?.skills?.map((skill) => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`text-[11px] tracking-wider uppercase px-3 py-1.5 border transition-all duration-150 ${
                  selectedSkills.includes(skill)
                    ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/8"
                    : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/60"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* ── Step 4: Name + Start ── */}
        <div className="flex flex-col items-center gap-5">
          <StepLabel n="04" label="Your Name" optional />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Arjun Sharma"
            onKeyDown={(e) => { if (e.key === "Enter") handleStart(); }}
            className="w-full max-w-xs bg-[#0A0A0A] border border-white/10 text-white placeholder-white/20 px-4 py-3 text-sm outline-none focus:border-white/20 transition-colors text-center"
          />
          <button
            onClick={handleStart}
            disabled={!resumeFile}
            className="bg-[#D4AF37] text-black text-xs sm:text-sm font-semibold tracking-widest uppercase px-8 sm:px-12 py-3 sm:py-4 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed w-full sm:w-auto whitespace-nowrap"
          >
            Begin Interview →
          </button>
          {!resumeFile && (
            <p className="text-red-400/50 text-xs text-center">
              Please upload your resume to start the interview
            </p>
          )}
          <p className="text-white/20 text-xs text-center leading-relaxed">
            AI interviewer powered by Groq · Evaluated by Gemini<br />
            10–15 minute session · Real-time voice + cross-questioning
          </p>
        </div>
      </main>
    </div>
  );
}

function StepLabel({ n, label, optional }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">{n} —</span>
      <span className="text-[11px] tracking-widest uppercase text-white/50">{label}</span>
      {optional && <span className="text-[10px] text-white/20 normal-case tracking-normal">(optional)</span>}
    </div>
  );
}