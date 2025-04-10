import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai"

// System prompts for different research contexts
const SYSTEM_PROMPTS = {
  default:
    "You are a professional market research analyst specializing in AI, technology, and financial markets. Provide detailed, data-driven insights with proper citations to reliable sources. Focus on current trends, market dynamics, and future projections.",
  technology:
    "You are a technology market analyst with expertise in emerging tech trends, software development, hardware innovations, and digital transformation. Provide detailed analysis of technology markets with emphasis on adoption rates, competitive landscapes, and future trajectories.",
  finance:
    "You are a financial market analyst specializing in investment strategies, market movements, economic indicators, and financial instruments. Provide comprehensive analysis of financial markets with focus on risk assessment, growth opportunities, and economic forecasts.",
  healthcare:
    "You are a healthcare industry analyst with expertise in medical technologies, pharmaceutical developments, healthcare policies, and patient care innovations. Provide in-depth analysis of healthcare markets with emphasis on regulatory impacts, innovation trends, and market access.",
  retail:
    "You are a retail industry analyst specializing in consumer behavior, e-commerce trends, supply chain management, and retail technologies. Provide detailed insights on retail markets with focus on omnichannel strategies, customer experience, and market disruptions.",
}

// Initialize the Gemini API client with error handling
let genAI: GoogleGenerativeAI | null = null

function initializeGeminiClient() {
  if (genAI) return genAI

  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment variables")
    }
    genAI = new GoogleGenerativeAI(apiKey)
    console.log("Gemini API client initialized successfully")
    return genAI
  } catch (error) {
    console.error("Failed to initialize Gemini API client:", error)
    throw error
  }
}

// Initialize chat models for different domains
const chatModels: { [key: string]: GenerativeModel } = {}

// Initialize chat history for different conversations
const chatHistories: { [key: string]: any } = {}

// Get the appropriate model based on the task and domain
function getModel(domain = "default", forChat = true) {
  const client = initializeGeminiClient()
  if (!client) {
    throw new Error("Gemini client not initialized")
  }

  if (forChat) {
    if (!chatModels[domain]) {
      chatModels[domain] = client.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
        },
      })
    }
    return chatModels[domain]
  }

  // For non-chat tasks, use gemini-2.0-flash as well
  return client.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.3,
      topP: 0.8,
      topK: 40,
    },
  })
}

// Get or create chat history for a domain
function getChatHistory(domain = "default"): any {
  if (!chatHistories[domain]) {
    const model = getModel(domain)
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text:
                "You are a market research analyst. Please provide insights based on the following context: " +
                SYSTEM_PROMPTS[domain as keyof typeof SYSTEM_PROMPTS],
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "I understand my role as a market research analyst with the specified expertise. I will provide detailed, data-driven insights while maintaining the context and focus areas you've outlined. How can I assist you with your market research needs?",
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    })
    chatHistories[domain] = chat
  }
  return chatHistories[domain]
}

export async function generateMarketResearch(prompt: string, domain = "default") {
  console.log(`Generating market research for prompt: "${prompt}" with domain: ${domain}`)

  try {
    if (!prompt || prompt.trim().length === 0) {
      throw new Error("Prompt cannot be empty")
    }

    console.log("Using Gemini Chat API for text generation")
    const chat = getChatHistory(domain)

    console.log("Sending request to Gemini API")
    const result = await chat.sendMessage(prompt)
    const response = await result.response
    const text = response.text()

    if (!text || text.trim().length === 0) {
      throw new Error("Received empty response from Gemini API")
    }

    console.log("Successfully generated text, length:", text.length)
    return text
  } catch (error) {
    console.error("Error generating market research:", error)
    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
    return "I apologize, but I encountered an error while researching this topic. Please try again later."
  }
}

