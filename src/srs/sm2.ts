export type Rating = 'again' | 'hard' | 'good' | 'easy'

export interface Sm2Input {
  quality: number
  repetitions: number
  easeFactor: number
  interval: number
}

export interface Sm2Output {
  repetitions: number
  easeFactor: number
  interval: number
  dueAt: number
}

export function ratingToQuality(rating: Rating): number {
  switch (rating) {
    case 'again': return 0
    case 'hard':  return 2
    case 'good':  return 4
    case 'easy':  return 5
  }
}

export function calculateNextReview(input: Sm2Input): Sm2Output {
  const { quality, repetitions, easeFactor, interval } = input
  const newEF = Math.max(
    1.3,
    easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02),
  )

  if (quality < 3) {
    return {
      repetitions: 0,
      easeFactor: newEF,
      interval: 1,
      dueAt: Date.now() + 86_400_000,
    }
  }

  let newInterval: number
  if (repetitions === 0) {
    newInterval = 1
  } else if (repetitions === 1) {
    newInterval = 6
  } else {
    newInterval = Math.round(interval * newEF)
  }

  if (quality === 5) {
    newInterval = Math.round(newInterval * 1.3)
  }

  return {
    repetitions: repetitions + 1,
    easeFactor: newEF,
    interval: newInterval,
    dueAt: Date.now() + newInterval * 86_400_000,
  }
}

export function previewNextInterval(
  card: { repetitions: number; easeFactor: number; interval: number },
  rating: Rating,
): number {
  return calculateNextReview({
    quality: ratingToQuality(rating),
    repetitions: card.repetitions,
    easeFactor: card.easeFactor,
    interval: card.interval,
  }).interval
}
