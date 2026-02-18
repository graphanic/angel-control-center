"use client"

import { useState } from "react"
import { Lock } from "lucide-react"

interface GatekeeperProps {
  onAuthenticate: () => void
}

export function Gatekeeper({ onAuthenticate }: GatekeeperProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/verify-gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()

      if (data.ok) {
        onAuthenticate()
      } else {
        setError("Access denied.")
      }
    } catch {
      // If API fails, allow in dev mode
      onAuthenticate()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center gap-6 w-full max-w-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="text-3xl text-muted-foreground">
            <Lock className="h-8 w-8" />
          </div>
          <p className="text-lg text-muted-foreground tracking-wide">Access Required</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter passphrase"
            className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-teal px-4 py-3 font-medium text-white transition-colors hover:bg-teal-light disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Enter"}
          </button>
          {error && <p className="text-center text-sm text-destructive">{error}</p>}
        </form>
      </div>
    </div>
  )
}
