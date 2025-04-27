"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"

interface NavbarProps {
  scrolled: boolean
}

export function Navbar({ scrolled }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-cyan-400">J.A.R.V.I.S.</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <ul className="flex space-x-8">
              <li>
                <a href="#" className="text-gray-300 transition-colors hover:text-cyan-400">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 transition-colors hover:text-cyan-400">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 transition-colors hover:text-cyan-400">
                  Tasks
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 transition-colors hover:text-cyan-400">
                  Voice Control
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 transition-colors hover:text-cyan-400">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-md p-2 text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="rounded-lg bg-gray-900/90 px-2 pb-3 pt-2 backdrop-blur-lg">
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Tasks
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Voice Control
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
