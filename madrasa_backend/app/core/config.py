import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    YOUTUBE_API_KEY: str
    LINKEDIN_CLIENT_ID: str
    LINKEDIN_CLIENT_SECRET: str
    TRANSLATION_API_KEY: str # e.g., for Google Cloud Translate
    TRANSLATION_API_URL: str = "https://translation.googleapis.com/language/translate/v2" # Example
    # Add database URL etc. if needed

    class Config:
        env_file = '.env'

settings = Settings()
