import { useState } from 'react'
import TaskCheckbox from './TaskCheckbox'

export default function PhaseCard({ phase, onToggleTask }) {
  const [isOpen, setIsOpen] = useState(true)
  const total = phase.tasks.length
  const completed = phase.tasks.filter((t) => t.is_completed).length
  const isDone = total > 0 && completed === total

  return (
    <div className="border border-faint">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="focus-ring w-full flex items-start gap-4 px-5 py-4 text-left hover:bg-ink/[0.02] transition-colors"
      >
        <span
          className={`font-display text-2xl leading-none tabular-nums shrink-0 ${
            isDone ? 'text-mute' : 'text-ink'
          }`}
        >
          {String(phase.phase_number).padStart(2, '0')}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <h3 className={`font-body text-base font-medium ${isDone ? 'text-mute' : 'text-ink'}`}>
              {phase.title}
            </h3>
            {isDone && (
              <span className="font-mono text-[10px] tracking-wider uppercase border border-mute text-mute px-1.5 py-0.5">
                Done
              </span>
            )}
          </div>
          <p className="font-mono text-xs text-mute mt-1">
            {completed} / {total}
          </p>
        </div>
        <span className="font-mono text-mute text-sm shrink-0 mt-1">
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {isOpen && (
        <div className="px-5 pb-4 border-t border-faint">
          {phase.description && (
            <p className="text-sm text-mute leading-relaxed pt-3 pb-1">
              {phase.description}
            </p>
          )}
          <div className="divide-y divide-faint/70">
            {phase.tasks.map((task) => (
              <TaskCheckbox key={task.id} task={task} onToggle={onToggleTask} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
