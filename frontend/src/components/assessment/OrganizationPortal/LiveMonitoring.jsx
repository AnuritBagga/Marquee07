import { useState, useEffect } from "react";
import axios from "axios";

/**
 * LiveMonitoring - Real-time proctoring and exam monitoring
 */
export default function LiveMonitoring({ organizationId }) {
  const [liveExams, setLiveExams] = useState([]);
  const [activeStudents, setActiveStudents] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiveExams();
    // Poll every 5 seconds for live updates
    const interval = setInterval(fetchLiveExams, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedExam) {
      fetchActiveStudents(selectedExam);
      const interval = setInterval(() => fetchActiveStudents(selectedExam), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedExam]);

  const fetchLiveExams = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/organization/monitoring/live-exams/${organizationId}`
      );
      if (response.data.success) {
        setLiveExams(response.data.exams);
        if (!selectedExam && response.data.exams.length > 0) {
          setSelectedExam(response.data.exams[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching live exams:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveStudents = async (examId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/organization/monitoring/active-students/${examId}`
      );
      if (response.data.success) {
        setActiveStudents(response.data.students);
      }
    } catch (error) {
      console.error("Error fetching active students:", error);
    }
  };

  const getViolationLevel = (violations) => {
    if (violations === 0) return { color: "text-green-400", bg: "bg-green-500/20", label: "Clean" };
    if (violations <= 2) return { color: "text-yellow-400", bg: "bg-yellow-500/20", label: "Minor" };
    return { color: "text-red-400", bg: "bg-red-500/20", label: "Critical" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (liveExams.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Live Monitoring</h1>
          <p className="text-white/60 mt-1">Real-time exam proctoring</p>
        </div>
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">📡</div>
          <h3 className="text-xl font-bold text-white mb-2">No Live Exams</h3>
          <p className="text-white/60">Active exams will appear here for monitoring</p>
        </div>
      </div>
    );
  }

  const selectedExamData = liveExams.find(e => e.id === selectedExam);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            Live Monitoring
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          </h1>
          <p className="text-white/60 mt-1">Real-time exam proctoring</p>
        </div>
        <div className="text-right">
          <p className="text-white/40 text-sm">Active Students</p>
          <p className="text-3xl font-bold text-[#D4AF37]">{activeStudents.length}</p>
        </div>
      </div>

      {/* Exam Selector */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4">
        <div className="flex items-center gap-4">
          <label className="text-white/60 text-sm font-medium">Select Exam:</label>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]/50"
          >
            {liveExams.map(exam => (
              <option key={exam.id} value={exam.id}>
                {exam.title} ({exam.active_students} active)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Exam Info */}
      {selectedExamData && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4">
            <p className="text-white/40 text-xs mb-1">Active Now</p>
            <p className="text-2xl font-bold text-green-400">{selectedExamData.active_students}</p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4">
            <p className="text-white/40 text-xs mb-1">Total Attempts</p>
            <p className="text-2xl font-bold text-white">{selectedExamData.total_attempts}</p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4">
            <p className="text-white/40 text-xs mb-1">Submitted</p>
            <p className="text-2xl font-bold text-blue-400">{selectedExamData.submitted}</p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4">
            <p className="text-white/40 text-xs mb-1">Violations</p>
            <p className="text-2xl font-bold text-red-400">{selectedExamData.total_violations}</p>
          </div>
        </div>
      )}

      {/* Active Students Grid */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">Active Students</h3>
        {activeStudents.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {activeStudents.map((student) => {
              const violationLevel = getViolationLevel(student.violations);
              const progress = ((student.answered_questions || 0) / (student.total_questions || 1)) * 100;
              const timeRemaining = Math.max(0, student.time_remaining || 0);
              const minutes = Math.floor(timeRemaining / 60);
              const seconds = timeRemaining % 60;

              return (
                <div
                  key={student.id}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-[#D4AF37]/50 transition-colors"
                >
                  {/* Student Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center font-bold text-black">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{student.name}</p>
                        <p className="text-white/40 text-xs">{student.email}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded ${violationLevel.bg} ${violationLevel.color} text-xs font-semibold`}>
                      {violationLevel.label}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-white/60">Progress</span>
                      <span className="text-white font-semibold">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#D4AF37] transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-white/5 rounded p-2 text-center">
                      <p className="text-white/40 text-xs">Answered</p>
                      <p className="text-white font-semibold text-sm">
                        {student.answered_questions}/{student.total_questions}
                      </p>
                    </div>
                    <div className="bg-white/5 rounded p-2 text-center">
                      <p className="text-white/40 text-xs">Time Left</p>
                      <p className={`font-semibold text-sm ${
                        minutes < 5 ? "text-red-400" : "text-white"
                      }`}>
                        {minutes}:{seconds.toString().padStart(2, '0')}
                      </p>
                    </div>
                    <div className="bg-white/5 rounded p-2 text-center">
                      <p className="text-white/40 text-xs">Violations</p>
                      <p className={`font-semibold text-sm ${violationLevel.color}`}>
                        {student.violations}
                      </p>
                    </div>
                  </div>

                  {/* Violation Details */}
                  {student.violations > 0 && student.recent_violations && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded p-2">
                      <p className="text-red-400 text-xs font-semibold mb-1">Recent Violations:</p>
                      <ul className="text-red-300 text-xs space-y-1">
                        {student.recent_violations.map((v, idx) => (
                          <li key={idx}>• {v}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Camera Feed Placeholder */}
                  <div className="mt-3 bg-black/50 rounded aspect-video flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-white/40 text-xs">📹 Camera Feed</p>
                      <p className="text-white/20 text-xs mt-1">(Integration pending)</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">⏳</div>
            <p className="text-white/60">No students currently taking this exam</p>
          </div>
        )}
      </div>

      {/* Alert Panel */}
      <div className="bg-[#0A0A0A] border border-red-500/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
            ⚠️
          </div>
          <h3 className="text-white font-semibold">Critical Alerts</h3>
        </div>
        <div className="space-y-2 text-sm">
          {activeStudents
            .filter(s => s.violations >= 3)
            .map((student, idx) => (
              <div key={idx} className="bg-red-500/10 rounded p-3 text-red-300">
                <strong>{student.name}</strong> has {student.violations} violations
              </div>
            ))}
          {activeStudents.filter(s => s.violations >= 3).length === 0 && (
            <p className="text-white/40 text-center py-4">No critical alerts</p>
          )}
        </div>
      </div>
    </div>
  );
}
