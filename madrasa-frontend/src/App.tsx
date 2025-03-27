import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { useTelegram } from './hooks/useTelegram';

import LoadingScreen from './components/LoadingScreen';

// --- Imports for Page Components ---
import OnboardingPage from './pages/OnboardingPage';           // Default
import { PersonaSelectionPage } from './pages/PersonaSelectionPage'; // Named
import { GoalSettingPage } from './pages/GoalSettingPage';       // Named
// *** CORRECTED IMPORT FOR DASHBOARDPAGE (Back to Default) ***
import { DashboardPage } from './pages/DashboardPage'; // Use NAMED import { }
import { LearningPathPage } from './pages/LearningPathPage';     // Named
import { SettingsPage } from './pages/SettingsPage';          // Named


// --- App Initializer Component Definition ---
const AppInitializer = ({ children }: { children: React.ReactNode }) => {
    const { userInfo } = useAppContext();
    const { tg } = useTelegram();
    const [isUserInfoStable, setIsUserInfoStable] = useState(false);
    const [minLoadingTimePassed, setMinLoadingTimePassed] = useState(false);

    useEffect(() => {
        if (userInfo) setIsUserInfoStable(true);
    }, [userInfo]);

    useEffect(() => {
        const visualTimer = setTimeout(() => setMinLoadingTimePassed(true), 2500);
        tg?.ready();
        return () => clearTimeout(visualTimer);
    }, [tg]);

    const initializationComplete = isUserInfoStable && minLoadingTimePassed;

    if (!initializationComplete) return <LoadingScreen />;
    return <>{children}</>;
};

// --- AppRoutes Component Definition ---
function AppRoutes() {
    const { userInfo, persona, learningPath, goals } = useAppContext();

    if (!userInfo) {
        console.error("AppRoutes ERROR: Rendering without userInfo!");
        return <div>Error: Application failed to initialize user data.</div>;
    }

    // Routing logic based on state...
     if (!persona) {
        return ( <Routes> <Route path="/onboarding" element={<OnboardingPage />} /> <Route path="/select-persona" element={<PersonaSelectionPage />} /> <Route path="/set-goals" element={<GoalSettingPage />} /> <Route path="*" element={<Navigate to="/onboarding" replace />} /> </Routes> );
     }
     if (!learningPath || learningPath.length === 0) {
        if (!goals || goals.length === 0) {
             return ( <Routes> <Route path="/set-goals" element={<GoalSettingPage />} /> <Route path="*" element={<Navigate to="/set-goals" replace />} /> </Routes> );
         } else {
             return ( <Routes> <Route path="/dashboard" element={<DashboardPage />} /> <Route path="/set-goals" element={<GoalSettingPage />} /> <Route path="*" element={<Navigate to="/dashboard" replace />} /> </Routes> );
         }
     }
     // Fully Onboarded
     return ( <Routes> <Route path="/dashboard" element={<DashboardPage />} /> <Route path="/learning-path" element={<LearningPathPage />} /> <Route path="/settings" element={<SettingsPage />} /> <Route path="/set-goals" element={<GoalSettingPage />} /> <Route path="/select-persona" element={<PersonaSelectionPage />} /> <Route path="*" element={<Navigate to="/dashboard" replace />} /> </Routes> );
}

// --- App Component Definition ---
function App() {
    return (
        <AppProvider>
            <Router>
                <AppInitializer>
                    <div className="font-sans antialiased">
                        <AppRoutes />
                    </div>
                </AppInitializer>
            </Router>
        </AppProvider>
    );
}

export default App;
