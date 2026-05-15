import type { SrsCard } from '../db/types'
import { previewNextInterval, type Rating } from '../srs/sm2'

interface RatingButtonsProps {
  card: SrsCard
  onRate: (rating: Rating) => void
}

function formatInterval(days: number): string {
  if (days <= 0) return 'now'
  if (days === 1) return '1 day'
  return `${days} days`
}

const RATINGS: { key: Rating; label: string; colors: string }[] = [
  { key: 'again', label: 'Again', colors: 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200' },
  { key: 'hard',  label: 'Hard',  colors: 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200' },
  { key: 'good',  label: 'Good',  colors: 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200' },
  { key: 'easy',  label: 'Easy',  colors: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200' },
]

export default function RatingButtons({ card, onRate }: RatingButtonsProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {RATINGS.map(({ key, label, colors }) => {
        const interval = previewNextInterval(card, key)
        return (
          <button
            key={key}
            onClick={() => onRate(key)}
            className={`flex flex-col items-center gap-1 px-2 py-3 rounded-xl border font-medium transition-colors ${colors}`}
          >
            <span className="text-sm">{label}</span>
            <span className="text-xs opacity-70">{formatInterval(interval)}</span>
          </button>
        )
      })}
    </div>
  )
}
