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
  const results: LexiconEntry[] = []

  for (const [hanzi, raw] of Object.entries(db)) {
    const matchesPinyin =
      raw.p.toLowerCase().startsWith(lower) ||
      raw.s.startsWith(lower)
    const matchesMeaning = raw.d.some((def) =>
      def.toLowerCase().includes(lower),
    )

    if (matchesPinyin || matchesMeaning) {
      results.push(toEntry(hanzi, raw))
      if (results.length >= limit) break
    }
  }

  return results
}
