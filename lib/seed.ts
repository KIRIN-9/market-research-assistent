export interface NewsItem {
  title: string
  summary: string
  category: string
  impact: string
  time: string
}

export interface Trend {
  title: string
  description: string
  category: string
  growth: string
}

export const initialNewsItems: NewsItem[] = [
  {
    title: "AI Startup Secures Major Funding",
    summary: "Leading AI startup announces $50M Series B funding round led by top venture capital firms.",
    category: "Technology",
    impact: "Medium",
    time: "3 hours ago",
  },
  {
    title: "Market Volatility Increases Amid Economic Data",
    summary: "Stock markets experience increased volatility following the release of mixed economic indicators.",
    category: "Finance",
    impact: "High",
    time: "1 day ago",
  },
  {
    title: "New Regulation Impacts Tech Sector",
    summary: "Regulatory changes announced that will affect data privacy practices across the technology industry.",
    category: "Regulation",
    impact: "High",
    time: "2 days ago",
  },
  {
    title: "Supply Chain Improvements for Electronics",
    summary:
      "Major improvements in semiconductor supply chain reported, potentially easing constraints for consumer electronics.",
    category: "Manufacturing",
    impact: "Medium",
    time: "4 days ago",
  },
]

export const initialTrends: Trend[] = [
  {
    title: "AI Integration Across Industries",
    description:
      "Companies across sectors are rapidly integrating AI into core business processes. This trend is accelerating with improved accessibility of large language models and specialized AI tools.",
    category: "Technology",
    growth: "+32% YoY",
  },
  {
    title: "Sustainable Technology Investment",
    description:
      "Investment in sustainable and green technologies continues to grow significantly. Companies are prioritizing ESG initiatives both for regulatory compliance and consumer demand.",
    category: "Sustainability",
    growth: "+24% YoY",
  },
  {
    title: "Remote Work Technology Evolution",
    description:
      "The tools and platforms supporting distributed workforces are evolving beyond basic communication. Advanced collaboration features and productivity analytics are driving the next wave of adoption.",
    category: "Workplace",
    growth: "+18% YoY",
  },
  {
    title: "Cybersecurity Spending Increase",
    description:
      "Organizations are significantly increasing cybersecurity budgets in response to growing threats. Zero-trust architecture and AI-powered security solutions are seeing the fastest adoption rates.",
    category: "Security",
    growth: "+29% YoY",
  },
  {
    title: "Edge Computing Expansion",
    description:
      "Edge computing infrastructure is expanding to support real-time processing needs. This growth is driven by IoT proliferation and applications requiring minimal latency.",
    category: "Infrastructure",
    growth: "+26% YoY",
  },
]
