import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * OfflineSubmitHandler - Handle exam submission when internet is required
 * SIMPLE VERSION: Just check internet, then show results from localStorage
 */
export default function OfflineSubmitHandler() {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(false);
  const [checking, setChecking] = useState(true);
  const [examSession, setExamSession] = useState(null);

  useEffect(() => {
    // Load exam session
    const session = JSON.parse(localStorage.getItem("examSession"));
    if (!session) {
      console.log("No exam session - redirecting to login");
      navigate("/exam/login", { replace: true });
      return;
    }
    setExamSession(session);

    // Initial internet check
    checkInternet();

    // Set up interval to continuously check internet
    const intervalId = setInterval(checkInternet, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, [navigate]);

  const checkInternet = async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      
      await fetch(`https://www.google.com/favicon.ico?${Date.now()}`, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache',
        signal: controller.signal
      });
      
      clearTimeout(timeout);
      
      // Internet is ON!
      setIsOnline(true);
      setChecking(false);
      
      // Auto-navigate to results after 1 second
      setTimeout(() => {
        console.log("✅ Internet is ON - navigating to results");
        navigate("/exam/results", { replace: true });
      }, 1500);
      
    } catch (error) {
      // Still offline
      setIsOnline(false);
      setChecking(false);
    }
  };

  const handleManualCheck = () => {
    setChecking(true);
    checkInternet();
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isOnline ? "bg-green-500/20 animate-bounce" : "bg-yellow-500/20"
          }`}>
            <span className="text-5xl">{isOnline ? "✅" : "📡"}</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isOnline ? "Internet Connected!" : "Connect to Internet"}
          </h1>
          <p className="text-white/60">
            {isOnline
              ? "Loading your results..."
              : "Turn on your internet to view exam results"}
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-8 mb-6">
          {isOnline ? (
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white font-semibold mb-2">Preparing Results...</p>
              <p className="text-white/60 text-sm">Your answers are safe</p>
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
                  <p className="text-white/60 text-sm">We'll detect when you're online</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">💾</span>
                <div>
                  <p className="text-white font-semibold mb-1">Your Answers Are Safe</p>
                  <p className="text-white/60 text-sm">Saved locally on your device</p>
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
              isOnline ? "bg-green-400 animate-pulse" : "bg-yellow-400 animate-pulse"
            }`}></div>
            <p className={`font-semibold text-sm ${
              isOnline ? "text-green-400" : "text-yellow-400"
            }`}>
              {checking ? "Checking..." : isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Manual Check Button */}
        {!isOnline && !checking && (
          <button
            onClick={handleManualCheck}
            className="w-full bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black px-6 py-4 rounded-lg transition-colors font-bold text-lg flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Check Again
          </button>
        )}

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-white/40 text-sm">
            {isOnline
              ? "Redirecting to results page..."
              : "Your exam is complete. Connect to internet to see results."}
          </p>
        </div>
      </div>
    </div>
  );
}
