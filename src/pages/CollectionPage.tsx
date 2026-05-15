import { Link } from 'react-router-dom'
import { useCollection, useCardMap, useDueCount } from '../hooks/useCollection'
import CollectionList from '../components/CollectionList'

export default function CollectionPage() {
  const entries = useCollection()
  const cardMap = useCardMap()
  const dueCount = useDueCount()

  if (entries === undefined || cardMap === undefined) {
    return <div className="text-center py-16 text-gray-400">Loading…</div>
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">My Collection</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {entries.length} character{entries.length !== 1 ? 's' : ''}
            {dueCount > 0 ? ` · ${dueCount} due` : ''}
          </p>
        </div>
        {dueCount > 0 && (
          <Link
            to="/review"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Review ({dueCount})
          </Link>
        )}
      </div>

      <CollectionList entries={entries} cardMap={cardMap} />
    </div>
  )
}
