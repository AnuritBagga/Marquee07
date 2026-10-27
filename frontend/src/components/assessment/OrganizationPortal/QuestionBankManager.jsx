import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * Question Bank Manager
 * Upload CSV, Excel, PDF, Word files or create questions manually
 */
export default function QuestionBankManager({ organizationId }) {
  const navigate = useNavigate();
  const [questionBanks, setQuestionBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadSubject, setUploadSubject] = useState("");

  useEffect(() => {
    fetchQuestionBanks();
  }, [organizationId]);

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
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!uploadFile || !uploadSubject) {
      alert("Please select a file and enter subject");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("organization_id", organizationId);
      formData.append("subject", uploadSubject);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/organization/question-bank/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (response.data.success) {
        alert(`✓ Successfully uploaded ${response.data.questions_count} questions!`);
        setShowUploadModal(false);
        setUploadFile(null);
        setUploadSubject("");
        fetchQuestionBanks();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please check format and try again.");
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (filename) => {
    if (!filename) return null;
    
    if (filename.endsWith('.pdf')) {
      return (
        <svg className="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
        </svg>
      );
    } else if (filename.endsWith('.docx') || filename.endsWith('.doc')) {
      return (
        <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
        </svg>
      );
    } else if (filename.endsWith('.csv')) {
      return (
        <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
        </svg>
      );
    } else if (filename.endsWith('.xlsx') || filename.endsWith('.xls')) {
      return (
        <svg className="w-8 h-8 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
        </svg>
      );
    }
    
    return (
      <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white/40 text-sm">Loading question banks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Question Banks</h1>
          <p className="text-white/60">Manage your question collections</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Questions
          </button>
          <button
            onClick={() => navigate('/organization/questions/create')}
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors border border-white/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Manually
          </button>
        </div>
      </div>

      {/* Supported Formats Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-white font-semibold mb-1">Supported File Formats</h3>
            <p className="text-white/60 text-sm">
              📄 <strong>CSV/Excel</strong> - Structured format (direct import)<br />
              📕 <strong>PDF</strong> - AI extracts questions automatically<br />
              📘 <strong>Word (DOCX)</strong> - AI extracts questions automatically<br />
              <span className="text-white/40 text-xs mt-1 block">Our AI will intelligently extract and format questions from PDF/Word files</span>
            </p>
          </div>
        </div>
      </div>

      {/* Question Banks Grid */}
      {questionBanks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {questionBanks.map((bank) => (
            <div
              key={bank.id}
              onClick={() => navigate(`/organization/question-bank/${bank.id}`)}
              className="bg-[#0A0A0A] border border-white/10 hover:border-[#D4AF37]/50 rounded-xl p-6 cursor-pointer transition-all hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  bank.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                  bank.difficulty === 'hard' ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {bank.difficulty}
                </span>
              </div>

              <h3 className="text-white font-semibold mb-2 line-clamp-2">{bank.name}</h3>
              <p className="text-white/40 text-sm mb-4 line-clamp-2">{bank.description || "No description"}</p>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div>
                  <p className="text-white/60 text-xs">Questions</p>
                  <p className="text-white font-semibold text-lg">{bank.total_questions}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs">Subject</p>
                  <p className="text-white font-semibold">{bank.subject}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-white text-lg font-semibold mb-2">No Question Banks Yet</h3>
          <p className="text-white/40 mb-6">Upload or create your first question bank to get started</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Questions
          </button>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-xl max-w-2xl w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Upload Question Bank</h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadFile(null);
                }}
                className="text-white/40 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Subject Input */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Subject <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={uploadSubject}
                  onChange={(e) => setUploadSubject(e.target.value)}
                  placeholder="e.g., Data Structures, Aptitude, SQL"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Upload File <span className="text-red-400">*</span>
                </label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-[#D4AF37]/50 transition-colors">
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls,.pdf,.docx,.doc"
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {uploadFile ? (
                      <div className="flex flex-col items-center">
                        {getFileIcon(uploadFile.name)}
                        <p className="text-white mt-3 font-medium">{uploadFile.name}</p>
                        <p className="text-white/40 text-sm mt-1">
                          {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setUploadFile(null);
                          }}
                          className="mt-3 text-red-400 text-sm hover:underline"
                        >
                          Remove file
                        </button>
                      </div>
                    ) : (
                      <div>
                        <svg className="w-12 h-12 mx-auto text-white/30 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-white mb-2">
                          <span className="text-[#D4AF37] font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-white/40 text-sm">
                          CSV, Excel, PDF, or Word files (Max 10MB)
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* File Format Guide */}
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2 text-sm">📋 CSV/Excel Format:</h4>
                <p className="text-white/60 text-xs font-mono mb-2">
                  question_type, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, marks, explanation
                </p>
                <h4 className="text-white font-medium mb-2 text-sm mt-3">🤖 PDF/Word Format:</h4>
                <p className="text-white/60 text-xs">
                  Just paste your questions in any format. AI will automatically extract and structure them!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleFileUpload}
                  disabled={!uploadFile || !uploadSubject || uploading}
                  className="flex-1 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Upload & Process
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadFile(null);
                  }}
                  disabled={uploading}
                  className="px-6 py-3 rounded-lg font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
