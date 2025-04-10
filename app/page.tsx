import { MainDashboard } from "@/components/dashboard/main-dashboard"
import { MainSidebar } from "@/components/main-sidebar"

export default function Home() {
  return (
    <div className="flex h-screen">
      <MainSidebar />
      <main className="flex-1 overflow-auto">
        <MainDashboard />
      </main>
    </div>
  )
}
