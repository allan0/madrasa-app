// src/contexts/AppContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useTelegram } from '../hooks/useTelegram'; // Assuming path

// Define shape of UserInfo
interface UserInfo {
    id: number;
    firstName: string;
    lastName?: string;
    username?: string;
    photoUrl?: string;
    languageCode?: string;
}

// Define shape of LearningStep (repeat from other pages or import from a types file)
interface LearningStep {
    id?: string | number;
    module: number;
    step: number;
    video_id: string;
    title: string;
    completed?: boolean;
    // add other fields as needed
}

// Define shape of the context value
interface AppContextType {
    userInfo: UserInfo | null;
    setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
    userGender: 'male' | 'female';
    setUserGender: React.Dispatch<React.SetStateAction<'male' | 'female'>>;
    persona: string | null;
    setPersona: React.Dispatch<React.SetStateAction<string | null>>;
    goals: string[];
    setGoals: React.Dispatch<React.SetStateAction<string[]>>;
    learningPath: LearningStep[];
    setLearningPath: React.Dispatch<React.SetStateAction<LearningStep[]>>;
    isLoading: boolean; // General loading state (e.g., for API calls)
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
    colors: { primary: string; secondary: string; textPrimary: string; text_secondary: string; };
    activeColorScheme: 'male' | 'female';
}

// Create the context with a default value (can be undefined or null initially)
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider Component
export const AppProvider = ({ children }: { children: ReactNode }) => {
    const { user: tgUser } = useTelegram(); // Get user from Telegram hook
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null); // Initialize as null
    const [userGender, setUserGender] = useState<'male' | 'female'>('male'); // Default gender/theme
    const [persona, setPersona] = useState<string | null>(null);
    const [goals, setGoals] = useState<string[]>([]);
    const [learningPath, setLearningPath] = useState<LearningStep[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false); // Separate loading state
    const [error, setError] = useState<string | null>(null);
    const [hasUserInfoInitialized, setHasUserInfoInitialized] = useState(false); // Flag to run effect once

    // Derive color scheme based on gender
    const activeColorScheme = userGender === 'female' ? 'female' : 'male';
    // Use template literals for dynamic Tailwind classes (make sure purge includes these patterns)
    const colors = {
        primary: activeColorScheme === 'female' ? 'bg-pink-500' : 'bg-blue-500', // Example class names
        secondary: activeColorScheme === 'female' ? 'bg-pink-50' : 'bg-blue-50',
        textPrimary: activeColorScheme === 'female' ? 'text-pink-600' : 'text-blue-600', // Adjust actual color shades as needed
        text_secondary: activeColorScheme === 'female' ? 'text-pink-500' : 'text-blue-500', // Or use grays like text-gray-600
        // Add border colors, focus rings etc. similarly if needed elsewhere
    };

    // Effect to initialize userInfo from tgUser ONCE
    useEffect(() => {
         // Only run if we haven't initialized yet AND tgUser data is available
        if (!hasUserInfoInitialized && tgUser) {
            // console.log("AppContext: Initializing userInfo from tgUser", tgUser);
            setUserInfo({
                 id: tgUser.id,
                 firstName: tgUser.first_name || 'Learner', // Provide default if name is missing
                 lastName: tgUser.last_name || undefined,   // Use undefined if missing
                 username: tgUser.username || undefined,
                 photoUrl: tgUser.photo_url || undefined,
                 languageCode: tgUser.language_code || 'en', // Default to 'en'
             });
             setHasUserInfoInitialized(true); // Mark as initialized
        }
        // Add fallback for browser testing if desired:
        // else if (!hasUserInfoInitialized && !tgUser && !import.meta.env.PROD /* Check if in dev */) {
        //    console.log("AppContext: No TG user, setting dummy data for browser testing.");
        //    setUserInfo({ id: 123, firstName: 'Test', languageCode: 'en' });
        //    setHasUserInfoInitialized(true);
        // }
    }, [tgUser, hasUserInfoInitialized]); // Depend on tgUser and the flag


    const value: AppContextType = {
        userInfo, setUserInfo,
        userGender, setUserGender,
        persona, setPersona,
        goals, setGoals,
        learningPath, setLearningPath,
        isLoading, setIsLoading,
        error, setError,
        colors,
        activeColorScheme
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
