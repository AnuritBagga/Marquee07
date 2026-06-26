import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

/**
 * useLiveInterview — orchestrates a real-time AI interview:
 *   1. POST /sessions/next-question → get AI question text
 *   2. Speak via SpeechSynthesis; expose `speaking` + audio amplitude
 *   3. After speech ends, record mic via MediaRecorder
 *   4. POST audio → /sessions/transcribe → candidate text
 *   5. Push both turns to history; loop.
 *
 * Phases: 'idle' | 'asking' | 'speaking' | 'listening' | 'transcribing' | 'ended' | 'error'
 */
export default function useLiveInterview(domain) {
  const [phase, setPhase] = useState("idle");
  const [history, setHistory] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [partialAnswer, setPartialAnswer] = useState("");
  const [amplitude, setAmplitude] = useState(0); // 0..1 from TTS analyser
  const [error, setError] = useState(null);

  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const utteranceRef = useRef(null);
  const ampTimerRef = useRef(null);

  // Drive a fake amplitude curve while TTS speaks (SpeechSynthesis has no
  // direct amplitude hook, but we can simulate convincingly).
  const startAmplitudePulse = useCallback(() => {
    const t0 = performance.now();
    const tick = () => {
      const t = (performance.now() - t0) / 1000;
      const a =
        0.55 +
        Math.sin(t * 6.2) * 0.2 +
        Math.sin(t * 11.4) * 0.12 +
        (Math.random() - 0.5) * 0.06;
      setAmplitude(Math.max(0, Math.min(1, a)));
      ampTimerRef.current = requestAnimationFrame(tick);
    };
    ampTimerRef.current = requestAnimationFrame(tick);
  }, []);

  const stopAmplitudePulse = useCallback(() => {
    if (ampTimerRef.current) cancelAnimationFrame(ampTimerRef.current);
    ampTimerRef.current = null;
    setAmplitude(0);
  }, []);

  const speak = useCallback(
    (text) =>
      new Promise((resolve) => {
        if (!("speechSynthesis" in window)) return resolve();
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 0.98;
        u.pitch = 1.02;
        // Prefer a female English voice if available
        const voices = window.speechSynthesis.getVoices();
        const preferred =
          voices.find((v) => /female|samantha|victoria|tessa|karen|aria/i.test(v.name)) ||
          voices.find((v) => v.lang?.startsWith("en"));
        if (preferred) u.voice = preferred;
        u.onstart = () => {
          setPhase("speaking");
          startAmplitudePulse();
        };
        u.onend = () => {
          stopAmplitudePulse();
          resolve();
        };
        u.onerror = () => {
          stopAmplitudePulse();
          resolve();
        };
        utteranceRef.current = u;
        window.speechSynthesis.speak(u);
      }),
    [startAmplitudePulse, stopAmplitudePulse],
  );

  const recordAnswer = useCallback(async (maxSeconds = 25) => {
    setPhase("listening");
    setPartialAnswer("");
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      setError("Microphone permission denied. Enable mic to use Live mode.");
      setPhase("error");
      throw e;
    }
    streamRef.current = stream;
    chunksRef.current = [];
    const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : "audio/webm";
    const rec = new MediaRecorder(stream, { mimeType: mime });
    recorderRef.current = rec;

    return new Promise((resolve) => {
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mime });
        stream.getTracks().forEach((t) => t.stop());
        resolve(blob);
      };
      rec.start();
      // auto stop after maxSeconds
      setTimeout(() => {
        if (rec.state === "recording") rec.stop();
      }, maxSeconds * 1000);
    });
  }, []);

  const stopRecording = useCallback(() => {
    const rec = recorderRef.current;
    if (rec && rec.state === "recording") rec.stop();
  }, []);

  const transcribe = useCallback(async (blob) => {
    setPhase("transcribing");
    const form = new FormData();
    form.append("file", blob, "answer.webm");
    const { data } = await axios.post(`${API}/sessions/transcribe`, form, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 90000,
    });
    return data.text || "";
  }, []);

  const fetchQuestion = useCallback(
    async (hist) => {
      setPhase("asking");
      const { data } = await axios.post(`${API}/sessions/next-question`, {
        domain,
        history: hist,
        candidate_name: "Aarav",
      });
      return data;
    },
    [domain],
  );

  /** Drives one full turn: ask → speak → listen → transcribe → push. */
  const runTurn = useCallback(
    async (hist) => {
      try {
        const { question, ended } = await fetchQuestion(hist);
        setCurrentQuestion(question);
        await speak(question);
        const newHist = [...hist, { role: "assistant", content: question }];
        if (ended) {
          setHistory(newHist);
          setPhase("ended");
          return;
        }
        const blob = await recordAnswer();
        const answer = await transcribe(blob);
        setPartialAnswer(answer);
        const next = [...newHist, { role: "user", content: answer }];
        setHistory(next);
        // loop
        await runTurn(next);
      } catch (e) {
        if (e?.response?.data?.detail) {
          setError(e.response.data.detail);
        } else if (e?.message) {
          setError(e.message);
        }
        setPhase("error");
      }
    },
    [fetchQuestion, speak, recordAnswer, transcribe],
  );

  const start = useCallback(() => {
    setHistory([]);
    setError(null);
    setCurrentQuestion("");
    setPartialAnswer("");
    runTurn([]);
  }, [runTurn]);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    stopAmplitudePulse();
    const rec = recorderRef.current;
    if (rec && rec.state === "recording") rec.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setPhase("idle");
  }, [stopAmplitudePulse]);

  useEffect(() => () => stop(), [stop]);

  return {
    phase,
    history,
    currentQuestion,
    partialAnswer,
    amplitude,
    error,
    start,
    stop,
    stopRecording,
  };
}
