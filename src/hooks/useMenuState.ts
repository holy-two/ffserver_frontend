import { writable, Writable } from "svelte/store";

const cacheMap: Record<string, Writable<boolean>> = {}

type GetMapKey<T extends Record<string, any>> = T extends Record<infer K, any> ? K : never

type Result = [x: Writable<number>, y: Writable<number>, show: Writable<boolean>]

export function hideAll() {
  for (const key in cacheMap) {
    cacheMap[key].set(false)
  }
}

export function hideAllExtra(name: GetMapKey<typeof cacheMap>) {
  for (const key in cacheMap) {
    if (key !== name) {
      cacheMap[key].set(false)
    }
  }
}

export default function useMenuState(name: string, initShow = false) {
  const show = writable(initShow)
  cacheMap[name] = show
  const x = writable(0)
  const y = writable(0)
  return [x, y, show] as Result
}