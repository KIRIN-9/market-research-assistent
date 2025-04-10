import { generateMarketResearch, extractReferences } from "./gemini-client"

// Function to fetch and process news
export async function fetchAndProcessNews(topic: string) {
  console.log(`Fetching news for topic: ${topic}`)

  try {
    const prompt = `Generate 4 recent news items about ${topic}. For each news item, provide:
    1. A concise title
    2. A brief summary (1-2 sentences)
    3. The category (e.g., Technology, Finance, Healthcare)
    4. The impact level (High, Medium, or Low)
    5. A relative time (e.g., "2 hours ago", "1 day ago")
    
    Format the response as a JSON array with the following structure:
    [
      {
        "title": "News title",
        "summary": "Brief summary",
        "category": "Category",
        "impact": "Impact level",
        "time": "Relative time"
      },
      ...
    ]
    
    Do not include any markdown formatting or code blocks in your response.`

    const systemPrompt =
      "You are a market news analyst. Provide factual, up-to-date news items based on current market trends and developments. Focus on accuracy and relevance."

    const result = await generateMarketResearch(`${systemPrompt}\n\n${prompt}`, "default")

    // Extract JSON from the response
    const jsonMatch = result.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error("Could not extract JSON from response")
    }

    const jsonStr = jsonMatch[0]
    const newsItems = JSON.parse(jsonStr)

    return newsItems
  } catch (error) {
    console.error("Error fetching and processing news:", error)

    // Return fallback data
    return [
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
  }
}

// Function to analyze market trends
export async function analyzeMarketTrends(sector: string) {
  console.log(`Analyzing market trends for sector: ${sector}`)

  try {
    const prompt = `Analyze current market trends in the ${sector} sector. Provide 5 key trends with:
    1. A concise title
    2. A brief description (2-3 sentences)
    3. The category (e.g., Technology, Finance, Healthcare)
    4. The growth projection (e.g., "+15% YoY", "Moderate growth")
    
    Format the response as a JSON array with the following structure:
    [
      {
        "title": "Trend title",
        "description": "Brief description",
        "category": "Category",
        "growth": "Growth projection"
      },
      ...
    ]
    
    Do not include any markdown formatting or code blocks in your response.`

    const systemPrompt =
      "You are a market trend analyst. Provide data-driven insights on current market trends and future projections. Focus on accuracy, relevance, and actionable insights."

    const result = await generateMarketResearch(`${systemPrompt}\n\n${prompt}`, "default")

    // Extract JSON from the response
    const jsonMatch = result.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error("Could not extract JSON from response")
    }

    const jsonStr = jsonMatch[0]
    const trends = JSON.parse(jsonStr)

    return trends
  } catch (error) {
    console.error("Error analyzing market trends:", error)

    // Return fallback data
    return [
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
  }
}

// Function to generate note content
export async function generateNoteContent(title: string, domain: string, content: string) {
  console.log(`Generating note content for title: ${title}, domain: ${domain}`)

  try {
    const prompt = `Create a well-structured research note based on the following information:
    
    Title: ${title}
    Domain: ${domain}
    Content: ${content}
    
    The note should:
    1. Extract and organize the key insights
    2. Include relevant data points and statistics
    3. Organize information into logical sections
    4. Provide a brief conclusion or summary
    5. Include a list of references or sources
    
    Format the response as a research note with clear sections. For the references, provide them as a separate list at the end.`

    const systemPrompt =
      "You are a research analyst specializing in creating concise, well-structured research notes. Focus on extracting key insights, organizing information logically, and providing accurate references."

    const result = await generateMarketResearch(`${systemPrompt}\n\n${prompt}`, domain)

    // Extract references
    const references = await extractReferences(result)

    // Clean up references if they're in array format
    let cleanedReferences: string[] = []
    if (Array.isArray(references)) {
      if (references.length > 0 && typeof references[0] === "object") {
        // If references are objects with title/url properties
        cleanedReferences = references.map((ref: any) => {
          if (ref.title && ref.url) {
            return `${ref.title} - ${ref.url}`
          } else if (ref.title) {
            return ref.title
          } else if (ref.url) {
            return ref.url
          }
          return String(ref)
        })
      } else {
        // If references are already strings
        cleanedReferences = references.map((ref) => String(ref))
      }
    } else if (typeof references === "string") {
      cleanedReferences = [references]
    }

    return {
      content: result,
      references: cleanedReferences,
    }
  } catch (error) {
    console.error("Error generating note content:", error)

    // Return the original content with empty references
    return {
      content: content,
      references: [],
    }
  }
}
