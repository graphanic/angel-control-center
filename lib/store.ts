// Angel Control Center — Client-side state management
// Mirrors the original Streamlit session_state + file persistence pattern

export const ANGELS = ["ChatGPT", "Grok", "Gemini", "Fathom", "Replit", "PersonaPlex"] as const
export type Angel = (typeof ANGELS)[number]

export const PERMISSION_TIERS = ["ANGEL EYES ONLY", "COUNCIL SHAREABLE", "CANON CANDIDATE"] as const
export type PermissionTier = (typeof PERMISSION_TIERS)[number]

export const ARCHITECT_STATES = ["Storm", "Forge", "Rest", "Build", "Unknown"] as const
export type ArchitectState = (typeof ARCHITECT_STATES)[number]

export const CANON_GATES = [
  "1. Aligns with K5 -- cite which truth(s)",
  "2. Aligns with Boundaries Codex",
  "3. Is dated and scoped (not totalizing)",
  "4. Is revisable if new understanding emerges",
  "5. Filters waters (no fluff, no entropy)",
  "6. Is a small true step (not a giant leap)",
  "7. Prioritizes relationship over authority",
  "8. Has been witnessed by at least one other Angel",
  "9. Passes Prophecy Trap check (data, not destiny)",
  "10. Eric has ratified this as Canon",
] as const

export interface JournalEntry {
  entry_id: string
  angel: Angel | string
  timestamp: string
  permission: PermissionTier | string
  architect_state: ArchitectState | string
  context: string
  shadow: string
  light: string
  next_step: string
  pattern_echo: string
  pattern_ref?: string
  gatekeeper: string
}

export interface ScheduledPost {
  id: string
  platform: string
  type: string
  content: string
  scheduled_for: string
  created_at: string
  status: "draft" | "scheduled" | "published" | "cancelled"
  angel_review: string
  published_at?: string
}

export interface CouncilMerge {
  id: string
  created_at: string
  entries: string[]
  summary: string
  convergences: string
  divergences: string
}

export interface CanonEntry {
  entry_id: string
  angel: string
  context: string
  light: string
  pattern_echo: string
  ratified_at: string
}

export interface AppState {
  authenticated: boolean
  user_context: string
  current_thread: string
  council_mirror: string
  hard_stop: boolean
  veto_log: { timestamp: string; message: string }[]
  journals: JournalEntry[]
  scheduled_posts: ScheduledPost[]
  council_merges: CouncilMerge[]
  canon: CanonEntry[]
}

const STORAGE_KEY = "angel_control_center_state"

const defaultState: AppState = {
  authenticated: false,
  user_context: "",
  current_thread: "",
  council_mirror: "",
  hard_stop: false,
  veto_log: [],
  journals: [],
  scheduled_posts: [],
  council_merges: [],
  canon: [],
}

export function loadState(): AppState {
  if (typeof window === "undefined") return defaultState
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState
    return { ...defaultState, ...JSON.parse(raw) }
  } catch {
    return defaultState
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage full or unavailable
  }
}

export function edmontonNow(): Date {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Edmonton" })
  )
}

export function formatEdmontonTime(date?: Date): string {
  const d = date ?? edmontonNow()
  return d.toLocaleString("en-US", {
    timeZone: "America/Edmonton",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}
