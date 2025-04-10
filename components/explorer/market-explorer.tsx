"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { StorageInitializer } from "../storage-initializer"

interface DomainCard {
  id: string
  name: string
  description: string
  color: string
  news: {
    title: string
    summary: string
    source: string
    date: string
  }[]
  research: {
    title: string
    summary: string
    author: string
    date: string
  }[]
}

const domainCards: DomainCard[] = [
  {
    id: "technology",
    name: "Technology",
    description: "Emerging tech trends, software development, hardware innovations, and digital transformation",
    color: "from-blue-500/20 to-purple-500/20",
    news: [
      {
        title: "Quantum Computing Breakthrough Announced",
        summary: "Researchers achieve new milestone in quantum error correction",
        source: "Tech Review",
        date: "2 hours ago",
      },
      {
        title: "Major Cloud Provider Expands AI Infrastructure",
        summary: "New data centers focused on AI workloads to open globally",
        source: "Cloud Insider",
        date: "1 day ago",
      },
      {
        title: "Open Source LLM Matches Commercial Model Performance",
        summary: "New benchmark results show parity with leading proprietary models",
        source: "AI Journal",
        date: "3 days ago",
      },
      {
        title: "Chip Shortage Easing for Consumer Electronics",
        summary: "Supply chain improvements benefit smartphone manufacturers",
        source: "Supply Chain Weekly",
        date: "5 days ago",
      },
    ],
    research: [
      {
        title: "The State of Edge Computing 2025",
        summary: "Analysis of edge computing adoption across industries",
        author: "Tech Research Group",
        date: "June 2025",
      },
      {
        title: "Semiconductor Industry Forecast",
        summary: "Five-year projection of chip manufacturing trends",
        author: "Silicon Insights",
        date: "May 2025",
      },
      {
        title: "Enterprise AI Implementation Strategies",
        summary: "Best practices for large-scale AI deployment",
        author: "Enterprise Tech Today",
        date: "April 2025",
      },
      {
        title: "Quantum Computing Market Analysis",
        summary: "Investment opportunities in quantum technologies",
        author: "Quantum Business Review",
        date: "March 2025",
      },
    ],
  },
  {
    id: "finance",
    name: "Finance",
    description: "Investment strategies, market movements, economic indicators, and financial instruments",
    color: "from-green-500/20 to-emerald-500/20",
    news: [
      {
        title: "Central Bank Signals Rate Cut Timeline",
        summary: "Federal Reserve hints at potential easing in coming months",
        source: "Financial Times",
        date: "5 hours ago",
      },
      {
        title: "Major Merger in Banking Sector Announced",
        summary: "Consolidation continues among regional banks",
        source: "Banking Daily",
        date: "2 days ago",
      },
      {
        title: "Cryptocurrency Regulation Framework Proposed",
        summary: "New guidelines aim to standardize digital asset oversight",
        source: "Crypto News",
        date: "4 days ago",
      },
      {
        title: "ESG Investing Reaches New Milestone",
        summary: "Sustainable funds surpass $5 trillion in global assets",
        source: "Investment Weekly",
        date: "1 week ago",
      },
    ],
    research: [
      {
        title: "Global Economic Outlook 2025-2030",
        summary: "Long-term projections for major economies",
        author: "World Economic Forum",
        date: "June 2025",
      },
      {
        title: "Fintech Disruption Report",
        summary: "How technology is reshaping financial services",
        author: "Fintech Insights",
        date: "May 2025",
      },
      {
        title: "Emerging Markets Investment Strategy",
        summary: "Opportunities and risks in developing economies",
        author: "Global Investments",
        date: "April 2025",
      },
      {
        title: "The Future of Digital Currencies",
        summary: "CBDCs, stablecoins, and the evolving payment landscape",
        author: "Digital Currency Institute",
        date: "March 2025",
      },
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    description: "Medical technologies, pharmaceutical developments, healthcare policies, and patient care innovations",
    color: "from-red-500/20 to-pink-500/20",
    news: [
      {
        title: "AI Diagnostic Tool Receives Regulatory Approval",
        summary: "New system shows 95% accuracy in early disease detection",
        source: "Health Tech Today",
        date: "3 hours ago",
      },
      {
        title: "Major Breakthrough in mRNA Vaccine Technology",
        summary: "Platform shows promise for multiple disease applications",
        source: "Medical Journal",
        date: "2 days ago",
      },
      {
        title: "Healthcare Staffing Crisis Prompts Policy Review",
        summary: "New initiatives aim to address workforce shortages",
        source: "Healthcare Policy Review",
        date: "5 days ago",
      },
      {
        title: "Remote Patient Monitoring Adoption Accelerates",
        summary: "Hospitals report 70% increase in telehealth utilization",
        source: "Digital Health News",
        date: "1 week ago",
      },
    ],
    research: [
      {
        title: "The Future of Precision Medicine",
        summary: "How genomics is transforming treatment approaches",
        author: "Medical Research Institute",
        date: "June 2025",
      },
      {
        title: "Healthcare AI Implementation Guide",
        summary: "Best practices for AI adoption in clinical settings",
        author: "Health AI Consortium",
        date: "May 2025",
      },
      {
        title: "Global Healthcare Systems Comparison",
        summary: "Analysis of outcomes, costs, and access across countries",
        author: "Health Policy Center",
        date: "April 2025",
      },
      {
        title: "Pharmaceutical Innovation Pipeline",
        summary: "Key drugs and therapies in late-stage development",
        author: "Pharma Research Group",
        date: "March 2025",
      },
    ],
  },
  {
    id: "retail",
    name: "Retail",
    description: "Consumer behavior, e-commerce trends, supply chain management, and retail technologies",
    color: "from-amber-500/20 to-yellow-500/20",
    news: [
      {
        title: "Major Retailer Unveils AI-Powered Shopping Experience",
        summary: "Personalization engine increases conversion rates by 35%",
        source: "Retail Innovation",
        date: "6 hours ago",
      },
      {
        title: "E-commerce Growth Slows as Physical Stores Rebound",
        summary: "Post-pandemic shift in consumer shopping preferences",
        source: "Retail Analyst",
        date: "3 days ago",
      },
      {
        title: "Supply Chain Visibility Platform Gains Traction",
        summary: "Retailers adopt real-time tracking to improve resilience",
        source: "Supply Chain Digest",
        date: "6 days ago",
      },
      {
        title: "Sustainable Packaging Initiative Launches",
        summary: "Industry consortium commits to plastic reduction targets",
        source: "Retail Sustainability",
        date: "1 week ago",
      },
    ],
    research: [
      {
        title: "The Future of Retail Experience",
        summary: "How technology is reshaping customer interactions",
        author: "Retail Research Group",
        date: "June 2025",
      },
      {
        title: "E-commerce Trends and Forecasts",
        summary: "Five-year projection of online retail growth",
        author: "Digital Commerce Institute",
        date: "May 2025",
      },
      {
        title: "Retail Supply Chain Transformation",
        summary: "Strategies for resilience and efficiency",
        author: "Supply Chain Center",
        date: "April 2025",
      },
      {
        title: "Consumer Behavior Shifts Post-2023",
        summary: "Analysis of changing shopping preferences and habits",
        author: "Consumer Insights Group",
        date: "March 2025",
      },
    ],
  },
]

export function MarketExplorer() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialDomain = searchParams.get("domain")
  const [domains, setDomains] = useState(domainCards)
  const [filteredDomains, setFilteredDomains] = useState(domainCards)

  useEffect(() => {
    if (initialDomain) {
      setFilteredDomains(domains.filter((domain) => domain.id === initialDomain))
    } else {
      setFilteredDomains(domains)
    }
  }, [initialDomain, domains])

  const handleResearchClick = (domain: string, topic: string) => {
    router.push(`/research?domain=${domain}&topic=${encodeURIComponent(topic)}`)
  }

  return (
    <>
      <StorageInitializer />
      <div className="container mx-auto p-6 gradient-bg">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Market Explorer</h1>
          <div className="text-xs text-muted-foreground">Explore domain-specific market insights powered by Gemini</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredDomains.map((domain) => (
            <Card key={domain.id} className={`card-gradient border-[#1e293b] overflow-hidden relative`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${domain.color} opacity-20`}></div>
              <div className="absolute top-4 right-4 text-6xl font-bold text-foreground/5">{domain.name}</div>

              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-medium">{domain.name}</CardTitle>
                  <Badge className="bg-primary/10 text-primary border-primary/20">{domain.id}</Badge>
                </div>
                <CardDescription className="text-muted-foreground">{domain.description}</CardDescription>
              </CardHeader>

              <CardContent className="relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-3 flex items-center">
                      <Badge variant="outline" className="mr-2 bg-blue-500/10 text-blue-400 border-blue-500/20">
                        News
                      </Badge>
                      Latest Updates
                    </h3>
                    <div className="space-y-3">
                      {domain.news.slice(0, 2).map((item, i) => (
                        <div key={i} className="bg-card/50 p-3 rounded-md border border-border/30">
                          <div className="font-medium text-sm">{item.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">{item.summary}</div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-primary/70">{item.source}</span>
                            <span className="text-xs text-muted-foreground">{item.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-3 flex items-center">
                      <Badge
                        variant="outline"
                        className="mr-2 bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      >
                        Research
                      </Badge>
                      Key Insights
                    </h3>
                    <div className="space-y-3">
                      {domain.research.slice(0, 2).map((item, i) => (
                        <div key={i} className="bg-card/50 p-3 rounded-md border border-border/30">
                          <div className="font-medium text-sm">{item.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">{item.summary}</div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-primary/70">{item.author}</span>
                            <span className="text-xs text-muted-foreground">{item.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full mt-4 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
                  onClick={() => handleResearchClick(domain.id, `${domain.name} market overview`)}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Deep Research This Domain
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
