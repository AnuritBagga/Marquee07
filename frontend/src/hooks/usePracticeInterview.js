import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// ─── Question schedule generator based on interview type ─────────────────────
export const getQuestionSchedule = (interviewType) => {
  const hasCoding = interviewType === "technical" || interviewType === "domain";
  
  if (hasCoding) {
    // Technical & Domain: 8 verbal + 2 DSA + 1 SQL
    return {
      1:  { type: "introduction",   limitSeconds: 90  },
      2:  { type: "intro_followup", limitSeconds: 90  },
      3:  { type: "resume_deep",    limitSeconds: 70  },
      4:  { type: "cross_question", limitSeconds: 70  },
      5:  { type: "resume_deep",    limitSeconds: 70  },
      6:  { type: "cross_question", limitSeconds: 70  },
      7:  { type: "resume_deep",    limitSeconds: 70  },
      8:  { type: "cross_question", limitSeconds: 70  },
      9:  { type: "dsa",            limitSeconds: 300 },
      10: { type: "dsa",            limitSeconds: 300 },
      11: { type: "sql",            limitSeconds: 300 },
    };
  } else {
    // UPSC, Defence, etc: All 11 verbal questions
    return {
      1:  { type: "introduction",   limitSeconds: 90  },
      2:  { type: "intro_followup", limitSeconds: 90  },
      3:  { type: "domain_deep",    limitSeconds: 70  },
      4:  { type: "cross_question", limitSeconds: 70  },
      5:  { type: "domain_deep",    limitSeconds: 70  },
      6:  { type: "cross_question", limitSeconds: 70  },
      7:  { type: "domain_deep",    limitSeconds: 70  },
      8:  { type: "cross_question", limitSeconds: 70  },
      9:  { type: "domain_deep",    limitSeconds: 70  },
      10: { type: "cross_question", limitSeconds: 70  },
      11: { type: "domain_deep",    limitSeconds: 70  },
    };
  }
};

export const TOTAL_QUESTIONS = 11;

const CLOSING_LINE =
  "Thank you so much for your time today. It was a real pleasure speaking with you — have a wonderful day! Your detailed scorecard is now being prepared.";

