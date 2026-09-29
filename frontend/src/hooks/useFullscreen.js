import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for fullscreen functionality
 * @returns {Object} - { isFullscreen, enterFullscreen, exitFullscreen, toggleFullscreen }
 */
export default function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Check if fullscreen is supported
  const isSupported = () => {
    return (
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    );
  };

  // Get fullscreen element (cross-browser)
  const getFullscreenElement = () => {
    return (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  };

  // Enter fullscreen mode
  const enterFullscreen = useCallback(async (element = document.documentElement) => {
    if (!isSupported()) {
      console.warn("Fullscreen API is not supported in this browser");
      return false;
    }

    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      }
      return true;
    } catch (err) {
      console.error("Error entering fullscreen:", err);
      return false;
    }
  }, []);

  // Exit fullscreen mode
  const exitFullscreen = useCallback(async () => {
    if (!getFullscreenElement()) {
      return false;
    }

    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
      return true;
    } catch (err) {
      console.error("Error exiting fullscreen:", err);
      return false;
    }
  }, []);

  // Toggle fullscreen mode
  const toggleFullscreen = useCallback(
    async (element = document.documentElement) => {
      if (getFullscreenElement()) {
        return await exitFullscreen();
      } else {
        return await enterFullscreen(element);
      }
    },
    [enterFullscreen, exitFullscreen]
  );

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!getFullscreenElement());
    };

    // Add event listeners for all browsers
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    // Initial check
    handleFullscreenChange();

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  return {
    isFullscreen,
    isSupported: isSupported(),
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
  };
}
