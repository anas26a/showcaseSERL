"use client";

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

// Function to request full-screen mode
const enterFullScreen = () => {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
};

// Function to exit full-screen mode
const exitFullScreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
};

const KioskMode = () => {
  const [projects, setProjects] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Fetch projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/data/projects.json");
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length); // Loop through projects
    }, 3000); //  3 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [projects]);

  // Handle full-screen change events
  useEffect(() => {
    const handleFullScreenChange = () => {
      if (document.fullscreenElement) {
        setIsFullScreen(true);
        document.body.style.overflow = "hidden"; // Hide scrollbars
      } else {
        setIsFullScreen(false);
        document.body.style.overflow = "auto"; // Restore scrollbars
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
    document.addEventListener("mozfullscreenchange", handleFullScreenChange);
    document.addEventListener("MSFullscreenChange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullScreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullScreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullScreenChange);
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!projects.length) {
    return <div>No projects found.</div>;
  }

  const currentProject = projects[currentIndex];
  const projectUrl = `${window.location.origin}/projects/${currentProject.id}`;

  return (
    <div
      className={`relative flex items-center justify-center ${
        isFullScreen ? "h-screen w-screen fixed" : "h-screen"
      } bg-blue-900 text-white`} // Use the dark blue background
    >
      {/* Navigation Bar (only visible if not fullscreen) */}
      {!isFullScreen && (
        <nav className="absolute top-4 left-4 z-50">
          <button
            onClick={enterFullScreen}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            Enter Full Screen
          </button>
        </nav>
      )}

      {/* Full-screen Layout: Split into Left (Images) and Right (Description + QR Code) */}
      <div className="flex w-[90vw] h-[90vh]">
        {/* Left side: Two images stacked on top of each other */}
        <div className="flex flex-col justify-between w-1/2 h-full p-4">
          {currentProject.screenshots.slice(0, 2).map((screenshot, index) => (
            <div
              key={index}
              className="flex-grow bg-gray-800 m-2 rounded-md"
              style={{
                height: "45%", // Each image occupies 45% of the left side
                backgroundColor: "#2d2d2d",
              }}
            >
              <img
                src={screenshot}
                alt={`Screenshot ${index + 1}`}
                className="object-cover w-full h-full rounded-md"
              />
            </div>
          ))}
        </div>

        {/* Right side: Description on top and QR Code below */}
        <div className="flex flex-col justify-between w-1/2 h-full p-4 bg-gray-800 rounded-md">
          {/* Project Description */}
          <div className="flex-grow p-4">
            <h1 className="text-4xl font-bold mb-2 text-center">
              {currentProject.title}
            </h1>
            <p className="text-lg text-center">{currentProject.description}</p>
          </div>

          {/* QR Code (always centered below description) */}
          <div className="flex flex-col items-center justify-center p-4">
            <QRCodeCanvas value={projectUrl} size={200} includeMargin={true} />
            <p className="text-center text-gray-400 mt-2">
              Scan to visit this project page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KioskMode;
