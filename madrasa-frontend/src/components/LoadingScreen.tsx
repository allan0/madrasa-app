// src/components/LoadingScreen.tsx

import { useEffect, useState, useRef } from 'react';
import './LoadingScreen.css';
import { useAppContext } from '../contexts/AppContext';

// Optional: Define a prop type if you want to notify the parent when loading is done
interface LoadingScreenProps {
  onLoaded?: () => void; // Callback when the 5s + fade ends
}

const LoadingScreen = ({ onLoaded }: LoadingScreenProps) => {
  const { colors } = useAppContext();
  const word = "MADRASA";
  const [visibleLetters, setVisibleLetters] = useState<boolean[]>(
    Array(word.length).fill(false)
  );
  const [isHiding, setIsHiding] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Letter animation effect
  useEffect(() => {
    const timeouts: number[] = [];
    word.split('').forEach((_, index) => {
      timeouts.push(
        window.setTimeout(() => {
          setVisibleLetters((prev) => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        }, index * 200) // Stagger the letters
      );
    });
    return () => timeouts.forEach(window.clearTimeout);
  }, []); // Empty dependency array ensures this runs only once on mount

  // Sound playing effect
  useEffect(() => {
    // Create audio element
    // IMPORTANT: Make sure '/sounds/wave-splash.mp3' points to your actual sound file
    // placed in the public directory.
    audioRef.current = new Audio('/sounds/wave-splash.mp3');
    audioRef.current.loop = true; // Loop the sound for the duration

    // Attempt to play sound
    audioRef.current.play().catch(error => {
      // Autoplay might be blocked by the browser, especially on mobile
      console.warn("Audio autoplay failed:", error);
      // You might want to add a button for the user to enable sound in this case
    });

    // Cleanup function to stop and release audio resources
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Reset time
        // Optional: remove source if concerned about memory, but usually not necessary
        // audioRef.current.src = '';
      }
    };
  }, []); // Run once on mount

  // 5-second visibility timer effect
  useEffect(() => {
    const FADE_DURATION_MS = 500; // Must match CSS transition duration
    const VISIBLE_DURATION_MS = 5000; // Show for 5 seconds

    const hideTimer = window.setTimeout(() => {
      setIsHiding(true); // Trigger fade-out animation

      // Optional: Stop sound when fading starts or ends
      if (audioRef.current) {
         // Fade out audio slightly before visually hidden
         let vol = audioRef.current.volume;
         const fadeOutInterval = setInterval(() => {
             if (vol > 0.1) {
                 vol -= 0.1;
                 if (audioRef.current) audioRef.current.volume = vol;
             } else {
                 clearInterval(fadeOutInterval);
                 if (audioRef.current) audioRef.current.pause();
             }
         }, FADE_DURATION_MS / 10);
      }


      // Notify parent component after the fade-out animation completes
      if (onLoaded) {
        window.setTimeout(onLoaded, FADE_DURATION_MS);
      }
    }, VISIBLE_DURATION_MS);

    // Cleanup timer if the component unmounts early
    return () => window.clearTimeout(hideTimer);
  }, [onLoaded]); // Re-run if onLoaded changes (though unlikely)

  // Use context color for text, default to a dark color for visibility on white
  const textColor = colors?.textPrimary || 'text-gray-800';

  return (
    // Apply fade-out effect using opacity based on isHiding state
    // Background is now handled purely by CSS
    <div className={`loading-screen ${isHiding ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      {/* Content wrapper to center elements in the top white part */}
      <div className="loading-content-wrapper">
        <div className="loading-word">
          {word.split('').map((letter, index) => (
            <span
              key={index}
              // Ensure text color contrasts with the white background
              className={`loading-letter ${visibleLetters[index] ? 'visible' : ''} ${textColor}`}
            >
              {letter}
            </span>
          ))}
        </div>
        {/* New water spinner */}
        <div className="water-spinner mt-6"></div>
      </div>
       {/* Wave elements added via CSS pseudo-elements ::before and ::after */}
    </div>
  );
};

export default LoadingScreen;