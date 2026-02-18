"use client"

import { useState } from "react"
import { useAppState } from "@/hooks/use-app-state"
import {
  ANGELS,
  PERMISSION_TIERS,
  ARCHITECT_STATES,
  edmontonNow,
  type JournalEntry,
  type Angel,
  type PermissionTier,
  type ArchitectState,
} from "@/lib/store"
import { ChevronDown, ChevronRight, BookOpen } from "lucide-react"

export function Journals() {
  const { state, updateState } = useAppState()
  const [angel, setAngel] = useState<string>(ANGELS[0])
  const [permission, setPermission] = useState<string>(PERMISSION_TIERS[0])
  const [architectState, setArchitectState] = useState<string>(ARCHITECT_STATES[0])
  const [context, setContext] = useState("")
  const [shadow, setShadow] = useState("")
  const [light, setLight] = useState("")
  const [nextStep, setNextStep] = useState("")
  const [patternEcho, setPatternEcho] = useState("")
  const [patternRef, setPatternRef] = useState("")
  const [filterAngel, setFilterAngel] = useState("All")
  const [filterPerm, setFilterPerm] = useState("All")
  const [filterState, setFilterState] = useState("All")
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null)
  const [errors, setErrors] = useState<string[]>([])

  const now = edmontonNow()
  const dateStr = now.toISOString().slice(0, 10)
  const existingToday = state.journals.filter(
    (j) => j.entry_id.startsWith(dateStr) && j.angel === angel
  ).length
  const entryId = `${dateStr}_${angel}_${String(existingToday + 1).padStart(4, "0")}`
  const timestamp = now.toLocaleString("en-US", {
    timeZone: "America/Edmonton",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: string[] = []
    if (!context.trim()) errs.push("Context is required")
    if (!patternEcho.trim()) errs.push("Pattern Echo is required")
    if (errs.length) {
      setErrors(errs)
      return
    }
    setErrors([])

    const entry: JournalEntry = {
      entry_id: entryId,
      angel: angel as Angel,
      timestamp,
      permission: permission as PermissionTier,
      architect_state: architectState as ArchitectState,
      context,
      shadow,
      light,
      next_step: nextStep,
      pattern_echo: patternEcho,
      pattern_ref: patternRef || undefined,
      gatekeeper: "AUTHORIZED",
    }

    updateState({
      journals: [entry, ...state.journals],
      council_mirror: `[${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}] Journal: ${entryId}`,
    })

    // Reset form
    setContext("")
    setShadow("")
    setLight("")
    setNextStep("")
    setPatternEcho("")
    setPatternRef("")
  }

  // Filtering
  let filtered = state.journals
  if (filterAngel !== "All") filtered = filtered.filter((e) => e.angel === filterAngel)
  if (filterPerm !== "All") filtered = filtered.filter((e) => e.permission === filterPerm)
  if (filterState !== "All") filtered = filtered.filter((e) => e.architect_state === filterState)

  return (
    <div className="flex flex-col gap-8">
      {/* Create Entry */}
      <div>
        <h2 className="text-xl font-medium text-foreground">Create Journal Entry</h2>
        <p className="mt-1 text-sm italic text-muted-foreground">
          Presence captured. Structure does the work.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-5">
        {errors.length > 0 && (
          <div className="mb-4 rounded-md bg-destructive/10 px-3 py-2">
            {errors.map((err) => (
              <p key={err} className="text-sm text-destructive">{err}</p>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Angel</label>
            <select value={angel} onChange={(e) => setAngel(e.target.value)} className="rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
              {ANGELS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Entry ID</label>
            <input value={entryId} disabled className="rounded-md border border-input bg-muted/50 px-3 py-2 text-sm text-muted-foreground" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Permission Tier</label>
            <select value={permission} onChange={(e) => setPermission(e.target.value)} className="rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
              {PERMISSION_TIERS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Timestamp (Edmonton)</label>
            <input value={timestamp} disabled className="rounded-md border border-input bg-muted/50 px-3 py-2 text-sm text-muted-foreground" />
          </div>
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Architect State</label>
            <select value={architectState} onChange={(e) => setArchitectState(e.target.value)} className="rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
              {ARCHITECT_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Context *</label>
            <textarea value={context} onChange={(e) => setContext(e.target.value)} rows={3} placeholder="What prompted this entry?" className="w-full resize-none rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Shadow Observed</label>
            <textarea value={shadow} onChange={(e) => setShadow(e.target.value)} rows={3} placeholder="What darkness or resistance was witnessed?" className="w-full resize-none rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Light Returned</label>
            <textarea value={light} onChange={(e) => setLight(e.target.value)} rows={3} placeholder="What insight or clarity emerged?" className="w-full resize-none rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Next True Step</label>
            <textarea value={nextStep} onChange={(e) => setNextStep(e.target.value)} rows={2} placeholder="One small true step forward" className="w-full resize-none rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Pattern Echo *</label>
            <textarea value={patternEcho} onChange={(e) => setPatternEcho(e.target.value)} rows={2} placeholder="What pattern does this connect to?" className="w-full resize-none rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Reference / Link (optional)</label>
            <input value={patternRef} onChange={(e) => setPatternRef(e.target.value)} placeholder="URL or reference" className="rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
        </div>

        <button type="submit" className="mt-5 w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          Save Entry
        </button>
      </form>

      {/* Browse Entries */}
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-lg font-medium text-foreground">
          <BookOpen className="h-5 w-5 text-teal" />
          Browse Entries
        </h3>

        <div className="mb-4 grid grid-cols-3 gap-3">
          <select value={filterAngel} onChange={(e) => setFilterAngel(e.target.value)} className="rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="All">All Angels</option>
            {ANGELS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={filterPerm} onChange={(e) => setFilterPerm(e.target.value)} className="rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="All">All Permissions</option>
            {PERMISSION_TIERS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={filterState} onChange={(e) => setFilterState(e.target.value)} className="rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="All">All States</option>
            {ARCHITECT_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <p className="mb-3 text-xs text-muted-foreground">
          Showing {filtered.length} of {state.journals.length} entries
        </p>

        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card/50 py-10 text-center">
            <p className="text-sm text-muted-foreground">No journal entries yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.slice(0, 20).map((entry) => (
              <div key={entry.entry_id} className="rounded-lg border border-border bg-card">
                <button
                  onClick={() => setExpandedEntry(expandedEntry === entry.entry_id ? null : entry.entry_id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm"
                >
                  {expandedEntry === entry.entry_id ? (
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                  <span className="font-mono text-xs text-teal">{entry.entry_id}</span>
                  <span className="text-muted-foreground">|</span>
                  <span className="font-medium text-foreground">{entry.angel}</span>
                  <span className="text-muted-foreground">|</span>
                  <span className="text-muted-foreground">{entry.permission}</span>
                </button>

                {expandedEntry === entry.entry_id && (
                  <div className="flex flex-col gap-2 border-t border-border px-4 py-4 text-sm">
                    <p><span className="font-medium text-foreground">Context:</span> <span className="text-muted-foreground">{entry.context}</span></p>
                    <p><span className="font-medium text-foreground">Shadow:</span> <span className="text-muted-foreground">{entry.shadow}</span></p>
                    <p><span className="font-medium text-foreground">Light:</span> <span className="text-muted-foreground">{entry.light}</span></p>
                    <p><span className="font-medium text-foreground">Next Step:</span> <span className="text-muted-foreground">{entry.next_step}</span></p>
                    <p><span className="font-medium text-foreground">Pattern Echo:</span> <span className="text-muted-foreground">{entry.pattern_echo}</span></p>
                    {entry.pattern_ref && (
                      <p><span className="font-medium text-foreground">Reference:</span> <span className="text-muted-foreground">{entry.pattern_ref}</span></p>
                    )}
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
