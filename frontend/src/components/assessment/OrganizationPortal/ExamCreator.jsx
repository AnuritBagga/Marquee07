import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * Exam Creator Wizard - Step by step exam creation
 */
export default function ExamCreator({ organizationId }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [questionBanks, setQuestionBanks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form data
  const [examData, setExamData] = useState({
    title: "",
    description: "",
    exam_type: "placement",
    duration_minutes: 120,
    question_bank_ids: [],
    start_time: "",
    end_time: "",
    proctoring_enabled: true,
    face_detection: true,
    tab_switch_allowed: 0,
    mobile_detection: true,
    shuffle_questions: true,
    shuffle_options: true,
    negative_marking: false,
    show_results_immediately: false,
    offline_mode_enabled: true
  });

  useEffect(() => {
    fetchQuestionBanks();
  }, []);

  const fetchQuestionBanks = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/organization/question-banks/${organizationId}`
      );
      if (response.data.success) {
        setQuestionBanks(response.data.question_banks);
      }
    } catch (error) {
      console.error("Error fetching question banks:", error);
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/organization/exam/create`,
        {
          ...examData,
          organization_id: organizationId
        }
      );

      if (response.data.success) {
        alert(`✓ Exam created successfully!\n\nExam Code: ${response.data.exam_code}\n\nShare this code with students.`);
        navigate(`/organization/exam/${response.data.exam_id}`);
      }
    } catch (error) {
      console.error("Error creating exam:", error);
      alert("Error creating exam. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Basic Info", icon: "📝" },
    { number: 2, title: "Questions", icon: "❓" },
    { number: 3, title: "Settings", icon: "⚙️" },
    { number: 4, title: "Review", icon: "✓" }
  ];

  const totalQuestions = questionBanks
    .filter(bank => examData.question_bank_ids.includes(bank.id))
    .reduce((sum, bank) => sum + bank.total_questions, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-2 transition-all ${
                    currentStep === step.number
                      ? "bg-[#D4AF37] text-black scale-110"
                      : currentStep > step.number
                      ? "bg-green-500/20 text-green-400"
                      : "bg-white/10 text-white/40"
                  }`}
                >
                  {currentStep > step.number ? "✓" : step.icon}
                </div>
                <p
                  className={`text-sm font-medium ${
                    currentStep === step.number ? "text-[#D4AF37]" : "text-white/40"
                  }`}
                >
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-4 ${
                    currentStep > step.number ? "bg-[#D4AF37]" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-8">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Exam Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={examData.title}
                onChange={(e) => setExamData({ ...examData, title: e.target.value })}
                placeholder="e.g., Software Engineer Placement Drive 2024"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={examData.description}
                onChange={(e) => setExamData({ ...examData, description: e.target.value })}
                placeholder="Brief description of the exam"
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Exam Type
                </label>
                <select
                  value={examData.exam_type}
                  onChange={(e) => setExamData({ ...examData, exam_type: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50"
                >
                  <option value="placement">Placement Drive</option>
                  <option value="practice">Practice Test</option>
                  <option value="mock">Mock Exam</option>
                  <option value="contest">Contest</option>
                </select>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={examData.duration_minutes}
                  onChange={(e) => setExamData({ ...examData, duration_minutes: parseInt(e.target.value) })}
                  min="15"
                  max="300"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={examData.start_time}
                  onChange={(e) => setExamData({ ...examData, start_time: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={examData.end_time}
                  onChange={(e) => setExamData({ ...examData, end_time: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Select Questions */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Select Question Banks</h2>
              <p className="text-white/60">Choose question banks to include in this exam</p>
            </div>

            {questionBanks.length > 0 ? (
              <div className="space-y-3">
                {questionBanks.map((bank) => (
                  <div
                    key={bank.id}
                    onClick={() => {
                      const isSelected = examData.question_bank_ids.includes(bank.id);
                      setExamData({
                        ...examData,
                        question_bank_ids: isSelected
                          ? examData.question_bank_ids.filter(id => id !== bank.id)
                          : [...examData.question_bank_ids, bank.id]
                      });
                    }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      examData.question_bank_ids.includes(bank.id)
                        ? "border-[#D4AF37] bg-[#D4AF37]/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                            examData.question_bank_ids.includes(bank.id)
                              ? "border-[#D4AF37] bg-[#D4AF37]"
                              : "border-white/30"
                          }`}
                        >
                          {examData.question_bank_ids.includes(bank.id) && (
                            <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{bank.name}</h3>
                          <p className="text-white/40 text-sm">{bank.subject}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">{bank.total_questions}</p>
                        <p className="text-white/40 text-xs">questions</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-white/40 mb-4">No question banks available</p>
                <button
                  onClick={() => navigate('/organization/question-banks')}
                  className="bg-[#D4AF37] text-black px-6 py-2 rounded-lg hover:bg-[#D4AF37]/90 transition-colors font-semibold"
                >
                  Create Question Bank
                </button>
              </div>
            )}

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-400 font-semibold">
                Total Questions: {totalQuestions}
              </p>
              <p className="text-white/60 text-sm mt-1">
                Selected {examData.question_bank_ids.length} question bank(s)
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Settings */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Exam Settings</h2>

            {/* Proctoring Settings */}
            <div className="bg-white/5 rounded-lg p-6 space-y-4">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                AI Proctoring
              </h3>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-white/80">Enable Proctoring</span>
                <input
                  type="checkbox"
                  checked={examData.proctoring_enabled}
                  onChange={(e) => setExamData({ ...examData, proctoring_enabled: e.target.checked })}
                  className="w-12 h-6 rounded-full appearance-none bg-white/10 checked:bg-[#D4AF37] relative cursor-pointer transition-colors"
                />
              </label>

              {examData.proctoring_enabled && (
                <>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-white/80">Face Detection</span>
                    <input
                      type="checkbox"
                      checked={examData.face_detection}
                      onChange={(e) => setExamData({ ...examData, face_detection: e.target.checked })}
                      className="w-12 h-6 rounded-full appearance-none bg-white/10 checked:bg-[#D4AF37] relative cursor-pointer transition-colors"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-white/80">Mobile Device Detection</span>
                    <input
                      type="checkbox"
                      checked={examData.mobile_detection}
                      onChange={(e) => setExamData({ ...examData, mobile_detection: e.target.checked })}
                      className="w-12 h-6 rounded-full appearance-none bg-white/10 checked:bg-[#D4AF37] relative cursor-pointer transition-colors"
                    />
                  </label>

                  <div>
                    <label className="block text-white/80 text-sm mb-2">
                      Tab Switches Allowed
                    </label>
                    <input
                      type="number"
                      value={examData.tab_switch_allowed}
                      onChange={(e) => setExamData({ ...examData, tab_switch_allowed: parseInt(e.target.value) })}
                      min="0"
                      max="10"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                    />
                    <p className="text-white/40 text-xs mt-1">0 = Auto-submit if tab is switched</p>
                  </div>
                </>
              )}
            </div>

            {/* Exam Behavior */}
            <div className="bg-white/5 rounded-lg p-6 space-y-4">
              <h3 className="text-white font-semibold mb-4">Exam Behavior</h3>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-white/80">Shuffle Questions</span>
                <input
                  type="checkbox"
                  checked={examData.shuffle_questions}
                  onChange={(e) => setExamData({ ...examData, shuffle_questions: e.target.checked })}
                  className="w-12 h-6 rounded-full appearance-none bg-white/10 checked:bg-[#D4AF37] relative cursor-pointer transition-colors"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-white/80">Shuffle Options</span>
                <input
                  type="checkbox"
                  checked={examData.shuffle_options}
                  onChange={(e) => setExamData({ ...examData, shuffle_options: e.target.checked })}
                  className="w-12 h-6 rounded-full appearance-none bg-white/10 checked:bg-[#D4AF37] relative cursor-pointer transition-colors"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-white/80">Negative Marking</span>
                <input
                  type="checkbox"
                  checked={examData.negative_marking}
                  onChange={(e) => setExamData({ ...examData, negative_marking: e.target.checked })}
                  className="w-12 h-6 rounded-full appearance-none bg-white/10 checked:bg-[#D4AF37] relative cursor-pointer transition-colors"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-white/80">Show Results Immediately</span>
                <input
                  type="checkbox"
                  checked={examData.show_results_immediately}
                  onChange={(e) => setExamData({ ...examData, show_results_immediately: e.target.checked })}
                  className="w-12 h-6 rounded-full appearance-none bg-white/10 checked:bg-[#D4AF37] relative cursor-pointer transition-colors"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-white/80">Offline Mode Enabled</span>
                <input
                  type="checkbox"
                  checked={examData.offline_mode_enabled}
                  onChange={(e) => setExamData({ ...examData, offline_mode_enabled: e.target.checked })}
                  className="w-12 h-6 rounded-full appearance-none bg-white/10 checked:bg-[#D4AF37] relative cursor-pointer transition-colors"
                />
              </label>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Review & Create</h2>

            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-[#D4AF37] font-semibold mb-3">Basic Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-white/40">Title:</span> <span className="text-white">{examData.title}</span></p>
                  <p><span className="text-white/40">Type:</span> <span className="text-white capitalize">{examData.exam_type}</span></p>
                  <p><span className="text-white/40">Duration:</span> <span className="text-white">{examData.duration_minutes} minutes</span></p>
                  <p><span className="text-white/40">Start:</span> <span className="text-white">{new Date(examData.start_time).toLocaleString()}</span></p>
                  <p><span className="text-white/40">End:</span> <span className="text-white">{new Date(examData.end_time).toLocaleString()}</span></p>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-[#D4AF37] font-semibold mb-3">Questions</h3>
                <p className="text-white">Total Questions: <strong>{totalQuestions}</strong></p>
                <p className="text-white/60 text-sm mt-2">
                  From {examData.question_bank_ids.length} question bank(s)
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-[#D4AF37] font-semibold mb-3">Settings</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    {examData.proctoring_enabled ? "✓" : "✗"}
                    <span className="text-white/80">Proctoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {examData.face_detection ? "✓" : "✗"}
                    <span className="text-white/80">Face Detection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {examData.shuffle_questions ? "✓" : "✗"}
                    <span className="text-white/80">Shuffle Questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {examData.negative_marking ? "✓" : "✗"}
                    <span className="text-white/80">Negative Marking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {examData.offline_mode_enabled ? "✓" : "✗"}
                    <span className="text-white/80">Offline Mode</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Back
        </button>

        {currentStep < 4 ? (
          <button
            onClick={handleNext}
            disabled={
              (currentStep === 1 && !examData.title) ||
              (currentStep === 2 && examData.question_bank_ids.length === 0)
            }
            className="px-6 py-3 rounded-lg bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 rounded-lg bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Create Exam
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
