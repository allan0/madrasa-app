import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { FaSeedling, FaRocket, FaUserTie, FaSearchLocation } from 'react-icons/fa'; // Example icons

// Define the Persona type
interface Persona {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ size: number, className: string }>; // Specify type for icon component
}

// Available personas data
const personas: Persona[] = [
  { id: 'aspiring', name: '🌱 The Aspiring Sourcer', description: 'New to sourcing? Start here.', icon: FaSeedling },
  { id: 'booster', name: '🚀 The Skill Booster', description: 'Enhance your existing sourcing skills.', icon: FaRocket },
  { id: 'lead', name: '🧑‍🏫 The Team Lead / Manager', description: 'Learn strategies to guide your team.', icon: FaUserTie }, // Changed Icon for Variety
  { id: 'niche', name: '💎 The Niche Hunter', description: 'Master techniques for hard-to-fill roles.', icon: FaSearchLocation }, // Changed Icon for Variety
];


// Use NAMED EXPORT to match the import in App.tsx
export const PersonaSelectionPage = () => {
    const navigate = useNavigate();
    const { setPersona, colors, activeColorScheme } = useAppContext();

    const handleSelectPersona = (personaId: string) => {
        console.log(`Selected persona: ${personaId}`);
        setPersona(personaId); // Update context
        navigate('/set-goals'); // Navigate to the next step (Goal Setting)
    };

    const cardHoverClass = activeColorScheme === 'female'
        ? 'hover:border-pink-400 hover:shadow-pink-100'
        : 'hover:border-blue-400 hover:shadow-blue-100';
        
    const selectedButtonClass = `${colors.primary} text-white`;

    return (
        <div className={`min-h-screen p-6 ${colors.secondary}`}>
            <h1 className={`text-3xl font-bold mb-2 text-center ${colors.textPrimary}`}>
                Choose Your Path
            </h1>
            <p className={`text-center mb-8 ${colors.text_secondary ?? 'text-gray-600'}`}>Select the profile that best describes you.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {personas.map((persona) => (
                    <div
                        key={persona.id}
                        className={`bg-white p-6 rounded-lg shadow-md border-2 border-transparent transition-all duration-300 cursor-pointer ${cardHoverClass}`}
                        onClick={() => handleSelectPersona(persona.id)}
                    >
                        <div className="flex items-center mb-3">
                           <persona.icon size={30} className={`${colors.textPrimary} mr-3`} />
                            <h2 className={`text-xl font-semibold ${colors.textPrimary}`}>
                                {persona.name}
                            </h2>
                        </div>
                        <p className={`text-gray-600 mb-4`}>
                            {persona.description}
                        </p>
                        <button
                           onClick={(e) => { e.stopPropagation(); handleSelectPersona(persona.id); }} // Prevent card click + button click issues
                           className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors duration-200 ${selectedButtonClass} hover:opacity-90`}
                        >
                            Select
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// No separate 'export default' needed because we used 'export const PersonaSelectionPage' above.
