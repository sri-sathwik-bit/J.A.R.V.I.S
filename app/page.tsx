"use client"

import { useEffect, useState } from "react"
import { ArrowDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { MatrixRain } from "@/components/matrix-rain"
import { Navbar } from "@/components/navbar"
import { TaskCategories } from "@/components/task-categories"
import { OSControlTasks } from "@/components/os-control-tasks"
// Fix: Update the import to use the default export
import VoiceControl from "@/components/voice-control"
import { Footer } from "@/components/footer"

export default function Home() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Matrix Rain Background */}
      <div className="fixed inset-0 z-0">
        <MatrixRain />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar scrolled={scrolled} />

        {/* Hero Section */}
        <section className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <div className="mb-8 animate-pulse">
            <div className="h-32 w-32 rounded-full bg-cyan-500/20 p-6 backdrop-blur-md">
              <div className="h-full w-full rounded-full bg-cyan-500/40 p-4">
                <div className="h-full w-full rounded-full bg-cyan-500/60"></div>
              </div>
            </div>
          </div>
          <h1 className="mb-4 text-5xl font-bold tracking-tighter md:text-7xl">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              J.A.R.V.I.S.
            </span>
          </h1>
          <h2 className="mb-6 text-2xl font-light md:text-3xl">Just A Rather Very Intelligent System</h2>
          <p className="mb-8 max-w-2xl text-lg text-gray-300">
            Advanced AI assistant capable of handling over 400 specialized tasks with voice control and intelligent
            responses.
          </p>
          <div className="animate-bounce">
            <ArrowDown className="h-8 w-8 text-cyan-400" />
          </div>
        </section>

        {/* Task Categories Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-16 text-center text-4xl font-bold">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                400+ Specialized Tasks
              </span>
            </h2>
            <TaskCategories />
          </div>
        </section>

        {/* OS Control Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-16 text-center text-4xl font-bold">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                OS & Computer Control
              </span>
            </h2>
            <OSControlTasks />
          </div>
        </section>

        {/* Voice Control Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-16 text-center text-4xl font-bold">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Voice Interaction
              </span>
            </h2>
            <VoiceControl />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-r from-blue-900/40 to-cyan-900/40 p-8 backdrop-blur-lg">
              <h2 className="mb-6 text-3xl font-bold">Ready to Experience the Future?</h2>
              <p className="mb-8 text-lg text-gray-300">
                Discover how J.A.R.V.I.S. can transform your digital experience with advanced AI capabilities.
              </p>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-6 text-lg font-semibold hover:from-cyan-600 hover:to-blue-600"><a href="https://inspiring-khapse-12475d.netlify.app/">
                Get Started with J.A.R.V.I.S.
                </a>
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  )
}
