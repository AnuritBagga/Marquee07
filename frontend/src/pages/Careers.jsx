import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Lion from "../components/brand/Lion";
import { Briefcase, MapPin, Clock, ChevronRight, Mail } from "lucide-react";

const JOB_OPENINGS = [
  {
    id: "ai-ml-engineer",
    title: "AI/ML Engineer",
    department: "Engineering",
    location: "Remote / Hybrid",
    type: "Full-time",
    experience: "2-4 years",
    description: "Build and deploy AI models for interview assessment, natural language processing, and candidate evaluation systems.",
    requirements: [
      "Strong experience with Python, TensorFlow/PyTorch",
      "NLP and speech recognition expertise",
      "Experience with LLMs and prompt engineering",
      "Understanding of ML model deployment and MLOps"
    ]
  },
  {
    id: "cloud-devops-engineer",
    title: "Cloud/DevOps Engineer",
    department: "Infrastructure",
    location: "Remote / Hybrid",
    type: "Full-time",
    experience: "3-5 years",
    description: "Design and maintain scalable cloud infrastructure for real-time interview platform serving thousands of concurrent users.",
    requirements: [
      "Strong AWS/Azure/GCP experience",
      "Kubernetes and Docker proficiency",
      "CI/CD pipeline expertise",
      "Experience with monitoring and observability tools"
    ]
  }
];

