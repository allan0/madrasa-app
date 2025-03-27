import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { FaCheck, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// Assuming LearningStep interface is similar to DashboardPage's
interface LearningStep {
    id?: string | number;
    module: number;
    step: number;
    video_id: string;
    title: string;
    completed?: boolean;
    description?: string;
    thumbnail?: string;
}

// Helper function to create YouTube embed URL
const getYoutubeEmbedUrl = (videoId: string): string => {
  return `https://www.youtube.com/embed/${videoId}`;
};

// DELETED THE UNUSED getYoutubeThumbnailUrl FUNCTION


// Use NAMED EXPORT
export const LearningPathPage = () => {
    const navigate = useNavigate();
    const {
        learningPath,
        setLearningPath,
        colors,
        error,
     } = useAppContext();

     const currentLearningPath: LearningStep[] = Array.isArray(learningPath) ? learningPath : [];
     const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

     useEffect(() => {
         const firstIncompleteIndex = currentLearningPath.findIndex(step => !step.completed);
         setCurrentStepIndex(firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0);
     }, [currentLearningPath]); // Depend on the derived array

     const currentStep = currentLearningPath[currentStepIndex];

    // ... rest of handleMarkComplete, handleMarkIncomplete, handleNextStep, handlePreviousStep ...
    const handleMarkComplete = () => {
        if (!currentStep) return;
        const updatedPath = currentLearningPath.map((step, index) =>
            index === currentStepIndex ? { ...step, completed: true } : step
        );
        setLearningPath(updatedPath);
        handleNextStep();
    };

    const handleMarkIncomplete = () => {
        if (!currentStep) return;
        const updatedPath = currentLearningPath.map((step, index) =>
            index === currentStepIndex ? { ...step, completed: false } : step
        );
        setLearningPath(updatedPath);
    };


    const handleNextStep = () => {
         if (currentStepIndex < currentLearningPath.length - 1) {
            setCurrentStepIndex(prevIndex => prevIndex + 1);
         } else {
             navigate('/dashboard');
         }
     };

    const handlePreviousStep = () => {
        if (currentStepIndex > 0) {
            // Correction: Decrement index for previous step
            setCurrentStepIndex(prevIndex => prevIndex - 1);
        }
     };


    // --- Render Logic ---
    if (error || currentLearningPath.length === 0 || !currentStep) {
        // ... Error/Empty state JSX ...
         return (
             <div className={`min-h-screen p-6 ${colors.secondary} text-center ${colors.textPrimary}`}>
                 <h1 className="text-2xl mb-4">Learning Path Not Available</h1>
                 {error && <p className="text-red-600 mb-4">Error: {error}</p>}
                 <button
                    onClick={() => navigate('/dashboard')}
                     className={`${colors.primary} text-white font-semibold py-2 px-4 rounded-md hover:opacity-90`}
                >
                    Back to Dashboard
                </button>
             </div>
         );
    }

    return (
        <div className={`min-h-screen p-4 md:p-6 ${colors.secondary}`}>
             {/* Back Button / Header */}
             <div className="mb-4 flex items-center justify-between">
                {/* ... Header JSX ... */}
                 <button onClick={() => navigate('/dashboard')} className={`flex items-center ${colors.textPrimary} hover:opacity-75`}>
                     <FaArrowLeft className="mr-2"/> Back to Dashboard
                 </button>
                <span className="text-sm font-medium text-gray-500">Step {currentStepIndex + 1} of {currentLearningPath.length}</span>
             </div>

             {/* Main Content Card */}
             <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
                {/* Step Title */}
                <h2 className={`text-xl md:text-2xl font-bold mb-3 ${colors.textPrimary}`}>
                   {/* ... Title JSX ... */}
                    {currentStep.module && currentStep.step ? `M${currentStep.module} S${currentStep.step}: ` : ''}
                     {currentStep.title}
                 </h2>

                {/* Video Embed Area */}
                 <div className="aspect-w-16 aspect-h-9 mb-4 rounded-lg overflow-hidden shadow">
                   {/* ... Iframe JSX ... */}
                    <iframe
                         src={getYoutubeEmbedUrl(currentStep.video_id)}
                        title={currentStep.title}
                        frameBorder="0"
                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                         referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                 </div>

                {/* Optional Description */}
                {currentStep.description && (
                   // ... Description JSX ...
                    <p className={`text-gray-600 mb-4 text-sm`}>
                        {currentStep.description}
                     </p>
                )}

                 {/* Action Buttons */}
                 <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t pt-4 mt-4">
                    {/* ... Buttons JSX ... */}
                      {/* Completion Toggle */}
                     <button
                        onClick={currentStep.completed ? handleMarkIncomplete : handleMarkComplete}
                        className={`flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            currentStep.completed
                                 ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                         }`}
                     >
                        <FaCheck className={`mr-2 ${currentStep.completed ? 'text-green-500' : 'text-gray-400'}`} />
                         {currentStep.completed ? 'Completed' : 'Mark as Complete'}
                    </button>

                     {/* Navigation */}
                     <div className="flex gap-3">
                         <button
                             onClick={handlePreviousStep}
                            disabled={currentStepIndex === 0}
                             className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${colors.textPrimary} bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                         >
                            <FaArrowLeft className="mr-2" /> Previous
                        </button>
                        <button
                             onClick={handleNextStep}
                             className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${colors.primary} text-white hover:opacity-90 shadow disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                             {currentStepIndex === currentLearningPath.length - 1 ? 'Finish Path' : 'Next'}
                             <FaArrowRight className="ml-2" />
                        </button>
                    </div>
                 </div>
             </div>
         </div>
    );
};
