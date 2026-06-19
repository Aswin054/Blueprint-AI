export default function ProgressBar({ completed, total }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-2">
        <p className="font-mono text-xs tracking-[0.15em] text-mute uppercase">
          Progress
        </p>
        <p className="font-mono text-xs text-ink">
          {completed} / {total} tasks — {pct}%
        </p>
      </div>
      <div className="h-[3px] w-full bg-faint relative overflow-hidden">
        <div
          className="h-full bg-ink animate-grow transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
