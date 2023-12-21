import {DB} from 'https://deno.land/x/sqlite@v3.7.0/mod.ts'
import {resolve} from 'https://deno.land/std@0.184.0/path/mod.ts'

export type BaseAppEvent = {
  id: string
  timestamp: Date
  info?: string
}

type WaterConsumptionEvent = {
  name: 'water-consumption'
  value: string
} & BaseAppEvent

type SnackConsupmtionEvent = {
  name: 'snack-consumption'
  value: string
} & BaseAppEvent

type PostureEvent = {
  name: 'posture'
  value: 'sitting' | 'standing'
} & BaseAppEvent

export type AppEvent =
  | WaterConsumptionEvent
  | SnackConsupmtionEvent
  | PostureEvent

export function toEvent([id, name, value, timestamp]: any) {
  const date = new Date(`${timestamp.replace(' ', 'T')}.000Z`)
  return {id, name, value, timestamp: date}
}

const DB_PATH = resolve(
  new URL('.', import.meta.url).pathname,
  '..',
  'data',
  'personal.db',
)

export function getEvents() {
  const db = new DB(DB_PATH)

  try {
    db.execute(`
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  value TEXT,
  info TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)
`)

    const results: AppEvent[] = []

    const cursor = db.query(
      `SELECT id, name, value, timestamp FROM events WHERE DATE(timestamp) = DATE('now')`,
    )

    for (const row of cursor) {
      results.push(toEvent(row))
    }

    results.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

    return results
  } finally {
    db.close()
  }
}

export function createEvent<E extends AppEvent>({
  name,
  value,
  info,
}: Pick<E, 'name' | 'value' | 'info'>) {
  const db = new DB(DB_PATH)

  try {
    const [row] = db.query(
      info
        ? `INSERT INTO events (name, value, info) VALUES (?, ?, ?) RETURNING id, name, value, timestamp`
        : `INSERT INTO events (name, value) VALUES (?, ?) RETURNING id, name, value, timestamp`,
      info ? [name, value, info] : [name, value],
    )
    return toEvent(row)
  } catch (error) {
    console.error(error)
  } finally {
    db.close()
  }
}
