"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Cpu,
  Database,
  FileText,
  FolderOpen,
  HardDrive,
  Layers,
  Lock,
  Monitor,
  Network,
  Power,
  Save,
  Search,
  Settings,
  Smartphone,
  Terminal,
  Wifi,
} from "lucide-react"

// OS Control tasks with descriptions
const osTasks = [
  {
    icon: <Power className="h-6 w-6" />,
    title: "Power Management",
    description: "Control system power states, schedule shutdowns, and manage energy settings.",
  },
  {
    icon: <Cpu className="h-6 w-6" />,
    title: "Process Control",
    description: "Monitor and manage running processes, allocate resources, and optimize performance.",
  },
  {
    icon: <HardDrive className="h-6 w-6" />,
    title: "Storage Management",
    description: "Analyze disk usage, clean temporary files, and optimize storage allocation.",
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "File Operations",
    description: "Search, organize, and manipulate files with voice commands.",
  },
  {
    icon: <FolderOpen className="h-6 w-6" />,
    title: "Directory Navigation",
    description: "Navigate through file system and manage folder structures efficiently.",
  },
  {
    icon: <Terminal className="h-6 w-6" />,
    title: "Command Execution",
    description: "Execute system commands and scripts through natural language instructions.",
  },
  {
    icon: <Settings className="h-6 w-6" />,
    title: "System Configuration",
    description: "Adjust system settings and preferences through voice commands.",
  },
  {
    icon: <Monitor className="h-6 w-6" />,
    title: "Display Control",
    description: "Manage screen resolution, brightness, and multi-monitor setups.",
  },
  {
    icon: <Wifi className="h-6 w-6" />,
    title: "Network Management",
    description: "Configure network settings, troubleshoot connections, and monitor bandwidth.",
  },
  {
    icon: <Lock className="h-6 w-6" />,
    title: "Security Controls",
    description: "Manage system security, update firewalls, and scan for vulnerabilities.",
  },
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: "Device Integration",
    description: "Connect and control peripheral devices and mobile integrations.",
  },
  {
    icon: <Database className="h-6 w-6" />,
    title: "Database Management",
    description: "Monitor and optimize database performance and storage.",
  },
  {
    icon: <Search className="h-6 w-6" />,
    title: "System Search",
    description: "Perform advanced searches across the entire system with natural language queries.",
  },
  {
    icon: <Save className="h-6 w-6" />,
    title: "Backup & Recovery",
    description: "Schedule and manage system backups and recovery operations.",
  },
  {
    icon: <Layers className="h-6 w-6" />,
    title: "Software Management",
    description: "Install, update, and remove software packages with voice commands.",
  },
  {
    icon: <Network className="h-6 w-6" />,
    title: "Remote Access",
    description: "Securely access and control systems remotely through voice instructions.",
  },
]

export function OSControlTasks() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {osTasks.map((task, index) => (
        <motion.div
          key={task.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="group"
          onHoverStart={() => setActiveIndex(index)}
          onHoverEnd={() => setActiveIndex(null)}
        >
          <div
            className={`flex h-full cursor-pointer flex-col rounded-lg border border-gray-800 bg-gray-900/50 p-5 backdrop-blur-sm transition-all duration-300 hover:border-cyan-800 hover:bg-gray-800/50 ${
              activeIndex === index ? "border-cyan-700 shadow-lg shadow-cyan-900/30" : ""
            }`}
          >
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                  : "bg-gray-800 text-cyan-400"
              }`}
            >
              {task.icon}
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">{task.title}</h3>
            <p className="text-sm text-gray-400">{task.description}</p>
            <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-gray-800">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                initial={{ width: "0%" }}
                animate={{ width: activeIndex === index ? "100%" : "0%" }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
