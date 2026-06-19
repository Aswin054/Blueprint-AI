import { useState } from 'react'
import IdeaInput from './components/IdeaInput.jsx'
import ClarifyingQuestions from './components/ClarifyingQuestions.jsx'
import RoadmapView from './components/RoadmapView.jsx'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { generateRoadmap, editRoadmap, ApiError } from './lib/api.js'

// Screens: 'input' -> 'questions' -> 'roadmap'
export default function App() {
  const [savedState, setSavedState, clearSaved] = useLocalStorage()
  const [screen, setScreen] = useState(savedState?.roadmap ? 'roadmap' : 'input')
  const [projectIdea, setProjectIdea] = useState(savedState?.projectIdea || '')
  const [roadmap, setRoadmap] = useState(savedState?.roadmap || null)

  const [isGenerating, setIsGenerating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [generateError, setGenerateError] = useState(null)
  const [editError, setEditError] = useState(null)

  const handleIdeaSubmit = (idea) => {
    setProjectIdea(idea)
    setGenerateError(null)
    setScreen('questions')
  }

  const handleQuestionsSubmit = async ({ skillLevel, timeAvailable, techStack, goals }) => {
    setIsGenerating(true)
    setGenerateError(null)
    try {
      const result = await generateRoadmap({
        projectIdea,
        skillLevel,
        timeAvailable,
        techStack,
        goals,
      })
      setRoadmap(result)
      setSavedState({ projectIdea, roadmap: result })
      setScreen('roadmap')
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Could not reach the server. Check that the backend is running.'
      setGenerateError(message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleUpdateRoadmap = (updated) => {
    setRoadmap(updated)
    setSavedState({ projectIdea, roadmap: updated })
  }

  const handleEditInstruction = async (instruction) => {
    setIsEditing(true)
    setEditError(null)
    try {
      const result = await editRoadmap({
        currentRoadmap: roadmap,
        userInstruction: instruction,
      })
      setRoadmap(result)
      setSavedState({ projectIdea, roadmap: result })
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Could not reach the server. Check that the backend is running.'
      setEditError(message)
    } finally {
      setIsEditing(false)
    }
  }

  const handleStartOver = () => {
    clearSaved()
    setProjectIdea('')
    setRoadmap(null)
    setGenerateError(null)
    setEditError(null)
    setScreen('input')
  }

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <header className="border-b border-faint px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <p className="font-display text-lg leading-none">Roadmap</p>
          <p className="font-mono text-xs text-mute">
            {screen === 'input' && '01 / 03'}
            {screen === 'questions' && '02 / 03'}
            {screen === 'roadmap' && '03 / 03'}
          </p>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center pt-14 sm:pt-20">
        {screen === 'input' && (
          <div className="w-full">
            <IdeaInput onSubmit={handleIdeaSubmit} isLoading={false} />
            {generateError && (
              <p className="max-w-2xl mx-auto px-6 mt-4 font-mono text-xs text-ink border-l-2 border-ink pl-2">
                {generateError}
              </p>
            )}
          </div>
        )}

        {screen === 'questions' && (
          <ClarifyingQuestions
            projectIdea={projectIdea}
            onSubmit={handleQuestionsSubmit}
            onBack={() => setScreen('input')}
            isLoading={isGenerating}
          />
        )}

        {screen === 'roadmap' && roadmap && (
          <RoadmapView
            roadmap={roadmap}
            onUpdateRoadmap={handleUpdateRoadmap}
            onEditInstruction={handleEditInstruction}
            onStartOver={handleStartOver}
            isEditLoading={isEditing}
            editError={editError}
          />
        )}
      </main>

      <footer className="px-6 py-5 text-center">
        <p className="font-mono text-[11px] text-mute/70">
          Saved locally in this browser — no account needed
        </p>
      </footer>
    </div>
  )
}
