"use client"

import { MainSidebar } from "@/components/main-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Tag } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getNote } from "@/lib/storage"
import { useParams, useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function NotePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [note, setNote] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchNote() {
      try {
        setIsLoading(true)
        const id = params.id as string
        console.log("Fetching note with ID:", id)

        const noteData = await getNote(id)
        console.log("Note data:", noteData)

        if (noteData) {
          setNote(noteData)
        } else {
          toast({
            title: "Note not found",
            description: "The requested note could not be found.",
            variant: "destructive",
          })
          router.push("/")
        }
      } catch (error) {
        console.error("Error fetching note:", error)
        toast({
          title: "Error",
          description: "There was a problem loading the note.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchNote()
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
              <h1 className="text-2xl font-bold">Loading Note...</h1>
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

  if (!note) {
    return (
      <div className="flex h-screen">
        <MainSidebar />
        <main className="flex-1 overflow-auto p-6 gradient-bg">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-6">Note Not Found</h1>
            <p>The requested note could not be found.</p>
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
  const formattedDate = new Date(note.created_at).toLocaleDateString("en-US", {
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
            <h1 className="text-2xl font-bold">Research Note</h1>
          </div>

          <Card className="card-gradient border-[#1e293b]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{note.title}</CardTitle>
                <Badge className="bg-primary/10 text-primary border-primary/20">{note.domain}</Badge>
              </div>
              <CardDescription className="flex items-center space-x-4 text-muted-foreground">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formattedDate}
                </span>
                <span className="flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  {note.domain}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-line leading-relaxed">
                  {note.content.split("\n\n").map((paragraph: string, idx: number) => (
                    <p key={idx} className={paragraph.match(/^#/) ? "text-lg font-bold mt-4" : ""}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {note.references && note.references.length > 0 && (
                <div className="mt-8 border-t border-border/30 pt-4">
                  <h3 className="text-lg font-medium mb-4">References</h3>
                  <div className="space-y-2">
                    {note.references.map((reference: string, index: number) => (
                      <div key={index} className="flex items-start text-sm">
                        <Badge
                          variant="outline"
                          className="mr-2 mt-0.5 bg-secondary/30 border-secondary/50 whitespace-nowrap"
                        >
                          Source {index + 1}
                        </Badge>
                        <span className="flex-1">{reference}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
