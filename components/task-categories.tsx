"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Brain,
  Calendar,
  Code,
  Database,
  FileText,
  Globe,
  Home,
  Mail,
  MessageSquare,
  Music,
  Search,
  Settings,
  Shield,
  Smartphone,
  User,
  Video,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Task categories with icons and counts
const categories = [
  { name: "System Control", icon: <Settings className="h-6 w-6" />, count: 40 },
  { name: "Data Analysis", icon: <Database className="h-6 w-6" />, count: 35 },
  { name: "Web Browsing", icon: <Globe className="h-6 w-6" />, count: 30 },
  { name: "Communication", icon: <MessageSquare className="h-6 w-6" />, count: 45 },
  { name: "Media Control", icon: <Music className="h-6 w-6" />, count: 25 },
  { name: "File Management", icon: <FileText className="h-6 w-6" />, count: 30 },
  { name: "Smart Home", icon: <Home className="h-6 w-6" />, count: 35 },
  { name: "Security", icon: <Shield className="h-6 w-6" />, count: 20 },
  { name: "Scheduling", icon: <Calendar className="h-6 w-6" />, count: 25 },
  { name: "Email", icon: <Mail className="h-6 w-6" />, count: 15 },
  { name: "Search", icon: <Search className="h-6 w-6" />, count: 20 },
  { name: "Programming", icon: <Code className="h-6 w-6" />, count: 30 },
  { name: "Video", icon: <Video className="h-6 w-6" />, count: 15 },
  { name: "Mobile", icon: <Smartphone className="h-6 w-6" />, count: 20 },
  { name: "Personal Assistant", icon: <User className="h-6 w-6" />, count: 25 },
  { name: "AI Learning", icon: <Brain className="h-6 w-6" />, count: 30 },
]

export function TaskCategories() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {categories.map((category, index) => (
        <motion.div
          key={category.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          onHoverStart={() => setHoveredIndex(index)}
          onHoverEnd={() => setHoveredIndex(null)}
        >
          <Card className="h-full overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 text-white transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
            <CardHeader className="pb-2">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/20">
                {category.icon}
              </div>
              <CardTitle className="text-xl">{category.name}</CardTitle>
              <CardDescription className="text-gray-400">{category.count} specialized tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`h-1 w-full rounded-full bg-gray-700 transition-all duration-500 ${
                  hoveredIndex === index ? "opacity-100" : "opacity-50"
                }`}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-1000"
                  style={{
                    width: hoveredIndex === index ? "100%" : "30%",
                  }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
