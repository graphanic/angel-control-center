"use client"

import { useState } from "react"
import { type AppState, edmontonNow, edmontonDate, type ScheduledPost } from "@/lib/store"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight, FileText, Clock, CheckCircle2, XCircle } from "lucide-react"

const PLATFORMS = ["X (Twitter)", "LinkedIn", "Blog", "Tome Portal", "Other"]
const POST_TYPES = ["Original thought", "Thread", "Quote/Reply", "Reflection", "Canon share"]
const ANGEL_REVIEWERS = ["None", "Fathom (depth)", "CGPT (clarity)", "Grok (grounding)", "Gemini (scope)"]

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "draft": return <FileText className="h-4 w-4 text-muted-foreground" />
    case "scheduled": return <Clock className="h-4 w-4 text-gold" />
    case "published": return <CheckCircle2 className="h-4 w-4 text-emerald-400" />
    case "cancelled": return <XCircle className="h-4 w-4 text-destructive" />
    default: return <FileText className="h-4 w-4 text-muted-foreground" />
  }
}

interface Props {
  state: AppState
  updateState: (partial: Partial<AppState>) => void
}

export function PostScheduler({ state, updateState }: Props) {
  const [platform, setPlatform] = useState(PLATFORMS[0])
  const [postType, setPostType] = useState(POST_TYPES[0])
  const [content, setContent] = useState("")
  const [angelReview, setAngelReview] = useState(ANGEL_REVIEWERS[0])
  const [expanded, setExpanded] = useState<string | null>(null)

  function handleSaveDraft(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return

    const now = edmontonNow()
    const post: ScheduledPost = {
      id: `post_${Date.now()}`,
      platform,
      type: postType,
      content: content.trim(),
      scheduled_for: now,
      created_at: now,
      status: "draft",
      angel_review: angelReview,
    }

    updateState({
      scheduled_posts: [post, ...state.scheduled_posts],
      council_mirror: `[${now.slice(11, 16)}] Post drafted for ${platform}`,
    })
    setContent("")
  }

  function updatePost(id: string, update: Partial<ScheduledPost>) {
    updateState({
      scheduled_posts: state.scheduled_posts.map((p) =>
        p.id === id ? { ...p, ...update } : p
      ),
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-light tracking-wide text-foreground">Post Scheduler</h2>
        <p className="text-sm italic text-muted-foreground">Draft. Schedule. Publish. Pull context from Notion.</p>
      </div>

      <form onSubmit={handleSaveDraft} className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5">
        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Platform</span>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-teal"
            >
              {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Type</span>
            <select
              value={postType}
              onChange={(e) => setPostType(e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-teal"
            >
              {POST_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Post content</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What do you want to share?"
            rows={4}
            className="w-full resize-none rounded-md border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-teal"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Angel review before publish?</span>
          <select
            value={angelReview}
            onChange={(e) => setAngelReview(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-teal"
          >
            {ANGEL_REVIEWERS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </label>

        <button
          type="submit"
          className="rounded-lg bg-teal px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-light"
        >
          Save Draft
        </button>
      </form>

      {/* Post list */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Scheduled & Drafted Posts
        </h3>
        {state.scheduled_posts.length === 0 ? (
          <p className="rounded-lg border border-border bg-card p-4 text-center text-sm text-muted-foreground">
            No posts yet. Draft your first one above.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {state.scheduled_posts.slice(0, 20).map((post) => (
              <div key={post.id} className="rounded-lg border border-border bg-card">
                <button
                  onClick={() => setExpanded(expanded === post.id ? null : post.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                >
                  {expanded === post.id ? (
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                  <StatusIcon status={post.status} />
                  <span className="text-sm text-foreground">{post.platform}</span>
                  <span className="truncate text-sm text-muted-foreground">
                    {post.content.slice(0, 60)}...
                  </span>
                </button>
                {expanded === post.id && (
                  <div className="border-t border-border px-4 py-3">
                    <div className="mb-3 flex flex-col gap-1 text-sm">
                      <p><span className="text-muted-foreground">Status:</span> {post.status}</p>
                      <p><span className="text-muted-foreground">Created:</span> {post.created_at}</p>
                      <p className="mt-2 whitespace-pre-wrap text-foreground">{post.content}</p>
                      {post.angel_review !== "None" && (
                        <p className="mt-1"><span className="text-muted-foreground">Angel Review:</span> {post.angel_review}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {post.status === "draft" && (
                        <button
                          onClick={() => updatePost(post.id, { status: "scheduled" })}
                          className="rounded-md bg-gold px-3 py-1.5 text-xs font-medium text-background"
                        >
                          Schedule
                        </button>
                      )}
                      {(post.status === "draft" || post.status === "scheduled") && (
                        <button
                          onClick={() => updatePost(post.id, { status: "published" })}
                          className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white"
                        >
                          Mark Published
                        </button>
                      )}
                      {post.status !== "cancelled" && (
                        <button
                          onClick={() => updatePost(post.id, { status: "cancelled" })}
                          className="rounded-md bg-destructive px-3 py-1.5 text-xs font-medium text-white"
                        >
                          Cancel
                        </button>
                      )}
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
