"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { type NewsItem, initialNewsItems } from "@/lib/seed"

export function NewsFeed() {
  const router = useRouter()
  const [newsItems, setNewsItems] = useState<NewsItem[]>(initialNewsItems)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "Medium":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20"
      case "Low":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      default:
        return ""
    }
  }

  const fetchLatestNews = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const topics = ["AI technology", "market trends", "financial markets", "technology sector"]
      const randomTopic = topics[Math.floor(Math.random() * topics.length)]
      const response = await fetch(`/api/news?topic=${encodeURIComponent(randomTopic)}`)

      if (!response.ok) {
        throw new Error("Failed to fetch news")
      }

      const latestNews = await response.json()
      setNewsItems(latestNews)
    } catch (err) {
      console.error("Error fetching news:", err)
      setError("Failed to fetch latest news")
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch news periodically
  useEffect(() => {
    fetchLatestNews() // Initial fetch

    const interval = setInterval(() => {
      fetchLatestNews()
    }, 300000) // Update every 5 minutes

    return () => clearInterval(interval)
  }, [])

  if (error) {
    return (
      <Card className="card-gradient border-[#1e293b]">
        <CardHeader>
          <CardTitle>Market News</CardTitle>
          <CardDescription>Latest updates and market movements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-400">{error}</div>
          <Button variant="outline" size="sm" onClick={fetchLatestNews} className="mt-2">
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
            <CardTitle>Market News</CardTitle>
            <CardDescription>Latest updates and market movements</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchLatestNews} disabled={isLoading}>
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading
            ? // Loading skeleton
              Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-card/50 rounded animate-pulse w-3/4"></div>
                    <div className="h-3 bg-card/50 rounded animate-pulse w-full"></div>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 bg-card/50 rounded animate-pulse w-16"></div>
                      <div className="h-3 bg-card/50 rounded animate-pulse w-24"></div>
                    </div>
                  </div>
                ))
            : newsItems.map((item, index) => (
                <div key={index}>
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{item.summary}</div>
                  <div className="flex items-center mt-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className={`mr-2 ${getImpactColor(item.impact)}`}>
                      {item.impact}
                    </Badge>
                    <span className="mr-2">{item.category}</span>
                    <span>{item.time}</span>
                  </div>
                  {index < newsItems.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
        </div>
      </CardContent>
    </Card>
  )
}
