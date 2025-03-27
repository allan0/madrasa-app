// src/hooks/useTelegram.ts
import { useState, useEffect, useMemo } from 'react';
import WebApp from '@twa-dev/sdk'; // Assuming you installed @twa-dev/sdk

// Import or define the User type from the SDK for better type safety
import type { WebAppUser } from '@twa-dev/types'; // Get specific type from the types package

// OR define a simplified local type if you don't need everything
// interface TgUser {
//   id: number;
//   is_bot?: boolean;
//   first_name: string;
//   last_name?: string;
//   username?: string;
//   language_code?: string;
//   is_premium?: boolean;
//   photo_url?: string;
// }


export function useTelegram() {
    // Define state to hold either WebAppUser or null
    const [user, setUser] = useState<WebAppUser | null>(null); // FIX: Specify type here
    const [themeParams, setThemeParams] = useState(WebApp.themeParams);
    const [colorScheme, setColorScheme] = useState(WebApp.colorScheme);
    const [isExpanded, setIsExpanded] = useState(WebApp.isExpanded);
    const [isReady, setIsReady] = useState(false); // Track if WebApp.ready() has been called

    useEffect(() => {
        // Call ready() only once
        if (!isReady) {
            WebApp.ready();
            setIsReady(true);
            // console.log("WebApp.ready() called");
        }

        const handleViewportChanged = () => {
            setIsExpanded(WebApp.isExpanded);
        };

        const handleThemeChanged = () => {
            setThemeParams(WebApp.themeParams);
            setColorScheme(WebApp.colorScheme);
        };

        WebApp.onEvent('viewportChanged', handleViewportChanged);
        WebApp.onEvent('themeChanged', handleThemeChanged);

        // --- FIX for setting user state ---
        // Use initDataUnsafe which might exist immediately
        if (WebApp.initDataUnsafe?.user) {
             // console.log("Setting user from initDataUnsafe", WebApp.initDataUnsafe.user);
            // Directly set the user, type matches useState<WebAppUser | null>
             setUser(WebApp.initDataUnsafe.user);
        } else if (!import.meta.env.PROD) {
             // Fallback for development outside Telegram
             console.warn("Telegram user data not available via initDataUnsafe. Using dummy data for development.");
             // Dummy data now correctly matches the type signature
              setUser({
                  id: 12345,
                  first_name: 'Test',
                  last_name: 'User',
                  username: 'testuser',
                  language_code: 'en',
                 // Add other fields from WebAppUser if needed, or keep it minimal if using a local type
                 // is_bot: false, is_premium: false // etc.
             });
         } else {
            // In production without user data - might be an issue
            console.error("Telegram user data not found in production environment.");
         }


        return () => {
            WebApp.offEvent('viewportChanged', handleViewportChanged);
            WebApp.offEvent('themeChanged', handleThemeChanged);
        };
    }, [isReady]); // Rerun if isReady changes (but should only run setup once)

    // Memoize safeUser to prevent unnecessary re-renders if user object reference changes but content is same
    const safeUser = useMemo(() => user, [user]);

    return {
        tg: WebApp,
        user: safeUser, // Use the memoized version
        themeParams,
        colorScheme,
        isExpanded
    };
}
