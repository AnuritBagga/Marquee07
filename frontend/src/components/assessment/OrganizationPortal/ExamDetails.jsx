import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * ExamDetails - View exam details and monitor attempts
 */
export default function ExamDetails({ organizationId }) {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // overview, attempts, settings

  useEffect(() => {
    fetchExamDetails();
    fetchAttempts();
  }, [examId]);

  const fetchExamDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/organization/exam/${examId}`
      );
      if (response.data.success) {
        setExam(response.data.exam);
      }
    } catch (error) {
      console.error("Error fetching exam:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttempts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/organization/exam/${examId}/attempts`
      );
      if (response.data.success) {
        setAttempts(response.data.attempts);
      }
    } catch (error) {
      console.error("Error fetching attempts:", error);
    }
  };

  const copyExamCode = () => {
    navigator.clipboard.writeText(exam.exam_code);
    alert("✓ Exam code copied to clipboard!");
  };

  const getStatusBadge = () => {
    const now = new Date();
    const start = new Date(exam.start_time);
    const end = new Date(exam.end_time);

    if (now < start) {
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">📅 Upcoming</span>;
    }
    if (now > end) {
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/60 border border-white/20">✓ Completed</span>;
    }
    return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">🔴 Live Now</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60">Exam not found</p>
      </div>
    );
  }

  const avgScore = attempts.length > 0
    ? (attempts.reduce((sum, a) => sum + (a.score || 0), 0) / attempts.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <button
            onClick={() => navigate("/organization/exams")}
            className="text-white/60 hover:text-white mb-4 flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Exams
          </button>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold text-white">{exam.title}</h1>
            {getStatusBadge()}
          </div>
          {exam.description && (
            <p className="text-white/60">{exam.description}</p>
          )}
        </div>
      </div>

      {/* Exam Code Card */}
      <div className="bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/30 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm mb-1">Share this code with students</p>
            <div className="flex items-center gap-3">
              <p className="text-[#D4AF37] font-mono font-bold text-3xl">{exam.exam_code}</p>
              <button
                onClick={copyExamCode}
                className="bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
              >
                📋 Copy Code
              </button>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/40 text-sm mb-1">Student Link</p>
            <button
              onClick={() => {
                const link = `${window.location.origin}/exam/${exam.exam_code}`;
                navigator.clipboard.writeText(link);
                alert("✓ Link copied!");
              }}
              className="text-blue-400 hover:text-blue-300 text-sm underline"
            >
              Copy Student Link
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6">
          <p className="text-white/40 text-sm mb-2">Total Attempts</p>
          <p className="text-3xl font-bold text-white">{attempts.length}</p>
        </div>
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6">
          <p className="text-white/40 text-sm mb-2">Average Score</p>
          <p className="text-3xl font-bold text-[#D4AF37]">{avgScore}%</p>
        </div>
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6">
          <p className="text-white/40 text-sm mb-2">Total Questions</p>
          <p className="text-3xl font-bold text-white">{exam.total_questions || 0}</p>
        </div>
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6">
          <p className="text-white/40 text-sm mb-2">Duration</p>
          <p className="text-3xl font-bold text-white">{exam.duration_minutes} <span className="text-lg text-white/60">min</span></p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
        <div className="flex border-b border-white/10">
          {["overview", "attempts", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-4 font-semibold capitalize transition-colors ${
                activeTab === tab
                  ? "bg-[#D4AF37] text-black"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-semibold mb-4">Exam Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-white/40 text-sm mb-1">Exam Type</p>
                    <p className="text-white font-semibold capitalize">{exam.exam_type}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-white/40 text-sm mb-1">Duration</p>
                    <p className="text-white font-semibold">{exam.duration_minutes} minutes</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-white/40 text-sm mb-1">Start Time</p>
                    <p className="text-white font-semibold">{new Date(exam.start_time).toLocaleString()}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-white/40 text-sm mb-1">End Time</p>
                    <p className="text-white font-semibold">{new Date(exam.end_time).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Features</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Proctoring", enabled: exam.proctoring_enabled, icon: "🎥" },
                    { label: "Face Detection", enabled: exam.face_detection, icon: "👤" },
                    { label: "Mobile Detection", enabled: exam.mobile_detection, icon: "📱" },
                    { label: "Shuffle Questions", enabled: exam.shuffle_questions, icon: "🔀" },
                    { label: "Shuffle Options", enabled: exam.shuffle_options, icon: "🔄" },
                    { label: "Negative Marking", enabled: exam.negative_marking, icon: "➖" },
                    { label: "Show Results", enabled: exam.show_results_immediately, icon: "📊" },
                    { label: "Offline Mode", enabled: exam.offline_mode_enabled, icon: "📡" }
                  ].map((feature, idx) => (
                    <div
                      key={idx}
                      className={`px-4 py-3 rounded-lg border ${
                        feature.enabled
                          ? "bg-green-500/10 border-green-500/30 text-green-400"
                          : "bg-white/5 border-white/10 text-white/40"
                      }`}
                    >
                      <span className="mr-2">{feature.icon}</span>
                      <span className="text-sm font-medium">{feature.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Attempts Tab */}
          {activeTab === "attempts" && (
            <div className="space-y-4">
              {attempts.length > 0 ? (
                <div className="space-y-3">
                  {attempts.map((attempt) => (
                    <div
                      key={attempt.id}
                      className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-semibold">{attempt.student_name}</p>
                          <p className="text-white/40 text-sm">{attempt.student_email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#D4AF37]">{attempt.score || 0}%</p>
                          <p className="text-white/40 text-sm">
                            {new Date(attempt.started_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-sm text-white/60">
                        <span>⏱️ {attempt.time_taken || 0} min</span>
                        <span>✓ {attempt.correct_answers || 0}/{exam.total_questions}</span>
                        {attempt.proctoring_violations > 0 && (
                          <span className="text-red-400">⚠️ {attempt.proctoring_violations} violations</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">📋</div>
                  <p className="text-white/60">No attempts yet</p>
                  <p className="text-white/40 text-sm mt-2">Students will appear here once they start the exam</p>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-400 text-sm">
                  ⚠️ Exam settings cannot be modified after students have started attempting
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Proctoring Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-white/80">Tab Switches Allowed</span>
                    <span className="text-white font-semibold">{exam.tab_switch_allowed}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-6 py-3 rounded-lg transition-colors font-semibold">
                  Delete Exam
                </button>
                <button className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors font-semibold">
                  Duplicate Exam
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
