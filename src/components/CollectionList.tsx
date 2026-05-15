import type { CollectionEntry, SrsCard } from '../db/types'
import CollectionEntryItem from './CollectionEntry'

interface CollectionListProps {
  entries: CollectionEntry[]
  cardMap: Map<string, SrsCard>
}

export default function CollectionList({ entries, cardMap }: CollectionListProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="text-5xl mb-3" style={{ fontFamily: 'var(--font-hanzi)' }}>空</div>
        <p className="text-base">Your collection is empty.</p>
        <p className="text-sm mt-1">Search for characters and add them.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {entries.map((entry) => (
        <CollectionEntryItem
          key={entry.hanzi}
          entry={entry}
          card={cardMap.get(entry.hanzi)}
        />
      ))}
    </div>
  )
}
