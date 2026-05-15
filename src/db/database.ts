import Dexie, { type EntityTable } from 'dexie'
import type { CollectionEntry, SrsCard } from './types'

class HanziSrsDb extends Dexie {
  collection!: EntityTable<CollectionEntry, 'id'>
  cards!: EntityTable<SrsCard, 'id'>

  constructor() {
    super('HanziSRS')
    this.version(1).stores({
      collection: '++id, hanzi, addedAt',
      cards: '++id, hanzi, dueAt',
    })
  }
}

export const db = new HanziSrsDb()
