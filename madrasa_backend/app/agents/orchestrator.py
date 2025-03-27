from app.agents.profile_analyzer import ProfileAnalyzerAgent # Assume created
from app.agents.goal_clarifier import GoalClarifierAgent # Assume created
from app.agents.content_scout import ContentScoutAgent
from app.agents.curriculum_designer import CurriculumDesignerAgent
# Import other agents as needed

class Orchestrator:
    """Manages the flow of data between agents to generate a learning path."""
    def __init__(self):
        self.profile_analyzer = ProfileAnalyzerAgent()
        self.goal_clarifier = GoalClarifierAgent()
        self.content_scout = ContentScoutAgent()
        self.curriculum_designer = CurriculumDesignerAgent()
        # Add other agents

    async def generate_learning_path(self, user_data: dict) -> dict:
        """
        Coordinates the agents to generate a personalized learning path.
        user_data should contain: persona, goals (from questionnaire),
        linkedin_data (if available), telegram_user_info etc.
        """
        print("🚀 Orchestrator: Starting learning path generation...")
        
        # 1. Analyze Profile (if LinkedIn connected)
        profile_summary = "No LinkedIn profile provided."
        linkedin_skills = []
        if user_data.get("linkedin_data"):
             # Simplified - Assume ProfileAnalyzer extracts summary & skills
             profile_analysis_result = await self.profile_analyzer.process({"linkedin_data": user_data["linkedin_data"]})
             profile_summary = profile_analysis_result.get("summary", profile_summary)
             linkedin_skills = profile_analysis_result.get("skills", [])
             print(f"👤 Profile analysis summary: {profile_summary[:50]}...")


        # 2. Clarify Goals (already provided via questionnaire in user_data)
        goals = user_data.get("goals", [])
        persona = user_data.get("persona", "Unknown")
        print(f"🎯 Goals received: {goals}, Persona: {persona}")
        
        # 3. Determine Search Keywords (Combine profile, goals, persona)
        #    (This logic could be improved with NLP/LLM later)
        keywords = list(set(goals + linkedin_skills + [persona, "sourcing", "recruitment"])) # Basic combination

        # 4. Scout Content
        scout_data = {"keywords": keywords, "max_results": 10} # Get more initially
        scouting_result = await self.content_scout.process(scout_data)
        available_videos = scouting_result.get("videos", [])

        if scouting_result.get("error"):
            print(f"⚠️ Orchestrator: Content scouting failed: {scouting_result['error']}")
        elif not available_videos:
             print(f"⚠️ Orchestrator: No videos found for keywords: {keywords}")


        # 5. Design Curriculum
        design_data = {
            "profile_summary": profile_summary,
            "goals": goals,
            "persona": persona,
            "videos": available_videos,
        }
        curriculum_result = await self.curriculum_designer.process(design_data)

        if curriculum_result.get("error"):
             print(f"⚠️ Orchestrator: Curriculum design failed: {curriculum_result['error']}")
             return {"error": curriculum_result['error']}

        print("✅ Orchestrator: Learning path generated successfully.")
        return {"learning_path": curriculum_result.get("learning_path", [])}
