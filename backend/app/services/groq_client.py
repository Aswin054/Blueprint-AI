import json
import os
from groq import Groq
from pydantic import ValidationError
from app.models.schemas import Roadmap
from app.prompts.generate_prompt import SYSTEM_PROMPT as GENERATE_SYSTEM_PROMPT, get_generation_prompt
from app.prompts.edit_prompt import SYSTEM_PROMPT as EDIT_SYSTEM_PROMPT, get_edit_prompt

def get_client():
    """Lazy-load the Groq client to ensure env vars are loaded first."""
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY environment variable is not set.")
    return Groq(api_key=api_key)

def _call_groq(system_prompt: str, user_prompt: str) -> Roadmap:
    """Helper to call Groq and parse the resulting JSON into a Roadmap object."""
    client = get_client()
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.2,
    )
    
    raw_output = response.choices[0].message.content.strip()
    
    # Clean up markdown code blocks if the AI includes them
    if raw_output.startswith("```"):
        raw_output = raw_output.replace("```json", "").replace("```", "").strip()
    
    print(f"DEBUG - Cleaned AI Output: {raw_output}")
    
    try:
        data = json.loads(raw_output)
        # This is where Pydantic validates the structure against schemas.py
        return Roadmap(**data)
    except json.JSONDecodeError as e:
        print(f"JSON Error: {e}")
        raise ValueError("The AI failed to generate valid JSON.")
    except ValidationError as e:
        print(f"Validation Error: {e}")
        raise ValueError(f"AI response did not match expected roadmap format: {e}")

def generate_roadmap_via_llm(request_data) -> Roadmap:
    """Generates a new roadmap from scratch."""
    prompt = get_generation_prompt(request_data)
    return _call_groq(GENERATE_SYSTEM_PROMPT, prompt)

def edit_roadmap_via_llm(current_roadmap: Roadmap, user_instruction: str) -> Roadmap:
    """Edits an existing roadmap based on user instructions."""
    prompt = get_edit_prompt(current_roadmap, user_instruction)
    return _call_groq(EDIT_SYSTEM_PROMPT, prompt)