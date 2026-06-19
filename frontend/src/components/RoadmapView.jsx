import { useMemo, useState } from 'react'
import PhaseCard from './PhaseCard'
import ProgressBar from './ProgressBar'
import ChatEditPanel from './ChatEditPanel'

export default function RoadmapView({ roadmap, onUpdateRoadmap, onEditInstruction, onStartOver, isEditLoading, editError }) {
  const { totalTasks, completedTasks } = useMemo(() => {
    let total = 0
    let done = 0
    roadmap.phases.forEach((phase) => {
      total += phase.tasks.length
      done += phase.tasks.filter((t) => t.is_completed).length
    })
    return { totalTasks: total, completedTasks: done }
  }, [roadmap])

  const handleToggleTask = (taskId) => {
    const updated = {
      ...roadmap,
      phases: roadmap.phases.map((phase) => ({
        ...phase,
        tasks: phase.tasks.map((task) =>
          task.id === taskId ? { ...task, is_completed: !task.is_completed } : task
        ),
      })),
    }
    onUpdateRoadmap(updated)
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-6 pb-20">
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-mute uppercase mb-3">
              02 — Your roadmap
            </p>
            <h1 className="font-display text-3xl sm:text-4xl leading-tight">
              {roadmap.project_name}
            </h1>
          </div>
          <button
            type="button"
            onClick={onStartOver}
            className="focus-ring font-mono text-xs text-mute hover:text-ink underline shrink-0 mt-1"
          >
            Start over
          </button>
        </div>
        <p className="text-mute text-sm leading-relaxed">{roadmap.summary}</p>
      </div>

      <div className="mb-8">
        <ProgressBar completed={completedTasks} total={totalTasks} />
      </div>

      <div className="space-y-3 mb-6">
        {roadmap.phases.map((phase) => (
          <PhaseCard key={phase.phase_number} phase={phase} onToggleTask={handleToggleTask} />
        ))}
      </div>

      <ChatEditPanel
        onSendInstruction={onEditInstruction}
        isLoading={isEditLoading}
        error={editError}
      />
    </div>
  )
}
