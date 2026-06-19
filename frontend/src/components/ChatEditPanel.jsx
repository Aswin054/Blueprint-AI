import { useState } from 'react'

export default function ChatEditPanel({ onSendInstruction, isLoading, error }) {
  const [instruction, setInstruction] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!instruction.trim() || isLoading) return
    onSendInstruction(instruction.trim())
    setInstruction('')
  }

  if (!isExpanded) {
    return (
      <button
        type="button"
        onClick={() => setIsExpanded(true)}
        className="focus-ring w-full border border-dashed border-faint px-5 py-3.5 text-left font-body text-sm text-mute hover:border-ink hover:text-ink transition-colors"
      >
        Want to change something? Talk to the roadmap →
      </button>
    )
  }

  return (
    <div className="border border-ink px-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <p className="font-mono text-xs tracking-[0.15em] text-mute uppercase">
          Edit via chat
        </p>
        <button
          type="button"
          onClick={() => setIsExpanded(false)}
          className="focus-ring font-mono text-xs text-mute hover:text-ink"
        >
          Close
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="e.g. Make phase 2 easier, or swap React for Vue"
          disabled={isLoading}
          autoFocus
          className="focus-ring flex-1 border border-faint px-3.5 py-2.5 text-sm placeholder:text-mute/70 focus:border-ink disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!instruction.trim() || isLoading}
          className="focus-ring border border-ink bg-ink px-5 py-2.5 font-body text-sm font-medium text-paper transition-opacity hover:opacity-80 disabled:opacity-30 shrink-0"
        >
          {isLoading ? 'Updating…' : 'Apply'}
        </button>
      </form>

      {error && (
        <p className="mt-3 font-mono text-xs text-ink border-l-2 border-ink pl-2">
          {error}
        </p>
      )}
    </div>
  )
}
