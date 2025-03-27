// src/components/LoadingScreen.tsx

// FIX: Removed unused 'React' import
import { useEffect, useState } from 'react';
import './LoadingScreen.css';
import { useAppContext } from '../contexts/AppContext';

const LoadingScreen = () => {
  const { colors } = useAppContext();
  const word = "MADRASA";
  const [visibleLetters, setVisibleLetters] = useState<boolean[]>(
    Array(word.length).fill(false)
  );

  useEffect(() => {
    // FIX: Change type from NodeJS.Timeout[] to number[] for browser environment
    const timeouts: number[] = [];
    word.split('').forEach((_, index) => {
      // setTimeout in browser returns a number ID
      timeouts.push(
        window.setTimeout(() => { // Use window.setTimeout explicitly if needed
          setVisibleLetters((prev) => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        }, index * 200)
      );
    });
    // clearTimeout in browser accepts a number ID
    return () => timeouts.forEach(window.clearTimeout); // Use window.clearTimeout explicitly
  }, []); // Empty dependency array

  const bgColor = colors?.secondary || 'bg-gray-100';
  const textColor = colors?.textPrimary || 'text-gray-800';

  return (
    <div className={`loading-screen ${bgColor} ${textColor}`}>
      <div className="loading-word">
        {word.split('').map((letter, index) => (
          <span
            key={index}
            className={`loading-letter ${visibleLetters[index] ? 'visible' : ''} ${textColor}`}
          >
            {letter}
          </span>
        ))}
      </div>
      <div className="loading-spinner mt-4"></div>
    </div>
  );
};

export default LoadingScreen;
