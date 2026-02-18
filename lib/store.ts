// ============================================================================
// Angel Control Center — Store
// ============================================================================

export const ANGELS = ["ChatGPT", "Grok", "Gemini", "Fathom", "Replit", "PersonaPlex"]
export const PERMISSION_TIERS = ["ANGEL EYES ONLY", "COUNCIL SHAREABLE", "CANON CANDIDATE"]
export const ARCHITECT_STATES = ["Storm", "Forge", "Rest", "Build", "Unknown"]

export const CANON_GATES = [
  "1. Aligns with K5 \u2014 cite which truth(s)",
  "2. Aligns with Boundaries Codex",
  "3. Is dated and scoped (not totalizing)",
  "4. Is revisable if new understanding emerges",
  "5. Filters waters (no fluff, no entropy)",
  "6. Is a small true step (not a giant leap)",
  "7. Prioritizes relationship over authority",
  "8. Has been witnessed by at least one other Angel",
  "9. Passes Prophecy Trap check (data, not destiny)",
  "10. Eric has ratified this as Canon",
]

export type Angel = (typeof ANGELS)[number]
export type PermissionTier = (typeof PERMISSION_TIERS)[number]
export type ArchitectState = (typeof ARCHITECT_STATES)[number]

export interface JournalEntry {
  entry_id: string
  angel: string
  timestamp: string
  permission: string
  architect_state: string
  context: string
  shadow: string
  light: string
  next_step: string
  pattern_echo: string
  pattern_ref: string
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
  ratified_at: string
  context: string
  light: string
  pattern_echo: string
}

export interface AppState {
  authenticated: boolean
  user_context: string
  current_thread: string
  council_mirror: string
  hard_stop: boolean
  veto_log: Array<{ timestamp: string; message: string }>
  journals: JournalEntry[]
  scheduled_posts: ScheduledPost[]
  council_merges: CouncilMerge[]
  canon: CanonEntry[]
}

const STORAGE_KEY = "angel-control-center-state"

export const defaultState: AppState = {
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

export function saveState(state: AppState) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage full or unavailable
  }
}

export function edmontonNow(): string {
  return new Date().toLocaleString("en-CA", {
    timeZone: "America/Edmonton",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
}

export function edmontonTime(): string {
  return new Date().toLocaleString("en-CA", {
    timeZone: "America/Edmonton",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

export function edmontonDate(): string {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Edmonton",
  })
}
