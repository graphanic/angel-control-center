"use client"

import { type AppState } from "@/lib/store"
import { Check, X, Trash2 } from "lucide-react"
import { useState } from "react"

interface SettingsProps {
  state: AppState
  updateState: (partial: Partial<AppState>) => void
}

export function Settings({ state, updateState }: SettingsProps) {
  const [confirmClear, setConfirmClear] = useState(false)

  function handleClearData() {
    updateState({
      journals: [],
      scheduled_posts: [],
      council_merges: [],
      canon: [],
      veto_log: [],
      council_mirror: "",
      current_thread: "",
      user_context: "",
      hard_stop: false,
    })
    setConfirmClear(false)
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-medium text-foreground">Settings</h2>
      </div>

      {/* Notion Config */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Notion Configuration
        </h3>
        <div className="flex flex-col gap-2 text-sm">
          <p className="flex items-center gap-2">
            <span className="text-foreground">API Key:</span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <X className="h-3.5 w-3.5 text-destructive" /> Not set
            </span>
          </p>
          <p className="flex items-center gap-2">
            <span className="text-foreground">Database ID:</span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <X className="h-3.5 w-3.5 text-destructive" /> Not set
            </span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Set <code className="rounded bg-muted px-1 py-0.5 font-mono text-foreground">NOTION_API_KEY</code> and{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-foreground">NOTION_DATABASE_ID</code> in your environment variables.
          </p>
        </div>
      </div>

      {/* Gatekeeper */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Gatekeeper
        </h3>
        <div className="flex flex-col gap-2 text-sm">
          <p className="flex items-center gap-2">
            <span className="text-foreground">Password hash:</span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Check className="h-3.5 w-3.5 text-emerald-400" /> Dev mode (no password required)
            </span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Set <code className="rounded bg-muted px-1 py-0.5 font-mono text-foreground">ANGEL_GATE_HASH</code> to enable password protection.
          </p>
          <div className="mt-2 rounded-md bg-muted px-3 py-2">
            <code className="font-mono text-xs text-muted-foreground">
              {`python -c "import hashlib; print(hashlib.sha256(b'YOUR_PASSWORD').hexdigest())"`}
            </code>
          </div>
        </div>
      </div>

      {/* Data Stats */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Data
        </h3>
        <div className="flex flex-col gap-2 text-sm">
          <p>
            <span className="text-foreground">Journal entries:</span>{" "}
            <span className="font-mono text-teal">{state.journals.length}</span>
          </p>
          <p>
            <span className="text-foreground">Scheduled posts:</span>{" "}
            <span className="font-mono text-teal">{state.scheduled_posts.length}</span>
          </p>
          <p>
            <span className="text-foreground">Council merges:</span>{" "}
            <span className="font-mono text-teal">{state.council_merges.length}</span>
          </p>
          <p>
            <span className="text-foreground">Canon entries:</span>{" "}
            <span className="font-mono text-teal">{state.canon.length}</span>
          </p>
          <p>
            <span className="text-foreground">Veto log:</span>{" "}
            <span className="font-mono text-teal">{state.veto_log.length}</span>
          </p>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-5">
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-destructive">
          Danger Zone
        </h3>
        {confirmClear ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-destructive">
              This will permanently clear all local data. Are you sure?
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleClearData}
                className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
              >
                Yes, Clear Everything
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmClear(true)}
            className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive transition-colors hover:bg-destructive/20"
          >
            <Trash2 className="h-4 w-4" />
            Clear All Local Data
          </button>
        )}
      </div>
    </div>
  )
}
