import { useState, useEffect, useRef } from 'react'
import { smartSearch, type LexiconEntry } from '../data/lexicon'
import SearchBar from '../components/SearchBar'
import SearchResults from '../components/SearchResults'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<LexiconEntry[]>([])
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setResults(smartSearch(query))
    }, 200)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  return (
    <div className="flex flex-col gap-4">
      <SearchBar value={query} onChange={setQuery} />
      <SearchResults results={results} query={query} />
    </div>
  )
}
