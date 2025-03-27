from abc import ABC, abstractmethod

class BaseAgent(ABC):
    """Abstract base class for all agents."""
    def __init__(self, name: str):
        self.name = name

    @abstractmethod
    async def process(self, data: dict) -> dict:
        """Process input data and return results."""
        pass

    def __repr__(self):
        return f"{self.__class__.__name__}(name={self.name})"
