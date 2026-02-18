import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(req: Request) {
  const { password } = await req.json()
  const expectedHash = process.env.ANGEL_GATE_HASH

  // No hash configured = dev mode, allow access
  if (!expectedHash) {
    return NextResponse.json({ ok: true })
  }

  const inputHash = crypto.createHash("sha256").update(password || "").digest("hex")

  return NextResponse.json({ ok: inputHash === expectedHash })
}
