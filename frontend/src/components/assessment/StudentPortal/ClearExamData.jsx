import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * ClearExamData - Utility page to clear all exam data from localStorage
 * Visit /exam/clear-data to use this
 */
export default function ClearExamData() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Clearing exam data...");
  const [cleared, setCleared] = useState([]);

  useEffect(() => {
    clearAllExamData();
  }, []);

  const clearAllExamData = () => {
    const clearedKeys = [];

    // Get all localStorage keys
    const keys = Object.keys(localStorage);

    keys.forEach((key) => {
      // Clear exam-related data
      if (
        key.startsWith("exam_") ||
        key === "examSession" ||
        key === "examAgreedAt"
      ) {
        localStorage.removeItem(key);
        clearedKeys.push(key);
        console.log("✅ Cleared:", key);
      }
    });

    if (clearedKeys.length === 0) {
      setStatus("No exam data found");
    } else {
      setStatus(`Cleared ${clearedKeys.length} items`);
    }

    setCleared(clearedKeys);

    // Auto-redirect after 3 seconds
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-5xl">🗑️</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{status}</h1>
          <p className="text-white/60">All exam data has been removed</p>
        </div>

        {cleared.length > 0 && (
          <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 mb-6 max-h-96 overflow-auto">
            <h3 className="text-white font-semibold mb-3">Cleared Items:</h3>
            <ul className="space-y-2">
              {cleared.map((key, index) => (
                <li
                  key={index}
                  className="text-green-400 text-sm font-mono bg-green-500/5 px-3 py-2 rounded border border-green-500/20"
                >
                  {key}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-center">
          <p className="text-white/40 text-sm mb-4">
            Redirecting to home page in 3 seconds...
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black px-8 py-3 rounded-lg font-bold transition-colors"
          >
            Go to Home Now
          </button>
        </div>
      </div>
    </div>
  );
}
