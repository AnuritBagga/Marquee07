import { useState, useEffect } from "react";
import axios from "axios";

/**
 * StudentReports - Performance analytics and insights
 */
export default function StudentReports({ organizationId }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState("all");
  const [exams, setExams] = useState([]);

  useEffect(() => {
    fetchExams();
    fetchReports();
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
    }
  };

  const fetchReports = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/organization/reports/${organizationId}`
      );
      if (response.data.success) {
        setReports(response.data.reports);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = selectedExam === "all"
    ? reports
    : reports.filter(r => r.exam_id === selectedExam);

  const stats = {
    totalAttempts: filteredReports.length,
    avgScore: filteredReports.length > 0
      ? (filteredReports.reduce((sum, r) => sum + (r.score || 0), 0) / filteredReports.length).toFixed(1)
      : 0,
    passRate: filteredReports.length > 0
      ? ((filteredReports.filter(r => (r.score || 0) >= 60).length / filteredReports.length) * 100).toFixed(1)
      : 0,
    violations: filteredReports.reduce((sum, r) => sum + (r.proctoring_violations || 0), 0)
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
      <div>
        <h1 className="text-3xl font-bold text-white">Student Reports</h1>
        <p className="text-white/60 mt-1">Performance analytics and insights</p>
      </div>

      {/* Filters */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4">
        <div className="flex items-center gap-4">
          <label className="text-white/60 text-sm font-medium">Filter by Exam:</label>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]/50"
          >
            <option value="all">All Exams</option>
            {exams.map(exam => (
              <option key={exam.id} value={exam.id}>{exam.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-xl">
              📊
            </div>
            <div>
              <p className="text-white/40 text-xs">Total Attempts</p>
              <p className="text-2xl font-bold text-white">{stats.totalAttempts}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-lg flex items-center justify-center text-xl">
              🎯
            </div>
            <div>
              <p className="text-white/40 text-xs">Average Score</p>
              <p className="text-2xl font-bold text-[#D4AF37]">{stats.avgScore}%</p>
            </div>
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center text-xl">
              ✓
            </div>
            <div>
              <p className="text-white/40 text-xs">Pass Rate</p>
              <p className="text-2xl font-bold text-green-400">{stats.passRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center text-xl">
              ⚠️
            </div>
            <div>
              <p className="text-white/40 text-xs">Total Violations</p>
              <p className="text-2xl font-bold text-red-400">{stats.violations}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Score Distribution */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">Score Distribution</h3>
        <div className="space-y-3">
          {[
            { range: "90-100%", min: 90, color: "bg-green-500" },
            { range: "75-89%", min: 75, color: "bg-blue-500" },
            { range: "60-74%", min: 60, color: "bg-yellow-500" },
            { range: "40-59%", min: 40, color: "bg-orange-500" },
            { range: "0-39%", min: 0, color: "bg-red-500" }
          ].map((bucket) => {
            const count = filteredReports.filter(r => {
              const score = r.score || 0;
              const nextMin = bucket.min + (bucket.min === 0 ? 40 : bucket.min === 40 ? 20 : 15);
              return score >= bucket.min && score < (bucket.range === "90-100%" ? 101 : nextMin);
            }).length;
            const percentage = filteredReports.length > 0 ? (count / filteredReports.length) * 100 : 0;

            return (
              <div key={bucket.range}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80 text-sm">{bucket.range}</span>
                  <span className="text-white/60 text-sm">{count} students</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${bucket.color} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Attempts */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">Recent Attempts</h3>
        {filteredReports.length > 0 ? (
          <div className="space-y-3">
            {filteredReports.slice(0, 10).map((report, idx) => (
              <div
                key={idx}
                className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-white font-semibold">{report.student_name}</p>
                    <p className="text-white/40 text-sm">{report.exam_title}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${
                      (report.score || 0) >= 75 ? "text-green-400" :
                      (report.score || 0) >= 60 ? "text-yellow-400" :
                      "text-red-400"
                    }`}>
                      {report.score || 0}%
                    </p>
                    <p className="text-white/40 text-xs">
                      {new Date(report.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm text-white/60">
                  <span>⏱️ {report.time_taken || 0} min</span>
                  <span>✓ {report.correct_answers}/{report.total_questions}</span>
                  {report.proctoring_violations > 0 && (
                    <span className="text-red-400">⚠️ {report.proctoring_violations} violations</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📊</div>
            <p className="text-white/60">No reports available</p>
            <p className="text-white/40 text-sm mt-2">Reports will appear once students complete exams</p>
          </div>
        )}
      </div>

      {/* Export Options */}
      <div className="flex gap-3">
        <button className="flex-1 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black px-6 py-3 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export as CSV
        </button>
        <button className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Export as PDF
        </button>
      </div>
    </div>
  );
}
