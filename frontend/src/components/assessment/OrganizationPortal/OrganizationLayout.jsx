import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

/**
 * OrganizationLayout - Main layout with sidebar navigation
 */
export default function OrganizationLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { path: "/organization/dashboard", icon: "📊", label: "Dashboard" },
    { path: "/organization/ai-chat", icon: "🤖", label: "AI Chatbot" },
    { path: "/organization/question-banks", icon: "💼", label: "Question Banks" },
    { path: "/organization/exams", icon: "📝", label: "Exams" },
    { path: "/organization/reports", icon: "📈", label: "Reports" },
    { path: "/organization/monitoring", icon: "👁️", label: "Live Monitoring" }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside
        className={`bg-[#0A0A0A] border-r border-white/10 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#B8941E] rounded-lg flex items-center justify-center text-xl">
                🎓
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="text-white font-bold">Marquee</h1>
                  <p className="text-white/40 text-xs">Organization Portal</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive(item.path)
                    ? "bg-[#D4AF37] text-black"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {sidebarOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/60 hover:bg-white/5 hover:text-white transition-all"
            >
              <span className="text-xl">
                {sidebarOpen ? "◀️" : "▶️"}
              </span>
              {sidebarOpen && <span className="font-medium">Collapse</span>}
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/60 hover:bg-white/5 hover:text-white transition-all"
            >
              <span className="text-xl">🏠</span>
              {sidebarOpen && <span className="font-medium">Home</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
