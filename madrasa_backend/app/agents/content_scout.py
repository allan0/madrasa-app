import httpx
from app.agents.base_agent import BaseAgent
from app.core.config import settings
from app.services.youtube_api import search_youtube_videos # Assume this service exists

class ContentScoutAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="ContentScout")

    async def process(self, data: dict) -> dict:
        """Searches YouTube for videos based on keywords."""
        keywords = data.get("keywords", [])
        max_results = data.get("max_results", 5)

        print(f"🕵️ {self.name}: Searching YouTube for keywords: {keywords}")

        if not keywords:
            return {"videos": [], "error": "No keywords provided."}

        try:
            # Assuming search_youtube_videos is an async function using httpx
            videos = await search_youtube_videos(
                api_key=settings.YOUTUBE_API_KEY,
                query=" ".join(keywords) + " sourcing tutorial", # Add context
                max_results=max_results
            )
            print(f"✅ {self.name}: Found {len(videos)} videos.")
            return {"videos": videos}
        except Exception as e:
            print(f"❌ {self.name}: Error searching YouTube: {e}")
            return {"videos": [], "error": str(e)}

# Assume app.services.youtube_api.py contains:
# async def search_youtube_videos(api_key: str, query: str, max_results: int = 5) -> list[dict]:
#    # ... implementation using httpx to call YouTube Data API v3 search.list ...
#    # Returns list of {'id': 'videoId', 'title': '...', 'description': '...', 'thumbnail': '...'}
