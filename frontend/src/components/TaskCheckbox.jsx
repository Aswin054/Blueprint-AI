export default function TaskCheckbox({ task, onToggle }) {
  return (
    <label className="group flex items-start gap-3 py-2.5 cursor-pointer">
      <input
        type="checkbox"
        checked={task.is_completed}
        onChange={() => onToggle(task.id)}
        className="task-checkbox focus-ring"
      />
      <div className="flex-1 min-w-0">
        <p
          className={`font-body text-sm leading-snug transition-colors ${
            task.is_completed ? 'text-mute line-through' : 'text-ink'
          }`}
        >
          {task.title}
        </p>
        {task.description && (
          <p
            className={`font-body text-xs leading-relaxed mt-0.5 transition-colors ${
              task.is_completed ? 'text-mute/60' : 'text-mute'
            }`}
          >
            {task.description}
          </p>
        )}
      </div>
    </label>
  )
}
