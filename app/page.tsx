"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const ThreePortfolio = dynamic(() => import("@/components/three-portfolio"), { ssr: false })
const SolarPortfolio = dynamic(() => import("@/components/solar-system-portfolio"), { ssr: false })

import ViewSelector from "@/components/view-selector"
import TerminalView from "@/components/terminal-view"
import ParallaxView from "@/components/parallax-view"
import ViewToggle from "@/components/view-toggle"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  const [selectedView, setSelectedView] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check localStorage for saved view preference
    const savedView = localStorage.getItem("portfolioView")
    if (savedView && (savedView === "terminal" || savedView === "parallax")) {
      setSelectedView(savedView)
    }
    setIsLoading(false)
  }, [])

  const handleViewSelect = (view: string) => {
    setSelectedView(view)
    localStorage.setItem("portfolioView", view)
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <ThemeProvider>
      <main className="min-h-screen">
        {!selectedView ? (
          <ViewSelector onSelectView={handleViewSelect} />
        ) : (
          <div className="relative">
            {selectedView === "terminal" && <TerminalView />}
            {selectedView === "parallax" && <ParallaxView />}
            {selectedView === "three" && <ThreePortfolio />}
            {selectedView === "solar" && <SolarPortfolio />}
            <div className="fixed top-4 right-4 z-50">
              <ViewToggle currentView={selectedView} onToggle={handleViewSelect} />
            </div>
          </div>
        )}
      </main>
    </ThemeProvider>
  )
}
