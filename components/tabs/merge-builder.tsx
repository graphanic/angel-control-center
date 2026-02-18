"use client"

import { useState } from "react"
import { type AppState, edmontonNow, type CouncilMerge } from "@/lib/store"
import { GitMerge } from "lucide-react"

interface Props {
  state: AppState
  updateState: (partial: Partial<AppState>) => void
}

export function MergeBuilder({ state, updateState }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [summary, setSummary] = useState("")
  const [convergences, setConvergences] = useState("")
  const [divergences, setDivergences] = useState("")

  if (state.hard_stop) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-light tracking-wide text-foreground">Council Merge Builder</h2>
        <p className="rounded-lg border border-destructive bg-card p-4 text-center text-sm text-destructive">HARD STOP ACTIVE</p>
      </div>
    )
  }

  const shareable = state.journals.filter(
    (e) => e.permission === "COUNCIL SHAREABLE" || e.permission === "CANON CANDIDATE"
  )

  function toggleEntry(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleCreateMerge() {
    if (selectedIds.size < 2) return

    const now = edmontonNow()
    const merge: CouncilMerge = {
      id: `COUNCIL_${Date.now()}`,
      created_at: now,
      entries: Array.from(selectedIds),
      summary: summary.trim(),
      convergences: convergences.trim(),
      divergences: divergences.trim(),
    }

    updateState({
      council_merges: [...state.council_merges, merge],
      council_mirror: `[${now.slice(11, 16)}] Merge: ${merge.id}`,
    })

    setSelectedIds(new Set())
    setSummary("")
    setConvergences("")
    setDivergences("")
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-light tracking-wide text-foreground">Council Merge Builder</h2>
        <p className="text-sm italic text-muted-foreground">Select shareable entries to synthesize across Angels.</p>
      </div>

      {shareable.length === 0 ? (
        <p className="rounded-lg border border-border bg-card p-4 text-center text-sm text-muted-foreground">
          No shareable entries yet.
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {shareable.slice(0, 30).map((entry) => (
              <label key={entry.entry_id} className="flex items-center gap-3 rounded-md border border-border bg-card px-4 py-3 cursor-pointer hover:bg-muted transition-colors">
                <input
                  type="checkbox"
                  checked={selectedIds.has(entry.entry_id)}
                  onChange={() => toggleEntry(entry.entry_id)}
                  className="h-4 w-4 rounded border-border accent-teal"
                />
                <span className="text-sm text-foreground">{entry.entry_id}</span>
                <span className="text-xs text-muted-foreground">({entry.angel})</span>
              </label>
            ))}
          </div>

          {selectedIds.size >= 2 && (
            <div className="flex flex-col gap-4 rounded-lg border border-teal bg-card p-5">
              <p className="text-sm text-teal">{selectedIds.size} entries selected</p>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Merge Summary</span>
                <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} className="w-full resize-none rounded-md border border-border bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-teal" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Convergences</span>
                <textarea value={convergences} onChange={(e) => setConvergences(e.target.value)} rows={3} className="w-full resize-none rounded-md border border-border bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-teal" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Divergences</span>
                <textarea value={divergences} onChange={(e) => setDivergences(e.target.value)} rows={3} className="w-full resize-none rounded-md border border-border bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-teal" />
              </label>
              <button onClick={handleCreateMerge} className="rounded-lg bg-teal px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-light">
                Create Merge
              </button>
            </div>
          )}
        </>
      )}

      {state.council_merges.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">Past Merges</h3>
          <div className="flex flex-col gap-2">
            {state.council_merges.map((m) => (
              <div key={m.id} className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
                <GitMerge className="h-4 w-4 text-teal" />
                <span className="text-sm text-foreground">{m.id}</span>
                <span className="text-xs text-muted-foreground">{m.entries.length} entries</span>
                <span className="ml-auto text-xs text-muted-foreground">{m.created_at}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
