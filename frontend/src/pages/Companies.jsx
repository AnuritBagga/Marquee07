import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Lion from "../components/brand/Lion";
import { Briefcase, Clock, FileText } from "lucide-react";

export default function Companies() {
  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#D4AF37]/10 blur-[150px]" />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/7 bg-[#050505]/90 backdrop-blur-md relative">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
          <Lion size={40} glow={true} animate={true} />
          <div className="font-serif text-xl tracking-widest text-[#D4AF37]">
            Marquee <span className="text-white/30 text-xs tracking-[0.3em] font-sans ml-2">RECRUITING</span>
          </div>
        </Link>
        <Link
          to="/"
          className="text-[10px] tracking-widest uppercase text-white/40 hover:text-white/70 transition-colors"
        >
          ← Back to Home
        </Link>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-24 flex flex-col items-center text-center">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <div className="w-24 h-24 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
            <Briefcase size={40} className="text-[#D4AF37]" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-5xl md:text-6xl font-light text-white mb-6 leading-tight"
        >
          No Active Assessments
        </motion.h1>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-white/60 text-lg leading-relaxed max-w-2xl mb-12"
        >
          You don't have any current online assessments (OA) or interview rounds scheduled.
          Check your email for upcoming assessment invitations or contact the hiring team for status updates.
        </motion.p>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mb-12"
        >
          <div className="border border-white/10 bg-white/[0.02] p-6 text-left">
            <FileText size={24} className="text-[#D4AF37] mb-3" strokeWidth={1.5} />
            <h3 className="font-serif text-xl text-white mb-2">Online Assessments</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              When companies invite you for OA rounds, they'll appear here with deadlines and links.
            </p>
          </div>

          <div className="border border-white/10 bg-white/[0.02] p-6 text-left">
            <Clock size={24} className="text-[#D4AF37] mb-3" strokeWidth={1.5} />
            <h3 className="font-serif text-xl text-white mb-2">Interview Rounds</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Scheduled AI or live interview rounds will show up here with timing and prep materials.
            </p>
          </div>

          <div className="border border-white/10 bg-white/[0.02] p-6 text-left">
            <Briefcase size={24} className="text-[#D4AF37] mb-3" strokeWidth={1.5} />
            <h3 className="font-serif text-xl text-white mb-2">Application Status</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Track your application pipeline and get real-time updates from recruiting teams.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/practice"
            className="bg-[#D4AF37] text-black px-8 py-4 text-[11px] uppercase tracking-[0.3em] hover:bg-white transition-colors duration-300"
          >
            Practice Interviews
          </Link>
          <a
            href="mailto:support@marquee.ai"
            className="border border-white/20 text-white px-8 py-4 text-[11px] uppercase tracking-[0.3em] hover:bg-white/5 transition-colors duration-300"
          >
            Contact Support
          </a>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 text-white/30 text-xs tracking-[0.3em] uppercase"
        >
          For Companies • Recruiting Portal
        </motion.p>
      </main>
    </div>
  );
}
