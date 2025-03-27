from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import logging # Import logging

from app.agents.orchestrator import Orchestrator
from app.agents.translation_agent import TranslationAgent
from app.models.user import OnboardingData, TranslationRequest, TranslationResponse # Define Pydantic models
from app.core.config import settings
# Add imports for LinkedIn OAuth flow if implementing

logging.basicConfig(level=logging.INFO) # Setup basic logging
logger = logging.getLogger(__name__)


app = FastAPI(title="Madrasa AI Backend")

# CORS (Cross-Origin Resource Sharing) - Allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Restrict in production! Allow your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = Orchestrator()
translator = TranslationAgent()

@app.get("/")
async def root():
    return {"message": "Welcome to the Madrasa AI Backend!"}

# --- Authentication Routes (Placeholder) ---
# /login/linkedin (Redirects to LinkedIn)
# /login/linkedin/callback (Handles callback from LinkedIn, exchanges code for token, fetches profile)
# These require libraries like 'requests-oauthlib' and careful handling of state and secrets.

@app.post("/generate-path")
async def generate_path(onboarding_data: OnboardingData):
    """
    Receives user onboarding data (persona, goals, potentially LinkedIn token/data)
    and triggers the multi-agent system to generate a learning path.
    """
    try:
        logger.info(f"Received onboarding data for user: {onboarding_data.telegram_user_id}")
        # In a real app, you'd fetch linkedin_data using a token if provided,
        # or rely solely on questionnaire data.
        # Assuming onboarding_data includes parsed goals, persona, etc.
        user_data_dict = onboarding_data.dict()
        # Example: Add placeholder linkedin_data if token exists (realistically fetch via API)
        # if onboarding_data.linkedin_access_token:
        #     user_data_dict["linkedin_data"] = await fetch_linkedin_profile(onboarding_data.linkedin_access_token)
        
        result = await orchestrator.generate_learning_path(user_data_dict)
        
        if "error" in result:
            logger.error(f"Error generating path: {result['error']}")
            raise HTTPException(status_code=500, detail=result["error"])
        
        logger.info(f"Successfully generated path with {len(result.get('learning_path', []))} steps.")
        return result

    except Exception as e:
        logger.exception("Unhandled exception in /generate-path") # Log full traceback
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")


@app.post("/translate", response_model=TranslationResponse)
async def translate_text(request_data: TranslationRequest):
    """
    Translates the provided text to the target language using the TranslationAgent.
    """
    try:
        logger.info(f"Received translation request for target language: {request_data.target_language}")
        result = await translator.process(request_data.dict())
        if "error" in result:
             logger.error(f"Translation error: {result['error']}")
             # Decide if you want to return error code or just original text + error message
             return TranslationResponse(original_text=request_data.text, translated_text=request_data.text, error=result["error"])
        
        logger.info("Translation successful.")
        return TranslationResponse(original_text=request_data.text, translated_text=result["translated_text"])
    
    except Exception as e:
        logger.exception("Unhandled exception in /translate")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

# Add other endpoints as needed (e.g., track progress, get user profile)
