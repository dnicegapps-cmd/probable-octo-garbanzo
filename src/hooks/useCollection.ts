import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/database'
import type { CollectionEntry, SrsCard } from '../db/types'
import { lookupChar } from '../data/lexicon'

export function useCollection(): CollectionEntry[] | undefined {
  return useLiveQuery(() =>
    db.collection.orderBy('addedAt').reverse().toArray(),
  )
}

export function useCardMap(): Map<string, SrsCard> | undefined {
  return useLiveQuery(async () => {
    const cards = await db.cards.toArray()
    return new Map(cards.map((c) => [c.hanzi, c]))
  })
}

export function useIsInCollection(hanzi: string): boolean {
  const result = useLiveQuery(
    () => db.collection.where('hanzi').equals(hanzi).first(),
    [hanzi],
  )
  return result !== undefined
}

export function useDueCount(): number {
  return useLiveQuery(
    () => db.cards.where('dueAt').belowOrEqual(Date.now()).count(),
  ) ?? 0
}

export async function addToCollection(hanzi: string): Promise<void> {
  const existing = await db.collection.where('hanzi').equals(hanzi).first()
  if (existing) return

  const entries = lookupChar(hanzi)
  if (entries.length === 0) throw new Error(`No data found for: ${hanzi}`)
  const entry = entries[0]

  await db.transaction('rw', db.collection, db.cards, async () => {
    await db.collection.add({
      hanzi,
      pinyin: entry.pinyin,
      meanings: entry.meanings,
      hskLevel: entry.hskLevel,
      addedAt: Date.now(),
    })
    await db.cards.add({
      hanzi,
      dueAt: Date.now(),
      interval: 0,
      easeFactor: 2.5,
      repetitions: 0,
      lastReviewedAt: null,
    })
  })
}

export async function removeFromCollection(hanzi: string): Promise<void> {
  await db.transaction('rw', db.collection, db.cards, async () => {
    await db.collection.where('hanzi').equals(hanzi).delete()
    await db.cards.where('hanzi').equals(hanzi).delete()
  })
}
