import type { CollectionEntry, SrsCard } from '../db/types'
import { removeFromCollection } from '../hooks/useCollection'

interface CollectionEntryProps {
  entry: CollectionEntry
  card?: SrsCard
}

function formatDue(dueAt: number): { text: string; urgent: boolean } {
  const now = Date.now()
  if (dueAt <= now) return { text: 'Due now', urgent: true }
  const diff = dueAt - now
  const days = Math.floor(diff / 86_400_000)
  const hours = Math.floor(diff / 3_600_000)
  if (days > 1) return { text: `In ${days} days`, urgent: false }
  if (days === 1) return { text: 'Tomorrow', urgent: false }
  if (hours >= 1) return { text: `In ${hours}h`, urgent: false }
  return { text: 'Due soon', urgent: true }
}

export default function CollectionEntryItem({ entry, card }: CollectionEntryProps) {
  const due = card ? formatDue(card.dueAt) : null

  return (
    <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-4">
      <span
        className="text-4xl leading-none w-12 text-center shrink-0"
        style={{ fontFamily: 'var(--font-hanzi)' }}
      >
        {entry.hanzi}
      </span>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-700">{entry.pinyin}</div>
        <div className="text-xs text-gray-500 truncate">
          {entry.meanings.slice(0, 2).join('; ')}
        </div>
      </div>

      {due && (
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${
            due.urgent
              ? 'bg-red-100 text-red-700'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {due.text}
        </span>
      )}

      <button
        onClick={() => removeFromCollection(entry.hanzi)}
        className="text-gray-300 hover:text-red-400 transition-colors shrink-0 text-lg leading-none"
        aria-label="Remove"
      >
        ×
      </button>
    </div>
  )
}
