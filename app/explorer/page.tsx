import { MarketExplorer } from "@/components/explorer/market-explorer"
import { MainSidebar } from "@/components/main-sidebar"
import { Suspense } from "react"

// Basic Loading component
function LoadingExplorer() {
  return (
    <div className="flex items-center justify-center h-full">
      <p>Loading explorer...</p>
    </div>
  )
}

export default function ExplorerPage() {
  return (
    <div className="flex h-screen">
      <MainSidebar />
      <main className="flex-1 overflow-auto">
        <Suspense fallback={<LoadingExplorer />}>
          <MarketExplorer />
        </Suspense>
      </main>
    </div>
  )
}
