import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * QuestionBankDetails - View and edit questions in a bank
 */
export default function QuestionBankDetails({ organizationId }) {
  const { bankId } = useParams();
  const navigate = useNavigate();
  const [bank, setBank] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchBankDetails();
    fetchQuestions();
  }, [bankId]);

  const fetchBankDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/organization/question-bank/${bankId}`
      );
      if (response.data.success) {
        setBank(response.data.bank);
      }
    } catch (error) {
      console.error("Error fetching bank:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/organization/question-bank/${bankId}/questions`
      );
      if (response.data.success) {
        setQuestions(response.data.questions);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!confirm("Delete this question?")) return;

    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/organization/question/${questionId}`
      );
      if (response.data.success) {
        setQuestions(questions.filter(q => q.id !== questionId));
        alert("✓ Question deleted");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Error deleting question");
    }
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: "text-green-400 bg-green-500/20",
      medium: "text-yellow-400 bg-yellow-500/20",
      hard: "text-red-400 bg-red-500/20"
    };
    return colors[difficulty] || colors.medium;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!bank) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60">Question bank not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate("/organization/question-banks")}
          className="text-white/60 hover:text-white mb-4 flex items-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Question Banks
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">{bank.name}</h1>
            <p className="text-white/60 mt-1">{bank.subject} • {questions.length} questions</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#D4AF37] text-black px-6 py-3 rounded-lg hover:bg-[#D4AF37]/90 transition-colors font-semibold flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Question
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-sm mb-1">Total Questions</p>
          <p className="text-3xl font-bold text-white">{questions.length}</p>
        </div>
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-sm mb-1">Easy</p>
          <p className="text-3xl font-bold text-green-400">
            {questions.filter(q => q.difficulty === "easy").length}
          </p>
        </div>
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-sm mb-1">Medium</p>
          <p className="text-3xl font-bold text-yellow-400">
            {questions.filter(q => q.difficulty === "medium").length}
          </p>
        </div>
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4">
          <p className="text-white/40 text-sm mb-1">Hard</p>
          <p className="text-3xl font-bold text-red-400">
            {questions.filter(q => q.difficulty === "hard").length}
          </p>
        </div>
      </div>

      {/* Questions List */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">Questions</h3>
        {questions.length > 0 ? (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="bg-white/5 rounded-lg p-5 border border-white/10 hover:border-white/20 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-[#D4AF37] rounded-lg flex items-center justify-center font-bold text-black flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    {/* Question Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-white font-medium text-lg mb-2">{question.question_text}</p>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(question.difficulty)}`}>
                            {question.difficulty}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400">
                            {question.question_type}
                          </span>
                          <span className="text-white/40 text-xs">
                            {question.marks} mark{question.marks !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingQuestion(question)}
                          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Options */}
                    {question.question_type === "mcq" && question.options && (
                      <div className="space-y-2">
                        {question.options.map((option, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-lg flex items-center gap-3 ${
                              option === question.correct_answer
                                ? "bg-green-500/10 border border-green-500/30"
                                : "bg-white/5"
                            }`}
                          >
                            <span className="text-white/60 font-mono text-sm">
                              {String.fromCharCode(65 + idx)}.
                            </span>
                            <span className={option === question.correct_answer ? "text-green-400" : "text-white/80"}>
                              {option}
                            </span>
                            {option === question.correct_answer && (
                              <span className="ml-auto text-green-400 text-xs font-semibold">✓ Correct</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Coding Question */}
                    {question.question_type === "coding" && (
                      <div className="mt-3 bg-black/50 rounded-lg p-3">
                        <p className="text-white/40 text-xs mb-2">Expected Output:</p>
                        <pre className="text-[#D4AF37] text-sm font-mono">{question.correct_answer}</pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">❓</div>
            <p className="text-white/60">No questions in this bank yet</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 bg-[#D4AF37] text-black px-6 py-3 rounded-lg hover:bg-[#D4AF37]/90 transition-colors font-semibold"
            >
              Add Your First Question
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal Placeholder */}
      {(showAddModal || editingQuestion) && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingQuestion ? "Edit Question" : "Add Question"}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingQuestion(null);
                }}
                className="text-white/60 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-white/60 text-center py-8">
              Question editor form coming next...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
