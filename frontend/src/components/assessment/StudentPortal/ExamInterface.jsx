import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DraggableCamera from "@/components/practice/DraggableCamera";

/**
 * ExamInterface - Main exam taking interface with proctoring
 */
export default function ExamInterface() {
  const navigate = useNavigate();
  const [examSession, setExamSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [violations, setViolations] = useState([]);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    // Load exam session
    const session = JSON.parse(localStorage.getItem("examSession"));
    if (!session) {
      navigate("/exam/login");
      return;
    }
    setExamSession(session);
    startTimeRef.current = Date.now();

    // Load or initialize questions
    const savedQuestions = localStorage.getItem(`exam_${session.examId}_questions`);
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    } else {
      // Mock questions - in production, fetch from API
      const mockQuestions = generateMockQuestions(session.examData.total_questions || 10);
      setQuestions(mockQuestions);
      localStorage.setItem(`exam_${session.examId}_questions`, JSON.stringify(mockQuestions));
    }

    // Load saved answers
    const savedAnswers = localStorage.getItem(`exam_${session.examId}_answers`);
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }

    // Set timer
    setTimeRemaining(session.examData.duration_minutes * 60);

    // Enter fullscreen
    enterFullscreen();

    // Setup event listeners
    setupProctoring(session.examData);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining <= 0) {
      handleAutoSubmit("Time's up!");
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleAutoSubmit("Time's up!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeRemaining]);

  const setupProctoring = (examData) => {
    // Fullscreen monitoring
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    // Tab switch detection
    if (examData.proctoring_enabled) {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }
  };

  const handleFullscreenChange = () => {
    const isFs = !!document.fullscreenElement;
    setIsFullscreen(isFs);
    
    if (!isFs) {
      logViolation("Exited fullscreen mode");
      // Attempt to re-enter fullscreen
      setTimeout(enterFullscreen, 100);
    }
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      const newCount = tabSwitchCount + 1;
      setTabSwitchCount(newCount);
      logViolation(`Tab switched (${newCount})`);

      const allowedSwitches = examSession?.examData?.tab_switch_allowed || 0;
      if (allowedSwitches === 0 || newCount > allowedSwitches) {
        handleAutoSubmit(`Tab switch limit exceeded (${newCount}/${allowedSwitches})`);
      }
    }
  };

  const enterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Exit fullscreen error:", error);
    }
  };

  const logViolation = (message) => {
    const violation = {
      timestamp: new Date().toISOString(),
      message,
      questionIndex: currentQuestionIndex
    };
    setViolations((prev) => [...prev, violation]);

    // Save to localStorage
    const examId = examSession?.examId;
    const savedViolations = JSON.parse(localStorage.getItem(`exam_${examId}_violations`) || "[]");
    savedViolations.push(violation);
    localStorage.setItem(`exam_${examId}_violations`, JSON.stringify(savedViolations));
  };

  const handleAnswerChange = (questionId, answer) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);

    // Auto-save to localStorage
    const examId = examSession?.examId;
    localStorage.setItem(`exam_${examId}_answers`, JSON.stringify(newAnswers));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionJump = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmitClick = () => {
    setShowSubmitModal(true);
  };

  const handleAutoSubmit = (reason) => {
    logViolation(`Auto-submit: ${reason}`);
    submitExam(true, reason);
  };

  const submitExam = async (autoSubmit = false, reason = "") => {
    try {
      setIsSubmitting(true);

      const examId = examSession?.examId;
      if (!examId) {
        console.error("No exam ID found!");
        alert("Error: Exam session not found. Please restart the exam.");
        setIsSubmitting(false);
        return;
      }

      const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);

      const submission = {
        examId,
        studentName: examSession?.studentName,
        studentEmail: examSession?.studentEmail,
        answers,
        timeTaken,
        violations,
        tabSwitches: tabSwitchCount,
        autoSubmit,
        autoSubmitReason: reason,
        submittedAt: new Date().toISOString()
      };

      console.log("Submitting exam:", submission);

      // Save submission to localStorage
      localStorage.setItem(`exam_${examId}_submission`, JSON.stringify(submission));
      console.log("✅ Submission saved to localStorage");
      
      // Verify it was saved
      const verifySubmission = localStorage.getItem(`exam_${examId}_submission`);
      if (!verifySubmission) {
        console.error("❌ Submission failed to save!");
        alert("Error saving submission. Please try again.");
        setIsSubmitting(false);
        return;
      }
      console.log("✅ Submission verified in localStorage");

      // Exit fullscreen
      await exitFullscreen();

      // Check if offline
      const isReallyOffline = !navigator.onLine;
      const isOfflineExam = examSession?.examData?.offline_mode_enabled;
      const isDemoExam = examId.includes('demo') || examSession?.examData?.exam_type === 'mock';

      if (isReallyOffline && isOfflineExam && !isDemoExam) {
        console.log("Offline mode - storing for later sync");
        // Store for later sync (real exams only)
        localStorage.setItem(`exam_${examId}_pendingSubmission`, JSON.stringify(submission));
        navigate("/exam/offline-submit", { replace: true });
      } else {
        console.log("Navigating to results (demo or online)");
        // Demo exams or online exams - go directly to results
        // Wait a bit to ensure localStorage is written
        setTimeout(() => {
          navigate("/exam/results", { replace: true });
        }, 100);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error submitting exam: " + error.message);
      setIsSubmitting(false);
    }
  };

  if (!examSession || questions.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  // Timer formatting
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timerColor = minutes < 5 ? "text-red-400" : minutes < 10 ? "text-yellow-400" : "text-white";

  return (
    <div className="min-h-screen bg-black">
      {/* Fullscreen Warning */}
      {!isFullscreen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0A0A0A] border border-red-500/50 rounded-xl p-8 max-w-md text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-4">Fullscreen Required</h2>
            <p className="text-white/80 mb-6">
              You must stay in fullscreen mode during the exam. Click below to re-enter fullscreen.
            </p>
            <button
              onClick={enterFullscreen}
              className="bg-[#D4AF37] text-black px-8 py-3 rounded-lg font-bold hover:bg-[#D4AF37]/90 transition-colors"
            >
              Enter Fullscreen
            </button>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="bg-[#0A0A0A] border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white font-bold text-lg">{examSession.examData.title}</h1>
            <p className="text-white/40 text-sm">{examSession.studentName}</p>
          </div>
          <div className="flex items-center gap-6">
            {/* Progress */}
            <div className="text-center">
              <p className="text-white/40 text-xs mb-1">Progress</p>
              <p className="text-white font-semibold">{answeredCount}/{questions.length}</p>
            </div>
            {/* Timer */}
            <div className="text-center">
              <p className="text-white/40 text-xs mb-1">Time Left</p>
              <p className={`font-mono font-bold text-xl ${timerColor}`}>
                {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#D4AF37] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex h-[calc(100vh-100px)]">
        {/* Question Panel */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-3xl mx-auto">
            {/* Question Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h2>
              {currentQuestion.difficulty && (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  currentQuestion.difficulty === "easy" ? "bg-green-500/20 text-green-400" :
                  currentQuestion.difficulty === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                  "bg-red-500/20 text-red-400"
                }`}>
                  {currentQuestion.difficulty}
                </span>
              )}
            </div>

            {/* Question Text */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 mb-6">
              <p className="text-white text-lg leading-relaxed">{currentQuestion.question_text}</p>
            </div>

            {/* Options */}
            {currentQuestion.question_type === "mcq" && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = answers[currentQuestion.id] === option;
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerChange(currentQuestion.id, option)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? "border-[#D4AF37] bg-[#D4AF37]/10"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? "border-[#D4AF37] bg-[#D4AF37]" : "border-white/30"
                        }`}>
                          {isSelected && (
                            <div className="w-3 h-3 bg-black rounded-full"></div>
                          )}
                        </div>
                        <span className="text-white/60 font-mono text-sm">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <span className="text-white flex-1">{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Text Answer */}
            {currentQuestion.question_type === "text" && (
              <textarea
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                placeholder="Type your answer here..."
                rows={6}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 resize-none"
              />
            )}

            {/* Coding Answer */}
            {currentQuestion.question_type === "coding" && (
              <textarea
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                placeholder="// Write your code here..."
                rows={12}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-[#D4AF37] font-mono text-sm placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 resize-none"
              />
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>
              
              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmitClick}
                  className="px-8 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold transition-colors"
                >
                  Submit Exam →
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-3 rounded-lg bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-semibold transition-colors"
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-[#0A0A0A] border-l border-white/10 p-6 overflow-auto">
          {/* Question Navigation */}
          <h3 className="text-white font-semibold mb-4">Questions</h3>
          <div className="grid grid-cols-5 gap-2 mb-6">
            {questions.map((q, index) => {
              const isAnswered = !!answers[q.id];
              const isCurrent = index === currentQuestionIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => handleQuestionJump(index)}
                  className={`aspect-square rounded-lg font-semibold text-sm transition-all ${
                    isCurrent
                      ? "bg-[#D4AF37] text-black"
                      : isAnswered
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          {/* Stats */}
          <div className="space-y-3 mb-6">
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-white/40 text-xs mb-1">Answered</p>
              <p className="text-white font-semibold">{answeredCount}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-white/40 text-xs mb-1">Not Answered</p>
              <p className="text-white font-semibold">{questions.length - answeredCount}</p>
            </div>
            {violations.length > 0 && (
              <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/30">
                <p className="text-red-400 text-xs mb-1">Violations</p>
                <p className="text-red-400 font-semibold">{violations.length}</p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmitClick}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Submit Exam
          </button>
        </div>
      </div>

      {/* Draggable Camera */}
      {examSession?.examData?.proctoring_enabled && (
        <DraggableCamera />
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">Submit Exam?</h2>
            <div className="space-y-3 mb-6">
              <p className="text-white/80">
                You have answered <strong className="text-[#D4AF37]">{answeredCount}</strong> out of{" "}
                <strong>{questions.length}</strong> questions.
              </p>
              {answeredCount < questions.length && (
                <p className="text-yellow-400 text-sm">
                  ⚠️ {questions.length - answeredCount} question(s) unanswered
                </p>
              )}
              <p className="text-white/60 text-sm">
                Once submitted, you cannot change your answers.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => submitExam(false)}
                disabled={isSubmitting}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to generate mock questions
function generateMockQuestions(count) {
  const questions = [];
  for (let i = 0; i < count; i++) {
    const correctIndex = i % 4; // Rotate correct answers
    questions.push({
      id: `q${i + 1}`,
      question_text: `Sample Question ${i + 1}: This is a placeholder question for testing purposes.`,
      question_type: "mcq",
      options: [
        `Option A for question ${i + 1}`,
        `Option B for question ${i + 1}`,
        `Option C for question ${i + 1}`,
        `Option D for question ${i + 1}`
      ],
      correct_answer: `Option ${String.fromCharCode(65 + correctIndex)} for question ${i + 1}`, // Store correct answer
      difficulty: ["easy", "medium", "hard"][i % 3],
      marks: i % 3 === 2 ? 3 : i % 3 === 1 ? 2 : 1
    });
  }
  return questions;
}
