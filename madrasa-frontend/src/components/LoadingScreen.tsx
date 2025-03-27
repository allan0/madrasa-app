/* src/components/LoadingScreen.css */

.loading-screen {
  display: flex;
  /* align-items: center;  We handle alignment via wrapper now */
  /* justify-content: center; */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  /* Split background: 75% white, 25% light blue */
  background: linear-gradient(to bottom, white 75%, #A0CED9 75%); /* Light blue - Adjust color as needed */
  transition: opacity 0.5s ease-out; /* Keep the fade-out transition */
  overflow: hidden; /* Important to contain the wave animation */
  /* Text color applied inline via Tailwind */
}

/* Wrapper to center content in the top (white) part */
.loading-content-wrapper {
  position: absolute;
  width: 100%;
  top: 37.5%; /* Vertically center in the top 75% */
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10; /* Ensure content is above waves */
}

.loading-word {
  display: inline-block;
  font-size: 3rem;
  font-weight: bold;
  letter-spacing: 0.1em;
  /* Text color applied via Tailwind in component */
}

.loading-letter {
  display: inline-block;
  opacity: 0;
  transform: translateY(20px) scale(0.8);
  transition: opacity 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275),
              transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  /* Text color class added dynamically */
}

.loading-letter.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* --- Water Wave Effect --- */
.loading-screen::before,
.loading-screen::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0; /* Position at the bottom */
  right: 0;
  background-repeat: repeat-x;
  height: 50px; /* Wave height */
  width: 200%; /* Wider than screen to allow horizontal movement */
  z-index: 1; /* Behind content wrapper */
}

/* First wave layer */
.loading-screen::before {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 50'%3E%3Cpath fill='%2363B3ED' d='M0 25 Q 25 0, 50 25 T 100 25 V 50 H 0 Z'/%3E%3C/svg%3E"); /* Medium Blue SVG wave */
  background-size: 100px 50px; /* Control size of one wave segment */
  animation: wave-flow 5s linear infinite;
  opacity: 0.8;
   bottom: -5px; /* slight overlap */
   z-index: 2; /* Above second layer */
}

/* Second wave layer (slightly different look/speed) */
.loading-screen::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 50'%3E%3Cpath fill='%234299E1' d='M0 30 Q 20 10, 50 30 T 100 30 V 50 H 0 Z'/%3E%3C/svg%3E"); /* Darker Blue SVG wave */
  background-size: 120px 50px;
  animation: wave-flow 7s linear infinite reverse; /* Slower and reverse */
  opacity: 0.6;
   height: 45px; /* Slightly shorter */
   z-index: 1; /* Behind first layer */
}

@keyframes wave-flow {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); } /* Move left by half its width */
}


/* --- New Water Spinner --- */
/* Remove old spinner styles if they exist */
.loading-spinner { /* Keep if used elsewhere, or remove */
  /* display: none; */ /* Hides old one if necessary */
}

.water-spinner {
  width: 50px;
  height: 50px;
  position: relative;
  /* margin-top: 24px; Provided by Tailwind mt-6 */
}

/* Create multiple circles for ripple effect */
.water-spinner::before,
.water-spinner::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #63B3ED; /* Match wave color */
  opacity: 0;
  animation: water-ripple 2s ease-out infinite;
}

/* Delay the second ripple */
.water-spinner::after {
  animation-delay: 0.75s;
}

@keyframes water-ripple {
  0% {
    transform: scale(0);
    opacity: 0.8;
  }
  80% {
    transform: scale(1.2);
    opacity: 0;
  }
  100% {
      transform: scale(1.3);
      opacity: 0;
  }
}