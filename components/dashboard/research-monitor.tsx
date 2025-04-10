"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

interface ResearchStats {
  papers: number
  breakthroughs: number
  announcements: number
  latestBreakthrough: string
}

const initialStats: ResearchStats = {
  papers: 127,
  breakthroughs: 3,
  announcements: 42,
  latestBreakthrough: "Novel attention mechanism improves multimodal reasoning by 23%",
}

const breakthroughs = [
  "Novel attention mechanism improves multimodal reasoning by 23%",
  "Quantum-inspired algorithm reduces training time by 47%",
  "New sparse transformer architecture achieves SOTA with 30% fewer parameters",
  "Breakthrough in multi-agent reinforcement learning shows 2x efficiency",
  "Self-supervised learning technique reduces data requirements by 60%",
  "New neural architecture search method finds optimal models 3x faster",
]

export function ResearchMonitor() {
  const [stats, setStats] = useState<ResearchStats>(initialStats)
  const [timeframe, setTimeframe] = useState("24h")

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update stats
      setStats((prev) => {
        // Papers increase more frequently
        const paperChange = Math.random() > 0.6 ? Math.floor(Math.random() * 5) + 1 : 0

        // Breakthroughs happen rarely
        const breakthroughChange = Math.random() > 0.9 ? 1 : 0

        // Announcements happen occasionally
        const announcementChange = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0

        // Occasionally update the latest breakthrough
        const newBreakthrough =
          breakthroughChange > 0 || Math.random() > 0.9
            ? breakthroughs[Math.floor(Math.random() * breakthroughs.length)]
            : prev.latestBreakthrough

        return {
          papers: prev.papers + paperChange,
          breakthroughs: prev.breakthroughs + breakthroughChange,
          announcements: prev.announcements + announcementChange,
          latestBreakthrough: newBreakthrough,
        }
      })

      // Occasionally change timeframe
      if (Math.random() > 0.9) {
        const timeframes = ["24h", "48h", "72h", "Week"]
        const randomTimeframe = timeframes[Math.floor(Math.random() * timeframes.length)]
        setTimeframe(randomTimeframe)
      }
    }, 8000) // Update every 8 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="card-gradient border-[#1e293b]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">GenAI Research Monitor</CardTitle>
          <Badge variant="outline" className="bg-secondary/30 text-foreground border-secondary/50">
            {timeframe}
          </Badge>
        </div>
        <CardDescription className="text-muted-foreground">Tracking ongoing research developments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-muted-foreground">New Research Papers</div>
            <div className="text-2xl font-bold">{stats.papers}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-muted-foreground">Major Breakthroughs</div>
            <div className="text-2xl font-bold text-primary">{stats.breakthroughs}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-muted-foreground">Industry Announcements</div>
            <div className="text-2xl font-bold">{stats.announcements}</div>
          </div>
          <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/30">
            <p className="font-medium text-foreground">Latest Breakthrough:</p>
            <p className="text-emerald-400">{stats.latestBreakthrough}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
