import { useState, useRef, useEffect } from "react";
import CameraFeed from "./CameraFeed";

/**
 * DraggableCamera - A draggable, resizable camera feed component
 * Similar to video call camera that can be moved around the screen
 */
export default function DraggableCamera({ onCameraStateChange }) {
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const cameraRef = useRef(null);

  // Handle drag start
  const handleMouseDown = (e) => {
    // Don't drag if clicking on controls inside the camera
    if (e.target.closest('button') || e.target.closest('select')) {
      return;
    }

    setIsDragging(true);
    const rect = cameraRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Handle dragging
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Keep within viewport bounds
      const maxX = window.innerWidth - 240; // 240px is camera width
      const maxY = window.innerHeight - 180; // 180px is camera height

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Update position on window resize
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => ({
        x: Math.min(prev.x, window.innerWidth - 240),
        y: Math.min(prev.y, window.innerHeight - 180),
      }));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={cameraRef}
      onMouseDown={handleMouseDown}
      className={`fixed z-50 w-[240px] rounded-lg overflow-hidden shadow-2xl ring-2 ring-white/20 transition-shadow ${
        isDragging ? "cursor-grabbing ring-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.4)]" : "cursor-grab hover:ring-[#D4AF37]/50"
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        aspectRatio: "16/9",
      }}
    >
      {/* Drag handle indicator */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="flex gap-1">
          <div className="w-1 h-1 rounded-full bg-white/30"></div>
          <div className="w-1 h-1 rounded-full bg-white/30"></div>
          <div className="w-1 h-1 rounded-full bg-white/30"></div>
        </div>
      </div>

      <CameraFeed
        autoStart={true}
        onCameraStateChange={onCameraStateChange}
        className="w-full h-full"
      />

      {/* Drag hint (only show initially) */}
      {!isDragging && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-white/40 bg-black/60 px-2 py-0.5 rounded pointer-events-none">
          Drag to move
        </div>
      )}
    </div>
  );
}
