import { useState } from "react";

const STARTERS = {
  python: (p) => p?.starterPython || "def solution():\n    # Write your solution here\n    pass\n",
  java: (p) => p?.starterJava || "public class Solution {\n    public int[] solution() {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
  cpp: (p) => p?.starterCpp || "class Solution {\npublic:\n    vector<int> solution() {\n        // Write your solution here\n        return {};\n    }\n};",
  sql: (p) => p?.starterSQL || "-- Write your SQL query here\nSELECT * FROM table_name;",
};

/**
 * CodeEditor
 * Props:
 *   problem     — dsaProblem object from AI response
 *   onRun       — async fn(language, code) → { results, allPassed, timeComplexity, spaceComplexity, explanation, hint }
 *   evalResult  — last result from onRun (controlled by parent)
 */
export default function CodeEditor({ problem, onRun, evalResult }) {
  const [lang, setLang] = useState("python");
  const [code, setCode] = useState(STARTERS.python(problem));
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0-3 = case tabs, "output" = results tab

  // When language changes, update starter code
  const switchLang = (l) => {
    setLang(l);
    setCode(STARTERS[l](problem));
  };

  const handleRun = async () => {
    if (running || !code.trim()) return;
    setRunning(true);
    setActiveTab("output");
    try {
      await onRun(lang, code);
    } finally {
      setRunning(false);
    }
  };

  // Handle Tab key inside textarea
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.target;
      const s = el.selectionStart;
      const newCode = code.substring(0, s) + "  " + code.substring(el.selectionEnd);
      setCode(newCode);
      requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 2; });
    }
  };

  const cases = problem?.testCases || [];
  const results = evalResult?.results || [];

  const statusIcon = (r) =>
    r === "pass" ? <span className="text-green-400 text-xs">✓</span> :
    r === "fail" ? <span className="text-red-400 text-xs">✗</span> :
    r === "error" ? <span className="text-yellow-400 text-xs">!</span> :
    <span className="text-white/20 text-xs">·</span>;

  const passingCount = results.filter((r) => r === "pass").length;

  return (
    <div className="flex flex-col h-full min-h-0 border-t border-white/7">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-2.5 border-b border-white/7 bg-[#0A0A0A] shrink-0">
        <div className="flex items-center gap-3">
          {/* Problem badge */}
          <span className="text-[10px] tracking-widest uppercase text-[#D4AF37] border border-[#D4AF37]/20 bg-[#D4AF37]/8 px-2.5 py-1">
            {problem?.difficulty || "Medium"} · {problem?.title || "DSA Problem"}
          </span>

          {/* Language selector */}
          <select
            value={lang}
            onChange={(e) => switchLang(e.target.value)}
            className="bg-[#111] border border-white/10 text-white/70 text-xs px-2 py-1 outline-none font-mono"
          >
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="sql">SQL</option>
          </select>
        </div>

        <button
          onClick={handleRun}
          disabled={running}
          className="bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold tracking-widest uppercase px-4 py-1.5 transition-colors"
        >
          {running ? "⏳ Running…" : "▶ Run Code"}
        </button>
      </div>

      {/* ── Problem description (collapsible) ── */}
      <div className="px-6 py-3 border-b border-white/7 bg-[#050505] shrink-0">
        <p className="text-white/50 text-xs leading-relaxed line-clamp-3">
          {problem?.description || "Write your solution below."}
        </p>
        {problem?.examples?.[0] && (
          <p className="text-white/30 text-[11px] font-mono mt-1.5">{problem.examples[0]}</p>
        )}
      </div>

      {/* ── Editor ── */}
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        className="flex-1 w-full bg-[#050505] text-[#e2e8f0] font-mono text-[13px] leading-relaxed p-5 outline-none resize-none border-b border-white/7 min-h-[160px]"
        style={{ tabSize: 2 }}
        placeholder="// Write your solution here…"
      />

      {/* ── Test panel ── */}
      <div className="shrink-0 h-[130px] bg-[#0A0A0A] flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-white/7">
          {cases.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 text-[10px] tracking-widest uppercase border-r border-white/7 transition-colors ${
                activeTab === i ? "text-[#D4AF37] bg-[#D4AF37]/8" : "text-white/30 hover:text-white/50"
              }`}
            >
              Case {i + 1} {results[i] ? statusIcon(results[i]) : ""}
            </button>
          ))}
          <button
            onClick={() => setActiveTab("output")}
            className={`px-4 py-2 text-[10px] tracking-widest uppercase transition-colors ${
              activeTab === "output" ? "text-[#D4AF37] bg-[#D4AF37]/8" : "text-white/30 hover:text-white/50"
            }`}
          >
            Output
          </button>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-white/50">
          {activeTab === "output" ? (
            evalResult ? (
              <div className="space-y-1">
                <div className={`font-medium ${evalResult.allPassed ? "text-green-400" : "text-red-400"}`}>
                  {passingCount}/{cases.length} test cases passed
                  {evalResult.timeComplexity && (
                    <span className="text-white/30 ml-3 font-normal">
                      Time: {evalResult.timeComplexity} · Space: {evalResult.spaceComplexity}
                    </span>
                  )}
                </div>
                {evalResult.explanation && (
                  <p className="text-white/40 text-[11px] leading-relaxed mt-1">{evalResult.explanation}</p>
                )}
                {evalResult.hint && (
                  <p className="text-[#D4AF37]/60 text-[11px] mt-1">💡 {evalResult.hint}</p>
                )}
              </div>
            ) : (
              <span className="text-white/20">Run your code to see results.</span>
            )
          ) : typeof activeTab === "number" && cases[activeTab] ? (
            <div className="space-y-2">
              <div>
                <span className="text-white/30 uppercase tracking-wider text-[10px]">Input</span>
                <div className="mt-1 bg-[#111] px-3 py-2 text-white/60">{cases[activeTab].input}</div>
              </div>
              <div>
                <span className="text-white/30 uppercase tracking-wider text-[10px]">Expected</span>
                <div className="mt-1 bg-[#111] px-3 py-2 text-white/60">{cases[activeTab].expected}</div>
              </div>
              {results[activeTab] && (
                <div className={results[activeTab] === "pass" ? "text-green-400" : "text-red-400"}>
                  {results[activeTab] === "pass" ? "✓ Passed" : "✗ Failed"}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}