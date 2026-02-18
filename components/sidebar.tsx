"use client"

import { useAppState } from "@/hooks/use-app-state"
import { formatEdmontonTime } from "@/lib/store"
import { LogOut, Circle } from "lucide-react"

export function Sidebar() {
  const { state, updateState } = useAppState()

  return (
    <aside className="flex h-full w-72 flex-col border-r border-border bg-card">
      <div className="flex flex-col gap-5 p-5">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Current Thread
          </label>
          <textarea
            value={state.current_thread}
            onChange={(e) => updateState({ current_thread: e.target.value })}
            placeholder="e.g., Building the post scheduler..."
            rows={4}
            className="w-full resize-none rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="h-px bg-border" />

        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Architect State
          </label>
          <textarea
            value={state.user_context}
            onChange={(e) => updateState({ user_context: e.target.value })}
            placeholder="Build mode, steady energy..."
            rows={3}
            className="w-full resize-none rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="h-px bg-border" />

        <div className="flex flex-col gap-2 text-sm">
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Time:</span>{" "}
            {formatEdmontonTime()} Edmonton
          </p>
          <p className="flex items-center gap-1.5 text-muted-foreground">
            <span className="font-medium text-foreground">Status:</span>
            {state.hard_stop ? (
              <>
                <Circle className="h-2.5 w-2.5 fill-destructive text-destructive" />
                <span className="text-destructive">HARD STOP</span>
              </>
            ) : (
              <>
                <Circle className="h-2.5 w-2.5 fill-emerald-500 text-emerald-500" />
                <span className="text-emerald-400">ACTIVE</span>
              </>
            )}
          </p>
        </div>
      </div>

      <div className="mt-auto border-t border-border p-4">
        <button
          onClick={() => updateState({ authenticated: false })}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>
    </aside>
  )
}
