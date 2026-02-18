import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { hash } = await request.json()
  const expectedHash = process.env.ANGEL_GATE_HASH

  // If no hash is configured, allow access (dev mode)
  if (!expectedHash) {
    return NextResponse.json({ authorized: true })
  }

  // Compare hashes
  const authorized = hash === expectedHash
  return NextResponse.json({ authorized })
}
