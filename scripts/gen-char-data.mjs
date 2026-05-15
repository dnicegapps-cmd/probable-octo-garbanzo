/**
 * Generates src/data/characters.json from chinese-lexicon.
 * Run once at development time: node scripts/gen-char-data.mjs
 * The output is committed and imported by lexicon.ts at build time.
 */
import { allEntries } from 'chinese-lexicon'
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'src', 'data', 'characters.json')

// Only include single CJK unified ideographs (most common block)
const CJK = /^[一-鿿㐀-䶿]$/

const chars = {}
for (const entry of allEntries) {
  const char = entry.simp
  if (!CJK.test(char)) continue
  if (chars[char]) continue // keep first (highest frequency) entry only
  chars[char] = {
    p: entry.pinyin,
    s: entry.searchablePinyin,
    d: entry.definitions.slice(0, 4),
    h: entry.statistics?.hskLevel ?? null,
    t: entry.trad !== char ? entry.trad : null,
  }
}

const count = Object.keys(chars).length
writeFileSync(OUT, JSON.stringify(chars))
console.log(`Wrote ${count} characters to ${OUT}`)
