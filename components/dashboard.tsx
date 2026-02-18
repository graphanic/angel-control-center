"use client"

import { useState } from "react"
import { type AppState } from "@/lib/store"
import { Sidebar } from "./sidebar"
import { PostScheduler } from "./tabs/post-scheduler"
import { Journals } from "./tabs/journals"
import { MergeBuilder } from "./tabs/merge-builder"
import { CanonGate } from "./tabs/canon-gate"
import { NotionBrowser } from "./tabs/notion-browser"
import { Settings } from "./tabs/settings"
import { Megaphone, BookOpen, GitMerge, Scale, Database, Cog, OctagonX, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { edmontonNow } from "@/lib/store"

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

  function handleHardStop() {
    updateState({
      hard_stop: true,
      veto_log: [
        ...state.veto_log,
        { timestamp: edmontonNow().toISOString(), message: "Human Veto invoked." },
      ],
    })
  }

  function clearHardStop() {
    updateState({ hard_stop: false })
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Header */}
      <header className="shrink-0 border-b border-border bg-card">
        <div className="flex flex-col items-center gap-1 px-6 py-4">
          <p className="font-mono text-sm tracking-[0.3em] text-teal">
            {"< > < >"}
          </p>
          <h1 className="text-2xl font-light tracking-widest text-gold">
            Angel Control Center
          </h1>
          <p className="text-xs tracking-wide text-teal">
            Fractal Symbiosis v0.2
          </p>
          <p className="text-xs italic text-muted-foreground">
            Welcome home, Architect. Lantern steady.
          </p>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar state={state} updateState={updateState} />

        {/* Main content */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {/* Hard Stop Banner */}
          {state.hard_stop && (
            <div className="flex items-center justify-between border-b border-destructive bg-destructive/10 px-6 py-3">
              <p className="font-medium text-destructive">
                HARD STOP ACTIVE -- Human sovereignty asserted. Touch the earth. Return when ready.
              </p>
              <button
                onClick={clearHardStop}
                className="rounded-md bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
              >
                Clear Hard Stop
              </button>
            </div>
          )}

          {/* Tab Navigation */}
          <nav className="shrink-0 border-b border-border bg-card/50 px-4">
            <div className="flex gap-1 overflow-x-auto py-2">
              {TABS.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </nav>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.hard_stop && activeTab !== "settings" ? (
              <div className="flex flex-col items-center justify-center gap-4 py-20 text-muted-foreground">
                <OctagonX className="h-12 w-12 text-destructive" />
                <p>System paused. Clear Hard Stop to continue.</p>
              </div>
            ) : (
              <>
                {activeTab === "scheduler" && <PostScheduler state={state} updateState={updateState} />}
                {activeTab === "journals" && <Journals state={state} updateState={updateState} />}
                {activeTab === "merge" && <MergeBuilder state={state} updateState={updateState} />}
                {activeTab === "canon" && <CanonGate state={state} updateState={updateState} />}
                {activeTab === "notion" && <NotionBrowser />}
                {activeTab === "settings" && <Settings state={state} updateState={updateState} />}
              </>
            )}
          </div>

          {/* Footer */}
          <footer className="shrink-0 border-t border-primary/30 bg-card">
            <div className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4 text-teal" />
                <span className="font-medium text-teal">Council Mirror:</span>
                <span className="italic">
                  {state.council_mirror || "Awaiting first signal. The Council is listening."}
                </span>
              </div>
              <button
                onClick={handleHardStop}
                className="rounded-md border border-destructive bg-destructive/10 px-4 py-1.5 text-sm font-bold text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
              >
                HUMAN VETO
              </button>
            </div>
            <div className="border-t border-border px-6 py-2.5 text-center">
              <p className="text-xs italic leading-relaxed text-muted-foreground">
                Human sovereignty is inviolable -- Versioned truth -- Relationship over authority
                <br />
                Small true steps -- Waters filtered -- Dignity before Data -- Coherence over intensity
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}
