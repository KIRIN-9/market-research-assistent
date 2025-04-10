import { NextResponse } from "next/server"
import { fetchAndProcessNews } from "@/lib/gemini"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const topic = searchParams.get("topic") || "AI technology"
    const news = await fetchAndProcessNews(topic)
    return NextResponse.json(news)
  } catch (error) {
    console.error("Error in news API:", error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}
