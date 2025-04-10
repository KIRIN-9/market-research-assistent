"use client"

import type React from "react"

import { useSidebar } from "./sidebar-provider"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"
import {
  ChevronLeft,
  Clock,
  Compass,
  Home,
  LineChart,
  MessageSquare,
  PanelLeft,
  Search,
  Settings,
  Star,
  FileText,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { ScrollArea } from "./ui/scroll-area"
import { Separator } from "./ui/separator"
import { Input } from "./ui/input"
import { ThemeToggle } from "./theme-toggle"
import { useEffect, useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { getSearchHistory, getNotes, getSavedResearch } from "@/lib/storage"
import { useToast } from "./ui/use-toast"

export function MainSidebar() {
  const { isOpen, toggleSidebar } = useSidebar()
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  const [searchQuery, setSearchQuery] = useState("")
  const [recentNotes, setRecentNotes] = useState<any[]>([])
  const [savedResearch, setSavedResearch] = useState<any[]>([])
  const [recentSearches, setRecentSearches] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [notesOpen, setNotesOpen] = useState(true)
  const [researchOpen, setResearchOpen] = useState(true)
  const [searchesOpen, setSearchesOpen] = useState(true)

  const navItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/",
    },
    {
      title: "Deep Research",
      icon: MessageSquare,
      href: "/research",
    },
    {
      title: "Market Explorer",
      icon: Compass,
      href: "/explorer",
    },
  ]

  // Fetch data from storage
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        console.log("Fetching sidebar data from storage")

        const notes = await getNotes()
        const research = await getSavedResearch()
        const searches = await getSearchHistory()

        setRecentNotes(notes.slice(0, 5))
        setSavedResearch(research.slice(0, 5))
        setRecentSearches(searches.slice(0, 5))

        console.log("Sidebar data loaded successfully")
      } catch (error) {
        console.error("Error fetching sidebar data:", error)
        toast({
          title: "Error loading data",
          description: "There was a problem loading your saved data.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/research?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
    }
  }

  return (
    <div
      className={cn(
        "bg-sidebar-background text-sidebar-foreground h-screen relative transition-all duration-300 border-r border-border",
        isOpen ? "w-64" : "w-16",
      )}
    >
      <div className="flex items-center justify-between p-4">
        {isOpen && (
          <div className="font-bold text-lg flex items-center">
            <LineChart className="mr-2 h-5 w-5 text-primary" />
            MarketAI
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {isOpen ? <ChevronLeft /> : <PanelLeft />}
        </Button>
      </div>

      <Separator className="bg-sidebar-border opacity-30" />

      {isOpen && (
        <div className="p-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search markets..."
              className="pl-8 bg-sidebar-accent text-sidebar-foreground border-sidebar-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      )}

      <ScrollArea className="h-[calc(100vh-9rem)]">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  pathname === item.href && "bg-sidebar-accent text-primary font-medium",
                  !isOpen && "justify-center px-0",
                )}
                onClick={() => router.push(item.href)}
              >
                <item.icon className={cn("h-5 w-5", isOpen && "mr-2", pathname === item.href && "text-primary")} />
                {isOpen && <span>{item.title}</span>}
              </Button>
            ))}
          </div>

          {isOpen && (
            <>
              <Collapsible open={notesOpen} onOpenChange={setNotesOpen} className="pt-6">
                <div className="flex items-center px-3 mb-2">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 h-4 hover:bg-transparent">
                      {notesOpen ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <FileText className="h-4 w-4 mr-1 text-emerald-400" />
                  <span className="text-xs font-medium text-muted-foreground">RECENT NOTES</span>
                </div>
                <CollapsibleContent>
                  <div className="space-y-1">
                    {isLoading ? (
                      Array(3)
                        .fill(0)
                        .map((_, i) => (
                          <div key={i} className="h-8 bg-sidebar-accent/30 rounded animate-pulse mx-1 my-2"></div>
                        ))
                    ) : recentNotes.length > 0 ? (
                      recentNotes.map((note) => (
                        <Button
                          key={note.id}
                          variant="ghost"
                          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm px-3"
                          onClick={() => router.push(`/notes/${note.id}`)}
                        >
                          <span className="truncate">{note.title}</span>
                        </Button>
                      ))
                    ) : (
                      <div className="text-xs text-muted-foreground px-3 py-2">No saved notes yet</div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible open={researchOpen} onOpenChange={setResearchOpen} className="pt-6">
                <div className="flex items-center px-3 mb-2">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 h-4 hover:bg-transparent">
                      {researchOpen ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <Star className="h-4 w-4 mr-1 text-amber-400" />
                  <span className="text-xs font-medium text-muted-foreground">SAVED RESEARCH</span>
                </div>
                <CollapsibleContent>
                  <div className="space-y-1">
                    {isLoading ? (
                      Array(3)
                        .fill(0)
                        .map((_, i) => (
                          <div key={i} className="h-8 bg-sidebar-accent/30 rounded animate-pulse mx-1 my-2"></div>
                        ))
                    ) : savedResearch.length > 0 ? (
                      savedResearch.map((item) => (
                        <Button
                          key={item.id}
                          variant="ghost"
                          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm px-3"
                          onClick={() => router.push(`/saved/${item.id}`)}
                        >
                          <span className="truncate">{item.title}</span>
                        </Button>
                      ))
                    ) : (
                      <div className="text-xs text-muted-foreground px-3 py-2">No saved research yet</div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible open={searchesOpen} onOpenChange={setSearchesOpen} className="pt-6">
                <div className="flex items-center px-3 mb-2">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 h-4 hover:bg-transparent">
                      {searchesOpen ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">RECENT SEARCHES</span>
                </div>
                <CollapsibleContent>
                  <div className="space-y-1">
                    {isLoading ? (
                      Array(3)
                        .fill(0)
                        .map((_, i) => (
                          <div key={i} className="h-8 bg-sidebar-accent/30 rounded animate-pulse mx-1 my-2"></div>
                        ))
                    ) : recentSearches.length > 0 ? (
                      recentSearches.map((item) => (
                        <Button
                          key={item.id}
                          variant="ghost"
                          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm px-3"
                          onClick={() => router.push(`/research?q=${encodeURIComponent(item.query)}`)}
                        >
                          <span className="truncate">{item.query}</span>
                        </Button>
                      ))
                    ) : (
                      <div className="text-xs text-muted-foreground px-3 py-2">No recent searches</div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </>
          )}
        </div>
      </ScrollArea>

      <div className="absolute bottom-0 w-full border-t border-sidebar-border p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            className={cn(
              "justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              !isOpen && "justify-center px-0 w-full",
            )}
          >
            <Settings className={cn("h-5 w-5", isOpen && "mr-2")} />
            {isOpen && <span>Settings</span>}
          </Button>
          {isOpen && <ThemeToggle />}
        </div>
      </div>
    </div>
  )
}
