import { writable } from "svelte/store"
import type { Item } from "./type"

interface CutItem {
  fromPath: string
  itemValue: Item
}

export const cutItem = writable<CutItem>(null)