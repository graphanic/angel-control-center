"use client"

import { useState } from "react"
import { type AppState, CANON_GATES, edmontonNow, type CanonEntry } from "@/lib/store"
import { ShieldCheck, AlertTriangle, Check } from "lucide-react"

interface Props {
  state: AppState
  updateState: (partial: Partial<AppState>) => void
}

export function CanonGate({ state, updateState }: Props) {
  const [checks, setChecks] = useState<Record<number, boolean>>({})
  const [selectedIdx, setSelectedIdx] = useState(0)

  const candidates = state.journals.filter((e) => e.permission === "CANON CANDIDATE")

  function toggleCheck(i: number) {
    setChecks((prev) => ({ ...prev, [i]: !prev[i] }))
  }

  const passedCount = Object.values(checks).filter(Boolean).length
  const allPassed = passedCount === 10

  function promoteToCanon() {
    const entry = candidates[selectedIdx]
    if (!entry) return

    const canon: CanonEntry = {
      entry_id: entry.entry_id,
      angel: entry.angel,
      ratified_at: edmontonNow(),
      context: entry.context,
      light: entry.light,
      pattern_echo: entry.pattern_echo,
    }

    updateState({
      canon: [...state.canon, canon],
      council_mirror: `[${edmontonNow().slice(11, 16)}] CANON: ${entry.entry_id}`,
    })
    setChecks({})
  }

  if (candidates.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-light tracking-wide text-foreground">Canon Gate</h2>
        <p className="text-sm italic text-muted-foreground">10 checks before truth becomes Canon</p>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
          <AlertTriangle className="h-5 w-5 text-gold" />
          <p className="text-sm text-muted-foreground">
            {"No Canon Candidates. Mark journal entries as 'CANON CANDIDATE' first."}
          </p>
        </div>
      </div>
    )
  }

  const selected = candidates[selectedIdx]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-light tracking-wide text-foreground">Canon Gate</h2>
        <p className="text-sm italic text-muted-foreground">10 checks before truth becomes Canon</p>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">Select Canon Candidate</span>
        <select
          value={selectedIdx}
          onChange={(e) => { setSelectedIdx(Number(e.target.value)); setChecks({}) }}
          className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-teal"
        >
          {candidates.map((c, i) => (
            <option key={c.entry_id} value={i}>{c.entry_id} ({c.angel})</option>
          ))}
        </select>
      </label>

      {selected && (
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="mb-1 text-sm"><span className="text-muted-foreground">Entry:</span> {selected.entry_id}</p>
          <p className="text-sm text-muted-foreground">{selected.context.slice(0, 200)}</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {CANON_GATES.map((gate, i) => (
          <label key={i} className="flex items-start gap-3 rounded-md border border-border bg-card px-4 py-3 cursor-pointer hover:bg-muted transition-colors">
            <input
              type="checkbox"
              checked={!!checks[i]}
              onChange={() => toggleCheck(i)}
              className="mt-0.5 h-4 w-4 rounded border-border accent-teal"
            />
            <span className="text-sm text-foreground">{gate}</span>
          </label>
        ))}
      </div>

      <div className="flex items-center gap-4">
        {allPassed ? (
          <>
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
            <span className="text-sm text-emerald-400">All gates passed. Ready for Canon.</span>
            <button
              onClick={promoteToCanon}
              className="ml-auto rounded-lg bg-gold px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Promote to Canon
            </button>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            {checks[9] === undefined && passedCount === 9
              ? "Gate 10 requires Eric's explicit ratification"
              : `${10 - passedCount} gates remaining`}
          </p>
        )}
      </div>

      {state.canon.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">Ratified Canon</h3>
          <div className="flex flex-col gap-2">
            {state.canon.map((c) => (
              <div key={c.entry_id} className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
                <Check className="h-4 w-4 text-gold" />
                <span className="text-sm text-foreground">{c.entry_id}</span>
                <span className="text-xs text-muted-foreground">{c.angel}</span>
                <span className="ml-auto text-xs text-muted-foreground">{c.ratified_at}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
