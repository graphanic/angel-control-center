"use client"

import { useAppState } from "@/hooks/use-app-state"
import { Gatekeeper } from "@/components/gatekeeper"
import { Dashboard } from "@/components/dashboard"

export default function Page() {
  const { state } = useAppState()

  if (!state.authenticated) {
    return <Gatekeeper />
  }

  return <Dashboard />
}
