import { useState, useEffect } from 'react'
import { db } from '../db/database'
import type { SrsCard } from '../db/types'
import { calculateNextReview, ratingToQuality, type Rating } from '../srs/sm2'

export interface ReviewSession {
  currentCard: SrsCard | null
  remaining: number
  totalDue: number
  completedCount: number
  isLoading: boolean
  isComplete: boolean
  submitRating: (rating: Rating) => Promise<void>
}

export function useReviewSession(): ReviewSession {
  const [queue, setQueue] = useState<SrsCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalDue, setTotalDue] = useState(0)
  const [completedCount, setCompletedCount] = useState(0)

  useEffect(() => {
    db.cards
      .where('dueAt')
      .belowOrEqual(Date.now())
      .toArray()
      .then((cards) => {
        const sorted = [...cards].sort((a, b) => a.dueAt - b.dueAt)
        setQueue(sorted)
        setTotalDue(sorted.length)
        setIsLoading(false)
      })
  }, [])

  const currentCard = queue[0] ?? null
  const remaining = queue.length
  const isComplete = !isLoading && queue.length === 0

  async function submitRating(rating: Rating): Promise<void> {
    if (!currentCard?.id) return

    const output = calculateNextReview({
      quality: ratingToQuality(rating),
      repetitions: currentCard.repetitions,
      easeFactor: currentCard.easeFactor,
      interval: currentCard.interval,
    })

    await db.cards.update(currentCard.id, {
      repetitions: output.repetitions,
      easeFactor: output.easeFactor,
      interval: output.interval,
      dueAt: output.dueAt,
      lastReviewedAt: Date.now(),
    })

    setCompletedCount((c) => c + 1)
    setQueue((prev) => {
      const rest = prev.slice(1)
      if (rating === 'again') {
        return [...rest, { ...currentCard, ...output }]
      }
      return rest
    })
  }

  return {
    currentCard,
    remaining,
    totalDue,
    completedCount,
    isLoading,
    isComplete,
    submitRating,
  }
}
