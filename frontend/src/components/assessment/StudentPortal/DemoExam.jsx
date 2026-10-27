import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * DemoExam - Redirect to exam flow with demo data
 */
export default function DemoExam() {
  const navigate = useNavigate();

  useEffect(() => {
    // Create a demo exam session
    const demoSession = {
      examId: "demo-exam-001",
      examCode: "DEMO01",
      studentName: "Demo User",
      studentEmail: "demo@example.com",
      studentId: "DEMO123",
      examData: {
        id: "demo-exam-001",
        title: "Mock Assessment - Demo Exam",
        exam_type: "mock",
        duration_minutes: 30,
        total_questions: 10,
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        proctoring_enabled: true,
        face_detection: true,
        mobile_detection: false,
        tab_switch_allowed: 2,
        shuffle_questions: true,
        shuffle_options: true,
        negative_marking: false,
        show_results_immediately: true,
        offline_mode_enabled: false // Keep false for demo - simpler UX
      }
    };

    // Save to localStorage
    localStorage.setItem("examSession", JSON.stringify(demoSession));

    // Navigate to system check
    navigate("/exam/system-check");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/60">Loading demo exam...</p>
      </div>
    </div>
  );
}
