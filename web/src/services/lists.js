import { DEMO_LISTS } from './store.js'

export async function saveCafeList(list) {
  const id = 'l' + (Object.keys(DEMO_LISTS).length + 1)
  DEMO_LISTS[id] = { id, ...list, createdAt: Date.now() }
  return DEMO_LISTS[id]
}

