"use client"

import { Database, ExternalLink } from "lucide-react"

export function NotionBrowser() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-medium text-foreground">Notion -- Your Words, Your History</h2>
        <p className="mt-1 text-sm italic text-muted-foreground">
          Pull from what you&apos;ve said before. Context is memory.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex flex-col items-center gap-4 py-6">
          <Database className="h-10 w-10 text-muted-foreground" />
          <h3 className="text-lg font-medium text-foreground">Notion Not Connected Yet</h3>
          <div className="max-w-md text-center text-sm leading-relaxed text-muted-foreground">
            <p className="mb-3">To connect:</p>
            <ol className="flex flex-col gap-1.5 text-left">
              <li>
                1. Create a Notion integration at{" "}
                <a
                  href="https://notion.so/my-integrations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-teal hover:underline"
                >
                  notion.so/my-integrations
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>2. Share your database with the integration</li>
              <li>
                3. Add <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">NOTION_API_KEY</code> and{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">NOTION_DATABASE_ID</code> to your environment variables
              </li>
            </ol>
            <p className="mt-4 text-xs text-muted-foreground">
              Your Notion databases become searchable context for posts and journals.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
