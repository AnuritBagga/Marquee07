import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * ExamLogin - Student enters exam code and details
 */
export default function ExamLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    examCode: "",
    studentName: "",
    studentEmail: "",
    studentId: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/student/exam/validate`,
        formData
      );

      if (response.data.success) {
        // Store exam session data
        localStorage.setItem("examSession", JSON.stringify({
          examId: response.data.exam.id,
          examCode: formData.examCode,
          studentName: formData.studentName,
          studentEmail: formData.studentEmail,
          studentId: formData.studentId,
          examData: response.data.exam
        }));

        // Navigate to system check
        navigate("/exam/system-check");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid exam code or details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#B8941E] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📝</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join Exam</h1>
          <p className="text-white/60">Enter your exam code and details to begin</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-[#0A0A0A] border border-white/10 rounded-xl p-8 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Exam Code <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.examCode}
              onChange={(e) => setFormData({ ...formData, examCode: e.target.value.toUpperCase() })}
              placeholder="Enter 6-digit code"
              maxLength={6}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-center text-2xl font-mono tracking-widest placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 uppercase"
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              placeholder="John Doe"
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50"
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Email Address <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={formData.studentEmail}
              onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value })}
              placeholder="john@example.com"
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50"
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Student ID (Optional)
            </label>
            <input
              type="text"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              placeholder="STU12345"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !formData.examCode || !formData.studentName || !formData.studentEmail}
            className="w-full bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black px-6 py-4 rounded-lg transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                Validating...
              </>
            ) : (
              <>
                Continue
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-white/40 text-sm">
            Make sure you have a stable internet connection and a working camera
          </p>
        </div>
      </div>
    </div>
  );
}
