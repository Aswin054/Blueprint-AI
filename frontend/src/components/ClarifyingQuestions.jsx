import { useState } from 'react'

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced']
const TIME_OPTIONS = ['1 week', '2 weeks', '1 month', '2+ months']

export default function ClarifyingQuestions({ projectIdea, onSubmit, onBack, isLoading }) {
  const [skillLevel, setSkillLevel] = useState('Beginner')
  const [timeAvailable, setTimeAvailable] = useState('2 weeks')
  const [techStackInput, setTechStackInput] = useState('')
  const [goals, setGoals] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isLoading) return
    const techStack = techStackInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    onSubmit({
      skillLevel,
      timeAvailable,
      techStack,
      goals: goals.trim() || undefined,
    })
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-6">
      <div className="mb-8">
        <p className="font-mono text-xs tracking-[0.2em] text-mute uppercase mb-3">
          01 — A few details
        </p>
        <h2 className="font-display text-3xl sm:text-4xl leading-tight mb-3">
          Tell us where you stand
        </h2>
        <p className="text-mute text-sm leading-relaxed border-l-2 border-faint pl-3">
          "{projectIdea}"
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-7">
        <fieldset>
          <legend className="font-body text-sm font-medium mb-2.5">Skill level</legend>
          <div className="flex gap-2 flex-wrap">
            {SKILL_LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setSkillLevel(level)}
                className={`focus-ring border px-4 py-2 text-sm transition-colors ${
                  skillLevel === level
                    ? 'border-ink bg-ink text-paper'
                    : 'border-faint text-ink hover:border-ink'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-body text-sm font-medium mb-2.5">Time available</legend>
          <div className="flex gap-2 flex-wrap">
            {TIME_OPTIONS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTimeAvailable(t)}
                className={`focus-ring border px-4 py-2 text-sm transition-colors ${
                  timeAvailable === t
                    ? 'border-ink bg-ink text-paper'
                    : 'border-faint text-ink hover:border-ink'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="tech-stack" className="block font-body text-sm font-medium mb-2.5">
            Preferred tech stack
          </label>
          <input
            id="tech-stack"
            type="text"
            value={techStackInput}
            onChange={(e) => setTechStackInput(e.target.value)}
            placeholder="e.g. React, Node.js, MongoDB"
            className="focus-ring w-full border border-faint px-4 py-2.5 text-sm placeholder:text-mute/70 focus:border-ink"
          />
          <p className="mt-1.5 font-mono text-xs text-mute">Comma-separated. Leave blank for a recommendation.</p>
        </div>

        <div>
          <label htmlFor="goals" className="block font-body text-sm font-medium mb-2.5">
            Anything else? <span className="text-mute font-normal">(optional)</span>
          </label>
          <input
            id="goals"
            type="text"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="e.g. I want this for my resume, focus on clean code"
            className="focus-ring w-full border border-faint px-4 py-2.5 text-sm placeholder:text-mute/70 focus:border-ink"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading}
            className="focus-ring font-body text-sm text-mute hover:text-ink transition-colors disabled:opacity-30"
          >
            ← Back
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="focus-ring border border-ink bg-ink px-6 py-2.5 font-body text-sm font-medium text-paper transition-opacity hover:opacity-80 disabled:opacity-30"
          >
            {isLoading ? 'Building roadmap…' : 'Generate roadmap →'}
          </button>
        </div>
      </form>
    </div>
  )
}
