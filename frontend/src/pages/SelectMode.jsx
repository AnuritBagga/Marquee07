import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MessageSquare, ClipboardCheck, ArrowRight, Sparkles, Shield } from "lucide-react";

/**
 * SelectMode - Choose between Interview Practice or Assessment
 * Clean, unified entry point for all features
 */
export default function SelectMode() {
  const modes = [
    {
      id: "interview",
      title: "Interview Practice",
      subtitle: "AI-Powered Mock Interviews",
      description: "Real-time AI cross-questioning that listens, reasons, and responds like a true interviewer.",
      icon: MessageSquare,
      link: "/practice",
      color: "from-[#D4AF37] to-[#B8941E]",
      bgGlow: "bg-[#D4AF37]/10",
      features: [
        "Real-time AI questioning",
        "Multiple difficulty levels",
        "Instant feedback & scoring",
        "Voice & text modes",
      ],
    },
    {
      id: "assessment",
      title: "Assessment Portal",
      subtitle: "AI-Proctored Examinations",
      description: "Create, manage, and take secure online exams with advanced AI proctoring and offline support.",
      icon: ClipboardCheck,
      link: "/exam/demo",
      color: "from-blue-500 to-purple-600",
      bgGlow: "bg-blue-500/10",
      features: [
        "AI-powered proctoring",
        "True offline exam mode",
        "Organization dashboard",
        "Secure & tamper-proof",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.03),transparent_50%)]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-6">
            <Sparkles size={16} className="text-[#D4AF37]" />
            <span className="text-[#D4AF37] text-sm font-semibold uppercase tracking-wider">
              Choose Your Path
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-6 tracking-tight">
            What Would You Like
            <br />
            <span className="italic text-[#D4AF37]/95">To Do Today?</span>
          </h1>

          <p className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Select your preferred mode to get started with Marquee
          </p>
        </motion.div>

        {/* Mode Cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {modes.map((mode, index) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Link
                to={mode.link}
                className="group block relative bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 sm:p-10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl overflow-hidden"
              >
                {/* Hover glow effect */}
                <div className={`absolute inset-0 ${mode.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${mode.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                    <mode.icon size={32} className="text-white" strokeWidth={2} />
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      {mode.title}
                    </h2>
                    <p className={`text-sm font-semibold uppercase tracking-wider bg-gradient-to-r ${mode.color} bg-clip-text text-transparent`}>
                      {mode.subtitle}
                    </p>
                  </div>

                  <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-8">
                    {mode.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {mode.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-white/60">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <span className="text-white font-semibold group-hover:text-[#D4AF37] transition-colors">
                      Get Started
                    </span>
                    <ArrowRight
                      size={20}
                      className="text-white/40 group-hover:text-[#D4AF37] group-hover:translate-x-2 transition-all duration-300"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Additional Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 sm:p-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <Shield size={24} className="text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">
                  Assessment Options
                </h3>
                <p className="text-white/60 text-sm">
                  Take exam with code, try demo, or access organization portal
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
              <Link
                to="/exam/login"
                className="flex-1 sm:flex-none px-5 py-2.5 text-xs uppercase tracking-wider text-white/70 border border-white/20 hover:text-white hover:border-white/40 rounded-lg transition-all text-center"
              >
                Enter Code
              </Link>
              <Link
                to="/exam/demo"
                className="flex-1 sm:flex-none px-5 py-2.5 text-xs uppercase tracking-wider text-black bg-green-400 hover:bg-green-300 rounded-lg transition-all font-semibold text-center"
              >
                Try Demo
              </Link>
              <Link
                to="/organization/dashboard"
                className="flex-1 sm:flex-none px-5 py-2.5 text-xs uppercase tracking-wider text-white/70 border border-white/20 hover:text-white hover:border-white/40 rounded-lg transition-all text-center"
              >
                Organization
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors text-sm"
          >
            <ArrowRight size={16} className="rotate-180" />
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
