import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ResumeUpload from "../components/practice/ResumeUpload";
import { getInterviewType } from "../data/practiceConfig";
import Lion from "../components/brand/Lion";
import lionLogo from "../assets/brand/lion-mascot-lg.png";

export default function PracticeSetup() {
  const { type, mode } = useParams();
  const navigate = useNavigate();
  
  const [resumeText, setResumeText] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [name, setName] = useState("");
  
  // Specific mode fields
  const [jobDescription, setJobDescription] = useState("");
  const [jobDescriptionFile, setJobDescriptionFile] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [roleName, setRoleName] = useState("");

  const typeConfig = getInterviewType(type);
  const isSpecific = mode === "specific";

  useEffect(() => {
    if (!typeConfig || !["general", "specific"].includes(mode)) {
      navigate("/practice");
      return;
    }
  }, [typeConfig, mode, navigate]);

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleResume = (text, file) => {
    setResumeText(text);
    setResumeFile(file);
  };

  const handleStart = () => {
    // Validate required fields
    if (!resumeFile) {
      alert("Please upload your resume");
      return;
    }
    
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    if (isSpecific && !jobDescription.trim() && !jobDescriptionFile) {
      alert("Please provide job description (paste text or upload PDF)");
      return;
    }

    // Persist config in sessionStorage
    const config = {
      interviewType: type,
      interviewMode: mode,
      resumeText,
      skills: selectedSkills,
      candidateName: name.trim(),
    };

    // Add specific mode fields if applicable
    if (isSpecific) {
      config.jobDescription = jobDescription.trim();
      config.jobDescriptionFile = jobDescriptionFile?.name || null;
      config.companyName = companyName.trim();
      config.roleName = roleName.trim();
    }

    sessionStorage.setItem("practiceConfig", JSON.stringify(config));
    navigate("/practice/session");
  };

  if (!typeConfig) return null;

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

      {/* Animated golden glow */}
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

      {/* Large decorative lion */}
      <motion.div
        className="fixed top-20 right-0 pointer-events-none z-0 opacity-5"
        initial={{ x: 100, opacity: 0, rotate: -15 }}
        animate={{ x: 0, opacity: 0.08, rotate: 0 }}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <Lion size={400} glow={false} animate={false} className="opacity-40" />
      </motion.div>
      
      {/* Nav */}
      <header className="sticky top-0 z-50 flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 gap-3 sm:gap-0 border-b border-white/7 bg-[#050505]/90 backdrop-blur-md relative">
        <motion.button
          onClick={() => navigate(`/practice/mode/${type}`)}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Lion size={40} glow={true} animate={true} />
          <div className="font-serif text-lg sm:text-xl tracking-widest text-[#D4AF37]">
            Marquee <span className="text-white/30 text-[10px] sm:text-xs tracking-[0.3em] font-sans ml-2">PRACTICE</span>
          </div>
        </motion.button>
        <motion.span 
          className="text-[10px] tracking-widest uppercase text-white/30 border border-white/10 px-3 py-1 whitespace-nowrap"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {typeConfig.label} · {isSpecific ? "Targeted" : "General"}
        </motion.span>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 flex flex-col gap-14 relative z-10">
        {/* Hero */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
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
            <div className="text-6xl">{typeConfig.icon}</div>
          </motion.div>

          <motion.p 
            className="text-[10px] tracking-[0.35em] uppercase text-[#D4AF37] mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {isSpecific ? "Targeted" : "General"} Interview Setup
          </motion.p>
          <motion.h1 
            className="font-serif text-5xl font-light leading-tight text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            {isSpecific ? "Target Your" : "Prepare for"}<br /><em>{typeConfig.label}</em>
          </motion.h1>
          <motion.p 
            className="text-white/40 leading-relaxed max-w-md mx-auto text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            {isSpecific 
              ? "Provide your details and job specifics. The AI will tailor questions to match the exact role requirements."
              : "Upload your resume and provide basic details. The AI will personalize questions based on your background."
            }
          </motion.p>
        </motion.div>

        {/* Resume Upload */}
        <div>
          <StepLabel n="01" label="Upload Your Resume" required />
          <div className="mt-4">
            <ResumeUpload onResume={handleResume} />
            {!resumeFile && (
              <p className="text-red-400/60 text-xs mt-2 text-center font-medium">
                ⚠ Resume is required for personalized interview
              </p>
            )}
            {resumeFile && (
              <p className="text-[#D4AF37]/60 text-xs mt-2 text-center">
                ✓ Resume uploaded · Questions will be personalized
              </p>
            )}
          </div>
        </div>

        {/* Name */}
        <div>
          <StepLabel n="02" label="Your Name" required />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Arjun Sharma"
            className="w-full bg-[#0A0A0A] border border-white/10 text-white placeholder-white/20 px-4 py-3 text-sm outline-none focus:border-white/20 transition-colors mt-4"
          />
        </div>

        {/* Specific Mode Fields */}
        {isSpecific && (
          <>
            <div>
              <StepLabel n="03" label="Job Description" required />
              
              {/* Tab selector */}
              <div className="flex gap-2 mt-4 mb-4">
                <button
                  onClick={() => setJobDescriptionFile(null)}
                  className={`flex-1 text-xs tracking-wider uppercase px-4 py-2 border transition-all ${
                    !jobDescriptionFile
                      ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/8"
                      : "border-white/10 text-white/40 hover:border-white/20"
                  }`}
                >
                  📝 Paste Text
                </button>
                <button
                  onClick={() => document.getElementById('jd-file-input').click()}
                  className={`flex-1 text-xs tracking-wider uppercase px-4 py-2 border transition-all ${
                    jobDescriptionFile
                      ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/8"
                      : "border-white/10 text-white/40 hover:border-white/20"
                  }`}
                >
                  📄 Upload PDF
                </button>
              </div>

              {/* Hidden file input */}
              <input
                id="jd-file-input"
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setJobDescriptionFile(file);
                    // You can also extract PDF text here if needed
                  }
                }}
                className="hidden"
              />

              {/* Text area or file display */}
              {!jobDescriptionFile ? (
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the complete job description here..."
                  rows={8}
                  className="w-full bg-[#0A0A0A] border border-white/10 text-white placeholder-white/20 px-4 py-3 text-sm outline-none focus:border-white/20 transition-colors resize-none"
                />
              ) : (
                <div className="w-full bg-[#0A0A0A] border border-[#D4AF37]/30 px-4 py-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📄</span>
                    <div>
                      <p className="text-sm text-white">{jobDescriptionFile.name}</p>
                      <p className="text-xs text-white/40 mt-1">
                        {(jobDescriptionFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setJobDescriptionFile(null)}
                    className="text-red-400/60 hover:text-red-400 transition-colors text-xs uppercase tracking-wider"
                  >
                    Remove
                  </button>
                </div>
              )}
              
              <p className="text-white/30 text-xs mt-2">
                {!jobDescriptionFile 
                  ? "Include responsibilities, requirements, and qualifications"
                  : "PDF will be processed to extract job details"
                }
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <StepLabel n="04" label="Company Name" optional />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Google"
                  className="w-full bg-[#0A0A0A] border border-white/10 text-white placeholder-white/20 px-4 py-3 text-sm outline-none focus:border-white/20 transition-colors mt-4"
                />
              </div>

              <div>
                <StepLabel n="05" label="Role Title" optional />
                <input
                  type="text"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="e.g. Senior Engineer"
                  className="w-full bg-[#0A0A0A] border border-white/10 text-white placeholder-white/20 px-4 py-3 text-sm outline-none focus:border-white/20 transition-colors mt-4"
                />
              </div>
            </div>
          </>
        )}

        {/* Skills */}
        <div>
          <StepLabel n={isSpecific ? "06" : "03"} label="Highlight Skills" optional />
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
          <p className="text-white/30 text-xs mt-3">
            Select skills you want the interviewer to focus on
          </p>
        </div>

        {/* Start Button */}
        <div className="flex flex-col items-center gap-5">
          <button
            onClick={handleStart}
            disabled={!resumeFile || !name.trim() || (isSpecific && !jobDescription.trim() && !jobDescriptionFile)}
            className="relative group bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#D4AF37] text-black text-xs sm:text-sm font-bold tracking-[0.3em] uppercase px-10 sm:px-16 py-4 sm:py-5 hover:shadow-2xl hover:shadow-[#D4AF37]/50 active:scale-[0.97] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed w-full sm:w-auto whitespace-nowrap overflow-hidden"
          >
            {/* Animated shine effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            
            {/* Glow effect */}
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="absolute inset-0 bg-[#D4AF37] blur-xl" />
            </span>
            
            {/* Button text */}
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span>Begin Interview</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            
            {/* Corner accents */}
            <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-black/20" />
            <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-black/20" />
            <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-black/20" />
            <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-black/20" />
          </button>
          
          {(!resumeFile || !name.trim() || (isSpecific && !jobDescription.trim() && !jobDescriptionFile)) && (
            <p className="text-red-400/50 text-xs text-center">
              Please fill all required fields to continue
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

function StepLabel({ n, label, required, optional }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">{n} —</span>
      <span className="text-[11px] tracking-widest uppercase text-white/50">{label}</span>
      {required && <span className="text-[10px] text-red-400/50 normal-case tracking-normal">(required)</span>}
      {optional && <span className="text-[10px] text-white/20 normal-case tracking-normal">(optional)</span>}
    </div>
  );
}
