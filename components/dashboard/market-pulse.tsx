"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, type TooltipProps } from "recharts"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// More realistic historical market data (SP500-like vs Tech/AI sector)
const historicalMarketData = [
  { date: "2024-10", market: 4768, tech: 5954 },
  { date: "2024-11", market: 4880, tech: 6102 },
  { date: "2024-12", market: 4945, tech: 6324 },
  { date: "2025-01", market: 5023, tech: 6518 },
  { date: "2025-02", market: 5186, tech: 6782 },
  { date: "2025-03", market: 5247, tech: 6890 },
  { date: "2025-04", market: 5312, tech: 7103 },
]

// Market sectors with more realistic data
const sectorPerformance = {
  technology: { name: "Technology", growth: "+7.8%", sentiment: "Bullish" },
  healthcare: { name: "Healthcare", growth: "+3.2%", sentiment: "Neutral" },
  finance: { name: "Finance", growth: "+1.9%", sentiment: "Cautious" },
  energy: { name: "Energy", growth: "-2.4%", sentiment: "Bearish" },
  consumer: { name: "Consumer", growth: "+2.1%", sentiment: "Neutral" },
}

// Format date labels for display
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat("en", { month: "short" }).format(date)
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const date = new Date(label)
    const formattedDate = new Intl.DateTimeFormat("en", {
      month: "long",
      year: "numeric",
    }).format(date)

    return (
      <div className="bg-card p-3 border border-border rounded-md shadow-lg">
        <p className="text-sm font-medium">{formattedDate}</p>
        <p className="text-sm text-primary">
          S&P 500: <span className="font-medium">{payload[0].value?.toLocaleString()}</span>
        </p>
        <p className="text-sm text-emerald-400">
          Tech/AI: <span className="font-medium">{payload[1].value?.toLocaleString()}</span>
        </p>
      </div>
    )
  }

  return null
}

