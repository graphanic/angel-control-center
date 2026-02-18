"use client"

import { type AppState, defaultState, saveState } from "@/lib/store"
import { Check, X, Trash2 } from "lucide-react"
import { useState } from "react"

interface Props {
  state: AppState
  updateState: (partial: Partial<AppState>) => void
}

function ConfigStatus({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {ok ? <Check className="h-4 w-4 text-emerald-400" /> : <X className="h-4 w-4 text-destructive" />}
      <span className="text-foreground">{label}</span>
      <span className="text-muted-foreground">{ok ? "Set" : "Not set"}</span>
    </div>
  )
}

export function Settings({ state, updateState }: Props) {
  const [showDanger, setShowDanger] = useState(false)

  function clearAllData() {
    saveState(defaultState)
    updateState({ ...defaultState, authenticated: true })
    setShowDanger(false)
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-lg font-light tracking-wide text-foreground">Settings</h2>
      </div>

      {/* Notion config */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Notion Configuration</h3>
        <div className="rounded-lg border border-border bg-card p-4">
          <ConfigStatus label="API Key:" ok={false} />
          <ConfigStatus label="Database ID:" ok={false} />
        </div>
      </div>

      {/* Gatekeeper */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Gatekeeper</h3>
        <div className="rounded-lg border border-border bg-card p-4">
          <ConfigStatus label="Password hash:" ok={false} />
          <p className="mt-2 text-xs text-muted-foreground">
            Set ANGEL_GATE_HASH in environment variables to enable password protection.
          </p>
          <code className="mt-1 block rounded bg-muted px-2 py-1 text-xs text-teal">
            {'python -c "import hashlib; print(hashlib.sha256(b\'YOUR_PASSWORD\').hexdigest())"'}
          </code>
        </div>
      </div>

      {/* Data stats */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Data</h3>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex flex-col gap-1 text-sm">
            <p><span className="text-muted-foreground">Journal entries:</span> <span className="text-foreground">{state.journals.length}</span></p>
            <p><span className="text-muted-foreground">Scheduled posts:</span> <span className="text-foreground">{state.scheduled_posts.length}</span></p>
            <p><span className="text-muted-foreground">Council merges:</span> <span className="text-foreground">{state.council_merges.length}</span></p>
            <p><span className="text-muted-foreground">Canon entries:</span> <span className="text-foreground">{state.canon.length}</span></p>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-destructive">Danger Zone</h3>
        <div className="rounded-lg border border-destructive bg-card p-4">
          {!showDanger ? (
            <button
              onClick={() => setShowDanger(true)}
              className="flex items-center gap-2 rounded-md border border-destructive px-4 py-2 text-sm text-destructive transition-colors hover:bg-destructive hover:text-white"
            >
              <Trash2 className="h-4 w-4" />
              Clear All Data
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-destructive">This will permanently delete all journals, posts, merges, and canon entries.</p>
              <div className="flex gap-2">
                <button
                  onClick={clearAllData}
                  className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-white"
                >
                  Confirm Delete Everything
                </button>
                <button
                  onClick={() => setShowDanger(false)}
                  className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
