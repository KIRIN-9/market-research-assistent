"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { type Trend, initialTrends } from "@/lib/seed"

export function TrendSpotlight() {
  const [trends, setTrends] = useState<Trend[]>(initialTrends)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sectors = [
    "AI and Machine Learning",
    "Cloud Computing",
    "Cybersecurity",
    "Fintech",
    "Healthcare Technology",
    "Renewable Energy",
  ]

  const fetchTrends = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const randomSector = sectors[Math.floor(Math.random() * sectors.length)]
      const response = await fetch(`/api/trends?sector=${encodeURIComponent(randomSector)}`)

      if (!response.ok) {
        throw new Error("Failed to fetch trends")
      }

      const latestTrends = await response.json()
      setTrends(latestTrends)
    } catch (err) {
      console.error("Error fetching trends:", err)
      setError("Failed to fetch latest trends")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTrends() // Initial fetch

    const interval = setInterval(() => {
      fetchTrends()
    }, 600000) // Update every 10 minutes

    return () => clearInterval(interval)
  }, [])

  const nextTrend = () => {
    setCurrentIndex((prev) => (prev + 1) % trends.length)
  }

  const prevTrend = () => {
    setCurrentIndex((prev) => (prev - 1 + trends.length) % trends.length)
  }

  if (error) {
    return (
      <Card className="card-gradient border-[#1e293b]">
        <CardHeader>
          <CardTitle>Trend Spotlight</CardTitle>
          <CardDescription>Emerging market trends and patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-400">{error}</div>
          <Button variant="outline" size="sm" onClick={fetchTrends} className="mt-2">
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="card-gradient border-[#1e293b]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Trend Spotlight</CardTitle>
            <CardDescription>Emerging market trends and patterns</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchTrends} disabled={isLoading}>
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          // Loading skeleton
          <div className="space-y-4">
            <div className="h-6 bg-card/50 rounded animate-pulse w-3/4"></div>
            <div className="h-20 bg-card/50 rounded animate-pulse w-full"></div>
            <div className="flex items-center justify-between">
              <div className="h-4 bg-card/50 rounded animate-pulse w-24"></div>
              <div className="h-4 bg-card/50 rounded animate-pulse w-16"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="text-lg font-medium mb-2">{trends[currentIndex]?.title}</div>
              <div className="text-muted-foreground">{trends[currentIndex]?.description}</div>
            </div>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {trends[currentIndex]?.category}
              </Badge>
              <div className="text-sm text-emerald-400">{trends[currentIndex]?.growth}</div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <Button variant="outline" size="sm" onClick={prevTrend} disabled={trends.length <= 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground">
                {currentIndex + 1} of {trends.length}
              </span>
              <Button variant="outline" size="sm" onClick={nextTrend} disabled={trends.length <= 1}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
