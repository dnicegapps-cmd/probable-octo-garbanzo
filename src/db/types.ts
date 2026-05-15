export interface CollectionEntry {
  id?: number
  hanzi: string
  pinyin: string
  meanings: string[]
  hskLevel?: number
  addedAt: number
}

export interface SrsCard {
  id?: number
  hanzi: string
  dueAt: number
  interval: number
  easeFactor: number
  repetitions: number
  lastReviewedAt: number | null
}
