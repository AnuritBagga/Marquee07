import { useState, useRef, useEffect } from "react";
import axios from "axios";

/**
 * AI Chatbot for Exam Creation
 * Powered by Groq + LangChain
 */
export default function AIChatbot({ organizationId, onExamCreated }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your AI assistant for creating exams. I can help you:\n\n• Generate questions from syllabus\n• Create question banks\n• Design complete exams\n• Configure marking schemes\n\nWhat would you like to create today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/organization/chat`,
        {
          message: input,
          conversation_id: conversationId,
          organization_id: organizationId
        }
      );

      if (response.data.success) {
        const aiMessage = {
          role: "assistant",
          content: response.data.message,
          timestamp: new Date().toISOString(),
          intent: response.data.extracted_intent
        };

        setMessages(prev => [...prev, aiMessage]);
        setConversationId(response.data.conversation_id);

        // If AI detected ready-to-create intent
        if (response.data.extracted_intent?.ready_to_create) {
          // Show confirmation button
          console.log("Ready to create exam:", response.data.extracted_intent);
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        role: "assistant",
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-[#D4AF37]/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold">AI Exam Creator</h3>
            <p className="text-xs text-white/40">Powered by Groq + LangChain</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                msg.role === "user"
                  ? "bg-[#D4AF37]/20 text-white border border-[#D4AF37]/30"
                  : msg.error
                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                  : "bg-white/5 text-white/80 border border-white/10"
              }`}
            >
              {/* Message content */}
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>

              {/* Intent detection badge */}
              {msg.intent?.ready_to_create && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="text-xs text-[#D4AF37] mb-2">✓ Ready to create exam</div>
                  <button
                    onClick={() => onExamCreated?.(msg.intent)}
                    className="bg-[#D4AF37] text-black text-xs px-3 py-1.5 rounded hover:bg-[#D4AF37]/90 transition-colors font-semibold"
                  >
                    Create Exam Now →
                  </button>
                </div>
              )}

              {/* Timestamp */}
              <p className="text-[10px] text-white/30 mt-2">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
              <span className="text-xs text-white/40">AI is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-[#0A0A0A]">
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message... (Shift+Enter for new line)"
            disabled={isLoading}
            rows={2}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm resize-none focus:outline-none focus:border-[#D4AF37]/50 disabled:opacity-50 placeholder-white/30"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-6 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Send
          </button>
        </div>

        {/* Quick suggestions */}
        <div className="flex gap-2 mt-3 flex-wrap">
          <button
            onClick={() => setInput("Create a placement drive exam for software engineers")}
            className="text-xs bg-white/5 hover:bg-white/10 text-white/60 px-3 py-1.5 rounded-full border border-white/10 transition-colors"
          >
            Placement Drive
          </button>
          <button
            onClick={() => setInput("Generate 20 DSA questions on arrays and strings")}
            className="text-xs bg-white/5 hover:bg-white/10 text-white/60 px-3 py-1.5 rounded-full border border-white/10 transition-colors"
          >
            DSA Questions
          </button>
          <button
            onClick={() => setInput("Create an aptitude test with 30 questions")}
            className="text-xs bg-white/5 hover:bg-white/10 text-white/60 px-3 py-1.5 rounded-full border border-white/10 transition-colors"
          >
            Aptitude Test
          </button>
        </div>
      </div>
    </div>
  );
}
