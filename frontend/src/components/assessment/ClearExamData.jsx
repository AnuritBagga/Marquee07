import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * ClearExamData - Utility page to clear all exam data
 */
export default function ClearExamData() {
  const navigate = useNavigate();
  const [clearing, setClearing] = useState(false);
  const [cleared, setCleared] = useState(false);

  const handleClearData = () => {
    setClearing(true);

    // Get all localStorage keys
    const keys = Object.keys(localStorage);
    const examKeys = keys.filter(k => k.includes('exam'));
    
    console.log(`Found ${examKeys.length} exam-related keys:`, examKeys);
    
    // Clear all exam-related data
    examKeys.forEach(key => {
      localStorage.removeItem(key);
      console.log(`✅ Cleared: ${key}`);
    });
    
    console.log("✨ All exam data cleared!");
    
    setTimeout(() => {
      setClearing(false);
      setCleared(true);
    }, 1000);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-8">
        {!cleared ? (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🗑️</span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Clear Exam Data</h1>
              <p className="text-white/60 text-sm">
                If you're experiencing issues with the exam, clearing old data can help.
              </p>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <p className="text-yellow-400 text-sm">
                <strong>⚠️ Warning:</strong> This will clear all saved exam progress and submissions.
              </p>
            </div>

            <button
              onClick={handleClearData}
              disabled={clearing}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-50 mb-3"
            >
              {clearing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Clearing...
                </span>
              ) : (
                "Clear All Exam Data"
              )}
            </button>

            <button
              onClick={handleGoHome}
              className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">✅</span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Data Cleared!</h1>
              <p className="text-white/60 text-sm">
                All exam data has been removed. You can now start fresh.
              </p>
            </div>

            <button
              onClick={handleGoHome}
              className="w-full bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black py-3 rounded-lg font-bold transition-colors"
            >
              Go to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}
