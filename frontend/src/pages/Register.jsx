import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import Lion from "../components/brand/Lion";
import { Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const { error } = await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
      });
      
      if (error) throw error;
      
      setSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      setError(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
      // Redirect happens automatically
    } catch (error) {
      setError(error.message || "Failed to sign in with Google");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden flex items-center justify-center">
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#D4AF37]/10 blur-[150px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center max-w-md px-6"
        >
          <div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 border-2 border-[#D4AF37] flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-[#D4AF37]" />
          </div>
          <h2 className="font-serif text-3xl text-white mb-4">Account Created!</h2>
          <p className="text-white/70 mb-6">
            Welcome to Marquee! Redirecting you to homepage...
          </p>
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#D4AF37]/10 blur-[150px]" />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/7 bg-[#050505]/90 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-3">
          <Lion size={40} glow={true} animate={true} />
          <div className="font-serif text-xl tracking-widest text-[#D4AF37]">
            Marquee
          </div>
        </Link>
        <Link
          to="/login"
          className="text-[10px] tracking-widest uppercase text-white/40 hover:text-white/70 transition-colors"
        >
          Sign In →
        </Link>
      </header>

      <main className="relative z-10 max-w-md mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Lion size={80} glow={true} animate={true} />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl font-light text-white mb-2">
              Create Account
            </h1>
            <p className="text-white/60 text-sm">
              Start your journey with Marquee AI interviews
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 rounded p-4 mb-6 flex items-start gap-3"
            >
              <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Google Sign Up */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full border border-white/20 text-white px-8 py-3 text-sm hover:bg-white/5 transition-colors duration-300 flex items-center justify-center gap-3 mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/40 text-xs uppercase tracking-wider">Or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Sign up Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white/70 text-sm mb-2">Full Name</label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-black/40 border border-white/20 text-white pl-12 pr-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
                  placeholder="John Doe"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">Email</label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-black/40 border border-white/20 text-white pl-12 pr-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">Password</label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-black/40 border border-white/20 text-white pl-12 pr-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
                  placeholder="At least 6 characters"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">Confirm Password</label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full bg-black/40 border border-white/20 text-white pl-12 pr-4 py-3 text-sm focus:border-[#D4AF37] focus:outline-none transition-colors"
                  placeholder="Re-enter password"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                required
                className="w-4 h-4 mt-0.5 border-white/30 bg-black/40 text-[#D4AF37] focus:ring-[#D4AF37]"
              />
              <span className="text-white/60 text-xs">
                I agree to the{" "}
                <a href="#" className="text-[#D4AF37] hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-[#D4AF37] hover:underline">
                  Privacy Policy
                </a>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4AF37] text-black px-8 py-3 text-[11px] uppercase tracking-[0.3em] font-semibold hover:bg-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-white/50 text-sm mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-[#D4AF37] hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
