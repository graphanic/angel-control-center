"use client"

import { useState } from "react"
import { useAppState } from "@/hooks/use-app-state"
import { edmontonNow, type CouncilMerge } from "@/lib/store"
import { GitMerge } from "lucide-react"

export function MergeBuilder() {
  const { state, updateState } = useAppState()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [summary, setSummary] = useState("")
  const [convergences, setConvergences] = useState("")
  const [divergences, setDivergences] = useState("")

  const shareable = state.journals.filter(
    (j) => j.permission === "COUNCIL SHAREABLE" || j.permission === "CANON CANDIDATE"
  )

  function toggleEntry(id: string) {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  function handleMerge() {
    if (selectedIds.size < 2) return

    const merge: CouncilMerge = {
      id: `COUNCIL_${Date.now()}`,
      created_at: edmontonNow().toISOString(),
      entries: Array.from(selectedIds),
      summary,
      convergences,
      divergences,
    }

    updateState({
      council_merges: [merge, ...state.council_merges],
      council_mirror: `[${edmontonNow().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}] Merge: ${merge.id}`,
    })

    setSelectedIds(new Set())
    setSummary("")
    setConvergences("")
    setDivergences("")
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-medium text-foreground">Council Merge Builder</h2>
        <p className="mt-1 text-sm italic text-muted-foreground">
          Synthesize entries across Angels. Select 2 or more shareable entries.
        </p>
      </div>

      {shareable.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card/50 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            No shareable entries yet. Create journal entries with &quot;COUNCIL SHAREABLE&quot; or &quot;CANON CANDIDATE&quot; permission.
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Select Entries to Merge
            </p>
            <div className="flex flex-col gap-1">
              {shareable.slice(0, 30).map((entry) => (
                <label
                  key={entry.entry_id}
                  className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-muted"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(entry.entry_id)}
                    onChange={() => toggleEntry(entry.entry_id)}
                    className="h-4 w-4 rounded border-border accent-primary"
                  />
                  <span className="font-mono text-xs text-teal">{entry.entry_id}</span>
                  <span className="text-sm text-muted-foreground">({entry.angel})</span>
                </label>
              ))}
            </div>
          </div>

          {selectedIds.size >= 2 && (
            <div className="rounded-lg border border-primary/30 bg-card p-5">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Merge Summary</label>
                  <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} className="w-full resize-none rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" placeholder="Summarize the merge..." />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Convergences</label>
                  <textarea value={convergences} onChange={(e) => setConvergences(e.target.value)} rows={3} className="w-full resize-none rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" placeholder="Where do these entries align?" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Divergences</label>
                  <textarea value={divergences} onChange={(e) => setDivergences(e.target.value)} rows={3} className="w-full resize-none rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" placeholder="Where do they differ?" />
                </div>
                <button
                  onClick={handleMerge}
                  className="w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Create Merge
                </button>
              </div>
            </div>
          )}

          {/* Existing merges */}
          {state.council_merges.length > 0 && (
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-medium text-foreground">
                <GitMerge className="h-5 w-5 text-teal" />
                Previous Merges
              </h3>
              <div className="flex flex-col gap-2">
                {state.council_merges.map((m) => (
                  <div key={m.id} className="rounded-lg border border-border bg-card px-4 py-3">
                    <p className="font-mono text-xs text-teal">{m.id}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{m.summary || "No summary"}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{m.entries.length} entries merged</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
