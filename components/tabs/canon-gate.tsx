"use client"

import { useState } from "react"
import { type AppState, CANON_GATES, edmontonNow, type CanonEntry } from "@/lib/store"
import { ShieldCheck, AlertTriangle, Check } from "lucide-react"

interface CanonGateProps {
  state: AppState
  updateState: (partial: Partial<AppState>) => void
}

export function CanonGate({ state, updateState }: CanonGateProps) {
  const [selectedIdx, setSelectedIdx] = useState<number>(-1)
  const [checks, setChecks] = useState<boolean[]>(new Array(10).fill(false))

  const candidates = state.journals.filter(
    (j) => j.permission === "CANON CANDIDATE"
  )

  const selected = selectedIdx >= 0 ? candidates[selectedIdx] : null
  const allPassed = checks.every(Boolean)
  const ericRatified = checks[9]
  const passedCount = checks.filter(Boolean).length

  function handleCheck(index: number) {
    const next = [...checks]
    next[index] = !next[index]
    setChecks(next)
  }

  function handlePromote() {
    if (!selected || !allPassed) return

    const canon: CanonEntry = {
      entry_id: selected.entry_id,
      angel: selected.angel,
      context: selected.context,
      light: selected.light,
      pattern_echo: selected.pattern_echo,
      ratified_at: edmontonNow().toISOString(),
    }

    updateState({
      canon: [...state.canon, canon],
      council_mirror: `[${edmontonNow().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}] CANON: ${selected.entry_id}`,
    })

    setChecks(new Array(10).fill(false))
    setSelectedIdx(-1)
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-medium text-foreground">Canon Gate</h2>
        <p className="mt-1 text-sm italic text-muted-foreground">
          10 checks before truth becomes Canon.
        </p>
      </div>

      {candidates.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card/50 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            No Canon Candidates. Mark journal entries as &quot;CANON CANDIDATE&quot; permission tier first.
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Select Canon Candidate
            </label>
            <select
              value={selectedIdx}
              onChange={(e) => {
                setSelectedIdx(Number(e.target.value))
                setChecks(new Array(10).fill(false))
              }}
              className="rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value={-1}>-- Select --</option>
              {candidates.map((c, i) => (
                <option key={c.entry_id} value={i}>
                  {c.entry_id} ({c.angel})
                </option>
              ))}
            </select>
          </div>

          {selected && (
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="text-sm">
                <span className="font-medium text-foreground">Entry:</span>{" "}
                <span className="font-mono text-teal">{selected.entry_id}</span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {selected.context.slice(0, 200)}
              </p>

              <div className="my-4 h-px bg-border" />

              <div className="flex flex-col gap-2">
                {CANON_GATES.map((gate, i) => (
                  <label
                    key={i}
                    className="flex cursor-pointer items-start gap-3 rounded-md px-3 py-2 transition-colors hover:bg-muted"
                  >
                    <input
                      type="checkbox"
                      checked={checks[i]}
                      onChange={() => handleCheck(i)}
                      className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
                    />
                    <span className="text-sm text-foreground">{gate}</span>
                  </label>
                ))}
              </div>

              <div className="mt-4">
                {allPassed ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <ShieldCheck className="h-5 w-5" />
                      <span className="text-sm font-medium">All gates passed. Ready for Canon.</span>
                    </div>
                    <button
                      onClick={handlePromote}
                      className="w-full rounded-md bg-gold py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-gold/90"
                    >
                      Promote to Canon
                    </button>
                  </div>
                ) : !ericRatified && passedCount === 9 ? (
                  <div className="flex items-center gap-2 text-gold">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="text-sm">
                      {"Gate 10 requires Eric's explicit ratification"}
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {10 - passedCount} gates remaining
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Ratified Canon */}
          {state.canon.length > 0 && (
            <div>
              <h3 className="mb-3 text-lg font-medium text-gold">Ratified Canon</h3>
              <div className="flex flex-col gap-2">
                {state.canon.map((c) => (
                  <div key={c.entry_id} className="rounded-lg border border-gold/20 bg-gold/5 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-gold" />
                      <span className="font-mono text-sm text-gold">{c.entry_id}</span>
                      <span className="text-xs text-muted-foreground">({c.angel})</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{c.context.slice(0, 120)}</p>
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