export default function Careers() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    linkedIn: "",
    portfolio: "",
    experience: "",
    currentCompany: "",
    location: "",
    coverLetter: "",
    position: "",
  });

  const handleApply = (job) => {
    setSelectedJob(job);
    setFormData({...formData, position: job.title});
    setShowApplicationForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Application submitted:", formData);
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
              Marquee <span className="text-white/30 text-xs tracking-[0.3em] font-sans ml-2">CAREERS</span>
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
              <Mail size={48} className="text-[#D4AF37]" />
            </div>

            <h1 className="font-serif text-5xl font-light text-white mb-6">
              Application Received
            </h1>
            
            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              Thank you for applying for <strong className="text-[#D4AF37]">{selectedJob?.title}</strong> at Marquee.
              Our hiring team will review your application and get back to you soon.
            </p>

            <div className="bg-white/5 border border-white/10 rounded p-8 mb-8 text-left max-w-xl mx-auto">
              <h3 className="font-serif text-xl text-[#D4AF37] mb-4">What's Next?</h3>
              <ul className="space-y-3 text-white/60 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">✓</span>
                  <span>Your resume has been sent to <strong className="text-white">marqueesupport@gmail.com</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">✓</span>
                  <span>Our team will review your profile within 1-2 weeks</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#D4AF37] mt-1">✓</span>
                  <span>If shortlisted, you'll receive an email for the next round</span>
                </li>
              </ul>
            </div>

            <Link
              to="/careers"
              onClick={() => {
                setSubmitted(false);
                setShowApplicationForm(false);
                setSelectedJob(null);
              }}
              className="bg-[#D4AF37] text-black px-8 py-3 text-[11px] uppercase tracking-[0.3em] hover:bg-white transition-colors inline-block"
            >
              Back to Openings
            </Link>
          </motion.div>
        </main>
      </div>
    );
  }

  if (showApplicationForm && selectedJob) {
    return (
      <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#D4AF37]/10 blur-[150px]" />
        </div>

        <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/7 bg-[#050505]/90 backdrop-blur-md">
          <Link to="/" className="flex items-center gap-3">
            <Lion size={40} glow={true} animate={true} />
            <div className="font-serif text-xl tracking-widest text-[#D4AF37]">
              Marquee <span className="text-white/30 text-xs tracking-[0.3em] font-sans ml-2">CAREERS</span>
            </div>
          </Link>
          <button
            onClick={() => setShowApplicationForm(false)}
            className="text-[10px] tracking-widest uppercase text-white/40 hover:text-white/70 transition-colors"
          >
            ← Back to Openings
          </button>
        </header>

        <main className="relative z-10 max-w-3xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full mb-4">
              <Briefcase size={32} className="text-[#D4AF37]" />
            </div>
            <h1 className="font-serif text-4xl font-light text-white mb-2">
              Apply for {selectedJob.title}
            </h1>
            <p className="text-white/60 text-sm">
              {selectedJob.department} • {selectedJob.location} • {selectedJob.type}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <section className="bg-white/[0.02] border border-white/10 p-8">
              <h2 className="font-serif text-2xl text-[#D4AF37] mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full bg-black/40 border border-white/20 text-white px-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
                    placeholder="John Doe"
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
                    placeholder="john@example.com"
                  />
                </div>

                <div>
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

                <div>
                  <label className="block text-white/70 text-sm mb-2">Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full bg-black/40 border border-white/20 text-white px-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
                    placeholder="City, Country"
                  />
                </div>
              </div>
            </section>

            {/* Professional Details */}
            <section className="bg-white/[0.02] border border-white/10 p-8">
              <h2 className="font-serif text-2xl text-[#D4AF37] mb-6">Professional Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Total Experience *</label>
                  <input
                    type="text"
                    required
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="w-full bg-black/40 border border-white/20 text-white px-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
                    placeholder="e.g., 3 years"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Current Company</label>
                  <input
                    type="text"
                    value={formData.currentCompany}
                    onChange={(e) => setFormData({...formData, currentCompany: e.target.value})}
                    className="w-full bg-black/40 border border-white/20 text-white px-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
                    placeholder="Current employer"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">LinkedIn Profile</label>
                  <input
                    type="url"
                    value={formData.linkedIn}
                    onChange={(e) => setFormData({...formData, linkedIn: e.target.value})}
                    className="w-full bg-black/40 border border-white/20 text-white px-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Portfolio / GitHub</label>
                  <input
                    type="url"
                    value={formData.portfolio}
                    onChange={(e) => setFormData({...formData, portfolio: e.target.value})}
                    className="w-full bg-black/40 border border-white/20 text-white px-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
                    placeholder="https://github.com/yourprofile"
                  />
                </div>
              </div>
            </section>

            {/* Cover Letter */}
            <section className="bg-white/[0.02] border border-white/10 p-8">
              <h2 className="font-serif text-2xl text-[#D4AF37] mb-6">Cover Letter</h2>
              <div>
                <label className="block text-white/70 text-sm mb-2">Why do you want to join Marquee? *</label>
                <textarea
                  required
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
                  rows="6"
                  className="w-full bg-black/40 border border-white/20 text-white px-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none resize-none"
                  placeholder="Tell us about your interest in this role and what you can bring to Marquee..."
                />
              </div>

              <div className="mt-6 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded p-4">
                <p className="text-white/80 text-sm">
                  <strong className="text-[#D4AF37]">Resume Required:</strong> Please upload your resume by sending it to{" "}
                  <a href="mailto:marqueesupport@gmail.com" className="text-[#D4AF37] hover:underline">
                    marqueesupport@gmail.com
                  </a>
                  {" "}with the subject line: <strong>Application - {selectedJob.title}</strong>
                </p>
              </div>
            </section>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                className="bg-[#D4AF37] text-black px-12 py-4 text-[11px] uppercase tracking-[0.3em] font-semibold hover:bg-white transition-colors duration-300"
              >
                Submit Application →
              </button>
            </div>

            <p className="text-center text-white/40 text-xs mt-4">
              By submitting, you agree to our recruitment process and data handling policies
            </p>
          </form>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#D4AF37]/10 blur-[150px]" />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/7 bg-[#050505]/90 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-3">
          <Lion size={40} glow={true} animate={true} />
          <div className="font-serif text-xl tracking-widest text-[#D4AF37]">
            Marquee <span className="text-white/30 text-xs tracking-[0.3em] font-sans ml-2">CAREERS</span>
          </div>
        </Link>
        <Link to="/" className="text-[10px] tracking-widest uppercase text-white/40 hover:text-white/70 transition-colors">
          ← Back to Home
        </Link>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full mb-6">
            <Briefcase size={32} className="text-[#D4AF37]" />
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-light text-white mb-6">
            Join the Marquee Team
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            We're building the future of AI-powered interviews. Join us in transforming how companies hire and how candidates prepare.
          </p>
        </motion.div>

        {/* Current Openings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="font-serif text-3xl text-white mb-8">Current Openings</h2>
          <div className="grid grid-cols-1 gap-6">
            {JOB_OPENINGS.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-white/[0.02] border border-white/10 hover:border-[#D4AF37]/30 p-8 transition-all duration-300 group"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="font-serif text-2xl text-white mb-3 group-hover:text-[#D4AF37] transition-colors">
                      {job.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-4 text-white/50 text-sm mb-4">
                      <span className="flex items-center gap-2">
                        <Briefcase size={16} />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin size={16} />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock size={16} />
                        {job.experience}
                      </span>
                    </div>

                    <p className="text-white/70 leading-relaxed mb-4">
                      {job.description}
                    </p>

                    <div className="mb-4">
                      <h4 className="text-white/80 text-sm font-semibold mb-2">Key Requirements:</h4>
                      <ul className="space-y-1">
                        {job.requirements.map((req, i) => (
                          <li key={i} className="text-white/60 text-sm flex items-start gap-2">
                            <span className="text-[#D4AF37] mt-1">•</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleApply(job)}
                      className="bg-[#D4AF37] text-black px-6 py-3 text-[11px] uppercase tracking-[0.3em] hover:bg-white transition-colors duration-300 flex items-center gap-2 group-hover:scale-105 transition-transform"
                    >
                      Apply Now
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* General Application */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded p-8 text-center"
        >
          <h3 className="font-serif text-2xl text-white mb-4">Don't see the right role?</h3>
          <p className="text-white/70 leading-relaxed mb-6 max-w-2xl mx-auto">
            We're always looking for talented individuals. Send your resume to{" "}
            <a href="mailto:marqueesupport@gmail.com" className="text-[#D4AF37] hover:underline font-medium">
              marqueesupport@gmail.com
            </a>
            {" "}and tell us what you'd love to build at Marquee.
          </p>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-16 text-center"
        >
          <h3 className="font-serif text-xl text-white mb-4">Questions?</h3>
          <p className="text-white/60 text-sm">
            For any queries about open positions or our hiring process, contact us at<br />
            <a href="mailto:marqueesupport@gmail.com" className="text-[#D4AF37] hover:underline">
              marqueesupport@gmail.com
            </a>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
