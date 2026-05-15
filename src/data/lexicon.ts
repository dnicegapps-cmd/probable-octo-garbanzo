import charData from './characters.json'

interface CharEntry {
  p: string       // pinyin with tone marks
  s: string       // searchable pinyin (no tones)
  d: string[]     // definitions
  h: number | null // HSK level
  t: string | null  // traditional form (if different)
}

const db = charData as Record<string, CharEntry>

export interface LexiconEntry {
  hanzi: string
  pinyin: string
  meanings: string[]
  hskLevel?: number
  traditional?: string
}

function toEntry(hanzi: string, raw: CharEntry): LexiconEntry {
  return {
    hanzi,
    pinyin: raw.p,
    meanings: raw.d,
    hskLevel: raw.h ?? undefined,
    traditional: raw.t ?? undefined,
  }
}

export function lookupChar(hanzi: string): LexiconEntry[] {
  const entry = db[hanzi]
  if (!entry) return []
  return [toEntry(hanzi, entry)]
}

export function smartSearch(query: string, limit = 30): LexiconEntry[] {
  const trimmed = query.trim()
  if (!trimmed) return []

  // Exact single CJK character lookup
  const isSingleCjk = /^[一-鿿㐀-䶿]$/.test(trimmed)
  if (isSingleCjk) {
    const entry = db[trimmed]
    return entry ? [toEntry(trimmed, entry)] : []
  }

  const lower = trimmed.toLowerCase()
  const results: Array<{ entry: LexiconEntry; score: number }> = []

  for (const [hanzi, raw] of Object.entries(db)) {
    const pinyinExact = raw.p.toLowerCase() === lower
    const pinyinStarts =
      raw.p.toLowerCase().startsWith(lower) || raw.s.startsWith(lower)
    const meaningMatch = raw.d.some((def) => def.toLowerCase().includes(lower))

    if (!pinyinExact && !pinyinStarts && !meaningMatch) continue

    // Score: lower is better (sorts to front)
    // Prefer HSK characters; within HSK prefer lower levels; non-HSK last
    const hskScore = raw.h != null ? raw.h : 99
    // Boost exact pinyin matches above starts-with
    const matchScore = pinyinExact ? 0 : pinyinStarts ? 1 : 2
    const score = matchScore * 100 + hskScore

    results.push({ entry: toEntry(hanzi, raw), score })
    if (results.length >= limit * 3) break // over-collect then trim
  }

  results.sort((a, b) => a.score - b.score)
  return results.slice(0, limit).map((r) => r.entry)
}
