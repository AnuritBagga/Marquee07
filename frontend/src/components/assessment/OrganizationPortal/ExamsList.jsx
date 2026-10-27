import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * ExamsList - View and manage all exams
 */
export default function ExamsList({ organizationId }) {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, active, upcoming, completed

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/organization/exams/${organizationId}`
      );
      if (response.data.success) {
        setExams(response.data.exams);
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setLoading(false);
    }
  };

  const getExamStatus = (exam) => {
    const now = new Date();
    const start = new Date(exam.start_time);
    const end = new Date(exam.end_time);

    if (now < start) return "upcoming";
    if (now > end) return "completed";
    return "active";
  };

  const filteredExams = exams.filter((exam) => {
    if (filter === "all") return true;
    return getExamStatus(exam) === filter;
  });

  const getStatusBadge = (status) => {
    const styles = {
      active: "bg-green-500/20 text-green-400 border-green-500/30",
      upcoming: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      completed: "bg-white/10 text-white/60 border-white/20"
    };

    const labels = {
      active: "🔴 Live",
      upcoming: "📅 Upcoming",
      completed: "✓ Completed"
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Exams</h1>
          <p className="text-white/60 mt-1">Manage and monitor all exams</p>
        </div>
        <button
          onClick={() => navigate("/organization/exam/create")}
          className="bg-[#D4AF37] text-black px-6 py-3 rounded-lg hover:bg-[#D4AF37]/90 transition-colors font-semibold flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Exam
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4">
        <div className="flex items-center gap-3">
          {["all", "active", "upcoming", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                filter === f
                  ? "bg-[#D4AF37] text-black"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Exams List */}
      {filteredExams.length > 0 ? (
        <div className="grid gap-4">
          {filteredExams.map((exam) => {
            const status = getExamStatus(exam);
            return (
              <div
                key={exam.id}
                onClick={() => navigate(`/organization/exam/${exam.id}`)}
                className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 hover:border-[#D4AF37]/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{exam.title}</h3>
                      {getStatusBadge(status)}
                    </div>
                    {exam.description && (
                      <p className="text-white/60 text-sm">{exam.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-white/40 text-xs mb-1">Exam Code</p>
                    <p className="text-[#D4AF37] font-mono font-bold text-lg">{exam.exam_code}</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/40 text-xs mb-1">Type</p>
                    <p className="text-white font-semibold capitalize">{exam.exam_type}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/40 text-xs mb-1">Duration</p>
                    <p className="text-white font-semibold">{exam.duration_minutes} min</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/40 text-xs mb-1">Questions</p>
                    <p className="text-white font-semibold">{exam.total_questions || 0}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/40 text-xs mb-1">Attempts</p>
                    <p className="text-white font-semibold">{exam.total_attempts || 0}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-white/60">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{new Date(exam.start_time).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/60">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{new Date(exam.start_time).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {exam.proctoring_enabled && (
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                        🎥 Proctored
                      </span>
                    )}
                    {exam.offline_mode_enabled && (
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                        📡 Offline
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-bold text-white mb-2">No exams found</h3>
          <p className="text-white/60 mb-6">
            {filter === "all"
              ? "Create your first exam to get started"
              : `No ${filter} exams at the moment`}
          </p>
          {filter === "all" && (
            <button
              onClick={() => navigate("/organization/exam/create")}
              className="bg-[#D4AF37] text-black px-6 py-3 rounded-lg hover:bg-[#D4AF37]/90 transition-colors font-semibold"
            >
              Create Your First Exam
            </button>
          )}
        </div>
      )}
    </div>
  );
}
