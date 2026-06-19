const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

/**
 * Thin wrapper around the backend's two endpoints. The frontend never
 * holds an API key or talks to Groq directly — everything routes through
 * the FastAPI proxy, which is what makes rate limiting and key security
 * possible in the first place.
 */

class ApiError extends Error {
  constructor(message, status, detail) {
    super(message)
    this.status = status
    this.detail = detail
  }
}

async function handleResponse(res) {
  if (res.status === 429) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(
      body.detail || 'Rate limit exceeded. Please try again later.',
      429,
      body.detail
    )
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(
      body.detail || `Request failed with status ${res.status}`,
      res.status,
      body.detail
    )
  }
  return res.json()
}

/**
 * Generates a new roadmap from the project idea + clarifying answers.
 * Matches GenerateRoadmapRequest in schemas.py.
 */
export async function generateRoadmap({ projectIdea, skillLevel, timeAvailable, techStack, goals }) {
  const res = await fetch(`${API_BASE_URL}/api/generate-roadmap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      project_idea: projectIdea,
      skill_level: skillLevel,
      time_available: timeAvailable,
      tech_stack: techStack,
      goals: goals || null,
    }),
  })
  return handleResponse(res)
}

/**
 * Sends a natural-language edit instruction against the current roadmap.
 * Matches EditRoadmapRequest in schemas.py.
 */
export async function editRoadmap({ currentRoadmap, userInstruction }) {
  const res = await fetch(`${API_BASE_URL}/api/edit-roadmap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      current_roadmap: currentRoadmap,
      user_instruction: userInstruction,
    }),
  })
  return handleResponse(res)
}

export { ApiError }
