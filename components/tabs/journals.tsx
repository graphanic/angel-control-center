"use client"

import { useState } from "react"
import {
  type AppState,
  ANGELS,
  PERMISSION_TIERS,
  ARCHITECT_STATES,
  edmontonNow,
  edmontonDate,
  type JournalEntry,
} from "@/lib/store"
import { ChevronDown, ChevronRight, BookOpen } from "lucide-react"

interface Props {
  state: AppState
  updateState: (partial: Partial<AppState>) => void
}

export function Journals({ state, updateState }: Props) {
  const [angel, setAngel] = useState(ANGELS[0])
  const [permission, setPermission] = useState(PERMISSION_TIERS[0])
  const [architectState, setArchitectState] = useState(ARCHITECT_STATES[0])
  const [context, setContext] = useState("")
  const [shadow, setShadow] = useState("")
  const [light, setLight] = useState("")
  const [nextStep, setNextStep] = useState("")
  const [patternEcho, setPatternEcho] = useState("")
  const [patternRef, setPatternRef] = useState("")
  const [filterAngel, setFilterAngel] = useState("All")
  const [filterPerm, setFilterPerm] = useState("All")
  const [filterState, setFilterState] = useState("All")
  const [expanded, setExpanded] = useState<string | null>(null)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!context.trim() || !patternEcho.trim()) return

    const now = edmontonNow()
    const date = edmontonDate()
    const count = state.journals.filter((j) => j.angel === angel && j.timestamp.startsWith(date)).length
    const entryId = `${date}_${angel}_${String(count + 1).padStart(4, "0")}`

    const entry: JournalEntry = {
      entry_id: entryId,
      angel,
      timestamp: now,
      permission,
      architect_state: architectState,
      context: context.trim(),
      shadow: shadow.trim(),
      light: light.trim(),
      next_step: nextStep.trim(),
      pattern_echo: patternEcho.trim(),
      pattern_ref: patternRef.trim(),
    }

    updateState({
      journals: [entry, ...state.journals],
      council_mirror: `[${now.slice(11, 16)}] Journal: ${entryId}`,
    })

    setContext("")
    setShadow("")
    setLight("")
    setNextStep("")
    setPatternEcho("")
    setPatternRef("")
  }

  const filtered = state.journals.filter((e) => {
    if (filterAngel !== "All" && e.angel !== filterAngel) return false
    if (filterPerm !== "All" && e.permission !== filterPerm) return false
    if (filterState !== "All" && e.architect_state !== filterState) return false
    return true
  })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-light tracking-wide text-foreground">Create Journal Entry</h2>
      </div>

      {state.hard_stop ? (
        <p className="rounded-lg border border-destructive bg-card p-4 text-center text-sm text-destructive">
          HARD STOP ACTIVE -- Journal creation disabled
        </p>
      ) : (
        <form onSubmit={handleSave} className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5">
          <div className="grid grid-cols-3 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Angel</span>
              <select value={angel} onChange={(e) => setAngel(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-teal">
                {ANGELS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Permission Tier</span>
              <select value={permission} onChange={(e) => setPermission(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-teal">
                {PERMISSION_TIERS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Architect State</span>
              <select value={architectState} onChange={(e) => setArchitectState(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-teal">
                {ARCHITECT_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Context *</span>
            <textarea value={context} onChange={(e) => setContext(e.target.value)} placeholder="What prompted this entry?" rows={3} className="w-full resize-none rounded-md border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-teal" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Shadow Observed</span>
            <textarea value={shadow} onChange={(e) => setShadow(e.target.value)} placeholder="What darkness or resistance was witnessed?" rows={3} className="w-full resize-none rounded-md border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-teal" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Light Returned</span>
            <textarea value={light} onChange={(e) => setLight(e.target.value)} placeholder="What insight or clarity emerged?" rows={3} className="w-full resize-none rounded-md border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-teal" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Next True Step</span>
            <textarea value={nextStep} onChange={(e) => setNextStep(e.target.value)} placeholder="One small true step forward" rows={2} className="w-full resize-none rounded-md border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-teal" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Pattern Echo *</span>
            <textarea value={patternEcho} onChange={(e) => setPatternEcho(e.target.value)} placeholder="What pattern does this connect to?" rows={2} className="w-full resize-none rounded-md border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-teal" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Reference / Link (optional)</span>
            <input type="text" value={patternRef} onChange={(e) => setPatternRef(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-teal" />
          </label>

          <button type="submit" className="rounded-lg bg-teal px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-light">
            Save Entry
          </button>
        </form>
      )}

      {/* Browse entries */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">Browse Entries</h3>

        <div className="mb-4 grid grid-cols-3 gap-3">
          <select value={filterAngel} onChange={(e) => setFilterAngel(e.target.value)} className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-teal">
            <option value="All">All Angels</option>
            {ANGELS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={filterPerm} onChange={(e) => setFilterPerm(e.target.value)} className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-teal">
            <option value="All">All Permissions</option>
            {PERMISSION_TIERS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={filterState} onChange={(e) => setFilterState(e.target.value)} className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-teal">
            <option value="All">All States</option>
            {ARCHITECT_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <p className="mb-2 text-xs text-muted-foreground">Showing {filtered.length} of {state.journals.length} entries</p>

        {filtered.length === 0 ? (
          <p className="rounded-lg border border-border bg-card p-4 text-center text-sm text-muted-foreground">
            No journal entries yet.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.slice(0, 20).map((entry) => (
              <div key={entry.entry_id} className="rounded-lg border border-border bg-card">
                <button
                  onClick={() => setExpanded(expanded === entry.entry_id ? null : entry.entry_id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                >
                  {expanded === entry.entry_id ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  <BookOpen className="h-4 w-4 text-teal" />
                  <span className="text-sm text-foreground">{entry.entry_id}</span>
                  <span className="text-xs text-muted-foreground">{entry.angel}</span>
                  <span className="text-xs text-muted-foreground">{entry.permission}</span>
                </button>
                {expanded === entry.entry_id && (
                  <div className="flex flex-col gap-2 border-t border-border px-4 py-3 text-sm">
                    <p><span className="text-muted-foreground">Context:</span> {entry.context}</p>
                    <p><span className="text-muted-foreground">Shadow:</span> {entry.shadow}</p>
                    <p><span className="text-muted-foreground">Light:</span> {entry.light}</p>
                    <p><span className="text-muted-foreground">Next Step:</span> {entry.next_step}</p>
                    <p><span className="text-muted-foreground">Pattern Echo:</span> {entry.pattern_echo}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
