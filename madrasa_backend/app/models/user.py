from pydantic import BaseModel, Field
from typing import List, Optional, Any

class TelegramUserInfo(BaseModel):
    id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    username: Optional[str] = None
    photo_url: Optional[str] = None
    language_code: Optional[str] = None

class OnboardingData(BaseModel):
    telegram_user_info: TelegramUserInfo
    persona: str
    goals: List[str] = Field(..., min_items=1) # Must provide at least one goal
    # Optional fields based on whether LinkedIn connect succeeded
    linkedin_profile_data: Optional[dict] = None # Store relevant parsed data
    # Or maybe linkedin_access_token: Optional[str] = None if backend fetches

    # Allow getting user ID easily
    @property
    def telegram_user_id(self):
        return self.telegram_user_info.id if self.telegram_user_info else None


class TranslationRequest(BaseModel):
    text: str
    target_language: str = "en" # Default language
    source_language: Optional[str] = None

class TranslationResponse(BaseModel):
    original_text: str
    translated_text: str
    error: Optional[str] = None
