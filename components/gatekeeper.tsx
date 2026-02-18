"use client"

import { useState } from "react"
import { useAppState } from "@/hooks/use-app-state"
import { Lock } from "lucide-react"

export function Gatekeeper() {
  const { updateState } = useAppState()
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(false)

    // Client-side hash verification
    // In dev mode (no hash configured), any password works
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

    // Check against env var (exposed via API) or allow in dev mode
    try {
      const res = await fetch("/api/verify-gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hash: hashHex }),
      })
      const result = await res.json()

      if (result.authorized) {
        updateState({ authenticated: true })
      } else {
        setError(true)
      }
    } catch {
      // If API unavailable, allow access in dev mode
      updateState({ authenticated: true })
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-lg tracking-wide text-muted-foreground">
          Access Required
        </p>

        <form onSubmit={handleSubmit} className="flex w-72 flex-col gap-3">
          <input
            type="password"
            placeholder="Enter passphrase"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-input bg-card px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Enter"}
          </button>
          {error && (
            <p className="text-center text-sm text-destructive">
              Access denied.
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
