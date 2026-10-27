import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * Organization Dashboard - Overview and Statistics
 */
export default function Dashboard({ organizationId }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, [organizationId]);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/organization/dashboard/${organizationId}`
      );

      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white/40 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Exams",
      value: stats?.total_exams || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "from-blue-500/20 to-blue-600/20",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-400"
    },
    {
      title: "Question Banks",
      value: stats?.total_question_banks || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: "from-purple-500/20 to-purple-600/20",
      borderColor: "border-purple-500/30",
      textColor: "text-purple-400"
    },
    {
      title: "Total Students",
      value: stats?.total_students || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: "from-green-500/20 to-green-600/20",
      borderColor: "border-green-500/30",
      textColor: "text-green-400"
    },
    {
      title: "Active Exams",
      value: stats?.recent_exams?.filter(e => e.status === 'ongoing')?.length || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: "from-[#D4AF37]/20 to-yellow-600/20",
      borderColor: "border-[#D4AF37]/30",
      textColor: "text-[#D4AF37]"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-white/10 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome to Organization Portal</h1>
        <p className="text-white/60">Manage your exams, question banks, and student assessments all in one place.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${card.color} border ${card.borderColor} rounded-xl p-6 hover:scale-[1.02] transition-transform cursor-pointer`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-black/20 flex items-center justify-center ${card.textColor}`}>
                {card.icon}
              </div>
            </div>
            <h3 className="text-white/60 text-sm mb-1">{card.title}</h3>
            <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/organization/chatbot')}
            className="flex items-center gap-4 p-4 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-lg transition-colors group"
          >
            <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold">AI Exam Creator</h3>
              <p className="text-xs text-white/40">Chat with AI to create exams</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/organization/question-banks')}
            className="flex items-center gap-4 p-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg transition-colors group"
          >
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold">Add Questions</h3>
              <p className="text-xs text-white/40">Upload or create questions</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/organization/exams/create')}
            className="flex items-center gap-4 p-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg transition-colors group"
          >
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold">Create Exam</h3>
              <p className="text-xs text-white/40">Manual exam creation</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Exams */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Exams</h2>
          <button
            onClick={() => navigate('/organization/exams')}
            className="text-[#D4AF37] text-sm hover:underline"
          >
            View All →
          </button>
        </div>

        {stats?.recent_exams && stats.recent_exams.length > 0 ? (
          <div className="space-y-3">
            {stats.recent_exams.map((exam) => (
              <div
                key={exam.id}
                className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg cursor-pointer transition-colors"
                onClick={() => navigate(`/organization/exam/${exam.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    exam.status === 'ongoing' ? 'bg-green-500/20 text-green-400' :
                    exam.status === 'published' ? 'bg-blue-500/20 text-blue-400' :
                    exam.status === 'completed' ? 'bg-gray-500/20 text-gray-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{exam.title}</h3>
                    <p className="text-xs text-white/40">Code: {exam.exam_code}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-white/60">{exam.duration_minutes} mins</p>
                    <p className="text-xs text-white/40">{exam.total_marks} marks</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    exam.status === 'ongoing' ? 'bg-green-500/20 text-green-400' :
                    exam.status === 'published' ? 'bg-blue-500/20 text-blue-400' :
                    exam.status === 'completed' ? 'bg-gray-500/20 text-gray-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {exam.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-white/40 mb-4">No exams created yet</p>
            <button
              onClick={() => navigate('/organization/chatbot')}
              className="bg-[#D4AF37] text-black px-6 py-2 rounded-lg hover:bg-[#D4AF37]/90 transition-colors font-semibold"
            >
              Create Your First Exam
            </button>
          </div>
        )}
      </div>

      {/* Help & Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Getting Started
          </h3>
          <p className="text-white/60 text-sm mb-4">
            Learn how to create your first exam and manage questions effectively.
          </p>
          <button className="text-blue-400 text-sm hover:underline">
            View Tutorial →
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Best Practices
          </h3>
          <p className="text-white/60 text-sm mb-4">
            Tips for creating effective assessments and proctoring settings.
          </p>
          <button className="text-purple-400 text-sm hover:underline">
            Read Guide →
          </button>
        </div>
      </div>
    </div>
  );
}
