import { useState } from 'react'
import type { LexiconEntry } from '../data/lexicon'
import { useIsInCollection, addToCollection } from '../hooks/useCollection'
import StrokeCanvas from './StrokeCanvas'

interface CharacterCardProps {
  entry: LexiconEntry
}

export default function CharacterCard({ entry }: CharacterCardProps) {
  const inCollection = useIsInCollection(entry.hanzi)
  const [adding, setAdding] = useState(false)
  const [showStrokes, setShowStrokes] = useState(false)

  async function handleAdd() {
    if (inCollection || adding) return
    setAdding(true)
    try {
      await addToCollection(entry.hanzi)
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <button
          onClick={() => setShowStrokes((s) => !s)}
          className="text-6xl leading-none hover:opacity-70 transition-opacity"
          style={{ fontFamily: 'var(--font-hanzi)' }}
          title="Show stroke order"
        >
          {entry.hanzi}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base text-gray-700 font-medium">{entry.pinyin}</span>
            {entry.hskLevel && (
              <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">
                HSK {entry.hskLevel}
              </span>
            )}
            {entry.traditional && (
              <span className="text-sm text-gray-400" style={{ fontFamily: 'var(--font-hanzi)' }}>
                {entry.traditional}
              </span>
            )}
          </div>
          <ul className="mt-1 text-sm text-gray-600 space-y-0.5">
            {entry.meanings.slice(0, 3).map((m, i) => (
              <li key={i} className="truncate">{m}</li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleAdd}
          disabled={inCollection || adding}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            inCollection
              ? 'bg-gray-100 text-gray-400 cursor-default'
              : adding
              ? 'bg-blue-100 text-blue-400 cursor-wait'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {inCollection ? 'Added' : adding ? '…' : 'Add'}
        </button>
      </div>

      {showStrokes && (
        <div className="flex justify-center pt-2 border-t border-gray-100">
          <StrokeCanvas hanzi={entry.hanzi} autoAnimate size={180} />
        </div>
      )}
    </div>
  )
}
