// src/services/api.ts

import axios from 'axios';

// Use environment variable for backend URL, fallback for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// --- Interfaces for Backend Payloads/Responses ---

// Interface matching the Pydantic model for backend's OnboardingData (approx.)
interface GeneratePathPayload {
    telegram_user_info: {
         id: number;
         first_name?: string;
         last_name?: string;
         username?: string;
         photo_url?: string;
         language_code?: string;
     };
    persona: string;
    goals: string[];
    linkedin_profile_data?: any; // Optional based on your backend model
}

// Interface for the expected backend response for path generation (approx.)
interface LearningPathResponse {
     learning_path: {
         module: number;
         step: number;
         video_id: string;
         title: string;
         // Add other fields if your backend returns more
     }[];
     error?: string; // Include error field if backend returns errors this way
 }

 // Interface matching the Pydantic model for backend's TranslationRequest
 interface TranslationPayload {
     text: string;
     target_language: string;
     source_language?: string | null; // Matches backend model
 }

 // Interface for the expected backend response for translation
 interface TranslationApiResponse {
     original_text: string;
     translated_text: string;
     error?: string;
 }


// --- API Call Functions ---

/**
 * Calls the backend to generate a personalized learning path.
 */
export const generateLearningPath = async (payload: GeneratePathPayload): Promise<LearningPathResponse> => {
    try {
        console.log(`Sending POST to ${API_BASE_URL}/generate-path`);
         const response = await axios.post<LearningPathResponse>(`${API_BASE_URL}/generate-path`, payload);
        // Assuming backend returns 200 OK on success, even if 'error' field is set internally
         return response.data;
     } catch (error: any) {
         console.error("API call to /generate-path failed:", error);
        let errorMessage = "Network error or backend unreachable.";
        if (axios.isAxiosError(error) && error.response) {
             // Use error detail from backend response if available
             errorMessage = error.response.data?.detail || error.response.data?.error || `Server responded with status ${error.response.status}`;
        } else if (error instanceof Error) {
             errorMessage = error.message;
        }
         // Return an object matching the expected structure, but with the error
         return { learning_path: [], error: errorMessage };
     }
 };

 /**
  * Calls the backend to translate text.
  */
 export const translateText = async (text: string, targetLanguage: string, sourceLanguage: string | null = null): Promise<string> => {
     try {
         const payload: TranslationPayload = {
             text,
             target_language: targetLanguage,
             source_language: sourceLanguage
         };
         console.log(`Sending POST to ${API_BASE_URL}/translate for lang ${targetLanguage}`);
         const response = await axios.post<TranslationApiResponse>(`${API_BASE_URL}/translate`, payload);

         if (response.data.error) {
             console.error("Translation API Error:", response.data.error);
             return text; // Return original text on backend-reported error
         }
         return response.data.translated_text;
     } catch (error: any) {
         console.error("API call to /translate failed:", error);
         // Fallback to original text on network/server error
         return text;
     }
 };

 // Add other API call functions here if needed later (e.g., update progress, fetch profile)
