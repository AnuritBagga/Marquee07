import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/**
 * SystemCheck - Verify camera, mic, and system compatibility
 */
export default function SystemCheck() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [checks, setChecks] = useState({
    camera: { status: "checking", message: "Checking camera..." },
    microphone: { status: "checking", message: "Checking microphone..." },
    fullscreen: { status: "pending", message: "Not tested yet" },
    browser: { status: "checking", message: "Checking browser..." }
  });
  const [stream, setStream] = useState(null);
  const [allPassed, setAllPassed] = useState(false);

  useEffect(() => {
    checkBrowser();
    checkMediaDevices();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const passed = Object.values(checks).every(check => check.status === "success");
    setAllPassed(passed);
  }, [checks]);

  const checkBrowser = () => {
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const isEdge = /Edg/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);

    if (isChrome || isEdge || isFirefox) {
      updateCheck("browser", "success", `${isChrome ? "Chrome" : isEdge ? "Edge" : "Firefox"} detected`);
    } else {
      updateCheck("browser", "warning", "Browser may not be fully supported");
    }
  };

  const checkMediaDevices = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      updateCheck("camera", "success", "Camera access granted");
      updateCheck("microphone", "success", "Microphone access granted");
    } catch (error) {
      console.error("Media device error:", error);
      if (error.name === "NotAllowedError") {
        updateCheck("camera", "error", "Camera permission denied");
        updateCheck("microphone", "error", "Microphone permission denied");
      } else {
        updateCheck("camera", "error", "Camera not available");
        updateCheck("microphone", "error", "Microphone not available");
      }
    }
  };

  const testFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      updateCheck("fullscreen", "success", "Fullscreen mode works");
      setTimeout(() => {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
      }, 2000);
    } catch (error) {
      updateCheck("fullscreen", "error", "Fullscreen not supported");
    }
  };

  const updateCheck = (key, status, message) => {
    setChecks(prev => ({
      ...prev,
      [key]: { status, message }
    }));
  };

  const handleContinue = () => {
    navigate("/exam/instructions");
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <span className="text-2xl">✓</span>;
      case "error":
        return <span className="text-2xl">✗</span>;
      case "warning":
        return <span className="text-2xl">⚠️</span>;
      case "checking":
        return <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>;
      default:
        return <span className="text-2xl">⏳</span>;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "border-green-500/30 bg-green-500/10";
      case "error":
        return "border-red-500/30 bg-red-500/10";
      case "warning":
        return "border-yellow-500/30 bg-yellow-500/10";
      default:
        return "border-white/10 bg-white/5";
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">System Compatibility Check</h1>
          <p className="text-white/60">Verifying your device meets exam requirements</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Camera Preview */}
          <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">Camera Preview</h3>
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-white/60 text-sm text-center">
              {checks.camera.status === "success"
                ? "Your camera is working correctly"
                : "Waiting for camera access..."}
            </p>
          </div>

          {/* System Checks */}
          <div className="space-y-4">
            {/* Camera Check */}
            <div className={`border rounded-xl p-4 ${getStatusColor(checks.camera.status)}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center">
                  {getStatusIcon(checks.camera.status)}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">Camera</h4>
                  <p className="text-white/60 text-sm">{checks.camera.message}</p>
                </div>
              </div>
            </div>

            {/* Microphone Check */}
            <div className={`border rounded-xl p-4 ${getStatusColor(checks.microphone.status)}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center">
                  {getStatusIcon(checks.microphone.status)}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">Microphone</h4>
                  <p className="text-white/60 text-sm">{checks.microphone.message}</p>
                </div>
              </div>
            </div>

            {/* Browser Check */}
            <div className={`border rounded-xl p-4 ${getStatusColor(checks.browser.status)}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center">
                  {getStatusIcon(checks.browser.status)}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">Browser</h4>
                  <p className="text-white/60 text-sm">{checks.browser.message}</p>
                </div>
              </div>
            </div>

            {/* Fullscreen Check */}
            <div className={`border rounded-xl p-4 ${getStatusColor(checks.fullscreen.status)}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center">
                  {getStatusIcon(checks.fullscreen.status)}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">Fullscreen Mode</h4>
                  <p className="text-white/60 text-sm">{checks.fullscreen.message}</p>
                </div>
                <button
                  onClick={testFullscreen}
                  className="bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Test
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
            <span className="text-xl">ℹ️</span>
            Important Notes
          </h3>
          <ul className="space-y-2 text-white/80 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>Once exam starts, you must stay in fullscreen mode</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>Your camera will record throughout the exam for proctoring</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>Tab switching may result in exam auto-submission</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>For offline exams, you'll need to turn off internet before starting</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => navigate("/exam/login")}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-lg transition-colors font-semibold"
          >
            ← Go Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!allPassed}
            className="flex-1 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black px-6 py-4 rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Continue
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        {!allPassed && (
          <p className="text-center text-red-400 text-sm mt-4">
            ⚠️ Please fix all issues before continuing
          </p>
        )}
      </div>
    </div>
  );
}
