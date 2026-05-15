import { Link } from 'react-router-dom'
import { useReviewSession } from '../hooks/useReviewSession'
import ReviewCard from '../components/ReviewCard'

export default function ReviewPage() {
  const session = useReviewSession()

  if (session.isLoading) {
    return (
      <div className="flex justify-center items-center py-24 text-gray-400">
        Loading reviews…
      </div>
    )
  }

  if (session.isComplete && session.totalDue === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <div className="text-6xl" style={{ fontFamily: 'var(--font-hanzi)' }}>好</div>
        <h2 className="text-2xl font-bold text-gray-800">All caught up!</h2>
        <p className="text-gray-500">No reviews due right now.</p>
        <Link
          to="/collection"
          className="mt-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
        >
          Go to Collection
        </Link>
      </div>
    )
  }

  if (session.isComplete) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <div className="text-6xl">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800">Session complete!</h2>
        <p className="text-gray-500">
          You reviewed {session.completedCount} card{session.completedCount !== 1 ? 's' : ''}.
        </p>
        <Link
          to="/collection"
          className="mt-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
        >
          Back to Collection
        </Link>
      </div>
    )
  }

  if (!session.currentCard) return null

  return (
    <ReviewCard
      card={session.currentCard}
      remaining={session.remaining}
      totalDue={session.totalDue}
      onRate={session.submitRating}
    />
  )
}
