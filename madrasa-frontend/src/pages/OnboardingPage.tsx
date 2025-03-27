import React, { useRef } from 'react';
import { Swiper as SwiperCore } from 'swiper';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
// FIX: Ensure Pagination IS imported correctly from swiper/modules
import { Pagination } from 'swiper/modules';

// FIX: Try importing the BUNDLED CSS which includes pagination styles
import 'swiper/swiper-bundle.css';
// Removed: import 'swiper/css'; // Removed direct core CSS import

import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { FaBookOpen, FaBrain, FaGlobeAmericas } from 'react-icons/fa';
import { IoIosArrowForward } from "react-icons/io";


export default function OnboardingPage() {
  const navigate = useNavigate();
  const { colors } = useAppContext();
  const swiperRef = useRef<SwiperRef>(null);

  const handleNext = () => {
      if (swiperRef.current) {
         const swiperInstance: SwiperCore = swiperRef.current.swiper;
         if (swiperInstance.isEnd) {
              console.log("Onboarding finished, navigating to /select-persona");
              navigate('/select-persona');
         } else {
              swiperInstance.slideNext();
         }
      } else {
        console.error("Swiper instance not found in ref.");
      }
  };

  // Styles and color logic...
  // ... (keep the previous style definitions and hex extraction logic) ...
   const nextButtonStyle = `${colors?.primary || 'bg-blue-500'} text-white font-bold py-3 px-8 rounded-full shadow-lg hover:opacity-90 transition-opacity duration-200 flex items-center justify-center text-lg`;
   const pageBackground = colors?.secondary || 'bg-gray-100';
   const primaryTextColor = colors?.textPrimary || 'text-gray-800';
   const secondaryTextColor = colors?.text_secondary || 'text-gray-600';
   // Function to try and extract hex color - Adjust if your colors object provides direct hex values
    const getHexFromClass = (tailwindClass: string | undefined): string | undefined => {
        if (!tailwindClass) return undefined;
        // Try direct hex first
        if (tailwindClass.startsWith('#')) return tailwindClass;
        // Basic Tailwind class mapping
        const match = tailwindClass.match(/bg-(\w+)-(\d+)/);
        if (match) {
            const colorsMap: { [key: string]: { [key: string]: string } } = {
                 blue: { '500': '#3B82F6' }, pink: { '500': '#EC4899' }, /* Add more if needed */
            };
            return colorsMap[match[1]]?.[match[2]];
        }
        return undefined;
    };
   const swiperPaginationColor = getHexFromClass(colors?.primary) || '#3B82F6'; // Default color


  return (
    <div className={`min-h-screen flex flex-col ${pageBackground} p-6`}>
       <Swiper
        ref={swiperRef}
        // FIX: Ensure Pagination variable IS used here and imported above
        modules={[Pagination]}
        spaceBetween={50}
        slidesPerView={1}
        pagination={{ clickable: true }} // This enables pagination
        className="flex-grow w-full"
        style={{ '--swiper-pagination-color': swiperPaginationColor } as React.CSSProperties}
       >
        {/* Slides ... */}
        {/* ... Slides JSX remains the same ... */}
        <SwiperSlide className="flex flex-col items-center justify-center text-center h-full pt-10 pb-20">
          <FaBookOpen size={80} className={`${primaryTextColor} mb-6`} />
          <h2 className={`text-3xl font-bold mb-4 ${primaryTextColor}`}>Unlock Your Sourcing Superpowers ✨</h2>
          <p className={`text-lg ${secondaryTextColor} max-w-md`}>
            Madrasa is your personal AI guide... 🎓
          </p>
        </SwiperSlide>
        {/* Other Slides */}
         <SwiperSlide className="flex flex-col items-center justify-center text-center h-full pt-10 pb-20">
          <FaBrain size={80} className={`${primaryTextColor} mb-6`} />
          <h2 className={`text-3xl font-bold mb-4 ${primaryTextColor}`}>Personalized Learning, Powered by AI 🤖</h2>
          <p className={`text-lg ${secondaryTextColor} max-w-md`}>
             Connect your LinkedIn profile... 🛤️
          </p>
        </SwiperSlide>
        <SwiperSlide className="flex flex-col items-center justify-center text-center h-full pt-10 pb-20">
          <FaGlobeAmericas size={80} className={`${primaryTextColor} mb-6`} />
          <h2 className={`text-3xl font-bold mb-4 ${primaryTextColor}`}>Learn Anywhere, Grow Everywhere 🌍</h2>
           <p className={`text-lg ${secondaryTextColor} max-w-md`}>
            Learn at your own pace... 🌐 Let's get started!
           </p>
        </SwiperSlide>

       </Swiper>

      <div className="mt-auto pt-4 flex justify-center">
        <button onClick={handleNext} className={nextButtonStyle}>
            Next <IoIosArrowForward className="ml-2" size={20}/>
        </button>
       </div>
    </div>
  );
}
