"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import { type AppState, loadState, saveState } from "@/lib/store"

const defaultState: AppState = {
  authenticated: false,
  user_context: "",
  current_thread: "",
  council_mirror: "",
  hard_stop: false,
  veto_log: [],
  journals: [],
  scheduled_posts: [],
  council_merges: [],
  canon: [],
}

interface AppStateCtx {
  state: AppState
  updateState: (partial: Partial<AppState>) => void
  mounted: boolean
}

const Ctx = createContext<AppStateCtx>({
  state: defaultState,
  updateState: () => {},
  mounted: false,
})

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setState(loadState())
    setMounted(true)
  }, [])

  const updateState = useCallback((partial: Partial<AppState>) => {
    setState((prev) => {
      const next = { ...prev, ...partial }
      saveState(next)
      return next
    })
  }, [])

  return (
    <Ctx.Provider value={{ state, updateState, mounted }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAppState() {
  return useContext(Ctx)
}
