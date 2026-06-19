from pydantic import BaseModel, Field
from typing import List, Optional

# Individual task within a phase
class Task(BaseModel):
    id: str
    title: str
    description: str
    is_completed: bool = False

# A grouping of tasks
class Phase(BaseModel):
    phase_number: int
    title: str
    description: str
    tasks: List[Task]

# The complete roadmap object
class Roadmap(BaseModel):
    project_name: str
    summary: str
    phases: List[Phase]

# Request model for generating a new roadmap
class GenerateRoadmapRequest(BaseModel):
    project_idea: str
    skill_level: str  # e.g., "Beginner", "Intermediate"
    time_available: str # e.g., "2 weeks"
    tech_stack: List[str]
    goals: Optional[str] = None

# Request model for editing an existing roadmap via chat
class EditRoadmapRequest(BaseModel):
    current_roadmap: Roadmap
    user_instruction: str