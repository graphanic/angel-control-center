"use client"

import { useState, useEffect, useCallback } from "react"
import { type AppState, loadState, saveState, defaultState } from "@/lib/store"
import { Gatekeeper } from "@/components/gatekeeper"
import { Dashboard } from "@/components/dashboard"

export default function Page() {
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

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="font-mono text-sm tracking-widest text-teal">Initializing...</p>
      </div>
    )
  }

  if (!state.authenticated) {
    return <Gatekeeper onAuthenticate={() => updateState({ authenticated: true })} />
  }

  return <Dashboard state={state} updateState={updateState} />
}
