//import React from 'react'; // Keep React for JSX
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
// *** REMOVED UNUSED FaLanguage, FaListAlt ***
import { FaPlayCircle, FaCheckCircle, FaCog } from 'react-icons/fa';

// Define the expected structure for a learning path step
interface LearningStep {
    id?: string | number;
    module: number;
    step: number;
    video_id: string;
    title: string;
    completed?: boolean;
}

// Use NAMED EXPORT
export const DashboardPage = () => {
    const navigate = useNavigate();
    const {
        userInfo,
        persona,
        goals,
        learningPath,
        isLoading,
        error,
        colors,
     } = useAppContext();

    const currentLearningPath: LearningStep[] = Array.isArray(learningPath) ? learningPath : [];
    const progress = currentLearningPath.filter(step => step.completed).length;
    const totalSteps = currentLearningPath.length;

    // ---- Loading State Handling ----
    if (isLoading && totalSteps === 0 && goals && goals.length > 0) {
         return ( /* ... Loading JSX ... */ <div className={`min-h-screen flex items-center justify-center ${colors.secondary} ${colors.textPrimary} p-6`}><div className="text-center"><svg className="animate-spin h-10 w-10 text-gray-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg><p className="text-xl">Generating...</p><p className={colors.text_secondary ?? 'text-gray-500'}>Based on persona: <span className="font-medium">{persona}</span></p></div></div> );
    }

    // ---- Error State Handling ----
    if (error && totalSteps === 0) {
           return ( /* ... Error JSX ... */ <div className={`min-h-screen flex items-center justify-center ${colors.secondary} p-6`}><div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg text-center shadow-md max-w-lg"><h2 className="text-xl font-bold mb-2">Oops!</h2><p className="mb-4">Couldn't generate path.</p><p className="text-sm bg-red-50 p-2 rounded border border-red-200 mb-4">{error}</p><button onClick={() => navigate('/set-goals')} className={`${colors.primary} text-white font-semibold py-2 px-4 rounded-md hover:opacity-90`}>Try Adjusting Goals</button></div></div> );
    }

    // ---- Path Not Available (General Catch-all) ----
     if (totalSteps === 0) {
          return ( /* ... Path not ready JSX ... */ <div className={`min-h-screen p-6 ${colors.secondary} ${colors.textPrimary} text-center`}><h1 className="text-2xl mb-4">Welcome, {userInfo?.firstName || 'Learner'}!</h1><p className="mb-4">Path isn't ready.</p>{!persona ? (<button onClick={() => navigate('/select-persona')} className={`${colors.primary} text-white font-semibold py-2 px-4 rounded-md hover:opacity-90`}> Choose Persona </button>) : (<button onClick={() => navigate('/set-goals')} className={`${colors.primary} text-white font-semibold py-2 px-4 rounded-md hover:opacity-90`}> Set Goals </button>)}</div> );
     }

    // --- Main Dashboard View (When Path Exists) ---
    const firstIncompleteStep = currentLearningPath.find(step => !step.completed);
    const handleContinueLearning = () => navigate(`/learning-path`);
    const progressPercentage = totalSteps > 0 ? Math.round((progress / totalSteps) * 100) : 0;

    return (
        <div className={`min-h-screen p-6 ${colors.secondary}`}>
            {/* Header */}
             <div className="flex justify-between items-center mb-8">
                 <h1 className={`text-3xl font-bold ${colors.textPrimary}`}>Welcome, {userInfo?.firstName || 'Learner'}! 👋</h1>
                 <button onClick={() => navigate('/settings')} title="Settings" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                    <FaCog size={24} className={`${colors.text_secondary ?? 'text-gray-500'} hover:text-gray-700`} /> {/* Used FaCog */}
                 </button>
             </div>

            {/* Progress Card */}
             <div className="bg-white p-6 rounded-lg shadow-lg mb-8 max-w-3xl mx-auto">
                 <h2 className={`text-xl font-semibold mb-4 ${colors.textPrimary}`}>{progress === totalSteps ? "Path Completed!" : "Your Learning Journey"}</h2>
                 {/* Progress Bar Section */}
                 <div className="mb-4">
                     <div className="flex justify-between text-sm font-medium mb-1"><span className={colors.text_secondary ?? 'text-gray-500'}>Progress</span><span className={colors.textPrimary}>{progressPercentage}%</span></div>
                     <div className={`w-full ${colors.secondary} rounded-full h-2.5`}><div className={`${colors.primary} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${progressPercentage}%` }}></div></div>
                     <p className="text-xs text-gray-500 mt-1">{progress} of {totalSteps} steps completed</p>
                 </div>
                 {/* Next Step / Completion Message */}
                 {firstIncompleteStep ? (
                     <div className="mt-4">
                         <p className="text-gray-600 mb-3 text-sm">Next up: <span className={`font-semibold ${colors.textPrimary}`}>{firstIncompleteStep.title}</span>{' '}(M{firstIncompleteStep.module}, S{firstIncompleteStep.step})</p>
                         <button onClick={handleContinueLearning} className={`w-full md:w-auto inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${colors.primary} text-white hover:opacity-90 shadow`}>
                             <FaPlayCircle className="mr-2" /> Continue Learning {/* Used FaPlayCircle */}
                         </button>
                     </div>
                 ) : (
                    <div className="text-center p-4 bg-green-50 rounded-md border border-green-200 mt-4">
                         <FaCheckCircle className="text-green-500 mx-auto text-4xl mb-2"/> {/* Used FaCheckCircle */}
                         <p className={`font-semibold text-green-700`}>Congratulations! You've completed your current path.</p>
                         <button onClick={() => navigate('/set-goals')} className="mt-3 text-sm font-medium text-blue-600 hover:underline">Set New Goals?</button>
                     </div>
                 )}
            </div>
             {/* Quick Links - COMMENTED OUT - Requires FaListAlt, FaLanguage */}
            {/*
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto text-center">
                 <div className={...} onClick={() => navigate('/learning-path')}><FaListAlt className={...} /> View Full Path</div>
                 <div className={...} onClick={() => navigate('/settings')}><FaLanguage className={...} /> Settings</div>
            </div>
            */}
        </div>
    );
};
