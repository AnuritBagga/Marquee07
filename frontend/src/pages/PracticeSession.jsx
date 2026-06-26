import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import usePracticeInterview, {
  TOTAL_QUESTIONS,
  getQuestionSchedule,
} from "../hooks/usePracticeInterview";
import WaveformBar from "../components/practice/WaveformBar";
import PracticeScorecard from "../components/practice/PracticeScorecard";
import { INTERVIEWERS, getInterviewType } from "../data/practiceConfig";
import Lion from "../components/brand/Lion";
import lionLogo from "../assets/brand/lion-mascot-lg.png";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (s) => {
  const m = Math.floor(s / 60), sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

const CODING_QS  = new Set([9, 10]);
const SQL_QS     = new Set([11]);
const CODING_ALL = new Set([9, 10, 11]);

const Q_TYPE_LABEL = {
  introduction:   "Introduction",
  intro_followup: "Follow-up",
  resume_deep:    "Resume Deep-Dive",
  cross_question: "Cross Question",
  dsa:            "Data Structures & Algorithms",
  sql:            "SQL Challenge",
};

// ─── Judge0 via backend proxy (kills CORS) ────────────────────────────────────
async function runOnJudge0(language, code, stdin = "") {
  try {
    const resp = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/practice/judge0`,
      {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ language, code, stdin }),
      }
    );
    if (!resp.ok) {
      console.error("Judge0 proxy non-OK:", resp.status, await resp.text().catch(() => ""));
      return null;
    }
    return await resp.json();
  } catch (e) {
    console.error("Judge0 proxy error:", e);
    return null;
  }
}

// ─── Starter templates ────────────────────────────────────────────────────────
const STARTERS = {
  javascript: `// Read input from stdin, print to stdout
const lines = require('fs').readFileSync(0, 'utf8').trim().split('\\n');
// Your solution here:
console.log(lines[0]);`,
  python: `# Read input from stdin, print to stdout
n = input().strip()
# Your solution here:
print(n)`,
  java: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String n = sc.nextLine();
        // Your solution here:
        System.out.println(n);
    }
}`,
  cpp: `#include <bits/stdc++.h>
using namespace std;
int main() {
    string n; getline(cin, n);
    // Your solution here:
    cout << n << endl;
    return 0;
}`,
  sql: `-- Write your SQL query below
SELECT *
FROM table_name
WHERE condition
ORDER BY column_name;`,
};

// ─── LeetCode-style Editor ────────────────────────────────────────────────────
function LeetCodeEditor({ problem, isSql, onAIEval, evalResult, timeLeft }) {
  const [lang,      setLang]      = useState(isSql ? "sql" : "python");
  const [code,      setCode]      = useState(isSql ? STARTERS.sql : STARTERS.python);
  const [running,   setRunning]   = useState(false);
  const [output,    setOutput]    = useState(null);
  const [aiRunning, setAiRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const textareaRef = useRef(null);

  // Load starter when problem provides one
  useEffect(() => {
    if (!problem) return;
    const starterMap = {
      python:     problem.starterPython,
      java:       problem.starterJava,
      cpp:        problem.starterCpp,
      javascript: problem.starterJS,
      sql:        problem.starterSQL,
    };
    if (starterMap[lang]) setCode(starterMap[lang]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem]);

  const handleLangChange = (l) => {
    setLang(l);
    const starterMap = {
      python:     problem?.starterPython,
      java:       problem?.starterJava,
      cpp:        problem?.starterCpp,
      javascript: problem?.starterJS,
    };
    setCode(starterMap[l] || STARTERS[l] || "");
    setOutput(null);
  };

  const handleRun = async () => {
    if (isSql) {
      setAiRunning(true);
      setActiveTab("results");
      await onAIEval(lang, code);
      setAiRunning(false);
      return;
    }
    setRunning(true);
    setActiveTab("results");
    setOutput(null);

    const result = await runOnJudge0(lang, code);
    setOutput(result);

    if (result) {
      setAiRunning(true);
      await onAIEval(lang, code, result);
      setAiRunning(false);
    }
    setRunning(false);
  };

  const urgentTimer   = timeLeft <= 60;
  const criticalTimer = timeLeft <= 30;

  const statusLabel = (status) => {
    if (!status) return null;
    const id = status?.id;
    if (id === 3) return { text: "Accepted",          color: "text-green-400",  bg: "bg-green-500/10 border-green-500/20" };
    if (id === 4) return { text: "Wrong Answer",      color: "text-red-400",    bg: "bg-red-500/10 border-red-500/20"   };
    if (id === 5) return { text: "Time Limit",        color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" };
    if (id === 6) return { text: "Compilation Error", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" };
    if (id >= 7)  return { text: "Runtime Error",     color: "text-red-400",    bg: "bg-red-500/10 border-red-500/20"   };
    return { text: status?.description || "Running", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" };
  };
  const st = statusLabel(output?.status);

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden" style={{ background: "#1e1e1e" }}>
      {/* Topbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-white/8 shrink-0">
        <div className="flex items-center gap-2">
          {!isSql ? (
            <div className="flex items-center bg-[#3a3a3a] rounded-md overflow-hidden">
              {["javascript","python","java","cpp"].map((l) => (
                <button key={l} onClick={() => handleLangChange(l)}
                  className={`text-[11px] px-2.5 py-1 transition-colors ${
                    lang === l ? "bg-[#D4AF37] text-black font-bold" : "text-white/40 hover:text-white/70"
                  }`}>
                  {l === "javascript" ? "JS" : l === "cpp" ? "C++" : l[0].toUpperCase() + l.slice(1)}
                </button>
              ))}
            </div>
          ) : (
            <span className="text-[11px] bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-md border border-blue-500/30 font-semibold">
              SQL
            </span>
          )}
          <span className="text-[10px] text-white/20 ml-1">
            {isSql ? "AI Evaluated" : "Executed via Judge0"}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className={`font-mono text-[13px] px-3 py-1 rounded-md border flex items-center gap-1.5 transition-colors ${
            criticalTimer ? "border-red-500/50 bg-red-500/12 text-red-400 animate-pulse" :
            urgentTimer   ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-300" :
                            "border-white/12 bg-white/5 text-white/50"
          }`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="2"/>
              <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {fmt(timeLeft)}
          </div>

          <button onClick={handleRun} disabled={running || aiRunning}
            className="flex items-center gap-1.5 bg-[#2cbb5d] hover:bg-[#34d367] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-1.5 rounded-md transition-colors">
            {running ? (
              <><svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>Running…</>
            ) : (
              <><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5 3.5l9 4.5-9 4.5V3.5z"/>
              </svg>Run Code</>
            )}
          </button>
        </div>
      </div>

      {/* Split */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left panel */}
        <div className="w-[360px] shrink-0 flex flex-col border-r border-white/8 bg-[#141414]">
          <div className="flex border-b border-white/8 shrink-0 bg-[#1a1a1a]">
            {["description","results"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 text-[11px] tracking-wider uppercase border-b-2 transition-colors ${
                  activeTab === tab ? "border-[#D4AF37] text-[#D4AF37]" : "border-transparent text-white/30 hover:text-white/50"
                }`}>
                {tab}
                {tab === "results" && output && (
                  <span className={`ml-1.5 text-[9px] px-1.5 rounded ${st?.color || "text-white/40"}`}>
                    {output?.status?.description || "…"}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === "description" && problem && (
              <div>
                <h2 className="font-semibold text-white text-[15px] mb-1 leading-snug">{problem.title}</h2>
                {problem.difficulty && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mb-3 inline-block ${
                    problem.difficulty === "Easy"   ? "bg-green-500/15 text-green-400" :
                    problem.difficulty === "Medium" ? "bg-yellow-500/15 text-yellow-400" :
                                                      "bg-red-500/15 text-red-400"
                  }`}>{problem.difficulty}</span>
                )}
                <p className="text-white/65 text-[13px] leading-relaxed mt-2 mb-4 whitespace-pre-wrap">{problem.description}</p>

                {problem.examples?.length > 0 && (
                  <>
                    <div className="text-[10px] tracking-widest uppercase text-white/20 mb-2 mt-4">Examples</div>
                    {problem.examples.map((ex, i) => {
                      const exText = typeof ex === "string" ? ex : `Input: ${ex.input}\nOutput: ${ex.output}${ex.explanation ? "\n" + ex.explanation : ""}`;
                      return (
                        <div key={i} className="mb-3 bg-[#222] rounded-md p-3 font-mono text-[12px] border border-white/5 whitespace-pre-wrap text-white/70">
                          {exText}
                        </div>
                      );
                    })}
                  </>
                )}

                {problem.testCases?.length > 0 && (
                  <>
                    <div className="text-[10px] tracking-widest uppercase text-white/20 mb-2 mt-4">Test Cases</div>
                    {problem.testCases.map((tc, i) => (
                      <div key={i} className="mb-2 bg-[#222] rounded-md p-2.5 font-mono text-[11px] border border-white/5">
                        <div className="text-white/35">Input: <span className="text-white/65">{tc.input}</span></div>
                        <div className="text-white/35">Expected: <span className="text-white/65">{tc.expected}</span></div>
                      </div>
                    ))}
                  </>
                )}

                {problem.constraints?.length > 0 && (
                  <>
                    <div className="text-[10px] tracking-widest uppercase text-white/20 mb-2 mt-4">Constraints</div>
                    <ul className="space-y-1">
                      {problem.constraints.map((c, i) => (
                        <li key={i} className="text-white/40 text-[12px] font-mono flex items-start gap-2">
                          <span className="text-[#D4AF37]/60 mt-0.5 shrink-0">•</span>{c}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}

            {activeTab === "results" && (
              <div className="space-y-3">
                {(running || aiRunning) && (
                  <div className="flex items-center gap-2.5 text-white/40 text-[12px] py-6">
                    <svg className="w-4 h-4 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    {running ? "Executing on Judge0…" : "AI is reviewing your solution…"}
                  </div>
                )}

                {!running && output && (
                  <div className={`rounded-md p-3 border text-[12px] ${st?.bg || "border-white/10 bg-white/4"}`}>
                    <div className={`font-bold text-[13px] mb-2 ${st?.color || "text-white/50"}`}>
                      {st?.text || output.status?.description}
                    </div>
                    {output.compile_output && (
                      <div className="mb-2">
                        <div className="text-white/30 text-[10px] uppercase tracking-widest mb-1">Compile Error</div>
                        <pre className="text-orange-400/80 text-[11px] font-mono whitespace-pre-wrap bg-black/30 p-2 rounded">{output.compile_output}</pre>
                      </div>
                    )}
                    {output.stdout && (
                      <div className="mb-2">
                        <div className="text-white/30 text-[10px] uppercase tracking-widest mb-1">Output</div>
                        <pre className="text-green-400/80 text-[11px] font-mono whitespace-pre-wrap bg-black/30 p-2 rounded">{output.stdout}</pre>
                      </div>
                    )}
                    {output.stderr && !output.compile_output && (
                      <div className="mb-2">
                        <div className="text-white/30 text-[10px] uppercase tracking-widest mb-1">Stderr</div>
                        <pre className="text-red-400/70 text-[11px] font-mono whitespace-pre-wrap bg-black/30 p-2 rounded">{output.stderr}</pre>
                      </div>
                    )}
                    <div className="flex gap-4 mt-2 text-[10px] text-white/25">
                      {output.time   && <span>⏱ {output.time}s</span>}
                      {output.memory && <span>🧠 {Math.round(output.memory / 1024)}MB</span>}
                    </div>
                  </div>
                )}

                {/* AI test case results */}
                {!aiRunning && Array.isArray(evalResult) && evalResult.length > 0 && (
                  <div className="mt-3 border border-[#D4AF37]/15 bg-[#D4AF37]/4 rounded-md p-3">
                    <div className="text-[10px] tracking-widest uppercase text-[#D4AF37] mb-2">
                      ✦ Test Case Results
                    </div>
                    <div className="space-y-2">
                      {evalResult.map((r, i) => (
                        <div key={i} className={`rounded p-2.5 border text-[11px] ${
                          r.passed ? "border-green-500/20 bg-green-500/5" : "border-red-500/20 bg-red-500/5"
                        }`}>
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className={r.passed ? "text-green-400 font-semibold" : "text-red-400 font-semibold"}>
                              {r.passed ? "✓ Pass" : "✗ Fail"}
                            </span>
                            <span className="text-white/25">Case {i + 1}</span>
                          </div>
                          <div className="font-mono space-y-0.5 text-[11px]">
                            <div><span className="text-white/30">Input: </span><span className="text-white/60">{String(r.input)}</span></div>
                            <div><span className="text-white/30">Expected: </span><span className="text-white/60">{String(r.expected)}</span></div>
                            <div><span className="text-white/30">Got: </span><span className={r.passed ? "text-green-400/80" : "text-red-400/80"}>{String(r.output)}</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!running && !aiRunning && !output && (!evalResult || (Array.isArray(evalResult) && evalResult.length === 0)) && (
                  <p className="text-white/20 text-[12px] py-4">Click <strong>Run Code</strong> to execute your solution.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: editor */}
        <div className="flex-1 flex flex-col min-w-0 relative" style={{ background: "#1e1e1e" }}>
          <div className="flex flex-1 min-h-0 overflow-hidden font-mono text-[13px] leading-[1.65]">
            <div className="shrink-0 w-10 bg-[#1e1e1e] border-r border-white/5 pt-4 pb-4 overflow-hidden select-none" aria-hidden="true" style={{ minHeight: "100%" }}>
              {code.split("\n").map((_, i) => (
                <div key={i} className="text-right pr-2.5 text-white/18 text-[12px]" style={{ lineHeight: "1.65" }}>{i + 1}</div>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
              className="flex-1 bg-transparent text-[#d4d4d4] resize-none outline-none p-4 pl-3"
              style={{
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
                lineHeight: "1.65",
                caretColor: "#D4AF37",
                tabSize: 2,
              }}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  const s = e.target.selectionStart, en = e.target.selectionEnd;
                  setCode(code.substring(0, s) + "  " + code.substring(en));
                  setTimeout(() => {
                    if (textareaRef.current) {
                      textareaRef.current.selectionStart = textareaRef.current.selectionEnd = s + 2;
                    }
                  }, 0);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PracticeSession ──────────────────────────────────────────────────────────
export default function PracticeSession() {
  const navigate = useNavigate();

  const config = (() => {
    try { return JSON.parse(sessionStorage.getItem("practiceConfig") || "{}"); }
    catch { return {}; }
  })();

  const {
    interviewType = "technical",
    resumeText    = "",
    skills        = [],
    candidateName = "the candidate",
  } = config;

  const typeConfig  = getInterviewType(interviewType);
  const interviewer = INTERVIEWERS[interviewType] || INTERVIEWERS.technical;
  const QUESTION_SCHEDULE = getQuestionSchedule(interviewType);

  const {
    phase, history, currentQuestion,
    dsaProblem, sqlProblem,
    amplitude, questionIndex, currentLimit,
    timerSeconds, score, error, codeResults,
    liveTranscript,
    start, end, stopRecording, submitTextAnswer, runCode,
  } = usePracticeInterview({ interviewType, resumeText, skills, candidateName });

  const [textAnswer,        setTextAnswer]        = useState("");
  const [codeEvalResult,    setCodeEvalResult]    = useState(null);
  const [displayedQuestion, setDisplayedQuestion] = useState("");
  const [typewriterDone,    setTypewriterDone]    = useState(false);
  const [answerTimeLeft,    setAnswerTimeLeft]    = useState(90);
  const [warned,            setWarned]            = useState(false);

  const transcriptRef   = useRef(null);
  const textRef         = useRef(null);
  const answerTimerRef  = useRef(null);
  const typewriterRef   = useRef(null);
  const textAnswerRef   = useRef("");
  const handleSubmitRef = useRef(null);
  const hasStartedRef   = useRef(false);

  useEffect(() => { textAnswerRef.current = textAnswer; }, [textAnswer]);

  useEffect(() => {
    if (!config.interviewType) { navigate("/practice"); return; }
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (transcriptRef.current) transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
  }, [history]);

  const handleSubmit = useCallback(() => {
    if (answerTimerRef.current) { clearInterval(answerTimerRef.current); answerTimerRef.current = null; }
    
    // For coding questions (Q9, Q10, Q11), just move to next question
    if (CODING_ALL.has(questionIndex)) {
      stopRecording();
      setTextAnswer("");
      textAnswerRef.current = "";
      submitTextAnswer("");  // Submit empty answer to proceed
      return;
    }
    
    // For verbal questions, get answer from text or speech
    const answer = textAnswerRef.current.trim() || liveTranscript.trim();
    stopRecording();
    setTextAnswer("");
    textAnswerRef.current = "";
    submitTextAnswer(answer || "");
  }, [submitTextAnswer, stopRecording, liveTranscript, questionIndex]);

  useEffect(() => { handleSubmitRef.current = handleSubmit; }, [handleSubmit]);

  useEffect(() => {
    if (phase === "listening") {
      setAnswerTimeLeft(currentLimit);
      answerTimerRef.current = setInterval(() => {
        setAnswerTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(answerTimerRef.current);
            answerTimerRef.current = null;
            handleSubmitRef.current();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (answerTimerRef.current) { clearInterval(answerTimerRef.current); answerTimerRef.current = null; }
      setAnswerTimeLeft(currentLimit);
    }
    return () => {
      if (answerTimerRef.current) { clearInterval(answerTimerRef.current); answerTimerRef.current = null; }
    };
  }, [phase, currentLimit]);

  useEffect(() => {
    if (phase !== "listening") {
      const safe = (typeof currentLimit === "number" && !isNaN(currentLimit)) ? currentLimit : 90;
      setAnswerTimeLeft(safe);
    }
  }, [currentLimit, phase]);

  useEffect(() => {
    if (!currentQuestion) return;
    if (typewriterRef.current) { clearInterval(typewriterRef.current); typewriterRef.current = null; }
    setTypewriterDone(false);
    setDisplayedQuestion("");
    // Reset compiler panel on each new question
    setCodeEvalResult(null);
    let i = 0;
    typewriterRef.current = setInterval(() => {
      i++;
      setDisplayedQuestion(currentQuestion.substring(0, i));
      if (i >= currentQuestion.length) {
        clearInterval(typewriterRef.current);
        typewriterRef.current = null;
        setTypewriterDone(true);
      }
    }, 16);
    return () => {
      if (typewriterRef.current) { clearInterval(typewriterRef.current); typewriterRef.current = null; }
    };
  }, [currentQuestion]);

  useEffect(() => {
    if (timerSeconds === 720 && !warned) {
      setWarned(true);
      if ("Notification" in window && Notification.permission === "granted")
        new Notification("Marquee", { body: "12 minutes elapsed — wrap up soon." });
    }
  }, [timerSeconds, warned]);

  // ── AI code eval — unwrap result.results so test cases render ────────────
  const handleAIEval = async (language, code, judge0Result) => {
    const result = await runCode(language, code, judge0Result);
    if (result) {
      setCodeEvalResult(result.results || result);
    }
    return result;
  };

  const isListening   = phase === "listening";
  const isSpeaking    = phase === "speaking";
  const isCodingQ     = CODING_ALL.has(questionIndex);
  const isSqlQ        = SQL_QS.has(questionIndex);
  const activeProblem = isSqlQ ? sqlProblem : (CODING_QS.has(questionIndex) ? dsaProblem : null);

  const qTypeBadge = QUESTION_SCHEDULE?.[questionIndex]?.type
    ? Q_TYPE_LABEL[QUESTION_SCHEDULE[questionIndex].type] || "" : "";

  const phaseLabel = {
    idle: "Initializing…", asking: "Composing question…",
    speaking: "Interviewer speaking", listening: "Your turn — answer now",
    transcribing: "Processing answer…", processing: "AI thinking…",
    ended: "Session complete", error: "Error",
  }[phase] || phase;

  const phaseDotColor = {
    asking: "bg-yellow-500 animate-pulse", speaking: "bg-[#D4AF37] animate-pulse",
    listening: "bg-red-500 animate-pulse", transcribing: "bg-blue-400 animate-pulse",
    processing: "bg-purple-400 animate-pulse", ended: "bg-green-500", error: "bg-red-600",
  }[phase] || "bg-white/20";

  const codingUrgent   = isCodingQ && answerTimeLeft <= 60;
  const codingCritical = isCodingQ && answerTimeLeft <= 30;
  const progressPct    = Math.min((questionIndex / TOTAL_QUESTIONS) * 100, 100);

  if (phase === "ended" || score) {
    return (
      <PracticeScorecard
        score={score}
        candidateName={candidateName}
        durationSeconds={timerSeconds}
        history={history}
        interviewType={interviewType}
        onRestart={() => navigate("/practice")}
      />
    );
  }

  return (
    <div className="h-screen bg-[#050505] text-white flex flex-col overflow-hidden">
      <header className="flex items-center justify-between px-6 py-3 border-b border-white/7 bg-[#050505]/95 backdrop-blur-md shrink-0 z-50">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
            title="Go to Home"
          >
            <Lion className="w-8 h-8 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <div className="font-serif text-lg tracking-widest text-[#D4AF37]">
              Marquee
              <span className="text-white/20 text-[10px] tracking-[0.3em] font-sans ml-2">LIVE SESSION</span>
            </div>
          </button>
          {qTypeBadge && (
            <span className={`text-[10px] tracking-widest px-2 py-0.5 border rounded-sm ${
              isSqlQ    ? "border-blue-500/30 bg-blue-500/10 text-blue-400" :
              isCodingQ ? "border-purple-500/30 bg-purple-500/10 text-purple-400" :
                          "border-white/10 bg-white/4 text-white/30"
            }`}>{qTypeBadge}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="font-mono text-sm text-[#D4AF37] border border-[#D4AF37]/20 bg-[#D4AF37]/8 px-3 py-1 rounded-sm">
            {fmt(timerSeconds)}
          </div>
          <button
            onClick={() => { 
              if (window.confirm("End the interview session and go back to home page?")) {
                window.speechSynthesis?.cancel();
                navigate("/");
              }
            }}
            className="border border-white/10 text-white/30 text-[10px] tracking-widest uppercase px-3 py-1.5 hover:border-white/20 hover:text-white/50 transition-all rounded-sm"
          >
            End Session
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <aside className="w-[236px] shrink-0 border-r border-white/7 bg-[#0A0A0A] flex flex-col">
          <div className="p-4 border-b border-white/7">
            <img src={interviewer.portrait} alt={interviewer.name} className="w-full h-32 object-cover object-top mb-3 grayscale-[15%]" />
            <div className="font-serif text-sm text-white">{interviewer.name}</div>
            <div className="text-[10px] text-white/30 tracking-wider mt-0.5">{interviewer.title}</div>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-white/7">
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${phaseDotColor}`} />
            <span className="text-[10px] tracking-widest uppercase text-white/35">{phaseLabel}</span>
          </div>

          <div ref={transcriptRef} className="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
            <div className="text-[9px] tracking-widest uppercase text-white/15 mb-1">Transcript</div>
            {history.map((t, i) => {
              const isAI = t.role === "assistant";
              return (
                <div key={i}>
                  <div className={`text-[9px] tracking-wider uppercase mb-0.5 ${isAI ? "text-[#D4AF37]" : "text-white/25"}`}>
                    {isAI ? "✦ Interviewer" : "▸ You"}
                  </div>
                  <div className={`text-[11px] leading-relaxed p-2 border-l-2 ${
                    isAI ? "text-white/60 border-[#D4AF37]/35 bg-[#D4AF37]/3" : "text-white/35 border-white/8"
                  }`}>
                    {t.content.length > 160 ? t.content.substring(0, 160) + "…" : t.content}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 border-t border-white/7 shrink-0">
            <div className="text-[9px] tracking-widest uppercase text-white/15 mb-2">Progress</div>
            <div className="flex gap-0.5 mb-1.5">
              {Array.from({ length: TOTAL_QUESTIONS }, (_, i) => {
                const qi = i + 1;
                const isDone    = qi < questionIndex;
                const isCurrent = qi === questionIndex;
                const isCode    = CODING_ALL.has(qi);
                return (
                  <div key={qi}
                    title={`Q${qi}: ${Q_TYPE_LABEL[QUESTION_SCHEDULE?.[qi]?.type] || ""}`}
                    className={`flex-1 h-1.5 rounded-sm transition-all duration-400 ${
                      isDone    ? "bg-[#D4AF37]" :
                      isCurrent ? (isCode ? "bg-purple-400 animate-pulse" : "bg-[#D4AF37]/60 animate-pulse") :
                                  (isCode ? "bg-purple-900/40" : "bg-white/8")
                    }`} />
                );
              })}
            </div>
            <div className="text-[9px] text-white/20 text-right">Q {questionIndex} of {TOTAL_QUESTIONS}</div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-h-0 min-w-0 relative">
          {/* Subtle lion logo watermark background */}
          <div 
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage: `url(${lionLogo})`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '40%',
              opacity: 0.02,
              mixBlendMode: 'luminosity',
            }}
          />
          
          <div className="px-8 pt-5 pb-4 border-b border-white/7 shrink-0 bg-[#060606] relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/20">
                {questionIndex > 0 ? `Question ${questionIndex} of ${TOTAL_QUESTIONS}` : "Loading…"}
              </span>
              {isCodingQ && (
                <span className="text-[9px] bg-purple-500/15 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded-sm">
                  5 min
                </span>
              )}
            </div>
            <div className="font-serif text-xl font-light text-white leading-relaxed min-h-[1.8rem]">
              {displayedQuestion}
              {!typewriterDone && <span className="animate-pulse text-[#D4AF37]">|</span>}
            </div>
          </div>

          <div className="flex items-center gap-4 px-8 py-2.5 border-b border-white/7 shrink-0 bg-[#060606] relative z-10">
            <WaveformBar
              active={isSpeaking || isListening}
              mode={isSpeaking ? "speaking" : isListening ? "listening" : "idle"}
              amplitude={amplitude}
            />
            <span className="text-[11px] text-white/25">{phaseLabel}</span>
          </div>

          {activeProblem ? (
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative z-10">
              <div className="px-6 py-2 border-b border-white/7 bg-[#0a0a0a] shrink-0 flex items-center gap-3">
                <div className={`font-mono text-[13px] px-3 py-1 border rounded-md flex items-center gap-1.5 ${
                  codingCritical ? "border-red-500/40 bg-red-500/8 text-red-400 animate-pulse" :
                  codingUrgent   ? "border-yellow-500/30 bg-yellow-500/6 text-yellow-400" :
                                   "border-white/10 bg-white/4 text-white/40"
                }`}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {fmt(isNaN(answerTimeLeft) ? 0 : answerTimeLeft)} remaining
                </div>
                <span className="text-[10px] text-white/20">Think aloud — explain your approach as you code</span>
                <div className="ml-auto">
                  <button
                    onClick={handleSubmit}
                    disabled={!isListening}
                    className="border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] tracking-widest uppercase px-4 py-1.5 hover:bg-[#D4AF37]/8 disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded-sm"
                  >
                    Submit Solution →
                  </button>
                </div>
              </div>

              <LeetCodeEditor
                problem={activeProblem}
                isSql={isSqlQ}
                onAIEval={handleAIEval}
                evalResult={codeEvalResult}
                timeLeft={answerTimeLeft}
              />
            </div>
          ) : (
            <>
              <div className="px-8 py-4 border-b border-white/7 shrink-0 bg-[#060606] relative z-10">
                <textarea
                  ref={textRef}
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
                  }}
                  placeholder={isListening ? "🎤 Recording… Speak or type your answer…" : "Waiting for the interviewer…"}
                  disabled={!isListening}
                  rows={3}
                  className="w-full bg-[#0A0A0A] border border-white/8 text-white placeholder-white/18 text-sm leading-relaxed px-4 py-3 outline-none resize-none focus:border-white/15 transition-colors disabled:opacity-40"
                />
                {isListening && !textAnswer && (
                  <div className="text-[11px] text-white/45 mt-2 px-3 py-1.5 bg-red-500/5 border border-red-500/15 rounded animate-pulse">
                    🎤 Recording in progress — speak clearly into your microphone
                  </div>
                )}
                {phase === "transcribing" && (
                  <div className="text-[11px] text-blue-400/65 mt-2 px-3 py-1.5 bg-blue-400/5 border border-blue-400/15 rounded">
                    ⏳ Transcribing your speech via Whisper…
                  </div>
                )}
                <div className="flex items-center gap-3 mt-2.5">
                  <button
                    onClick={handleSubmit}
                    disabled={!isListening}
                    className="border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] tracking-widest uppercase px-5 py-2 hover:bg-[#D4AF37]/8 disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded-sm"
                  >
                    Submit Answer →
                  </button>
                  {isListening && (
                    <>
                      <button
                        onClick={stopRecording}
                        className="border border-white/10 text-white/30 text-[10px] tracking-widest uppercase px-3 py-2 hover:border-white/20 hover:text-white/50 transition-all rounded-sm"
                      >
                        ⏹ Stop Mic
                      </button>
                      <div className={`text-[11px] font-mono px-2.5 py-1 border rounded-sm ${
                        answerTimeLeft <= 10 ? "border-red-400/40 text-red-400 bg-red-400/5" : "border-white/10 text-white/35"
                      }`}>
                        ⏱ {isNaN(answerTimeLeft) ? 0 : answerTimeLeft}s
                      </div>
                    </>
                  )}
                  <span className="ml-auto text-[10px] text-white/18">
                    {isListening ? "🎤 Listening • Enter to submit" : ""}
                  </span>
                </div>
              </div>

              {error && (
                <div className="mx-8 mt-4 px-4 py-2.5 border border-red-500/20 bg-red-500/5 text-red-400 text-xs rounded-sm relative z-10">
                  {error}
                </div>
              )}

              <div className="flex-1 overflow-y-auto px-8 py-5 relative z-10">
                <div className="bg-[#0A0A0A] border border-white/6 p-5 rounded-sm">
                  <div className="text-[9px] tracking-widest uppercase text-[#D4AF37] mb-2">
                    {questionIndex >= 3 && questionIndex <= 8 ? "Resume Tip" : "Interview Tip"}
                  </div>
                  <p className="text-white/35 text-sm leading-relaxed">
                    {questionIndex === 1 && "Spend 60–90 seconds on your introduction: current role, one key achievement, and why you're excited about this opportunity."}
                    {questionIndex === 2 && "Elaborate on one thread from your introduction — pick your strongest story and go deeper with concrete numbers."}
                    {questionIndex >= 3 && questionIndex <= 8 && (
                      typeConfig?.tips?.[questionIndex % (typeConfig.tips?.length || 1)] ||
                      "Use STAR — Situation, Task, Action, Result — to structure your answer with concrete measurable impact."
                    )}
                    {!questionIndex && "Your AI interviewer is reading your resume and preparing your first question…"}
                  </p>
                </div>
                {history.length === 0 && phase !== "idle" && (
                  <p className="mt-4 text-white/12 text-xs">Preparing your personalised first question…</p>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}