export default function usePracticeInterview({
  interviewType = "technical",
  resumeText    = "",
  skills        = [],
  candidateName = "the candidate",
}) {
  const QUESTION_SCHEDULE = getQuestionSchedule(interviewType);

  const [phase,           setPhase]           = useState("idle");
  const [history,         setHistory]         = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [dsaProblem,      setDsaProblem]      = useState(null);
  const [sqlProblem,      setSqlProblem]      = useState(null);
  const [amplitude,       setAmplitude]       = useState(0);
  const [questionIndex,   setQuestionIndex]   = useState(0);
  const [currentLimit,    setCurrentLimit]    = useState(90);
  const [timerSeconds,    setTimerSeconds]    = useState(0);
  const [score,           setScore]           = useState(null);
  const [error,           setError]           = useState(null);
  const [codeResults,     setCodeResults]     = useState(null);
  const [liveTranscript]                      = useState("");

  // Refs
  const recorderRef         = useRef(null);
  const chunksRef           = useRef([]);
  const streamRef           = useRef(null);
  const ampTimerRef         = useRef(null);
  const timerRef            = useRef(null);
  const historyRef          = useRef([]);
  const dsaProblemRef       = useRef(null);
  const sqlProblemRef       = useRef(null);
  const codeResultsRef      = useRef(null);
  const timerSecondsRef     = useRef(0);
  const questionIndexRef    = useRef(0);
  const submittingRef       = useRef(false);
  const recordingPromiseRef = useRef(null);
  const usedDsaTitlesRef    = useRef([]);  // Track which DSA problems were used

  useEffect(() => { historyRef.current       = history;       }, [history]);
  useEffect(() => { dsaProblemRef.current    = dsaProblem;    }, [dsaProblem]);
  useEffect(() => { sqlProblemRef.current    = sqlProblem;    }, [sqlProblem]);
  useEffect(() => { codeResultsRef.current   = codeResults;   }, [codeResults]);
  useEffect(() => { questionIndexRef.current = questionIndex; }, [questionIndex]);

  const startAmp = useCallback(() => {
    const t0 = performance.now();
    const tick = () => {
      const t = (performance.now() - t0) / 1000;
      const a = 0.55 + Math.sin(t * 6.2) * 0.20 + Math.sin(t * 11.4) * 0.12 + (Math.random() - 0.5) * 0.06;
      setAmplitude(Math.max(0, Math.min(1, a)));
      ampTimerRef.current = requestAnimationFrame(tick);
    };
    ampTimerRef.current = requestAnimationFrame(tick);
  }, []);

  const stopAmp = useCallback(() => {
    if (ampTimerRef.current) cancelAnimationFrame(ampTimerRef.current);
    ampTimerRef.current = null;
    setAmplitude(0);
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setTimerSeconds((s) => { const n = s + 1; timerSecondsRef.current = n; return n; });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const getVoices = () =>
    new Promise((resolve) => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) return resolve(v);
      const onchange = () => resolve(window.speechSynthesis.getVoices());
      window.speechSynthesis.addEventListener("voiceschanged", onchange, { once: true });
      setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1500);
    });

  const speak = useCallback(async (text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    await new Promise((r) => setTimeout(r, 150));
    const voices = await getVoices();
    return new Promise((resolve) => {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.95; u.pitch = 1.0;
      const preferred =
        voices.find((v) => /female|samantha|victoria|tessa|karen|aria|zira/i.test(v.name)) ||
        voices.find((v) => v.lang?.startsWith("en"));
      if (preferred) u.voice = preferred;
      u.onstart = () => { setPhase("speaking"); startAmp(); };
      u.onend   = () => { stopAmp(); resolve(); };
      u.onerror = (e) => {
        if (e.error !== "interrupted") console.warn("TTS:", e.error);
        stopAmp(); resolve();
      };
      window.speechSynthesis.speak(u);
    });
  }, [startAmp, stopAmp]);

  const stopRecording = useCallback(() => {
    const rec = recorderRef.current;
    if (rec && rec.state === "recording") rec.stop();
  }, []);

  const recordAnswer = useCallback(async () => {
    setPhase("listening");

    const prevRec = recorderRef.current;
    if (prevRec && prevRec.state !== "inactive") prevRec.stop();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    chunksRef.current = [];

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
    } catch {
      setError("Microphone permission denied. Type your answer instead.");
      setPhase("error");
      throw new Error("mic-denied");
    }
    streamRef.current = stream;

    const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus" : "audio/webm";
    const rec = new MediaRecorder(stream, { mimeType: mime });
    recorderRef.current = rec;

    return new Promise((resolve) => {
      rec.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        resolve(new Blob(chunksRef.current, { type: mime }));
      };
      rec.start(1000);
    });
  }, []);

  const transcribe = useCallback(async (blob) => {
    setPhase("transcribing");
    const form = new FormData();
    form.append("file", blob, "answer.webm");
    try {
      const { data } = await axios.post(`${API}/sessions/transcribe`, form, { timeout: 90000 });
      return data.text || "";
    } catch (e) {
      console.error("Transcription error:", e?.response?.status, e?.response?.data);
      return "";
    }
  }, []);

  const fetchQuestion = useCallback(async (hist, nextIndex) => {
    setPhase("asking");
    const schedule = QUESTION_SCHEDULE[nextIndex] || { type: "cross_question", limitSeconds: 70 };
    const { data } = await axios.post(`${API}/practice/question`, {
      interviewType,
      history: hist,
      resumeText,
      skills,
      candidateName,
      questionType:   schedule.type,  // Send the type: "dsa", "sql", or other
      questionIndex:  nextIndex,
      usedDsaTitles:  usedDsaTitlesRef.current,  // Send list of used DSA problems
      totalQuestions: TOTAL_QUESTIONS,
    });
    
    // Track used DSA problems to prevent duplicates
    if (data.dsaProblem && data.dsaProblem.title) {
      usedDsaTitlesRef.current = [...usedDsaTitlesRef.current, data.dsaProblem.title];
    }
    
    return data;
  }, [interviewType, resumeText, skills, candidateName]);

  const evaluate = useCallback(async (hist, durationSec) => {
    setPhase("processing");
    try {
      const { data } = await axios.post(`${API}/practice/evaluate`, {
        interviewType,
        candidateName,
        durationSeconds: durationSec,
        history:         hist,
        dsaProblemTitle: dsaProblemRef.current?.title || null,
        sqlProblemTitle: sqlProblemRef.current?.title || null,
        testResults:     codeResultsRef.current
          ? codeResultsRef.current.map((r) => (r?.passed ? "pass" : "fail"))
          : null,
      });
      setScore(data);
      setPhase("ended");
    } catch {
      setError("Could not generate scorecard.");
      setPhase("ended");
    }
  }, [interviewType, candidateName]);

  // ── runCode now accepts judge0Result as 3rd arg ──────────────────────────
  const runCode = useCallback(async (language, code, judge0Result = null) => {
    const problem = dsaProblemRef.current || sqlProblemRef.current;
    if (!problem) return null;
    try {
      const { data } = await axios.post(`${API}/practice/run-code`, {
        language, code, problem, judge0Result,
      });
      setCodeResults(data.results);
      return data; // { results: [{passed,input,expected,output}], explanation, hint, ... }
    } catch (e) {
      console.error("run-code error:", e?.response?.data || e.message);
      return null;
    }
  }, []);

  const runTurn = useCallback(async (hist) => {
    try {
      setError(null);
      submittingRef.current = false;

      const nextIndex = questionIndexRef.current + 1;

      if (nextIndex > TOTAL_QUESTIONS) {
        window.speechSynthesis?.cancel();
        await speak(CLOSING_LINE);
        stopTimer();
        await evaluate(hist, timerSecondsRef.current);
        return;
      }

      const schedule = QUESTION_SCHEDULE[nextIndex];
      setCurrentLimit(schedule.limitSeconds);

      const qData = await fetchQuestion(hist, nextIndex);
      const { question, dsaProblem: problem, sqlProblem: sqlProb } = qData;

      if (problem) setDsaProblem(problem);
      if (sqlProb) setSqlProblem(sqlProb);

      setCurrentQuestion(question);
      setQuestionIndex(nextIndex);
      questionIndexRef.current = nextIndex;

      const newHist = [...hist, { role: "assistant", content: question }];
      setHistory(newHist);

      await speak(question);

      setPhase("listening");
      recordingPromiseRef.current = recordAnswer();
      recordingPromiseRef.current.catch((err) => {
        console.error("Recording failed:", err);
        recordingPromiseRef.current = null;
      });
    } catch (e) {
      const msg = e?.response?.data?.detail || e?.message || "Something went wrong.";
      setError(msg);
      setPhase("error");
    }
  }, [fetchQuestion, speak, recordAnswer, evaluate, stopTimer]);

  const submitTextAnswer = useCallback(async (text) => {
    if (submittingRef.current) return;
    submittingRef.current = true;

    let answer = text?.trim() || "";

    if (!answer) {
      stopRecording();
      if (recordingPromiseRef.current) {
        try {
          const blob = await recordingPromiseRef.current;
          recordingPromiseRef.current = null;
          if (blob && blob.size > 1000) {
            console.log("Transcribing audio blob, size:", blob.size);
            answer = await transcribe(blob);
            console.log("Transcription result:", answer);
          }
        } catch {
          recordingPromiseRef.current = null;
        }
      }
    } else {
      stopRecording();
      recordingPromiseRef.current = null;
    }

    if (!answer?.trim()) {
      setError("No answer detected. Please speak clearly or type your answer.");
      setPhase("listening");
      submittingRef.current = false;
      return;
    }

    const hist = [...historyRef.current, { role: "user", content: answer }];
    setHistory(hist);

    if (questionIndexRef.current >= TOTAL_QUESTIONS) {
      window.speechSynthesis?.cancel();
      await speak(CLOSING_LINE);
      stopTimer();
      await evaluate(hist, timerSecondsRef.current);
    } else {
      await runTurn(hist);
    }
  }, [runTurn, transcribe, stopRecording, speak, stopTimer, evaluate]);

  const start = useCallback(() => {
    setHistory([]);
    setPhase("idle");
    setError(null);
    setScore(null);
    setDsaProblem(null);
    setSqlProblem(null);
    setCodeResults(null);
    setCurrentQuestion("");
    setQuestionIndex(0);
    questionIndexRef.current = 0;
    setCurrentLimit(90);
    setTimerSeconds(0);
    timerSecondsRef.current = 0;
    submittingRef.current = false;
    recordingPromiseRef.current = null;
    usedDsaTitlesRef.current = [];  // Reset used DSA problems
    startTimer();
    runTurn([]);
  }, [runTurn, startTimer]);

  const end = useCallback(async () => {
    window.speechSynthesis?.cancel();
    stopAmp();
    stopRecording();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    recordingPromiseRef.current = null;
    stopTimer();
    setPhase("processing");
    await evaluate(historyRef.current, timerSecondsRef.current);
  }, [stopAmp, stopTimer, stopRecording, evaluate]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      stopAmp();
      stopTimer();
      const rec = recorderRef.current;
      if (rec && rec.state === "recording") rec.stop();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [stopAmp, stopTimer]);

  return {
    phase, history, currentQuestion, dsaProblem, sqlProblem,
    amplitude, questionIndex, currentLimit, timerSeconds,
    score, error, codeResults, liveTranscript,
    start, end, stopRecording, submitTextAnswer, runCode,
    TOTAL_QUESTIONS, QUESTION_SCHEDULE,
  };
}