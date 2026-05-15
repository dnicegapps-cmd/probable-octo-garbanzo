interface ProgressBarProps {
  completed: number
  total: number
}

export default function ProgressBar({ completed, total }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
      <div
        className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
