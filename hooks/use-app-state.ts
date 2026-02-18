"use client"

import useSWR from "swr"
import { type AppState, loadState, saveState } from "@/lib/store"

const STATE_KEY = "angel-state"

export function useAppState() {
  const { data, mutate } = useSWR<AppState>(STATE_KEY, () => loadState(), {
    fallbackData: loadState(),
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  const state = data!

  const updateState = (partial: Partial<AppState>) => {
    const next = { ...state, ...partial }
    saveState(next)
    mutate(next, false)
  }

  return { state, updateState }
}
