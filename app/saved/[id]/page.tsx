"use client"

import { MainSidebar } from "@/components/main-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Tag } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getSavedResearchItem } from "@/lib/storage"
import { useParams, useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function SavedResearchPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [research, setResearch] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchResearch() {
      try {
        setIsLoading(true)
        const id = params.id as string
        console.log("Fetching saved research with ID:", id)

        const researchData = await getSavedResearchItem(id)
        console.log("Research data:", researchData)

        if (researchData) {
          setResearch(researchData)
        } else {
          toast({
            title: "Research not found",
            description: "The requested research could not be found.",
            variant: "destructive",
          })
          router.push("/")
        }
      } catch (error) {
        console.error("Error fetching research:", error)
        toast({
          title: "Error",
          description: "There was a problem loading the research.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchResearch()
  }, [params.id, router, toast])

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <MainSidebar />
        <main className="flex-1 overflow-auto p-6 gradient-bg">
          <div className="container mx-auto">
            <div className="flex items-center mb-6">
              <Button variant="outline" size="sm" asChild className="mr-4 bg-card border-border/50 hover:bg-secondary">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Link>
              </Button>
              <h1 className="text-2xl font-bold">Loading Research...</h1>
            </div>

            <Card className="card-gradient border-[#1e293b]">
              <CardHeader>
                <div className="h-6 bg-card/50 rounded animate-pulse w-1/3 mb-2"></div>
                <div className="h-4 bg-card/50 rounded animate-pulse w-1/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-card/50 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-card/50 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-card/50 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-card/50 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-card/50 rounded animate-pulse w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  if (!research) {
    return (
      <div className="flex h-screen">
        <MainSidebar />
        <main className="flex-1 overflow-auto p-6 gradient-bg">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-6">Research Not Found</h1>
            <p>The requested research could not be found.</p>
            <Button asChild className="mt-4">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  // Format the date
  const formattedDate = new Date(research.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex h-screen">
      <MainSidebar />
      <main className="flex-1 overflow-auto p-6 gradient-bg">
        <div className="container mx-auto">
          <div className="flex items-center mb-6">
            <Button variant="outline" size="sm" asChild className="mr-4 bg-card border-border/50 hover:bg-secondary">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Saved Research</h1>
          </div>

          <Card className="card-gradient border-[#1e293b]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{research.title}</CardTitle>
                <Badge className="bg-primary/10 text-primary border-primary/20">{research.domain}</Badge>
              </div>
              <CardDescription className="flex items-center space-x-4 text-muted-foreground">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formattedDate}
                </span>
                <span className="flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  {research.domain}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-line">{research.content}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
