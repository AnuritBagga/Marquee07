import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Lion from "../components/brand/Lion";
import { GraduationCap, CheckCircle } from "lucide-react";

export default function UniversityRegister() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    // University Details
    universityName: "",
    universityType: "",
    location: "",
    website: "",
    accreditation: "",
    
    // Contact Person
    contactName: "",
    designation: "",
    department: "",
    email: "",
    phone: "",
    
    // Student Demographics
    totalStudents: "",
    placementBatchSize: "",
    departments: [],
    customDepartment: "",
    graduationYears: [],
    
    // Assessment Requirements
    assessmentPurpose: [],
    interviewTypes: [],
    customInterviewType: "",
    
    // Technical Details
    questionTypes: [],
    customQuestionType: "",
    difficultyLevel: "",
    duration: "",
    numberOfQuestions: "",
    
    // Platform Requirements
    codingLanguages: [],
    assessmentFrequency: "",
    expectedSessions: "",
    startDate: "",
    dashboardAccess: [],
    
    // Special Requirements
    specialRequirements: "",
    additionalNotes: "",
  });

  const assessmentPurposeOptions = [
    "Campus Placement Preparation",
    "Mock Interview Cycles",
    "Skill Assessment & Readiness",
    "Department-wise Evaluation",
    "Final Year Screening",
    "Internship Selection",
    "Other (Specify)"
  ];

  const departmentOptions = [
    "Computer Science / IT",
    "Electronics & Communication",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
    "MBA / Management",
    "Other Engineering",
    "Other (Specify)"
  ];

  const interviewTypeOptions = [
    "Technical / DSA",
    "Domain Specific",
    "Aptitude / Reasoning",
    "Behavioral / Soft Skills",
    "Group Discussion",
    "HR Round",
    "Other (Specify)"
  ];

  const questionTypeOptions = [
    "Multiple Choice (MCQ)",
    "Coding Problems",
    "System Design",
    "Case Studies",
    "Scenario-based",
    "Open-ended",
    "Other (Specify)"
  ];

  const codingLanguageOptions = [
    "Python",
    "Java",
    "JavaScript",
    "C++",
    "C#",
    "Go",
    "Ruby",
    "SQL"
  ];

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Company Registration:", formData);
    // Here you would typically send to backend
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#D4AF37]/10 blur-[150px]" />
        </div>

        <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/7 bg-[#050505]/90 backdrop-blur-md">
          <Link to="/" className="flex items-center gap-3">
            <Lion size={40} glow={true} animate={true} />
            <div className="font-serif text-xl tracking-widest text-[#D4AF37]">
              Marquee <span className="text-white/30 text-xs tracking-[0.3em] font-sans ml-2">FOR COMPANIES</span>
            </div>
          </Link>
        </header>

        <main className="relative z-10 max-w-3xl mx-auto px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-24 h-24 rounded-full bg-[#D4AF37]/10 border-2 border-[#D4AF37] flex items-center justify-center mx-auto mb-8">
              <CheckCircle size={48} className="text-[#D4AF37]" />
            </div>

            <h1 className="font-serif text-5xl font-light text-white mb-6">
              Thank You for Choosing Marquee
            </h1>
            
            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              We've received your registration for <strong className="text-[#D4AF37]">{formData.universityName}</strong>.
              Our team will review your requirements and reach out within 24-48 hours.
            </p>

            <div className="bg-white/5 border border-white/10 rounded p-8 mb-8 text-left max-w-xl mx-auto">
              <h3 className="font-serif text-xl text-[#D4AF37] mb-4">What's Next?</h3>
              <ul className="space-y-3 text-white/60 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">✓</span>
                  <span>Our team will analyze your interview requirements and candidate volume</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">✓</span>
                  <span>You'll receive a customized pricing proposal via email at <strong className="text-white">{formData.email}</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">✓</span>
                  <span>We'll schedule a demo call to walk you through the platform</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">✓</span>
                  <span>Payment details and onboarding timeline will be shared</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded p-6 mb-8 max-w-xl mx-auto">
              <p className="text-white/80 text-sm">
                For urgent queries or custom requirements, contact us directly at<br />
                <a href="mailto:marqueesupport@gmail.com" className="text-[#D4AF37] font-medium hover:underline">
                  marqueesupport@gmail.com
                </a>
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Link
                to="/"
                className="bg-[#D4AF37] text-black px-8 py-3 text-[11px] uppercase tracking-[0.3em] hover:bg-white transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#D4AF37]/10 blur-[150px]" />
      </div>

      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/7 bg-[#050505]/90 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-3">
          <Lion size={40} glow={true} animate={true} />
          <div className="font-serif text-xl tracking-widest text-[#D4AF37]">
            Marquee <span className="text-white/30 text-xs tracking-[0.3em] font-sans ml-2">FOR UNIVERSITIES</span>
          </div>
        </Link>
        <Link to="/campuses" className="text-[10px] tracking-widest uppercase text-white/40 hover:text-white/70 transition-colors">
          ← Back
        </Link>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full mb-4">
            <GraduationCap size={32} className="text-[#D4AF37]" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-white mb-4">
            University / Institution Registration
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Tell us about your placement needs. We'll create a campus-wide assessment solution with cohort dashboards and readiness tracking.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* University Details */}
          <section className="bg-white/[0.02] border border-white/10 p-8">
            <h2 className="font-serif text-2xl text-[#D4AF37] mb-6">University / Institution Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/70 text-sm mb-2">Institution Name *</label>
                <input
                  type="text"
                  required
                  value={formData.universityName}
                  onChange={(e) => setFormData({...formData, universityName: e.target.value})}
                  className="w-full bg-black/40 border border-white/20 text-white px-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
                  placeholder="Enter university/college name"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Institution Type *</label>
                <select
                  required
                  value={formData.universityType}
                  onChange={(e) => setFormData({...formData, universityType: e.target.value})}
                  className="w-full bg-black/40 border border-white/20 text-white px-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
                >
                  <option value="">Select type</option>
                  <option>University</option>
                  <option>Engineering College</option>
                  <option>Management Institute</option>
                  <option>Technical Institute</option>
                  <option>Autonomous College</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Location (City/State) *</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-black/40 border border-white/20 text-white px-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
                  placeholder="e.g., Mumbai, Maharashtra"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Accreditation</label>
                <input
                  type="text"
                  value={formData.accreditation}
                  onChange={(e) => setFormData({...formData, accreditation: e.target.value})}
                  className="w-full bg-black/40 border border-white/20 text-white px-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
                  placeholder="e.g., NAAC A+, AICTE, UGC"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-white/70 text-sm mb-2">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="w-full bg-black/40 border border-white/20 text-white px-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
                  placeholder="https://university.edu"
                />
              </div>
            </div>
          </section>

          {/* Contact Person */}
          <section className="bg-white/[0.02] border border-white/10 p-8">
            <h2 className="font-serif text-2xl text-[#D4AF37] mb-6">Placement Coordinator / Contact Person</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/70 text-sm mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.contactName}
                  onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                  className="w-full bg-black/40 border border-white/20 text-white px-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
                  placeholder="Dr. Rajesh Kumar"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Designation *</label>
                <input
                  type="text"
                  required
                  value={formData.designation}
                  onChange={(e) => setFormData({...formData, designation: e.target.value})}
                  className="w-full bg-black/40 border border-white/20 text-white px-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
                  placeholder="Placement Officer, HOD, Training & Placement Head"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="w-full bg-black/40 border border-white/20 text-white px-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
                  placeholder="Training & Placement Cell"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-black/40 border border-white/20 text-white px-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
                  placeholder="placement@university.edu"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-white/70 text-sm mb-2">Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-black/40 border border-white/20 text-white px-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </section>

          {/* Student Demographics & Departments */}
          <section className="bg-white/[0.02] border border-white/10 p-8">
            <h2 className="font-serif text-2xl text-[#D4AF37] mb-6">Student Demographics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-white/70 text-sm mb-2">Total Students *</label>
                <input
                  type="number"
                  required
                  min="50"
                  value={formData.totalStudents}
                  onChange={(e) => setFormData({...formData, totalStudents: e.target.value})}
                  className="w-full bg-black/40 border border-white/20 text-white px-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none"
                  placeholder="e.g., 5000"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Placement Batch Size *</label>
                <input
                  type="number"
                  required
                  min="10"
                  value={formData.placementBatchSize}
                  onChange={(e) => setFormData({...formData, placementBatchSize: e.target.value})}
                  className="w-full bg-black/40 border border-white/20 text-white px-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none"
                  placeholder="e.g., 800"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-white/70 text-sm mb-3">Departments / Streams * (Select all that apply)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {departmentOptions.map(dept => (
                  <label key={dept} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.departments.includes(dept)}
                      onChange={() => handleCheckboxChange('departments', dept)}
                      className="w-4 h-4 border-white/30 bg-black/40 text-[#D4AF37] focus:ring-[#D4AF37]"
                    />
                    <span className="text-white/70 group-hover:text-white transition-colors text-sm">{dept}</span>
                  </label>
                ))}
              </div>
              {formData.departments.includes("Other (Specify)") && (
                <input
                  type="text"
                  value={formData.customDepartment}
                  onChange={(e) => setFormData({...formData, customDepartment: e.target.value})}
                  className="w-full mt-3 bg-black/40 border border-white/20 text-white px-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none"
                  placeholder="Specify other department"
                />
              )}
            </div>
          </section>

          {/* Assessment Purpose & Requirements */}
          <section className="bg-white/[0.02] border border-white/10 p-8">
            <h2 className="font-serif text-2xl text-[#D4AF37] mb-6">Assessment Requirements</h2>
            
            <div className="mb-6">
              <label className="block text-white/70 text-sm mb-3">Assessment Purpose * (Select all that apply)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {assessmentPurposeOptions.map(purpose => (
                  <label key={purpose} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.assessmentPurpose.includes(purpose)}
                      onChange={() => handleCheckboxChange('assessmentPurpose', purpose)}
                      className="w-4 h-4 border-white/30 bg-black/40 text-[#D4AF37] focus:ring-[#D4AF37]"
                    />
                    <span className="text-white/70 group-hover:text-white transition-colors text-sm">{purpose}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-white/70 text-sm mb-3">Interview Types * (Select all that apply)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {interviewTypeOptions.map(type => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.interviewTypes.includes(type)}
                      onChange={() => handleCheckboxChange('interviewTypes', type)}
                      className="w-4 h-4 border-white/30 bg-black/40 text-[#D4AF37] focus:ring-[#D4AF37]"
                    />
                    <span className="text-white/70 group-hover:text-white transition-colors text-sm">{type}</span>
                  </label>
                ))}
              </div>
              {formData.interviewTypes.includes("Other (Specify)") && (
                <input
                  type="text"
                  value={formData.customInterviewType}
                  onChange={(e) => setFormData({...formData, customInterviewType: e.target.value})}
                  className="w-full mt-3 bg-black/40 border border-white/20 text-white px-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none"
                  placeholder="Specify custom interview type"
                />
              )}
            </div>
          </section>

          {/* Technical Details */}
          <section className="bg-white/[0.02] border border-white/10 p-8">
            <h2 className="font-serif text-2xl text-[#D4AF37] mb-6">Assessment Configuration</h2>
            
            <div className="mb-6">
              <label className="block text-white/70 text-sm mb-3">Question Types * (Select all that apply)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {questionTypeOptions.map(type => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.questionTypes.includes(type)}
                      onChange={() => handleCheckboxChange('questionTypes', type)}
                      className="w-4 h-4 border-white/30 bg-black/40 text-[#D4AF37] focus:ring-[#D4AF37]"
                    />
                    <span className="text-white/70 group-hover:text-white transition-colors text-sm">{type}</span>
                  </label>
                ))}
              </div>
              {formData.questionTypes.includes("Other (Specify)") && (
                <input
                  type="text"
                  value={formData.customQuestionType}
                  onChange={(e) => setFormData({...formData, customQuestionType: e.target.value})}
                  className="w-full mt-3 bg-black/40 border border-white/20 text-white px-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none"
                  placeholder="Specify custom question type"
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-white/70 text-sm mb-2">Difficulty Level *</label>
                <select
                  required
                  value={formData.difficultyLevel}
                  onChange={(e) => setFormData({...formData, difficultyLevel: e.target.value})}
                  className="w-full bg-black/40 border border-white/20 text-white px-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="">Select level</option>
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                  <option>Mixed (Easy + Medium)</option>
                  <option>Mixed (Medium + Hard)</option>
                  <option>All Levels</option>
                </select>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Duration (minutes) *</label>
                <input
                  type="number"
                  required
                  min="15"
                  max="180"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full bg-black/40 border border-white/20 text-white px-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none"
                  placeholder="e.g. 45"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Number of Questions *</label>
                <input
                  type="number"
                  required
                  min="5"
                  max="100"
                  value={formData.numberOfQuestions}
                  onChange={(e) => setFormData({...formData, numberOfQuestions: e.target.value})}
                  className="w-full bg-black/40 border border-white/20 text-white px-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none"
                  placeholder="e.g. 20"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-white/70 text-sm mb-3">Coding Languages (if applicable)</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {codingLanguageOptions.map(lang => (
                  <label key={lang} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.codingLanguages.includes(lang)}
                      onChange={() => handleCheckboxChange('codingLanguages', lang)}
                      className="w-4 h-4 border-white/30 bg-black/40 text-[#D4AF37] focus:ring-[#D4AF37]"
                    />
                    <span className="text-white/70 group-hover:text-white transition-colors text-sm">{lang}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* Platform & Timeline */}
          <section className="bg-white/[0.02] border border-white/10 p-8">
            <h2 className="font-serif text-2xl text-[#D4AF37] mb-6">Platform Requirements & Timeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-white/70 text-sm mb-2">Assessment Frequency *</label>
                <select
                  required
                  value={formData.assessmentFrequency}
                  onChange={(e) => setFormData({...formData, assessmentFrequency: e.target.value})}
                  className="w-full bg-black/40 border border-white/20 text-white px-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="">Select frequency</option>
                  <option>One-time Setup</option>
                  <option>Per Semester</option>
                  <option>Monthly Cycles</option>
                  <option>Ongoing Access</option>
                </select>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Expected Sessions/Year *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.expectedSessions}
                  onChange={(e) => setFormData({...formData, expectedSessions: e.target.value})}
                  className="w-full bg-black/40 border border-white/20 text-white px-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none"
                  placeholder="e.g., 2000"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Expected Start Date *</label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="w-full bg-black/40 border border-white/20 text-white px-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-white/70 text-sm mb-3">Dashboard & Admin Access Required</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {["Cohort Dashboard", "Individual Reports", "Department-wise Analytics", "Performance Tracking", "Bulk Upload", "Custom Reports"].map(access => (
                  <label key={access} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.dashboardAccess.includes(access)}
                      onChange={() => handleCheckboxChange('dashboardAccess', access)}
                      className="w-4 h-4 border-white/30 bg-black/40 text-[#D4AF37] focus:ring-[#D4AF37]"
                    />
                    <span className="text-white/70 group-hover:text-white transition-colors text-sm">{access}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* Additional Requirements */}
          <section className="bg-white/[0.02] border border-white/10 p-8">
            <h2 className="font-serif text-2xl text-[#D4AF37] mb-6">Additional Information</h2>
            
            <div className="mb-6">
              <label className="block text-white/70 text-sm mb-2">Special Requirements</label>
              <textarea
                value={formData.specialRequirements}
                onChange={(e) => setFormData({...formData, specialRequirements: e.target.value})}
                rows="4"
                className="w-full bg-black/40 border border-white/20 text-white px-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none resize-none"
                placeholder="e.g., Custom branding, specific evaluation criteria, integration requirements, proctoring needs, etc."
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">Additional Notes</label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => setFormData({...formData, additionalNotes: e.target.value})}
                rows="3"
                className="w-full bg-black/40 border border-white/20 text-white px-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none resize-none"
                placeholder="Any other information you'd like us to know..."
              />
            </div>

            <div className="mt-6 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded p-4">
              <p className="text-white/80 text-sm">
                <strong className="text-[#D4AF37]">Need custom features?</strong> For specialized requirements like white-labeling, 
                custom integrations, or unique assessment formats, reach out to us at{" "}
                <a href="mailto:marqueesupport@gmail.com" className="text-[#D4AF37] hover:underline">
                  marqueesupport@gmail.com
                </a>
              </p>
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              className="bg-[#D4AF37] text-black px-12 py-4 text-[11px] uppercase tracking-[0.3em] font-semibold hover:bg-white transition-colors duration-300"
            >
              Submit Registration →
            </button>
          </div>

          <p className="text-center text-white/40 text-xs mt-4">
            By submitting, you agree to receive pricing and service information from Marquee
          </p>
        </form>
      </main>
    </div>
  );
}
