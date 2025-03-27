import React from 'react';
import { useAppContext } from '../contexts/AppContext'; // Likely needed for settings

// Use NAMED EXPORT to match the import in App.tsx (based on the last error)
export const SettingsPage = () => {
    const { colors, userGender, setUserGender, userInfo, setUserInfo } = useAppContext(); // Get state and setters

    // Handler for changing the theme preference (gender affects colors)
    const handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newGender = event.target.value as 'male' | 'female';
        setUserGender(newGender);
        // In a real app, you might save this preference to localStorage or a backend
    };

     // Handler for changing the language preference
      const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
         const newLang = event.target.value;
         // Update language in context (assuming languageCode is part of userInfo)
          if (userInfo) {
             setUserInfo({ ...userInfo, languageCode: newLang });
              // Also potentially save this preference
         }
          console.log("Language preference changed to:", newLang);
          // You would trigger translation logic based on this new language code
     };


    return (
        <div className={`min-h-screen p-6 ${colors.secondary}`}>
            <h1 className={`text-3xl font-bold mb-6 ${colors.textPrimary}`}>
                ⚙️ Settings
            </h1>

            <div className="bg-white p-4 rounded-lg shadow mb-6 max-w-md mx-auto">
                <label htmlFor="genderSelect" className={`block mb-2 font-semibold ${colors.text_secondary ?? 'text-gray-600'}`}>
                    Theme Preference:
                </label>
                <select
                    id="genderSelect"
                    value={userGender}
                    onChange={handleGenderChange}
                    className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${userGender === 'male' ? 'focus:ring-blue-300' : 'focus:ring-pink-300'}`}
                >
                    <option value="male">Blue/White Theme</option>
                    <option value="female">Pink/White Theme</option>
                </select>
                <p className="text-sm text-gray-500 mt-2">Changes the app's primary color scheme.</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow max-w-md mx-auto">
               <label htmlFor="languageSelect" className={`block mb-2 font-semibold ${colors.text_secondary ?? 'text-gray-600'}`}>
                   App Language:
                </label>
                <select
                   id="languageSelect"
                    value={userInfo?.languageCode || 'en'} // Default to 'en' if not in userInfo
                   onChange={handleLanguageChange}
                   className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${userGender === 'male' ? 'focus:ring-blue-300' : 'focus:ring-pink-300'}`}
                >
                    {/* Add more languages as needed */}
                    <option value="en">English</option>
                    <option value="es">Español (Spanish)</option>
                     <option value="fr">Français (French)</option>
                     <option value="ar">العربية (Arabic)</option>
                     {/* Add others supported by your translation agent */}
                 </select>
                <p className="text-sm text-gray-500 mt-2">Translates UI elements and content where available.</p>
            </div>

            {/* You can add more settings fields here */}

        </div>
    );
};

// No separate 'export default' needed because we used 'export const SettingsPage' above.
