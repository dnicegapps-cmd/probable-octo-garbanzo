import type { LexiconEntry } from '../data/lexicon'
import CharacterCard from './CharacterCard'

interface SearchResultsProps {
  results: LexiconEntry[]
  query: string
}

export default function SearchResults({ results, query }: SearchResultsProps) {
  if (!query.trim()) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="text-5xl mb-3" style={{ fontFamily: 'var(--font-hanzi)' }}>搜</div>
        <p>Search for any Chinese character</p>
        <p className="text-sm mt-1 text-gray-300">Try "study", "xue", or "学"</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p>No results for "{query}"</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {results.map((entry) => (
        <CharacterCard key={entry.hanzi + entry.pinyin} entry={entry} />
      ))}
    </div>
  )
}
