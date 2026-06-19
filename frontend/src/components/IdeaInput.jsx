import { useState } from 'react'

export default function IdeaInput({ onSubmit, isLoading }) {
  const [idea, setIdea] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!idea.trim() || isLoading) return
    onSubmit(idea.trim())
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-6">
      <div className="mb-10">
        <p className="font-mono text-xs tracking-[0.2em] text-mute uppercase mb-3">
          00 — Start here
        </p>
        <h1 className="font-display text-4xl sm:text-5xl leading-[1.05] mb-4">
          What are you building?
        </h1>
        <p className="text-mute text-base leading-relaxed max-w-md">
          Describe the project in your own words. A roadmap is built around
          exactly what you tell it — be as specific as you can.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g. A chat app where two users can message each other in real time, with login and message history."
          rows={5}
          disabled={isLoading}
          className="focus-ring w-full border border-ink bg-paper px-4 py-3 text-base leading-relaxed placeholder:text-mute/70 resize-none disabled:opacity-50"
          autoFocus
        />

        <div className="mt-4 flex items-center justify-between">
          <p className="font-mono text-xs text-mute">
            {idea.length > 0 ? `${idea.length} characters` : 'No project is too small'}
          </p>
          <button
            type="submit"
            disabled={!idea.trim() || isLoading}
            className="focus-ring border border-ink bg-ink px-6 py-2.5 font-body text-sm font-medium text-paper transition-opacity hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Thinking…' : 'Continue →'}
          </button>
        </div>
      </form>
    </div>
  )
}
