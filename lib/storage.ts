import localforage from "localforage"
import { v4 as uuidv4 } from "uuid"

// Initialize storage
export async function initializeStorage() {
  try {
    // Configure localforage
    localforage.config({
      name: "MarketSenseAI",
      storeName: "market_research_data",
      description: "Storage for market research data",
    })

    // Test storage
    await localforage.setItem("storage_test", "Storage initialized")
    const test = await localforage.getItem("storage_test")

    if (test !== "Storage initialized") {
      throw new Error("Storage initialization test failed")
    }

    console.log("Storage initialized successfully")
    return true
  } catch (error) {
    console.error("Error initializing storage:", error)
    throw error
  }
}

// Types
export interface Note {
  id: string
  title: string
  content: string
  domain: string
  created_at: string
  references?: string[]
}

export interface SavedResearch {
  id: string
  title: string
  content: string
  domain: string
  created_at: string
}

export interface SearchHistoryItem {
  id: string
  query: string
  timestamp: string
}

// Notes functions
export async function saveNote(note: Omit<Note, "id" | "created_at">) {
  try {
    const notes = await getNotes()

    const newNote: Note = {
      id: uuidv4(),
      ...note,
      created_at: new Date().toISOString(),
    }

    notes.unshift(newNote)
    await localforage.setItem("notes", notes)
    return newNote
  } catch (error) {
    console.error("Error saving note:", error)
    throw error
  }
}

export async function getNotes(): Promise<Note[]> {
  try {
    const notes = await localforage.getItem<Note[]>("notes")
    return notes || []
  } catch (error) {
    console.error("Error getting notes:", error)
    return []
  }
}

export async function getNote(id: string): Promise<Note | null> {
  try {
    const notes = await getNotes()
    return notes.find((note) => note.id === id) || null
  } catch (error) {
    console.error("Error getting note:", error)
    return null
  }
}

export async function deleteNote(id: string) {
  try {
    const notes = await getNotes()
    const filteredNotes = notes.filter((note) => note.id !== id)
    await localforage.setItem("notes", filteredNotes)
    return true
  } catch (error) {
    console.error("Error deleting note:", error)
    throw error
  }
}

// Saved research functions
export async function saveResearch(research: Omit<SavedResearch, "id" | "created_at">) {
  try {
    const savedResearch = await getSavedResearch()

    const newResearch: SavedResearch = {
      id: uuidv4(),
      ...research,
      created_at: new Date().toISOString(),
    }

    savedResearch.unshift(newResearch)
    await localforage.setItem("saved_research", savedResearch)
    return newResearch
  } catch (error) {
    console.error("Error saving research:", error)
    throw error
  }
}

export async function getSavedResearch(): Promise<SavedResearch[]> {
  try {
    const savedResearch = await localforage.getItem<SavedResearch[]>("saved_research")
    return savedResearch || []
  } catch (error) {
    console.error("Error getting saved research:", error)
    return []
  }
}

export async function getSavedResearchItem(id: string): Promise<SavedResearch | null> {
  try {
    const savedResearch = await getSavedResearch()
    return savedResearch.find((item) => item.id === id) || null
  } catch (error) {
    console.error("Error getting saved research item:", error)
    return null
  }
}

export async function deleteSavedResearch(id: string) {
  try {
    const savedResearch = await getSavedResearch()
    const filteredResearch = savedResearch.filter((item) => item.id !== id)
    await localforage.setItem("saved_research", filteredResearch)
    return true
  } catch (error) {
    console.error("Error deleting saved research:", error)
    throw error
  }
}

// Search history functions
export async function addSearchHistory(query: string) {
  try {
    const searchHistory = await getSearchHistory()

    // Check if this query already exists
    const existingIndex = searchHistory.findIndex((item) => item.query.toLowerCase() === query.toLowerCase())

    if (existingIndex !== -1) {
      // Remove the existing entry
      searchHistory.splice(existingIndex, 1)
    }

    const newItem: SearchHistoryItem = {
      id: uuidv4(),
      query,
      timestamp: new Date().toISOString(),
    }

    searchHistory.unshift(newItem)

    // Limit to 50 items
    const limitedHistory = searchHistory.slice(0, 50)

    await localforage.setItem("search_history", limitedHistory)
    return newItem
  } catch (error) {
    console.error("Error adding search history:", error)
    throw error
  }
}

export async function getSearchHistory(): Promise<SearchHistoryItem[]> {
  try {
    const searchHistory = await localforage.getItem<SearchHistoryItem[]>("search_history")
    return searchHistory || []
  } catch (error) {
    console.error("Error getting search history:", error)
    return []
  }
}

export async function clearSearchHistory() {
  try {
    await localforage.setItem("search_history", [])
    return true
  } catch (error) {
    console.error("Error clearing search history:", error)
    throw error
  }
}

// Clear all data
export async function clearAllData() {
  try {
    await localforage.clear()
    return true
  } catch (error) {
    console.error("Error clearing all data:", error)
    throw error
  }
}
