"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Sparkles, FileText, BarChart3, Globe, History, Save, AlertCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useSearchParams, useRouter } from "next/navigation"
import { streamMarketResearch, extractResearchInsights } from "@/lib/gemini-client"
import { generateNoteContent } from "@/lib/gemini"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { saveNote, addSearchHistory } from "@/lib/storage"

interface Message {
  role: "user" | "assistant"
  content: string
  sources?: Array<{ title: string; url: string }>
  charts?: Array<{ type: string; title: string }>
  isStreaming?: boolean
}

interface SaveNoteDialogProps {
  content: string
  onSave: (title: string, content: string, domain: string) => Promise<void>
  defaultDomain?: string
}

function SaveNoteDialog({ content, onSave, defaultDomain = "technology" }: SaveNoteDialogProps) {
  const [title, setTitle] = useState("")
  const [noteContent, setNoteContent] = useState("")
  const [domain, setDomain] = useState(defaultDomain)
  const [isSaving, setIsSaving] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [open, setOpen] = useState(false)
  const [references, setReferences] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      console.log("[SaveNoteDialog] Dialog opened - Generating title and content")
      const titleSuggestion = content.split("\n")[0].slice(0, 50) + (content.split("\n")[0].length > 50 ? "..." : "")
      setTitle(titleSuggestion)
      console.log("[SaveNoteDialog] Title suggestion generated:", titleSuggestion)

      setIsGenerating(true)
      generateNoteContent(titleSuggestion, domain, content.slice(0, 2000))
        .then((result: { content: string; references: string[] }) => {
          console.log("[SaveNoteDialog] Note content generated with Gemini")
          setNoteContent(result.content)
          setReferences(result.references)
          setIsGenerating(false)
        })
        .catch((error: Error) => {
          console.error("[SaveNoteDialog] Error generating note content:", error)
          extractResearchInsights(content)
            .then((insights) => {
              console.log("[SaveNoteDialog] Research insights extracted successfully")
              setNoteContent(insights)
              setIsGenerating(false)
            })
            .catch((fallbackError) => {
              console.error("[SaveNoteDialog] Fallback extraction error:", fallbackError)
              setNoteContent(content.slice(0, 1000) + (content.length > 1000 ? "..." : ""))
              setIsGenerating(false)
            })
        })
    }
  }, [open, content, domain])

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your note",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      await onSave(title, noteContent, domain)
      setOpen(false)
      toast({
        title: "Note saved",
        description: "Your enhanced research note has been saved successfully",
      })
    } catch (error) {
      console.error("Error saving note:", error)
      toast({
        title: "Error saving note",
        description: "There was a problem saving your note. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-card border-border/50 hover:bg-secondary">
          <Save className="h-4 w-4 mr-2" />
          Save as Note
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Save Research Note</DialogTitle>
          <DialogDescription>
            Create an enhanced note from your research using Gemini AI to extract key insights and provide references.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="domain" className="text-right">
              Domain
            </Label>
            <select
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="technology">Technology</option>
              <option value="finance">Finance</option>
              <option value="healthcare">Healthcare</option>
              <option value="retail">Retail</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="content" className="text-right">
              Content
            </Label>
            <div className="col-span-3">
              {isGenerating ? (
                <div className="min-h-[200px] p-3 border rounded-md flex flex-col items-center justify-center">
                  <div className="flex space-x-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-primary/50 animate-bounce"></div>
                    <div className="h-2 w-2 rounded-full bg-primary/50 animate-bounce delay-75"></div>
                    <div className="h-2 w-2 rounded-full bg-primary/50 animate-bounce delay-150"></div>
                  </div>
                  <p className="text-sm text-muted-foreground">Generating enhanced note content with Gemini AI...</p>
                </div>
              ) : (
                <Textarea
                  id="content"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="min-h-[200px]"
                />
              )}
            </div>
          </div>

          {references.length > 0 && (
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="references" className="text-right">
                References
              </Label>
              <div className="col-span-3 space-y-2">
                {references.map((reference, index) => (
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
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave} disabled={isSaving || isGenerating}>
            {isSaving ? "Saving..." : "Save Enhanced Note"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ResearchInterface() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialTopic = searchParams.get("topic") || ""
  const initialQuery = searchParams.get("q") || ""
  const initialDomain = searchParams.get("domain") || "default"

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState<string>("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    console.log("[ResearchInterface] Messages updated - Scrolling to bottom")
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, currentStreamingMessage])

  useEffect(() => {
    if ((initialTopic || initialQuery) && messages.length === 0) {
      const query = initialTopic || initialQuery
      console.log("[ResearchInterface] Initial query detected:", query)
      setInput(`I'd like to research about: ${query}`)
      setTimeout(() => {
        console.log("[ResearchInterface] Auto-triggering research for initial query")
        handleSend()
      }, 100)
    }
  }, [initialTopic, initialQuery])

  const handleSend = async () => {
    if (!input.trim() && messages.length === 0) return
    console.log("[ResearchInterface] Processing new research request")

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev: Message[]) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      console.log("[ResearchInterface] Saving to search history")
      await addSearchHistory(input)
    } catch (error) {
      console.error("[ResearchInterface] Error saving search history:", error)
    }

    setMessages((prev: Message[]) => [
      ...prev,
      {
        role: "assistant",
        content: "",
        isStreaming: true,
      },
    ])
    console.log("[ResearchInterface] Added assistant placeholder message")

    try {
      console.log("[ResearchInterface] Starting market research stream")
      await streamMarketResearch(
        input,
        (chunk: string) => {
          console.log("[ResearchInterface] Received stream chunk")
          setCurrentStreamingMessage((prev) => prev + chunk)
        },
        (fullText: string) => {
          console.log("[ResearchInterface] Stream completed - Updating final message")
          setMessages((prev: Message[]) => {
            const newMessages = [...prev]
            const lastMessage = newMessages[newMessages.length - 1]
            if (lastMessage && lastMessage.isStreaming) {
              lastMessage.content = fullText
              lastMessage.isStreaming = false
            }
            return newMessages
          })
          setCurrentStreamingMessage("")
        },
        initialDomain,
      )
    } catch (error) {
      console.error("[ResearchInterface] Error streaming market research:", error)
      toast({
        title: "Error",
        description: "Failed to generate research. Please try again.",
        variant: "destructive",
      })
      setMessages((prev: Message[]) => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
      console.log("[ResearchInterface] Research request completed")
    }
  }

  const saveResearchNote = async (title: string, content: string, domain: string): Promise<void> => {
    console.log("[ResearchInterface] Saving research note:", { title, domain })
    try {
      const lastAssistantMessage = [...messages].reverse().find((m) => m.role === "assistant")
      if (!lastAssistantMessage) {
        console.error("[ResearchInterface] No research content found to save")
        throw new Error("No research to save")
      }

      let references: string[] = []
      try {
        const result = await generateNoteContent(title, domain, content.slice(0, 2000))
        references = result.references

        if (references.length === 0 && lastAssistantMessage.sources) {
          references = lastAssistantMessage.sources?.map((s) => s.title) || []
        }
      } catch (error) {
        console.error("[ResearchInterface] Error generating references:", error)
        if (lastAssistantMessage.sources) {
          references = lastAssistantMessage.sources?.map((s) => s.title) || []
        }
      }

      console.log("[ResearchInterface] Using references:", references)

      await saveNote({
        title,
        content,
        domain,
        references,
      })

      console.log("[ResearchInterface] Note saved successfully")
    } catch (error) {
      console.error("[ResearchInterface] Error saving note:", error)
      throw error
    }
  }

  return (
    <div className="container mx-auto p-6 gradient-bg">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Deep Research Interface</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="bg-card border-border/50 hover:bg-secondary">
            <History className="h-4 w-4 mr-2" />
            Research History
          </Button>

          {messages.length > 0 && messages.some((m) => m.role === "assistant" && !m.isStreaming) && (
            <SaveNoteDialog
              content={messages
                .filter((m) => m.role === "assistant" && !m.isStreaming)
                .map((m) => m.content)
                .join("\n\n")}
              onSave={saveResearchNote}
              defaultDomain={initialDomain}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2 card-gradient border-[#1e293b]">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Research Conversation</CardTitle>
            <CardDescription className="text-muted-foreground">
              Ask detailed questions about markets, trends, and companies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Sparkles className="h-12 w-12 text-primary/50 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Start Your Research</h3>
                  <p className="text-muted-foreground max-w-md">
                    Ask detailed questions about markets, companies, or trends to get comprehensive analysis powered by
                    Gemini.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === "user"
                            ? "bg-primary/20 border border-primary/30"
                            : "bg-card border border-border/50"
                        }`}
                      >
                        {message.isStreaming ? (
                          <>
                            <div className="whitespace-pre-line">{currentStreamingMessage}</div>
                            <div className="flex space-x-2 mt-2">
                              <div className="h-2 w-2 rounded-full bg-primary/50 animate-bounce"></div>
                              <div className="h-2 w-2 rounded-full bg-primary/50 animate-bounce delay-75"></div>
                              <div className="h-2 w-2 rounded-full bg-primary/50 animate-bounce delay-150"></div>
                            </div>
                          </>
                        ) : (
                          <div className="whitespace-pre-line">{message.content}</div>
                        )}

                        {message.sources && message.sources.length > 0 && (
                          <div className="mt-4">
                            <div className="text-xs font-semibold mb-2 text-muted-foreground">SOURCES</div>
                            <div className="space-y-2">
                              {message.sources.map((source, idx) => (
                                <div key={idx} className="flex items-center text-xs">
                                  <Badge variant="outline" className="mr-2 bg-secondary/30 border-secondary/50">
                                    Source
                                  </Badge>
                                  <a
                                    href={source.url}
                                    className="text-primary hover:text-primary/80 underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {source.title}
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {message.charts && (
                          <div className="mt-4">
                            <div className="text-xs font-semibold mb-2 text-muted-foreground">VISUALIZATIONS</div>
                            <div className="space-y-2">
                              {message.charts.map((chart, idx) => (
                                <div key={idx} className="bg-card/50 rounded-md p-3 border border-border/30">
                                  <div className="flex items-center text-xs mb-2">
                                    <BarChart3 className="h-3 w-3 mr-1 text-primary" />
                                    <span>{chart.title}</span>
                                  </div>
                                  <div className="h-32 bg-card rounded flex items-center justify-center text-xs text-muted-foreground">
                                    [Interactive {chart.type} chart visualization]
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            <div className="flex items-center space-x-2 mt-4">
              <Input
                placeholder="Ask about market trends, companies, or economic indicators..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                className="flex-1 bg-card border-border/50"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="card-gradient border-[#1e293b]">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Research Parameters</CardTitle>
              <CardDescription className="text-muted-foreground">Customize your research experience</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="depth">
                <TabsList className="grid grid-cols-2 mb-4 bg-card">
                  <TabsTrigger
                    value="depth"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Depth
                  </TabsTrigger>
                  <TabsTrigger
                    value="region"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Region
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="depth" className="space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-2 text-muted-foreground">Research Depth</div>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-start bg-card border-border/50 hover:bg-secondary"
                      >
                        Overview
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="justify-start bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Standard
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-start bg-card border-border/50 hover:bg-secondary"
                      >
                        Deep Dive
                      </Button>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2 text-muted-foreground">Time Horizon</div>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-start bg-card border-border/50 hover:bg-secondary"
                      >
                        Short-term
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="justify-start bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Medium
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-start bg-card border-border/50 hover:bg-secondary"
                      >
                        Long-term
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="region" className="space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-2 text-muted-foreground">Focus Region</div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="justify-start bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Globe className="h-3 w-3 mr-2" />
                        Global
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-start bg-card border-border/50 hover:bg-secondary"
                      >
                        North America
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-start bg-card border-border/50 hover:bg-secondary"
                      >
                        Europe
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-start bg-card border-border/50 hover:bg-secondary"
                      >
                        Asia Pacific
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Separator className="my-4 bg-border/30" />

              <div>
                <div className="text-sm font-medium mb-2 text-muted-foreground">Data Sources</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-2 bg-primary/10 text-primary border-primary/20">
                        Primary
                      </Badge>
                      <span className="text-sm">Financial Reports</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-secondary/50">
                      <FileText className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-2 bg-primary/10 text-primary border-primary/20">
                        Primary
                      </Badge>
                      <span className="text-sm">Market Analysis</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-secondary/50">
                      <FileText className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Badge
                        variant="outline"
                        className="mr-2 bg-secondary/30 text-muted-foreground border-secondary/50"
                      >
                        Secondary
                      </Badge>
                      <span className="text-sm">News Articles</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-secondary/50">
                      <FileText className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient border-[#1e293b]">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Related Topics</CardTitle>
              <CardDescription className="text-muted-foreground">Explore connected research areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="cursor-pointer bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                >
                  Market Trends
                </Badge>
                <Badge
                  variant="secondary"
                  className="cursor-pointer bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                >
                  Competitive Analysis
                </Badge>
                <Badge
                  variant="secondary"
                  className="cursor-pointer bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                >
                  Industry Forecasts
                </Badge>
                <Badge
                  variant="secondary"
                  className="cursor-pointer bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                >
                  Regulatory Impact
                </Badge>
                <Badge
                  variant="secondary"
                  className="cursor-pointer bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                >
                  Investment Opportunities
                </Badge>
                <Badge
                  variant="secondary"
                  className="cursor-pointer bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                >
                  Technology Adoption
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient border-[#1e293b]">
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-amber-400" />
                <CardTitle className="text-lg font-medium">Research Tips</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm space-y-2 text-muted-foreground">
              <p>• Ask specific questions for more focused insights</p>
              <p>• Request data visualizations for complex trends</p>
              <p>• Save important findings as notes for future reference</p>
              <p>• Specify time periods for more relevant analysis</p>
              <p>• Compare multiple markets or companies in one query</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
