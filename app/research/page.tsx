import { MainSidebar } from "@/components/main-sidebar"
import { ResearchInterface } from "@/components/research/research-interface"
import { Suspense } from "react"

// Basic Loading component
function LoadingResearch() {
  return (
    <div className="flex items-center justify-center h-full">
      <p>Loading research interface...</p>
    </div>
  )
}

export default function ResearchPage() {
  return (
    <div className="flex h-screen">
      <MainSidebar />
      <main className="flex-1 overflow-auto">
        <Suspense fallback={<LoadingResearch />}>
          <ResearchInterface />
        </Suspense>
      </main>
    </div>
  )
}
