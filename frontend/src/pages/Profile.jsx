import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  User, Calendar, TrendingUp, Award, Clock, Target,
  Settings, History, BarChart3, Upload, Globe, Lock,
  Github, Linkedin, Globe as WebIcon, Mail, Edit2,
  Check, X, Flame, Trophy, Star, Zap
} from "lucide-react";
import Lion from "@/components/brand/Lion";

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Lion size={48} animate glow />
          <p className="text-white/60 text-sm tracking-wider">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "history", label: "History", icon: History },
    { id: "statistics", label: "Statistics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Mock data - will be replaced with real data from Supabase
  const profileData = {
    username: user.email?.split("@")[0] || "user",
    fullName: user.user_metadata?.full_name || "Anonymous User",
    email: user.email,
    bio: "Building my interview skills with Marquee AI",
    avatarUrl: null,
    isPublic: false,
    totalInterviews: 12,
    averageScore: 78.5,
    currentStreak: 5,
    longestStreak: 12,
    totalPracticeTime: 7200, // seconds
    githubUrl: "",
    linkedinUrl: "",
    websiteUrl: "",
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with gradient */}
      <div className="relative bg-gradient-to-b from-[#1a1a1a] to-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] p-1">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[#D4AF37] font-bold text-4xl sm:text-5xl">
                  {profileData.fullName.charAt(0).toUpperCase()}
                </div>
              </div>
              {/* Edit overlay */}
              {activeTab === "settings" && (
                <div className="absolute inset-0 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Upload size={24} className="text-white" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-4xl font-bold">{profileData.fullName}</h1>
                {profileData.isPublic ? (
                  <span className="flex items-center gap-1 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                    <Globe size={12} />
                    Public
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs bg-white/10 text-white/60 px-2 py-1 rounded-full">
                    <Lock size={12} />
                    Private
                  </span>
                )}
              </div>
              <p className="text-white/60 text-sm sm:text-base mb-1">@{profileData.username}</p>
              {profileData.bio && (
                <p className="text-white/80 text-sm sm:text-base max-w-2xl">{profileData.bio}</p>
              )}
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 sm:gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <Target className="text-[#D4AF37]" size={18} />
                  <span className="text-white/60 text-sm">
                    <span className="text-white font-semibold">{profileData.totalInterviews}</span> interviews
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="text-orange-500" size={18} />
                  <span className="text-white/60 text-sm">
                    <span className="text-white font-semibold">{profileData.currentStreak}</span> day streak
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-500" size={18} />
                  <span className="text-white/60 text-sm">
                    <span className="text-white font-semibold">{profileData.averageScore}%</span> avg score
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-white/10 sticky top-0 bg-black/80 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                      : "text-white/60 hover:text-white border-b-2 border-transparent"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && <OverviewTab profileData={profileData} />}
        {activeTab === "history" && <HistoryTab />}
        {activeTab === "statistics" && <StatisticsTab />}
        {activeTab === "settings" && <SettingsTab profileData={profileData} />}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// OVERVIEW TAB
// ═══════════════════════════════════════════════════════════════════════════════

const OverviewTab = ({ profileData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Stats Cards */}
      <div className="lg:col-span-2 space-y-6">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            icon={Target}
            label="Total Interviews"
            value={profileData.totalInterviews}
            color="blue"
          />
          <StatCard
            icon={TrendingUp}
            label="Avg Score"
            value={`${profileData.averageScore}%`}
            color="green"
          />
          <StatCard
            icon={Flame}
            label="Current Streak"
            value={`${profileData.currentStreak} days`}
            color="orange"
          />
          <StatCard
            icon={Trophy}
            label="Best Streak"
            value={`${profileData.longestStreak} days`}
            color="yellow"
          />
        </div>

        {/* Activity Heatmap */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar size={20} className="text-[#D4AF37]" />
              Activity Overview
            </h3>
            <span className="text-sm text-white/60">Last 12 months</span>
          </div>
          <ActivityHeatmap />
        </div>

        {/* Recent Achievements */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Award size={20} className="text-[#D4AF37]" />
            Recent Achievements
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AchievementBadge
              icon="🔥"
              title="Week Warrior"
              description="7 day streak achieved"
              unlocked={true}
            />
            <AchievementBadge
              icon="🎯"
              title="Perfect Score"
              description="Scored 100% in interview"
              unlocked={false}
            />
            <AchievementBadge
              icon="💻"
              title="Code Master"
              description="Solved 50 DSA problems"
              unlocked={true}
            />
            <AchievementBadge
              icon="⚡"
              title="Speed Runner"
              description="Completed in under 30 min"
              unlocked={false}
            />
          </div>
        </div>
      </div>

      {/* Right Column - Practice Time & Leaderboard */}
      <div className="space-y-6">
        {/* Practice Time */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Clock size={20} className="text-[#D4AF37]" />
            Practice Time
          </h3>
          <div className="text-center py-6">
            <div className="text-4xl font-bold text-[#D4AF37] mb-2">
              {Math.floor(profileData.totalPracticeTime / 3600)}h {Math.floor((profileData.totalPracticeTime % 3600) / 60)}m
            </div>
            <p className="text-white/60 text-sm">Total time invested</p>
          </div>
          <div className="space-y-2 mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">This week</span>
              <span className="text-white">2h 30m</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">This month</span>
              <span className="text-white">8h 45m</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">All time</span>
              <span className="text-white">{Math.floor(profileData.totalPracticeTime / 3600)}h</span>
            </div>
          </div>
        </div>

        {/* Skills Breakdown */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Zap size={20} className="text-[#D4AF37]" />
            Skills Breakdown
          </h3>
          <div className="space-y-4">
            <SkillBar label="Behavioral" value={85} color="blue" />
            <SkillBar label="Technical" value={72} color="green" />
            <SkillBar label="DSA" value={68} color="purple" />
            <SkillBar label="SQL" value={80} color="yellow" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// HISTORY TAB
// ═══════════════════════════════════════════════════════════════════════════════

const HistoryTab = () => {
  // Mock interview history data
  const interviews = [
    {
      id: 1,
      date: "2024-01-15",
      type: "Technical",
      score: 85,
      duration: "45 min",
      interviewer: "Dr. Sarah Reed",
    },
    {
      id: 2,
      date: "2024-01-14",
      type: "Behavioral",
      score: 92,
      duration: "38 min",
      interviewer: "Dr. Sarah Reed",
    },
    {
      id: 3,
      date: "2024-01-12",
      type: "Mixed",
      score: 78,
      duration: "52 min",
      interviewer: "Dr. Sarah Reed",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Interview History</h2>
        <select className="bg-[#0a0a0a] border border-white/20 text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:border-[#D4AF37]">
          <option>All Types</option>
          <option>Behavioral</option>
          <option>Technical</option>
          <option>Mixed</option>
        </select>
      </div>

      {interviews.map((interview) => (
        <div
          key={interview.id}
          className="bg-[#0a0a0a] border border-white/10 rounded-lg p-6 hover:border-[#D4AF37]/50 transition-colors cursor-pointer"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg font-semibold">{interview.type} Interview</span>
                <span className={`text-sm px-2 py-1 rounded ${
                  interview.score >= 80 ? "bg-green-500/20 text-green-400" :
                  interview.score >= 60 ? "bg-yellow-500/20 text-yellow-400" :
                  "bg-red-500/20 text-red-400"
                }`}>
                  {interview.score}%
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-white/60">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(interview.date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {interview.duration}
                </span>
                <span className="flex items-center gap-1">
                  <User size={14} />
                  {interview.interviewer}
                </span>
              </div>
            </div>
            <button className="text-[#D4AF37] hover:text-[#F4D03F] text-sm font-medium">
              View Details →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STATISTICS TAB
// ═══════════════════════════════════════════════════════════════════════════════

const StatisticsTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Statistics & Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Trend */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Score Trend</h3>
          <div className="h-64 flex items-center justify-center text-white/40">
            <div className="text-center">
              <TrendingUp size={48} className="mx-auto mb-2 opacity-50" />
              <p>Chart visualization coming soon</p>
            </div>
          </div>
        </div>

        {/* Performance by Category */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Performance by Category</h3>
          <div className="h-64 flex items-center justify-center text-white/40">
            <div className="text-center">
              <BarChart3 size={48} className="mx-auto mb-2 opacity-50" />
              <p>Chart visualization coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS TAB
// ═══════════════════════════════════════════════════════════════════════════════

const SettingsTab = ({ profileData }) => {
  const [formData, setFormData] = useState(profileData);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Save to Supabase
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h2 className="text-2xl font-bold">Profile Settings</h2>

      {/* Basic Info */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        
        <div>
          <label className="block text-sm text-white/60 mb-2">Full Name</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-2">Username</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-2">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            rows={3}
            className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37] resize-none"
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold mb-4">Social Links</h3>
        
        <div>
          <label className="block text-sm text-white/60 mb-2 flex items-center gap-2">
            <Github size={16} />
            GitHub Profile
          </label>
          <input
            type="url"
            value={formData.githubUrl}
            onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
            placeholder="https://github.com/username"
            className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-2 flex items-center gap-2">
            <Linkedin size={16} />
            LinkedIn Profile
          </label>
          <input
            type="url"
            value={formData.linkedinUrl}
            onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
            placeholder="https://linkedin.com/in/username"
            className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-2 flex items-center gap-2">
            <WebIcon size={16} />
            Personal Website
          </label>
          <input
            type="url"
            value={formData.websiteUrl}
            onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})}
            placeholder="https://yourwebsite.com"
            className="w-full bg-black border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
        
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <div className="font-medium">Public Profile</div>
            <div className="text-sm text-white/60">Allow others to view your profile and statistics</div>
          </div>
          <div className="relative">
            <input
              type="checkbox"
              checked={formData.isPublic}
              onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-white/20 rounded-full peer peer-checked:bg-[#D4AF37] transition-colors"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
          </div>
        </label>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full bg-[#D4AF37] text-black font-semibold py-3 rounded-lg hover:bg-[#F4D03F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colors = {
    blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
    green: "from-green-500/20 to-green-600/20 border-green-500/30",
    orange: "from-orange-500/20 to-orange-600/20 border-orange-500/30",
    yellow: "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30",
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-lg p-4`}>
      <Icon size={24} className="text-white/80 mb-2" />
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-white/60">{label}</div>
    </div>
  );
};

const ActivityHeatmap = () => {
  // Mock heatmap data - will be replaced with real data
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const weeks = 52;
  
  return (
    <div className="overflow-x-auto">
      <div className="inline-flex flex-col gap-1 min-w-max">
        <div className="flex gap-1">
          {Array.from({ length: weeks }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1">
              {Array.from({ length: 7 }).map((_, j) => {
                const level = Math.floor(Math.random() * 5);
                const colors = ["bg-white/5", "bg-green-900/40", "bg-green-700/60", "bg-green-500/80", "bg-green-400"];
                return (
                  <div
                    key={j}
                    className={`w-3 h-3 rounded-sm ${colors[level]} hover:ring-2 hover:ring-[#D4AF37] transition-all cursor-pointer`}
                    title={`${level} interviews`}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-white/40 mt-2">
          {months.map((month, i) => (
            <span key={i}>{month}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

const AchievementBadge = ({ icon, title, description, unlocked }) => {
  return (
    <div className={`border rounded-lg p-4 transition-all ${
      unlocked 
        ? "bg-[#D4AF37]/10 border-[#D4AF37]/30 hover:border-[#D4AF37]" 
        : "bg-white/5 border-white/10 opacity-50"
    }`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="font-semibold">{title}</div>
      <div className="text-xs text-white/60">{description}</div>
    </div>
  );
};

const SkillBar = ({ label, value, color }) => {
  const colors = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    yellow: "bg-yellow-500",
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-white/80">{label}</span>
        <span className="text-white/60">{value}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colors[color]} transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

export default Profile;
