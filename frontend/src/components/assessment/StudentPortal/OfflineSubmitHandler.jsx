import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * OfflineSubmitHandler - Handle exam submission when internet is required
 */
export default function OfflineSubmitHandler() {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [submitting, setSubmitting] = useState(false);
  const [examSession, setExamSession] = useState(null);

  useEffect(() => {
    // Load exam session
    const session = JSON.parse(localStorage.getItem("examSession"));
    if (!session) {
      navigate("/exam/login");
      return;
    }
    setExamSession(session);

    // Monitor online status
    const handleOnline = () => {
      setIsOnline(true);
      // Auto-submit when connection is restored
      setTimeout(() => submitPendingExam(session), 1000);
    };
    
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [navigate]);

  const submitPendingExam = async (session) => {
    setSubmitting(true);

    try {
      const examId = session.examId;
      const submission = JSON.parse(localStorage.getItem(`exam_${examId}_pendingSubmission`));

      if (!submission) {
        console.warn("No pending submission found, checking regular submission");
        const regularSubmission = localStorage.getItem(`exam_${examId}_submission`);
        if (regularSubmission) {
          console.log("Found regular submission, navigating to results");
          navigate("/exam/results", { replace: true });
          return;
        }
        alert("No submission found. Please take the exam again.");
        navigate("/", { replace: true });
        return;
      }

      console.log("Submitting to server:", submission);

      // Submit to backend API
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://marquee07.vercel.app/api';
      
      try {
        const response = await axios.post(
          `${backendUrl}/student/exam/submit`,
          submission,
          {
            headers: {
              'Content-Type': 'application/json'
            },
            timeout: 30000 // 30 second timeout
          }
        );

        console.log("Server response:", response.data);

        if (response.data && response.data.success) {
          // Success! Clear pending and move to regular submission
          localStorage.setItem(`exam_${examId}_submission`, JSON.stringify(submission));
          localStorage.removeItem(`exam_${examId}_pendingSubmission`);
          
          // Navigate to results
          setTimeout(() => {
            navigate("/exam/results", { replace: true });
          }, 500);
        } else {
          throw new Error(response.data?.message || "Submission failed");
        }
      } catch (apiError) {
        console.error("Backend API error:", apiError);
        
        // Check if it's a network error or server error
        if (apiError.code === 'ECONNABORTED' || apiError.message.includes('timeout')) {
          throw new Error("Request timed out. Please check your connection and try again.");
        } else if (apiError.response) {
          // Server responded with error
          throw new Error(`Server error: ${apiError.response.status}. ${apiError.response.data?.message || ''}`);
        } else if (apiError.request) {
          // Request made but no response
          throw new Error("No response from server. Please check if the backend is running.");
        } else {
          throw new Error(apiError.message || "Unknown error occurred");
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitting(false);
      
      // Show detailed error message
      const errorMsg = `Error submitting exam:\n${error.message}\n\nYour answers are saved locally. Please:\n1. Check your internet connection\n2. Make sure backend server is running\n3. Click "Submit Now" to try again`;
      alert(errorMsg);
    }
  };

  const handleManualSubmit = () => {
    if (!isOnline) {
      alert("Please connect to the internet first");
      return;
    }
    submitPendingExam(examSession);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isOnline ? "bg-green-500/20" : "bg-yellow-500/20"
          }`}>
            <span className="text-5xl">{isOnline ? "🌐" : "📡"}</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {submitting ? "Submitting Exam..." : isOnline ? "Internet Connected!" : "Connect to Internet"}
          </h1>
          <p className="text-white/60">
            {submitting
              ? "Please wait while we submit your exam"
              : isOnline
              ? "Your exam is being submitted automatically"
              : "Turn on your internet connection to submit your exam"}
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-8 mb-6">
          {submitting ? (
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white font-semibold mb-2">Submitting your exam...</p>
              <p className="text-white/60 text-sm">This may take a few moments</p>
            </div>
          ) : isOnline ? (
            <div className="text-center">
              <div className="text-5xl mb-4">✅</div>
              <p className="text-white font-semibold mb-2">Connection Established</p>
              <p className="text-white/60 text-sm">Your exam will be submitted automatically</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">📱</span>
                <div>
                  <p className="text-white font-semibold mb-1">Turn on WiFi or Mobile Data</p>
                  <p className="text-white/60 text-sm">Enable your internet connection</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🔄</span>
                <div>
                  <p className="text-white font-semibold mb-1">Automatic Detection</p>
                  <p className="text-white/60 text-sm">We'll detect when you're back online</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">💾</span>
                <div>
                  <p className="text-white font-semibold mb-1">Your Answers Are Safe</p>
                  <p className="text-white/60 text-sm">All answers saved locally</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Connection Status Indicator */}
        <div className={`border rounded-xl p-4 mb-6 ${
          isOnline
            ? "bg-green-500/10 border-green-500/30"
            : "bg-yellow-500/10 border-yellow-500/30"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              isOnline ? "bg-green-400 animate-pulse" : "bg-yellow-400"
            }`}></div>
            <p className={`font-semibold text-sm ${
              isOnline ? "text-green-400" : "text-yellow-400"
            }`}>
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Manual Submit Button */}
        {isOnline && !submitting && (
          <button
            onClick={handleManualSubmit}
            className="w-full bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black px-6 py-4 rounded-lg transition-colors font-bold text-lg flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Submit Now
          </button>
        )}

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-white/40 text-sm">
            {isOnline
              ? "If submission doesn't start automatically, use the button above"
              : "Waiting for internet connection..."}
          </p>
        </div>
      </div>
    </div>
  );
}
