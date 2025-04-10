import { NextResponse } from "next/server"
import { analyzeMarketTrends } from "@/lib/gemini"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sector = searchParams.get("sector") || "AI and Machine Learning"

    const trends = await analyzeMarketTrends(sector)
    return NextResponse.json(trends)
  } catch (error) {
    console.error("Error in trends API:", error)
    return NextResponse.json({ error: "Failed to fetch trends" }, { status: 500 })
  }
}
