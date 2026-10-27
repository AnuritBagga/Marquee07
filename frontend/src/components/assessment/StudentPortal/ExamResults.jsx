import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * ExamResults - Display exam results and performance
 */
export default function ExamResults() {
  const navigate = useNavigate();
  const [examSession, setExamSession] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = () => {
    // Load exam session
    const session = JSON.parse(localStorage.getItem("examSession"));
    if (!session) {
      navigate("/exam/login");
      return;
    }
    setExamSession(session);

    // Load submission
    const examId = session.examId;
    const sub = JSON.parse(localStorage.getItem(`exam_${examId}_submission`));
    if (!sub) {
      alert("No submission found");
      navigate("/exam/login");
      return;
    }
    setSubmission(sub);

    // Calculate results (in production, this comes from backend)
    const questions = JSON.parse(localStorage.getItem(`exam_${examId}_questions`));
    const calculatedResults = calculateResults(questions, sub.answers, session.examData);
    setResults(calculatedResults);
    setLoading(false);
  };

  const calculateResults = (questions, answers, examData) => {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;
    let totalMarks = 0;
    let obtainedMarks = 0;

    questions.forEach((q) => {
      totalMarks += q.marks || 1;
      
      if (!answers[q.id]) {
        unanswered++;
      } else if (answers[q.id] === q.correct_answer) {
        correct++;
        obtainedMarks += q.marks || 1;
      } else {
        incorrect++;
        // Negative marking
        if (examData.negative_marking) {
          obtainedMarks -= (q.marks || 1) * 0.25;
        }
      }
    });

    const percentage = totalMarks > 0 ? ((obtainedMarks / totalMarks) * 100).toFixed(2) : 0;
    const passed = percentage >= 60;

    return {
      correct,
      incorrect,
      unanswered,
      totalQuestions: questions.length,
      totalMarks,
      obtainedMarks: Math.max(0, obtainedMarks).toFixed(2),
      percentage,
      passed,
      grade: getGrade(percentage)
    };
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: "A+", color: "text-green-400" };
    if (percentage >= 80) return { grade: "A", color: "text-green-400" };
    if (percentage >= 70) return { grade: "B", color: "text-blue-400" };
    if (percentage >= 60) return { grade: "C", color: "text-yellow-400" };
    if (percentage >= 50) return { grade: "D", color: "text-orange-400" };
    return { grade: "F", color: "text-red-400" };
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleFinish = () => {
    // Clean up localStorage
    if (examSession) {
      const examId = examSession.examId;
      localStorage.removeItem(`exam_${examId}_questions`);
      localStorage.removeItem(`exam_${examId}_answers`);
      localStorage.removeItem(`exam_${examId}_violations`);
      localStorage.removeItem(`exam_${examId}_submission`);
      localStorage.removeItem(`exam_${examId}_pendingSubmission`);
    }
    localStorage.removeItem("examSession");
    localStorage.removeItem("examAgreedAt");

    // Navigate to home or login
    navigate("/");
  };

  if (loading || !results) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            results.passed
              ? "bg-green-500/20 animate-bounce"
              : "bg-red-500/20"
          }`}>
            <span className="text-5xl">{results.passed ? "🎉" : "📊"}</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            {results.passed ? "Congratulations!" : "Exam Completed"}
          </h1>
          <p className="text-white/60">
            {results.passed
              ? "You have successfully passed the exam"
              : "Here are your exam results"}
          </p>
        </div>

        {/* Score Card */}
        <div className="bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/30 rounded-xl p-8 mb-8 text-center">
          <p className="text-white/60 text-sm mb-2">Your Score</p>
          <div className="flex items-center justify-center gap-4 mb-4">
            <p className="text-6xl font-bold text-[#D4AF37]">{results.percentage}%</p>
            <div className={`text-5xl font-bold ${results.grade.color}`}>
              {results.grade.grade}
            </div>
          </div>
          <p className="text-white/80">
            {results.obtainedMarks} out of {results.totalMarks} marks
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">✓</span>
            </div>
            <p className="text-white/40 text-sm mb-1">Correct</p>
            <p className="text-2xl font-bold text-green-400">{results.correct}</p>
          </div>

          <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">✗</span>
            </div>
            <p className="text-white/40 text-sm mb-1">Incorrect</p>
            <p className="text-2xl font-bold text-red-400">{results.incorrect}</p>
          </div>

          <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">○</span>
            </div>
            <p className="text-white/40 text-sm mb-1">Unanswered</p>
            <p className="text-2xl font-bold text-yellow-400">{results.unanswered}</p>
          </div>

          <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">⏱️</span>
            </div>
            <p className="text-white/40 text-sm mb-1">Time Taken</p>
            <p className="text-2xl font-bold text-blue-400">
              {formatTime(submission?.timeTaken || 0)}
            </p>
          </div>
        </div>

        {/* Performance Details */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 mb-8">
          <h3 className="text-white font-semibold mb-4">Performance Breakdown</h3>
          
          {/* Accuracy Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-white/60">Accuracy</span>
              <span className="text-white font-semibold">
                {((results.correct / results.totalQuestions) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="h-4 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-green-400"
                style={{ width: `${(results.correct / results.totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Completion Bar */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-white/60">Completion Rate</span>
              <span className="text-white font-semibold">
                {(((results.correct + results.incorrect) / results.totalQuestions) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="h-4 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B8941E]"
                style={{ width: `${((results.correct + results.incorrect) / results.totalQuestions) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Exam Info */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 mb-8">
          <h3 className="text-white font-semibold mb-4">Exam Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-white/40 mb-1">Exam Title</p>
              <p className="text-white font-medium">{examSession?.examData?.title}</p>
            </div>
            <div>
              <p className="text-white/40 mb-1">Student Name</p>
              <p className="text-white font-medium">{examSession?.studentName}</p>
            </div>
            <div>
              <p className="text-white/40 mb-1">Submitted At</p>
              <p className="text-white font-medium">
                {new Date(submission?.submittedAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-white/40 mb-1">Exam Code</p>
              <p className="text-[#D4AF37] font-mono font-bold">{examSession?.examCode}</p>
            </div>
          </div>
        </div>

        {/* Proctoring Report */}
        {submission?.violations && submission.violations.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">⚠️</span>
              </div>
              <div>
                <h3 className="text-red-400 font-semibold">Proctoring Violations Detected</h3>
                <p className="text-red-300 text-sm">{submission.violations.length} incident(s) recorded</p>
              </div>
            </div>
            <div className="space-y-2">
              {submission.violations.slice(0, 5).map((violation, index) => (
                <div key={index} className="bg-red-500/5 rounded p-3 text-sm">
                  <p className="text-red-300">{violation.message}</p>
                  <p className="text-red-400/60 text-xs mt-1">
                    {new Date(violation.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))}
              {submission.violations.length > 5 && (
                <p className="text-red-400/60 text-xs text-center">
                  +{submission.violations.length - 5} more violations
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleFinish}
            className="flex-1 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black px-6 py-4 rounded-lg transition-colors font-bold text-lg flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </button>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-white/40 text-sm">
            {examSession?.examData?.show_results_immediately
              ? "Detailed results have been sent to your email"
              : "Final results will be shared by the organization"}
          </p>
        </div>
      </div>
    </div>
  );
}
