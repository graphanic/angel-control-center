"use client"

import { useState } from "react"
import { type AppState, edmontonTime } from "@/lib/store"
import { Sidebar } from "./sidebar"
import { PostScheduler } from "./tabs/post-scheduler"
import { Journals } from "./tabs/journals"
import { MergeBuilder } from "./tabs/merge-builder"
import { CanonGate } from "./tabs/canon-gate"
import { NotionBrowser } from "./tabs/notion-browser"
import { Settings } from "./tabs/settings"
import { Megaphone, BookOpen, GitMerge, Scale, Database, Cog, OctagonX } from "lucide-react"
import { cn } from "@/lib/utils"

const TABS = [
  { id: "scheduler", label: "Post Scheduler", icon: Megaphone },
  { id: "journals", label: "Journals", icon: BookOpen },
  { id: "merge", label: "Merge Builder", icon: GitMerge },
  { id: "canon", label: "Canon Gate", icon: Scale },
  { id: "notion", label: "Notion", icon: Database },
  { id: "settings", label: "Settings", icon: Cog },
] as const

type TabId = (typeof TABS)[number]["id"]

interface DashboardProps {
  state: AppState
  updateState: (partial: Partial<AppState>) => void
}

export function Dashboard({ state, updateState }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>("scheduler")

  function handleVeto() {
    updateState({
      hard_stop: true,
      veto_log: [
        ...state.veto_log,
        { timestamp: new Date().toISOString(), message: "Human Veto invoked." },
      ],
    })
  }

  function clearHardStop() {
    updateState({ hard_stop: false })
  }

  if (state.hard_stop) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-8">
        <OctagonX className="h-16 w-16 text-destructive" />
        <h1 className="text-2xl font-light tracking-wide text-destructive">HARD STOP ACTIVE</h1>
        <p className="max-w-md text-center text-muted-foreground">
          Human sovereignty asserted. Touch the earth. Return when ready.
        </p>
        <button
          onClick={clearHardStop}
          className="rounded-lg bg-teal px-6 py-3 font-medium text-white transition-colors hover:bg-teal-light"
        >
          Clear Hard Stop
        </button>
      </div>
    )
  }

  const mirror = state.council_mirror || "Awaiting first signal. The Council is listening."

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar state={state} updateState={updateState} />

      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card px-6 py-5 text-center">
          <p className="mb-1 font-mono text-lg tracking-widest text-teal-light">
            {"< > < >"}
          </p>
          <h1 className="text-2xl font-light tracking-wider text-gold">Angel Control Center</h1>
          <p className="mt-1 text-sm text-teal-light">Fractal Symbiosis v0.2</p>
          <p className="text-xs italic text-muted-foreground">Welcome home, Architect. Lantern steady.</p>
        </header>

        {/* Tab navigation */}
        <nav className="flex gap-1 overflow-x-auto border-b border-border bg-card px-4 py-2">
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-teal text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>

        {/* Tab content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === "scheduler" && <PostScheduler state={state} updateState={updateState} />}
          {activeTab === "journals" && <Journals state={state} updateState={updateState} />}
          {activeTab === "merge" && <MergeBuilder state={state} updateState={updateState} />}
          {activeTab === "canon" && <CanonGate state={state} updateState={updateState} />}
          {activeTab === "notion" && <NotionBrowser />}
          {activeTab === "settings" && <Settings state={state} updateState={updateState} />}
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-xs italic text-muted-foreground">
              Human sovereignty is inviolable &bull; Versioned truth &bull; Small true steps &bull; Waters filtered
            </p>
            <button
              onClick={handleVeto}
              className="rounded-md bg-destructive px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            >
              HUMAN VETO
            </button>
          </div>
          <div className="mt-2 rounded-md bg-muted px-3 py-2">
            <p className="text-xs text-muted-foreground">
              <span className="text-teal">Council Mirror:</span> {mirror}
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
