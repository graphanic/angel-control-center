"use client"

import { useState, useEffect, useCallback } from "react"
import { type AppState, loadState, saveState } from "@/lib/store"
import { Gatekeeper } from "@/components/gatekeeper"
import { Dashboard } from "@/components/dashboard"

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

export default function Page() {
  const [state, setState] = useState<AppState>(defaultState)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    console.log("[v0] Page mounting, loading state...")
    setState(loadState())
    setMounted(true)
    console.log("[v0] Page mounted successfully")
  }, [])

  const updateState = useCallback((partial: Partial<AppState>) => {
    setState((prev) => {
      const next = { ...prev, ...partial }
      saveState(next)
      return next
    })
  }, [])

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <p className="font-mono text-sm tracking-[0.3em] text-teal">{"< > < >"}</p>
          <p className="text-xs tracking-wide text-muted-foreground">Initializing...</p>
        </div>
      </div>
    )
  }

  if (!state.authenticated) {
    return <Gatekeeper state={state} updateState={updateState} />
  }

  return <Dashboard state={state} updateState={updateState} />
}