export async function streamMarketResearch(
  prompt: string,
  onChunk: (chunk: string) => void,
  onFinish: (fullText: string) => void,
  domain = "default",
) {
  console.log(`Streaming market research for prompt: "${prompt}" with domain: ${domain}`)
  let fullText = ""

  try {
    if (!prompt || prompt.trim().length === 0) {
      throw new Error("Prompt cannot be empty")
    }

    console.log("Using Gemini Chat API for streaming")
    const chat = getChatHistory(domain)

    console.log("Starting streaming request to Gemini API")
    const result = await chat.sendMessageStream(prompt)

    for await (const chunk of result.stream) {
      const chunkText = chunk.text()
      if (chunkText && chunkText.trim().length > 0) {
        console.log("Received chunk:", chunkText.substring(0, 20) + (chunkText.length > 20 ? "..." : ""))
        fullText += chunkText
        onChunk(chunkText)
      }
    }

    if (!fullText || fullText.trim().length === 0) {
      throw new Error("Received empty response from Gemini API stream")
    }

    console.log("Stream completed, total length:", fullText.length)
    onFinish(fullText)
    return { text: Promise.resolve(fullText) }
  } catch (error) {
    console.error("Error streaming market research:", error)
    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
    onChunk("I apologize, but I encountered an error while researching this topic. Please try again later.")
    onFinish("I apologize, but I encountered an error while researching this topic. Please try again later.")
    return null
  }
}

// Extract key insights from research for saving as notes
export async function extractResearchInsights(research: string) {
  console.log("Extracting research insights, text length:", research.length)

  try {
    if (!research || research.trim().length === 0) {
      throw new Error("Research text cannot be empty")
    }

    console.log("Using Gemini API for insights extraction")
    const model = getModel("default", false)

    const prompt = `Extract the key insights, findings, and important data points from the following research: ${research}`
    const systemPrompt =
      "You are a research summarizer. Extract only the most important insights, key statistics, and conclusions. Format your response as bullet points with clear categories. Keep it concise but comprehensive."

    console.log("Sending insights extraction request to Gemini API")
    const result = await model.generateContent(`${systemPrompt}\n\n${prompt}`)
    const response = await result.response
    const text = response.text()

    if (!text || text.trim().length === 0) {
      throw new Error("Received empty response for insights extraction")
    }

    console.log("Successfully extracted insights, length:", text.length)
    return text
  } catch (error) {
    console.error("Error extracting research insights:", error)
    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
    return "Unable to extract insights from the research."
  }
}

// Extract references from research
export async function extractReferences(research: string) {
  console.log("Extracting references, text length:", research.length)

  try {
    if (!research || research.trim().length === 0) {
      throw new Error("Research text cannot be empty")
    }

    console.log("Using Gemini API for references extraction")
    const model = getModel("default", false)

    const prompt = `Extract all references, sources, and citations from the following research: ${research}`
    const systemPrompt =
      "You are a citation extractor. Identify and list all references, sources, and citations mentioned in the text. Format your response as a JSON array. Each reference should have a title and URL field. Do not include any markdown formatting or code blocks."

    console.log("Sending references extraction request to Gemini API")
    const result = await model.generateContent(`${systemPrompt}\n\n${prompt}`)
    const response = await result.response
    const text = response.text()

    if (!text || text.trim().length === 0) {
      throw new Error("Received empty response for references extraction")
    }

    console.log("Successfully extracted references, raw text:", text)

    try {
      // Clean up the text by removing any markdown formatting
      const cleanText = text.replace(/```json\n|\n```/g, "").trim()
      const parsedReferences = JSON.parse(cleanText)
      if (!Array.isArray(parsedReferences)) {
        throw new Error("Parsed references is not an array")
      }
      return parsedReferences
    } catch (parseError) {
      console.error("Error parsing references JSON:", parseError)
      // If parsing fails, return as a simple array of strings
      return text.split("\n").filter((line) => line.trim().length > 0)
    }
  } catch (error) {
    console.error("Error extracting references:", error)
    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
    return []
  }
}

// Reset chat history for a domain
export function resetChat(domain = "default") {
  if (chatHistories[domain]) {
    delete chatHistories[domain]
  }
  return true
}

// Get chat history for a domain
export function getChatMessages(domain = "default") {
  const chat = getChatHistory(domain)
  return chat.getHistory ? chat.getHistory() : []
}
