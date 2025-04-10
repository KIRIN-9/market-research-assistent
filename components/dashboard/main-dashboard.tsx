"use client"

import type React from "react"

import { MarketPulse } from "./market-pulse"
import { ResearchMonitor } from "./research-monitor"
import { TrendSpotlight } from "./trend-spotlight"
import { FinancialCards } from "./financial-cards"
import { NewsFeed } from "./news-feed"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageSquare, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "../theme-toggle"
import { StorageInitializer } from "../storage-initializer"

export function MainDashboard() {
  const [refreshTime, setRefreshTime] = useState<Date | null>(null)
  const [customTopic, setCustomTopic] = useState("")
  const router = useRouter()

  // Update refresh time every minute
  useEffect(() => {
    setRefreshTime(new Date())
    const interval = setInterval(() => {
      setRefreshTime(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  // Function to handle custom topic search
  const handleCustomSearch = () => {
    if (customTopic.trim()) {
      // Encode the topic for the URL
      const encodedTopic = encodeURIComponent(customTopic.trim())
      router.push(`/research?topic=${encodedTopic}`)
      setCustomTopic("") // Optional: clear input after search
    }
  }

  // Function to handle Enter key press in input
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleCustomSearch()
    }
  }

  return (
    <>
      <StorageInitializer />
      <div className="container mx-auto p-6 gradient-bg">
        {/* Deep Research Quick Access */}
        <Card className="card-gradient border-[#1e293b]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Deep Research</CardTitle>
            <CardDescription className="text-muted-foreground">
              Ask Gemini AI for in-depth market analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="bg-card/50 p-3 rounded-md border border-border/30">
                <div className="font-medium text-sm mb-2">Quick Research Topics</div>
                <div className="flex flex-wrap gap-2 items-center">
                  {/* Predefined Topic Buttons */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                    onClick={() => router.push("/research?topic=AI%20Market%20Growth%20Forecast")}
                  >
                    AI Market Growth
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                    onClick={() => router.push("/research?topic=Semiconductor%20Industry%20Analysis")}
                  >
                    Semiconductor Industry
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                    onClick={() => router.push("/research?topic=Renewable%20Energy%20Investments")}
                  >
                    Renewable Energy
                  </Button>
                  {/* Custom Topic Input and Button */}
                  <div className="flex items-center gap-2 flex-grow mt-2 sm:mt-0 sm:flex-grow-0 sm:ml-auto">
                    <Input
                      type="text"
                      placeholder="Enter custom topic..."
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="h-9 text-sm flex-grow min-w-[720px]"
                    />
                  </div>
                </div>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 mt-2" onClick={() => router.push("/research")}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Open Deep Research Interface
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Rest of the dashboard content */}
        <div className="flex items-center justify-between my-6">
          <h1 className="text-2xl font-bold">Market Research Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="text-xs text-muted-foreground">
              Last updated: {refreshTime?.toLocaleTimeString() || "Loading..."} | Data powered by Gemini
            </div>
            <ThemeToggle />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <NewsFeed />
          <div className="col-span-2 space-y-6">
            <MarketPulse />
            <TrendSpotlight />
            <FinancialCards />
            <ResearchMonitor />
          </div>

          {/* Market Explorer Preview */}
          <Card className="col-span-3 card-gradient border-[#1e293b]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Market Explorer</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-card border-border/50 hover:bg-secondary"
                  onClick={() => router.push("/explorer")}
                >
                  View All Domains
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              <CardDescription className="text-muted-foreground">
                Domain-specific market insights and research
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {["technology", "finance", "healthcare", "retail"].map((domain) => (
                  <div
                    key={domain}
                    className="bg-card/50 p-4 rounded-md border border-border/30 hover:bg-card/70 transition-colors cursor-pointer"
                    onClick={() => router.push(`/explorer?domain=${domain}`)}
                  >
                    <h3 className="font-medium capitalize mb-2">{domain}</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      {domain === "technology" && "Emerging tech trends and digital transformation"}
                      {domain === "finance" && "Investment strategies and market movements"}
                      {domain === "healthcare" && "Medical technologies and healthcare innovations"}
                      {domain === "retail" && "Consumer behavior and e-commerce trends"}
                    </p>
                    <div className="flex justify-end">
                      <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 p-0 h-auto">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
