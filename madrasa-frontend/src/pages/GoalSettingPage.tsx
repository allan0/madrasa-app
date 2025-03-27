// src/pages/GoalSettingPage.tsx

import React, { useState } from 'react'; // React is needed for useState
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { generateLearningPath } from '../services/api'; // Ensure this path is correct

// Define Goal type
interface GoalOption {
    id: string;
    label: string;
}

// Predefined Goal Options
const commonGoals: GoalOption[] = [
    { id: 'understand_basics', label: 'Understand Sourcing Fundamentals' },
    { id: 'boolean_search', label: 'Master Boolean Search Strings' },
    { id: 'linkedin_sourcing', label: 'Improve LinkedIn Sourcing' },
    { id: 'github_sourcing', label: 'Learn GitHub Sourcing for Tech Roles' },
    { id: 'tools_discovery', label: 'Discover New Sourcing Tools & Extensions' },
    { id: 'candidate_engagement', label: 'Enhance Candidate Engagement Messages' },
    { id: 'niche_talent', label: 'Find Niche or Hard-to-Fill Talent' },
    { id: 'reporting_metrics', label: 'Understand Sourcing KPIs & Metrics' },
    { id: 'advanced_techniques', label: 'Explore Advanced/OSINT Techniques' },
];

// NAMED EXPORT
export const GoalSettingPage = () => {
    const navigate = useNavigate();
    const {
        persona,
        setGoals, // This should update the context's goal state immediately for routing logic
        setLearningPath, // This updates the path AFTER successful API call
        setIsLoading,
        setError,
        isLoading,
        error,
        colors,
        activeColorScheme,
        userInfo
     } = useAppContext();

    const [selectedGoalIds, setSelectedGoalIds] = useState<Set<string>>(new Set());

    // --- State derived for button logic ---
    const noGoalsSelected = selectedGoalIds.size === 0;

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        // Clear error when user makes a selection
        if(error) setError(null);

        setSelectedGoalIds(prev => {
            const newSet = new Set(prev);
            if (checked) {
                newSet.add(value);
            } else {
                newSet.delete(value);
            }
            return newSet;
        });
    };

    const handleSubmitGoals = async () => {
        console.log("handleSubmitGoals triggered"); // Log 1: Start

        // --- Initial Validation ---
        if (noGoalsSelected) {
            console.log("Validation failed: No goals selected."); // Log Validation Fail
            setError("Please select at least one goal.");
            return;
        }
        if (!persona) {
            console.log("Validation failed: Persona not set."); // Log Validation Fail
            setError("Persona not selected. Please go back.");
            return;
        }
         if (!userInfo) {
             console.log("Validation failed: UserInfo not available."); // Log Validation Fail
             setError("User information not available. Please try reloading.");
             return;
        }

        // --- Prepare Data ---
        const goalLabels = Array.from(selectedGoalIds)
            .map(id => commonGoals.find(g => g.id === id)?.label) // Get the label text
            .filter((label): label is string => typeof label === 'string'); // Filter out undefined and ensure type is string

        console.log("Selected Goals (Labels):", goalLabels); // Log 2: Goals being sent

        // Update context immediately with chosen goals (might be useful for routing in AppRoutes)
        setGoals(goalLabels);

        // --- API Call ---
        setIsLoading(true); // Set loading true BEFORE api call
        setError(null); // Clear previous errors
        setLearningPath([]); // Clear old path if retrying

        console.log("Calling API: generateLearningPath"); // Log 3: API call start
        try {
             const apiPayload = {
                 telegram_user_info: userInfo, // Ensure userInfo structure matches backend expectation
                 persona: persona,
                 goals: goalLabels,
                 // linkedin_profile_data: undefined, // Add if needed
             };
            console.log("API Payload:", apiPayload); // Log Payload

            // Call the API function
             const pathResult = await generateLearningPath(apiPayload);

            console.log("API Response:", pathResult); // Log 4: API response

            if (pathResult && pathResult.learning_path && pathResult.learning_path.length > 0) {
                 console.log("API Success: Path received with steps."); // Log 5a: Success
                 setLearningPath(pathResult.learning_path); // Update context with the NEW path
                navigate('/dashboard'); // Navigate to dashboard on success
            } else {
                 // Handle cases where API returns 200 but path is empty or there's a specific error message
                 const errorMessage = pathResult?.error || "Backend generated an empty path or reported an unknown issue.";
                 console.error("API Reported Error or Empty Path:", errorMessage); // Log 5b: Backend Error
                 setError(errorMessage);
                 // Stay on goals page to show error
            }
        } catch (err: any) {
            // Handle network errors or exceptions during the API call itself
            console.error("API Call Exception:", err); // Log 5c: Network/Code Error
            setError(`Failed to generate path: ${err.message || 'Check network or server logs.'}`);
            // Stay on goals page to show error
        } finally {
            console.log("Setting isLoading to false."); // Log 6: Loading finished
            setIsLoading(false); // Set loading false AFTER api call finishes (success or error)
        }
    };

    // Button styling
     const buttonClass = `${colors.primary} text-white font-bold py-3 px-8 rounded-full shadow-lg transition-opacity duration-200 flex items-center justify-center text-lg`;
    // Button disabled state logic
     const isButtonDisabled = isLoading || noGoalsSelected; // Combine loading and selection checks
     const buttonDisabledClasses = isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90';

     // Checkbox styling
     const checkboxClass = `form-checkbox h-5 w-5 rounded border-gray-300 focus:ring-offset-0 ${activeColorScheme === 'female' ? 'text-pink-500 focus:ring-pink-400' : 'text-blue-500 focus:ring-blue-400'}`;


    return (
        <div className={`min-h-screen p-6 ${colors.secondary}`}>
            <h1 className={`text-3xl font-bold mb-2 text-center ${colors.textPrimary}`}>
                What are your goals?
            </h1>
             <p className={`text-center mb-8 ${colors.text_secondary ?? 'text-gray-600'}`}>
                 Help us tailor your learning path. Select your key objectives (1-3 recommended).
                 <br/> Your Persona: <span className={`font-semibold ${colors.textPrimary}`}>{persona || 'Not Set'}</span>
             </p>

             {/* Display API or Validation Errors */}
             {error && (
                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 max-w-xl mx-auto" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
             )}


             <div className="bg-white p-6 rounded-lg shadow max-w-xl mx-auto mb-8">
                 <fieldset disabled={isLoading}> {/* Disable fieldset while loading */}
                    <legend className={`text-lg font-semibold mb-4 ${colors.textPrimary}`}>Select Goals:</legend>
                     <div className="space-y-3">
                         {commonGoals.map((goal) => (
                            <label key={goal.id} className={`flex items-center space-x-3 ${isLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                                <input
                                     type="checkbox"
                                     value={goal.id}
                                    checked={selectedGoalIds.has(goal.id)}
                                    onChange={handleCheckboxChange}
                                    className={checkboxClass}
                                    disabled={isLoading} // Explicitly disable checkbox too
                                />
                                {/* CORRECTED TYPO HERE */}
                                <span className={colors.textPrimary}>{goal.label}</span>
                            </label>
                         ))}
                     </div>
                 </fieldset>
             </div>


            {/* Submit Button */}
            <div className="flex justify-center">
                <button
                    onClick={handleSubmitGoals}
                     disabled={isButtonDisabled} // Use the combined disabled state variable
                     className={`${buttonClass} ${buttonDisabledClasses}`} // Apply base and disabled styles
                >
                    {/* Show loading indicator or rocket icon */}
                     {isLoading ? (
                        <>
                           <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                           Generating Path...
                         </>
                    ) : (
                       <>Generate Learning Path <span className="ml-2">🚀</span></>
                     )}
                </button>
             </div>

         </div>
    );
};