export function MarketPulse() {
  const [marketData, setMarketData] = useState(historicalMarketData)
  const [selectedSector, setSelectedSector] = useState("technology")
  const [marketTrend, setMarketTrend] = useState({
    direction: "up",
    percent: "0.6%",
  })
  const [volatilityIndex, setVolatilityIndex] = useState(18.4)

  // Key sectors data
  const [sectors, setSectors] = useState(sectorPerformance)

  // Simulate market updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update the last data point with subtle, realistic changes
      setMarketData((prevData) => {
        const newData = [...prevData]
        const lastIndex = newData.length - 1
        const lastEntry = newData[lastIndex]

        // More subtle, realistic price movements (0.1-0.5% changes)
        const marketChange = lastEntry.market * (0.998 + Math.random() * 0.007)
        const techChange = lastEntry.tech * (0.997 + Math.random() * 0.009)

        newData[lastIndex] = {
          ...lastEntry,
          market: Math.round(marketChange),
          tech: Math.round(techChange),
        }

        return newData
      })

      // Update market trend occasionally
      if (Math.random() > 0.7) {
        const isUp = Math.random() > 0.4 // Slightly bullish bias
        const changePercent = (0.1 + Math.random() * 0.9).toFixed(2)
        setMarketTrend({
          direction: isUp ? "up" : "down",
          percent: `${changePercent}%`,
        })
      }

      // Update volatility index occasionally
      if (Math.random() > 0.8) {
        // VIX-like volatility index, typically between 15-25
        const newVix = 15 + Math.random() * 10
        setVolatilityIndex(Number.parseFloat(newVix.toFixed(1)))
      }

      // Occasionally update sector performances
      if (Math.random() > 0.9) {
        setSectors((prevSectors) => {
          const newSectors = { ...prevSectors }
          const sectorToUpdate = Object.keys(newSectors)[Math.floor(Math.random() * Object.keys(newSectors).length)]

          const sentiments = ["Bullish", "Neutral", "Cautious", "Bearish"]
          const newSentiment = sentiments[Math.floor(Math.random() * sentiments.length)]

          // Generate realistic growth change
          const currentGrowth = Number.parseFloat(newSectors[sectorToUpdate].growth.replace("%", ""))
          const growthChange = Math.random() * 0.8 - 0.3 // -0.3% to +0.5%
          const newGrowth = (currentGrowth + growthChange).toFixed(1)
          const growthSign = newGrowth >= 0 ? "+" : ""

          newSectors[sectorToUpdate] = {
            ...newSectors[sectorToUpdate],
            growth: `${growthSign}${newGrowth}%`,
            sentiment: newSentiment,
          }

          return newSectors
        })
      }
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="col-span-2 row-span-2 card-gradient border-[#1e293b]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-medium">Market Pulse Center</CardTitle>
          <CardDescription className="text-muted-foreground">S&P 500 vs Tech/AI performance</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <div className={`text-sm ${marketTrend.direction === "up" ? "text-green-400" : "text-red-400"}`}>
            {marketTrend.direction === "up" ? "+" : "-"}
            {marketTrend.percent}
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={marketData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorMarket" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorTech" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="chart-grid" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#94a3b8" }}
                axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
                tickFormatter={formatDate}
              />
              <YAxis
                tick={{ fill: "#94a3b8" }}
                axisLine={{ stroke: "rgba(255, 255, 255, 0.1)" }}
                domain={["dataMin - 100", "dataMax + 100"]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="market"
                name="S&P 500"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorMarket)"
                activeDot={{
                  r: 6,
                  fill: "#3b82f6",
                  stroke: "#0f172a",
                  strokeWidth: 2,
                }}
              />
              <Area
                type="monotone"
                dataKey="tech"
                name="Tech/AI"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#colorTech)"
                activeDot={{
                  r: 6,
                  fill: "#10b981",
                  stroke: "#0f172a",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <Tabs defaultValue="sectors" className="mt-4">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="sectors">Key Sectors</TabsTrigger>
            <TabsTrigger value="indicators">Market Indicators</TabsTrigger>
          </TabsList>
          <TabsContent value="sectors" className="mt-2">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(sectors).map(([key, sector]) => (
                <div
                  key={key}
                  className={`bg-card rounded-md p-3 border border-[#1e293b] ${
                    selectedSector === key ? "ring-1 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedSector(key)}
                >
                  <div className="text-sm font-medium mb-1 text-muted-foreground">{sector.name}</div>
                  <div className="text-xl font-bold">{sector.sentiment}</div>
                  <div className="text-xs mt-1">
                    <span className={sector.growth.startsWith("+") ? "text-green-400" : "text-red-400"}>
                      {sector.growth}
                    </span>{" "}
                    monthly change
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="indicators" className="mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card rounded-md p-3 border border-[#1e293b]">
                <div className="text-sm font-medium mb-1 text-muted-foreground">Volatility Index</div>
                <div className="text-2xl font-bold">{volatilityIndex}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  <span className={volatilityIndex < 20 ? "text-green-400" : "text-amber-400"}>
                    {volatilityIndex < 20 ? "Low" : "Moderate"} volatility
                  </span>
                </div>
              </div>
              <div className="bg-card rounded-md p-3 border border-[#1e293b]">
                <div className="text-sm font-medium mb-1 text-muted-foreground">Market Breadth</div>
                <div className="text-2xl font-bold">62%</div>
                <div className="text-xs text-muted-foreground mt-1">Advancing vs declining stocks</div>
              </div>
              <div className="bg-card rounded-md p-3 border border-[#1e293b]">
                <div className="text-sm font-medium mb-1 text-muted-foreground">S&P 500 YTD</div>
                <div className="text-2xl font-bold text-green-400">+11.4%</div>
                <div className="text-xs text-muted-foreground mt-1">Year-to-date performance</div>
              </div>
              <div className="bg-card rounded-md p-3 border border-[#1e293b]">
                <div className="text-sm font-medium mb-1 text-muted-foreground">Tech/AI YTD</div>
                <div className="text-2xl font-bold text-emerald-400">+19.3%</div>
                <div className="text-xs text-muted-foreground mt-1">Outperforming market by 7.9%</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
