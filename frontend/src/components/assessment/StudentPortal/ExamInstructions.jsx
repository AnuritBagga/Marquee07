import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * ExamInstructions - Display exam rules and requirements
 */
export default function ExamInstructions() {
  const navigate = useNavigate();
  const [examSession, setExamSession] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // Load exam session from localStorage
    const session = JSON.parse(localStorage.getItem("examSession"));
    if (!session) {
      navigate("/exam/login");
      return;
    }
    setExamSession(session);

    // Monitor online/offline status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [navigate]);

  const handleStartExam = () => {
    if (!agreed) {
      alert("Please agree to the exam rules before starting");
      return;
    }

    // For offline exams, check if internet is off
    if (examSession?.examData?.offline_mode_enabled && !isOffline) {
      if (!confirm("This exam requires offline mode. Please turn off your internet connection and click OK to continue.")) {
        return;
      }
    }

    // Save agreement timestamp
    localStorage.setItem("examAgreedAt", new Date().toISOString());
    
    // Navigate to exam interface
    navigate("/exam/interface");
  };

  if (!examSession) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin"></div>
      </div>
    );
  }

  const { examData } = examSession;

  return (
    <div className="min-h-screen bg-black p-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#B8941E] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📋</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{examData.title}</h1>
          <p className="text-white/60">{examData.exam_type.toUpperCase()} Exam</p>
        </div>

        {/* Exam Info Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4 text-center">
            <p className="text-white/40 text-sm mb-1">Duration</p>
            <p className="text-2xl font-bold text-[#D4AF37]">{examData.duration_minutes} min</p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4 text-center">
            <p className="text-white/40 text-sm mb-1">Questions</p>
            <p className="text-2xl font-bold text-white">{examData.total_questions || 0}</p>
          </div>
          <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4 text-center">
            <p className="text-white/40 text-sm mb-1">Mode</p>
            <p className="text-2xl font-bold text-blue-400">
              {examData.offline_mode_enabled ? "📡 Offline" : "🌐 Online"}
            </p>
          </div>
        </div>

        {/* Offline Mode Alert */}
        {examData.offline_mode_enabled && (
          <div className={`border rounded-xl p-6 mb-8 ${
            isOffline
              ? "bg-green-500/10 border-green-500/30"
              : "bg-yellow-500/10 border-yellow-500/30"
          }`}>
            <div className="flex items-start gap-4">
              <div className="text-3xl">
                {isOffline ? "✅" : "⚠️"}
              </div>
              <div className="flex-1">
                <h3 className={`font-bold mb-2 ${isOffline ? "text-green-400" : "text-yellow-400"}`}>
                  {isOffline ? "Offline Mode Ready" : "Offline Mode Required"}
                </h3>
                {isOffline ? (
                  <p className="text-white/80 text-sm">
                    Your internet is off. You can now start the exam. Your answers will be saved locally and submitted when you turn internet back on.
                  </p>
                ) : (
                  <>
                    <p className="text-white/80 text-sm mb-3">
                      This exam must be taken offline. Please follow these steps:
                    </p>
                    <ol className="text-white/80 text-sm space-y-2 ml-4">
                      <li>1. Turn off your WiFi or disconnect ethernet cable</li>
                      <li>2. Disable mobile data on your device</li>
                      <li>3. Wait for the green "Offline Mode Ready" message</li>
                      <li>4. Click "Start Exam"</li>
                    </ol>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Exam Instructions</h2>

          <div className="space-y-6">
            {/* General Rules */}
            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span className="text-xl">📜</span>
                General Rules
              </h3>
              <ul className="space-y-2 text-white/80 text-sm ml-8">
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>The exam has {examData.total_questions} questions and must be completed in {examData.duration_minutes} minutes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Timer will start as soon as you begin the exam</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Your answers are auto-saved as you progress</span>
                </li>
                {examData.negative_marking && (
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    <span className="text-red-300">Negative marking is enabled - incorrect answers will deduct points</span>
                  </li>
                )}
                {examData.shuffle_questions && (
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span>Questions will appear in random order</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Proctoring Rules */}
            {examData.proctoring_enabled && (
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span className="text-xl">🎥</span>
                  Proctoring Rules
                </h3>
                <ul className="space-y-2 text-white/80 text-sm ml-8">
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span>Your camera will record throughout the exam for proctoring</span>
                  </li>
                  {examData.face_detection && (
                    <li className="flex items-start gap-2">
                      <span className="text-[#D4AF37] mt-1">•</span>
                      <span>Face detection is enabled - ensure your face is clearly visible</span>
                    </li>
                  )}
                  {examData.mobile_detection && (
                    <li className="flex items-start gap-2">
                      <span className="text-[#D4AF37] mt-1">•</span>
                      <span>Mobile phone detection is active - keep phones away from camera view</span>
                    </li>
                  )}
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span>Ensure good lighting and a quiet environment</span>
                  </li>
                </ul>
              </div>
            )}

            {/* Restrictions */}
            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span className="text-xl">🚫</span>
                Restrictions
              </h3>
              <ul className="space-y-2 text-white/80 text-sm ml-8">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span className="text-red-300">You must remain in fullscreen mode throughout the exam</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span className="text-red-300">
                    {examData.tab_switch_allowed === 0
                      ? "Switching tabs or windows will auto-submit your exam"
                      : `You are allowed ${examData.tab_switch_allowed} tab switch(es)`}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span className="text-red-300">Do not refresh the page during the exam</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span className="text-red-300">Any suspicious activity will be logged and flagged</span>
                </li>
              </ul>
            </div>

            {/* Submission */}
            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span className="text-xl">✅</span>
                Submission
              </h3>
              <ul className="space-y-2 text-white/80 text-sm ml-8">
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Click "Submit Exam" when you're done</span>
                </li>
                {examData.offline_mode_enabled && (
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span>After clicking submit, you'll be prompted to turn internet back on</span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span>Exam will auto-submit when time runs out</span>
                </li>
                {examData.show_results_immediately && (
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span>Results will be shown immediately after submission</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Agreement Checkbox */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 mb-6">
          <label className="flex items-start gap-4 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-6 h-6 mt-1 accent-[#D4AF37] cursor-pointer"
            />
            <div className="flex-1">
              <p className="text-white font-semibold mb-2">
                I agree to the exam rules and regulations
              </p>
              <p className="text-white/60 text-sm">
                By checking this box, I confirm that I have read and understood all the exam instructions, 
                and I agree to follow all rules and restrictions. I understand that any violation may result 
                in exam cancellation and disciplinary action.
              </p>
            </div>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/exam/system-check")}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-lg transition-colors font-semibold"
          >
            ← Back to System Check
          </button>
          <button
            onClick={handleStartExam}
            disabled={!agreed || (examData.offline_mode_enabled && !isOffline)}
            className="flex-1 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black px-6 py-4 rounded-lg transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {examData.offline_mode_enabled && !isOffline ? (
              <>
                ⚠️ Turn Off Internet First
              </>
            ) : (
              <>
                Start Exam
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
