export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="size-9 rounded-md bg-secondary animate-pulse" />
              <div className="h-12 w-48 rounded bg-secondary animate-pulse" />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden md:block w-64 h-9 rounded bg-secondary animate-pulse" />
              <div className="size-9 rounded bg-secondary animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8">
        <div className="flex gap-6">
          {/* Desktop sidebar skeleton */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 p-4 rounded-lg bg-card border border-border space-y-5">
              {/* Results count skeleton */}
              <div className="h-7 flex items-center justify-between">
                <div className="h-4 w-24 bg-secondary animate-pulse rounded" />
              </div>

              {/* Colors skeleton */}
              <div className="space-y-2">
                <div className="h-3 w-16 bg-secondary animate-pulse rounded" />
                <div className="flex gap-1">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="w-6 h-6 bg-secondary animate-pulse rounded-full" />
                  ))}
                </div>
              </div>

              {/* Mana value skeleton */}
              <div className="space-y-2">
                <div className="h-3 w-20 bg-secondary animate-pulse rounded" />
                <div className="grid grid-cols-6 gap-1">
                  {Array.from({ length: 11 }).map((_, i) => (
                    <div key={i} className="h-8 bg-secondary/50 animate-pulse rounded" />
                  ))}
                </div>
              </div>

              {/* Mana input skeleton */}
              <div className="space-y-2">
                <div className="h-3 w-28 bg-secondary animate-pulse rounded" />
                <div className="h-9 bg-secondary/50 animate-pulse rounded" />
                <div className="h-3 w-full bg-secondary/30 animate-pulse rounded" />
              </div>

              {/* Counter toggle skeleton */}
              <div className="flex items-center justify-between py-2">
                <div className="h-3 w-32 bg-secondary animate-pulse rounded" />
                <div className="h-6 w-11 bg-secondary animate-pulse rounded-full" />
              </div>
            </div>
          </aside>

          {/* Main content skeleton */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter button skeleton */}
            <div className="lg:hidden mb-4">
              <div className="h-9 w-24 rounded-md bg-secondary animate-pulse" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-488/680 rounded-lg bg-secondary animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
