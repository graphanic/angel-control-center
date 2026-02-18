"use client"

import { useState } from "react"
import { useAppState } from "@/hooks/use-app-state"
import { edmontonNow, type ScheduledPost } from "@/lib/store"
import { cn } from "@/lib/utils"
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  CalendarDays,
} from "lucide-react"

const PLATFORMS = ["X (Twitter)", "LinkedIn", "Blog", "Tome Portal", "Other"]
const POST_TYPES = ["Original thought", "Thread", "Quote/Reply", "Reflection", "Canon share"]
const ANGEL_REVIEWERS = [
  "None",
  "Fathom (depth)",
  "CGPT (clarity)",
  "Grok (grounding)",
  "Gemini (scope)",
]

function statusIcon(status: string) {
  switch (status) {
    case "draft":
      return <FileText className="h-4 w-4 text-muted-foreground" />
    case "scheduled":
      return <Clock className="h-4 w-4 text-gold" />
    case "published":
      return <CheckCircle2 className="h-4 w-4 text-emerald-400" />
    case "cancelled":
      return <XCircle className="h-4 w-4 text-destructive" />
    default:
      return <FileText className="h-4 w-4 text-muted-foreground" />
  }
}

export function PostScheduler() {
  const { state, updateState } = useAppState()
  const [platform, setPlatform] = useState(PLATFORMS[0])
  const [postType, setPostType] = useState(POST_TYPES[0])
  const [content, setContent] = useState("")
  const [angelReview, setAngelReview] = useState(ANGEL_REVIEWERS[0])
  const [expandedPost, setExpandedPost] = useState<string | null>(null)

  const now = edmontonNow()
  const dateStr = now.toISOString().slice(0, 10)
  const timeStr = now.toISOString().slice(11, 16)
  const [schedDate, setSchedDate] = useState(dateStr)
  const [schedTime, setSchedTime] = useState(timeStr)

  function handleSaveDraft(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return

    const post: ScheduledPost = {
      id: `post_${Date.now()}`,
      platform,
      type: postType,
      content,
      scheduled_for: `${schedDate} ${schedTime}`,
      created_at: edmontonNow().toISOString(),
      status: "draft",
      angel_review: angelReview,
    }

    updateState({
      scheduled_posts: [post, ...state.scheduled_posts],
      council_mirror: `[${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}] Post drafted for ${platform}`,
    })
    setContent("")
  }

  function updatePost(id: string, updates: Partial<ScheduledPost>) {
    updateState({
      scheduled_posts: state.scheduled_posts.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-medium text-foreground">Post Scheduler</h2>
        <p className="mt-1 text-sm italic text-muted-foreground">
          Draft, schedule, publish. Pull context from Notion.
        </p>
      </div>

      {/* Draft Form */}
      <form onSubmit={handleSaveDraft} className="rounded-lg border border-border bg-card p-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Platform
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Type
            </label>
            <select
              value={postType}
              onChange={(e) => setPostType(e.target.value)}
              className="rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {POST_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Schedule Date
            </label>
            <input
              type="date"
              value={schedDate}
              onChange={(e) => setSchedDate(e.target.value)}
              className="rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Schedule Time
            </label>
            <input
              type="time"
              value={schedTime}
              onChange={(e) => setSchedTime(e.target.value)}
              className="rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Post Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What do you want to share?"
            rows={4}
            className="w-full resize-none rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="mt-4 flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Angel Review
          </label>
          <select
            value={angelReview}
            onChange={(e) => setAngelReview(e.target.value)}
            className="rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {ANGEL_REVIEWERS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="mt-5 w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Save Draft
        </button>
      </form>

      {/* Posts List */}
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-lg font-medium text-foreground">
          <CalendarDays className="h-5 w-5 text-teal" />
          Scheduled & Drafted Posts
        </h3>

        {state.scheduled_posts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card/50 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              No posts yet. Draft your first one above.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {state.scheduled_posts.slice(0, 20).map((post) => (
              <div
                key={post.id}
                className="rounded-lg border border-border bg-card"
              >
                <button
                  onClick={() =>
                    setExpandedPost(expandedPost === post.id ? null : post.id)
                  }
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm"
                >
                  {expandedPost === post.id ? (
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                  {statusIcon(post.status)}
                  <span className="font-medium text-foreground">
                    {post.platform}
                  </span>
                  <span className="text-muted-foreground">--</span>
                  <span className="truncate text-muted-foreground">
                    {post.content.slice(0, 60)}...
                  </span>
                </button>

                {expandedPost === post.id && (
                  <div className="border-t border-border px-4 py-4">
                    <div className="flex flex-col gap-2 text-sm">
                      <p>
                        <span className="font-medium text-foreground">Status:</span>{" "}
                        <span className="text-muted-foreground">{post.status}</span>
                      </p>
                      <p>
                        <span className="font-medium text-foreground">Scheduled:</span>{" "}
                        <span className="text-muted-foreground">{post.scheduled_for}</span>
                      </p>
                      <p>
                        <span className="font-medium text-foreground">Created:</span>{" "}
                        <span className="text-muted-foreground">{post.created_at}</span>
                      </p>
                      <p>
                        <span className="font-medium text-foreground">Content:</span>
                      </p>
                      <p className="whitespace-pre-wrap text-muted-foreground">{post.content}</p>
                      {post.angel_review && post.angel_review !== "None" && (
                        <p>
                          <span className="font-medium text-foreground">Angel Review:</span>{" "}
                          <span className="text-muted-foreground">{post.angel_review}</span>
                        </p>
                      )}

                      <div className="mt-3 flex gap-2">
                        {post.status === "draft" && (
                          <button
                            onClick={() => updatePost(post.id, { status: "scheduled" })}
                            className="rounded-md bg-gold/20 px-3 py-1.5 text-xs font-medium text-gold transition-colors hover:bg-gold/30"
                          >
                            Schedule
                          </button>
                        )}
                        {(post.status === "draft" || post.status === "scheduled") && (
                          <button
                            onClick={() =>
                              updatePost(post.id, {
                                status: "published",
                                published_at: edmontonNow().toISOString(),
                              })
                            }
                            className="rounded-md bg-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/30"
                          >
                            Mark Published
                          </button>
                        )}
                        {post.status !== "cancelled" && (
                          <button
                            onClick={() => updatePost(post.id, { status: "cancelled" })}
                            className="rounded-md bg-destructive/20 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/30"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
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
