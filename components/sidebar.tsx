"use client"

import { useState, useEffect } from "react"
import { type AppState, edmontonTime } from "@/lib/store"
import { LogOut, Circle } from "lucide-react"

interface SidebarProps {
  state: AppState
  updateState: (partial: Partial<AppState>) => void
}

export function Sidebar({ state, updateState }: SidebarProps) {
  const [time, setTime] = useState(edmontonTime())

  useEffect(() => {
    const interval = setInterval(() => setTime(edmontonTime()), 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <aside className="flex w-72 shrink-0 flex-col gap-4 border-r border-border bg-card p-5">
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Current Thread
        </h3>
        <textarea
          value={state.current_thread}
          onChange={(e) => updateState({ current_thread: e.target.value })}
          placeholder="What are we working on..."
          rows={4}
          className="w-full resize-none rounded-md border border-border bg-background p-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-teal"
        />
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Architect State
        </h3>
        <textarea
          value={state.user_context}
          onChange={(e) => updateState({ user_context: e.target.value })}
          placeholder="Mood, fog, intent..."
          rows={3}
          className="w-full resize-none rounded-md border border-border bg-background p-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-teal"
        />
      </div>

      <div className="mt-auto flex flex-col gap-3 border-t border-border pt-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Edmonton</span>
          <span className="font-mono">{time}</span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Circle
            className={`h-2.5 w-2.5 fill-current ${state.hard_stop ? "text-destructive" : "text-emerald-400"}`}
          />
          <span className={state.hard_stop ? "text-destructive" : "text-emerald-400"}>
            {state.hard_stop ? "HARD STOP" : "ACTIVE"}
          </span>
        </div>

        <button
          onClick={() => updateState({ authenticated: false })}
          className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-3.5 w-3.5" />
          Log Out
        </button>
      </div>
    </aside>
  )
}
