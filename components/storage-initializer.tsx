"use client"

import { useEffect, useState } from "react"
import { initializeStorage } from "@/lib/storage"

export function StorageInitializer() {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeStorage()
        setInitialized(true)
        console.log("Storage initialized successfully")
      } catch (error) {
        console.error("Error initializing storage:", error)
      }
    }

    initialize()
  }, [])

  return null // This component doesn't render anything
}
