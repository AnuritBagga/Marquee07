import { useEffect, useRef, useState } from "react";

/**
 * CameraFeed component - Displays user's webcam feed with controls
 * @param {boolean} autoStart - Whether to start camera automatically
 * @param {function} onCameraStateChange - Callback when camera state changes
 * @param {string} className - Additional CSS classes
 */
export default function CameraFeed({ autoStart = false, onCameraStateChange, className = "" }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get available camera devices
  const enumerateDevices = async () => {
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = deviceList.filter((device) => device.kind === "videoinput");
      setDevices(videoDevices);
      if (videoDevices.length > 0 && !selectedDevice) {
        setSelectedDevice(videoDevices[0].deviceId);
      }
    } catch (err) {
      console.error("Error enumerating devices:", err);
    }
  };

  // Start camera with specified device
  const startCamera = async (deviceId = null) => {
    setIsLoading(true);
    setError(null);

    try {
      // Stop any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const constraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: "user" },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsActive(true);
      onCameraStateChange?.(true);
      await enumerateDevices();
    } catch (err) {
      console.error("Error accessing camera:", err);
      let errorMessage = "Failed to access camera";
      
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        errorMessage = "Camera permission denied. Please allow camera access in your browser settings.";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        errorMessage = "No camera device found. Please connect a camera.";
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        errorMessage = "Camera is already in use by another application.";
      } else if (err.name === "OverconstrainedError") {
        errorMessage = "Requested camera device not available.";
      }

      setError(errorMessage);
      setIsActive(false);
      onCameraStateChange?.(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsActive(false);
    onCameraStateChange?.(false);
  };

  // Switch camera device
  const switchCamera = async (deviceId) => {
    setSelectedDevice(deviceId);
    if (isActive) {
      await startCamera(deviceId);
    }
  };

  // Auto-start on mount if enabled
  useEffect(() => {
    if (autoStart) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  return (
    <div className={`relative ${className}`}>
      {/* Video feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover rounded-lg bg-black"
      />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <svg
              className="w-8 h-8 animate-spin text-[#D4AF37]"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            <span className="text-xs text-white/70">Starting camera...</span>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-lg p-4">
          <div className="text-center max-w-[200px]">
            <div className="text-red-400 mb-2">
              <svg
                className="w-8 h-8 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-xs text-white/70 mb-3">{error}</p>
            <button
              onClick={() => startCamera(selectedDevice)}
              className="text-xs bg-[#D4AF37] text-black px-3 py-1.5 rounded hover:bg-[#D4AF37]/90 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Camera off overlay */}
      {!isActive && !error && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 rounded-lg">
          <div className="text-center">
            <div className="text-white/30 mb-3">
              <svg
                className="w-10 h-10 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
                <line x1="3" y1="3" x2="21" y2="21" strokeWidth="2" />
              </svg>
            </div>
            <p className="text-xs text-white/50 mb-3">Camera is off</p>
            <button
              onClick={() => startCamera(selectedDevice)}
              className="text-xs bg-[#D4AF37] text-black px-3 py-1.5 rounded hover:bg-[#D4AF37]/90 transition-colors"
            >
              Turn On Camera
            </button>
          </div>
        </div>
      )}

      {/* Controls overlay (only show when active) */}
      {isActive && !error && (
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2">
          {/* Camera toggle */}
          <button
            onClick={stopCamera}
            className="bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white p-2 rounded-md transition-colors group"
            title="Turn off camera"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
              <line x1="3" y1="3" x2="21" y2="21" strokeWidth="2" />
            </svg>
          </button>

          {/* Camera switcher (only show if multiple cameras available) */}
          {devices.length > 1 && (
            <select
              value={selectedDevice || ""}
              onChange={(e) => switchCamera(e.target.value)}
              className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1.5 rounded-md border border-white/10 hover:bg-black/80 transition-colors focus:outline-none focus:border-[#D4AF37]"
            >
              {devices.map((device, index) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${index + 1}`}
                </option>
              ))}
            </select>
          )}

          {/* Live indicator */}
          <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs text-white/90">LIVE</span>
          </div>
        </div>
      )}
    </div>
  );
}
