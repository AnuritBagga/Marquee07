import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import offlineExamManager from "../../../utils/offlineExamManager";

/**
 * DemoExam - Redirect to exam flow with demo data
 * Now with TRUE offline support - saves data for WiFi OFF mode
 */
export default function DemoExam() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Preparing demo exam...");

  useEffect(() => {
    const setupDemoExam = async () => {
      try {
        setStatus("Creating demo session...");

        // Create a demo exam session
        const demoSession = {
          examId: "demo-exam-001",
          examCode: "DEMO01",
          studentName: "Demo User",
          studentEmail: "demo@example.com",
          studentId: "DEMO123",
          examData: {
            id: "demo-exam-001",
            title: "Mock Assessment - Demo Exam (Works Offline!)",
            exam_type: "mock",
            duration_minutes: 30,
            total_questions: 10,
            start_time: new Date().toISOString(),
            end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            proctoring_enabled: true,
            face_detection: true,
            mobile_detection: false,
            tab_switch_allowed: 2,
            shuffle_questions: true,
            shuffle_options: true,
            negative_marking: false,
            show_results_immediately: true,
            offline_mode_enabled: true // MUST be enabled for WiFi OFF
          }
        };

        setStatus("Saving data for offline use...");

        // Save to localStorage
        localStorage.setItem("examSession", JSON.stringify(demoSession));

        // Save to IndexedDB for true offline support
        try {
          await offlineExamManager.saveExamForOffline(demoSession.examData);
          console.log("✅ Demo exam saved for offline use");
        } catch (error) {
          console.warn("⚠️ Could not save to IndexedDB, using localStorage only:", error);
        }

        setStatus("Redirecting to system check...");

        // Small delay to show messages
        setTimeout(() => {
          navigate("/exam/system-check");
        }, 500);

      } catch (error) {
        console.error("Failed to setup demo exam:", error);
        setStatus("Error setting up demo. Redirecting anyway...");
        setTimeout(() => {
          navigate("/exam/system-check");
        }, 1000);
      }
    };

    setupDemoExam();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/60 mb-2">{status}</p>
        <p className="text-white/40 text-sm">Setting up offline exam support...</p>
      </div>
    </div>
  );
}
    </div>
  );
}
