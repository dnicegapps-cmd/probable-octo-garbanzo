import { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import type { SrsCard } from '../db/types'
import type { Rating } from '../srs/sm2'
import { db } from '../db/database'
import StrokeCanvas from './StrokeCanvas'
import RatingButtons from './RatingButtons'
import ProgressBar from './ProgressBar'

type CardPhase = 'recall' | 'reveal' | 'rating'

interface ReviewCardProps {
  card: SrsCard
  remaining: number
  totalDue: number
  onRate: (rating: Rating) => Promise<void>
}

export default function ReviewCard({ card, remaining, totalDue, onRate }: ReviewCardProps) {
  const [phase, setPhase] = useState<CardPhase>('recall')
  const [animDone, setAnimDone] = useState(false)
  const [rating, setRating] = useState(false)

  const entry = useLiveQuery(
    () => db.collection.where('hanzi').equals(card.hanzi).first(),
    [card.hanzi],
  )

  // Reset phase when card changes
  useEffect(() => {
    setPhase('recall')
    setAnimDone(false)
    setRating(false)
  }, [card.hanzi])

  const completed = totalDue - remaining

  async function handleRate(r: Rating) {
    if (rating) return
    setRating(true)
    await onRate(r)
  }

  return (
    <div className="flex flex-col gap-6">
      <ProgressBar completed={completed} total={totalDue} />

      <div className="text-center text-xs text-gray-400 font-medium uppercase tracking-wide">
        {remaining} remaining
      </div>

      {/* Character display */}
      <div className="flex flex-col items-center gap-1">
        <div
          className="text-9xl leading-none"
          style={{ fontFamily: 'var(--font-hanzi)' }}
        >
          {card.hanzi}
        </div>
        {phase === 'recall' && entry && (
          <div className="text-sm text-gray-400 mt-2">
            {entry.hskLevel ? `HSK ${entry.hskLevel}` : ''}
          </div>
        )}
      </div>

      {/* Stroke canvas — mounted only in reveal/rating phases */}
      {phase !== 'recall' && (
        <div className="flex justify-center">
          <StrokeCanvas
            hanzi={card.hanzi}
            autoAnimate={phase === 'reveal'}
            onAnimationComplete={() => setAnimDone(true)}
          />
        </div>
      )}

      {/* Phase-specific controls */}
      {phase === 'recall' && (
        <button
          onClick={() => setPhase('reveal')}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-base"
        >
          Reveal Stroke Order
        </button>
      )}

      {phase === 'reveal' && (
        <button
          onClick={() => setPhase('rating')}
          className={`w-full py-4 font-semibold rounded-xl transition-colors text-base ${
            animDone
              ? 'bg-slate-800 hover:bg-slate-700 text-white'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          disabled={!animDone}
        >
          {animDone ? "I'm Ready to Rate" : 'Watching animation…'}
        </button>
      )}

      {phase === 'rating' && (
        <div className="flex flex-col gap-3">
          <p className="text-center text-sm text-gray-500">How well did you recall the stroke order?</p>
          <RatingButtons card={card} onRate={handleRate} />
        </div>
      )}
    </div>
  )
}
