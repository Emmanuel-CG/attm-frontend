import { div as Div } from "react"

export default function LoadingProfile() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="h-10 w-24 bg-muted rounded-md mb-4 animate-pulse" />
          <div className="h-10 w-64 bg-muted rounded-md animate-pulse mb-2" />
          <div className="h-5 w-96 bg-muted rounded-md animate-pulse" />
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-border p-6 space-y-4">
            <div className="h-6 w-40 bg-muted rounded-md animate-pulse mb-4" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-muted rounded-md animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
