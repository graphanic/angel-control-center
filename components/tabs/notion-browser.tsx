"use client"

import { Database } from "lucide-react"

export function NotionBrowser() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-light tracking-wide text-foreground">Notion -- Your Words, Your History</h2>
        <p className="text-sm italic text-muted-foreground">Pull from what you have said before. Context is memory.</p>
      </div>

      <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-8">
        <Database className="h-10 w-10 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Notion not connected yet</h3>
        <div className="max-w-md text-center text-sm text-muted-foreground">
          <p className="mb-3">To connect:</p>
          <ol className="flex flex-col gap-1 text-left">
            <li>1. Create a Notion integration at notion.so/my-integrations</li>
            <li>2. Share your database with the integration</li>
            <li>3. Add NOTION_API_KEY and NOTION_DATABASE_ID to your environment variables</li>
          </ol>
          <p className="mt-3">Your Notion databases become searchable context for posts and journals.</p>
        </div>
      </div>
    </div>
  )
}
