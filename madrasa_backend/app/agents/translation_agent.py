import httpx
from app.agents.base_agent import BaseAgent
from app.core.config import settings

class TranslationAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="Translator")

    async def process(self, data: dict) -> dict:
        """Translates text using an external API."""
        text_to_translate = data.get("text", "")
        target_language = data.get("target_language", "en") # Default to English
        source_language = data.get("source_language", None) # Let API detect if possible

        if not text_to_translate:
            return {"translated_text": "", "error": "No text provided."}

        print(f"🌐 {self.name}: Translating to '{target_language}'...")

        try:
            async with httpx.AsyncClient() as client:
                payload = {
                    'q': text_to_translate,
                    'target': target_language,
                    'key': settings.TRANSLATION_API_KEY
                }
                if source_language:
                    payload['source'] = source_language

                response = await client.post(settings.TRANSLATION_API_URL, data=payload)
                response.raise_for_status() # Raise error for bad status codes

                result = response.json()
                translated = result['data']['translations'][0]['translatedText']

                print(f"✅ {self.name}: Translation successful.")
                return {"translated_text": translated}
        except httpx.RequestError as e:
            print(f"❌ {self.name}: HTTP Request Error during translation: {e}")
            return {"translated_text": text_to_translate, "error": f"HTTP Error: {e}"}
        except Exception as e:
            print(f"❌ {self.name}: Error during translation: {e}, Response: {response.text if 'response' in locals() else 'N/A'}")
            return {"translated_text": text_to_translate, "error": str(e)} # Return original on error?
