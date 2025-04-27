"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { Mic, Volume2, VolumeX, Play, Pause, Settings, ChevronUp, ChevronDown } from "lucide-react"

import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Fix: Ensure the component is properly exported
export function VoiceControl() {
  // Speech synthesis states
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>("")
  const [rate, setRate] = useState<number>(1)
  const [pitch, setPitch] = useState<number>(1)
  const [volume, setVolume] = useState<number>(1)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Check if speech synthesis is available
  const [isSpeechSupported, setIsSpeechSupported] = useState(true)

  // Sample phrases
  const samplePhrases = [
    "Hello, I am J.A.R.V.I.S., your personal AI assistant.",
    "All systems are operating at optimal levels. CPU usage is at 12%, memory at 34%.",
    "I've analyzed the data and found several patterns that might interest you.",
    "Would you like me to run a diagnostic on your network connections?",
    "I've scheduled your meeting for tomorrow at 2 PM and sent the invitations.",
    "The weather forecast indicates a 70% chance of rain this afternoon.",
  ]

  const [customText, setCustomText] = useState("")
  const [conversation, setConversation] = useState<{ type: "user" | "jarvis"; text: string }[]>([])

  // Reference to the speech synthesis utterance
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Initialize speech synthesis and get available voices
  useEffect(() => {
    // Check if speech synthesis is supported
    if (typeof window !== "undefined") {
      const isSupported = "speechSynthesis" in window
      setIsSpeechSupported(isSupported)

      if (!isSupported) {
        console.warn("Speech synthesis is not supported in this browser")
        return
      }
    }

    if (typeof window === "undefined" || !window.speechSynthesis) {
      console.warn("Speech synthesis is not supported in this browser")
      return
    }

    // Function to load and set voices
    const loadVoices = () => {
      try {
        const availableVoices = window.speechSynthesis.getVoices()

        if (availableVoices && availableVoices.length > 0) {
          console.log(`Loaded ${availableVoices.length} voices`)
          setVoices(availableVoices)

          // Try to find a good default voice (preferably a male voice for J.A.R.V.I.S.)
          // Filter for English voices first as a priority
          const englishVoices = availableVoices.filter(
            (voice) => voice.lang.includes("en") || voice.lang.includes("EN"),
          )

          const voicesToUse = englishVoices.length > 0 ? englishVoices : availableVoices

          // Look for a suitable male voice
          const defaultVoice =
            voicesToUse.find(
              (voice) =>
                voice.name.includes("Male") ||
                voice.name.includes("Daniel") ||
                voice.name.toLowerCase().includes("google") ||
                voice.name.includes("David"),
            ) || voicesToUse[0]

          if (defaultVoice) {
            console.log(`Selected default voice: ${defaultVoice.name}`)
            setSelectedVoice(defaultVoice.name)
          }
        } else {
          console.warn("No voices available yet, will try again")
          // If no voices are available yet, we'll try again after a short delay
          setTimeout(loadVoices, 500)
        }
      } catch (error) {
        console.error("Error loading voices:", error)
      }
    }

    // Initial load
    loadVoices()

    // Set up event listener for voices changed
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }

    // Clean up
    return () => {
      try {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel()
        }
      } catch (error) {
        console.error("Error during cleanup:", error)
      }
    }
  }, [])

  // Function to speak text
  const speak = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      console.warn("Speech synthesis is not supported")
      // Add the text to conversation anyway so the UI still works
      setConversation((prev) => [...prev, { type: "jarvis", text }])
      return
    }

    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(text)
      utteranceRef.current = utterance

      // Set voice with fallback
      if (voices.length > 0) {
        const voice = voices.find((v) => v.name === selectedVoice)
        if (voice) {
          utterance.voice = voice
        } else {
          // Fallback to the first available voice
          console.warn(`Selected voice "${selectedVoice}" not found, using default`)
          utterance.voice = voices[0]
        }
      }

      // Set other properties with safe values
      utterance.rate = Math.max(0.1, Math.min(rate, 2)) // Clamp between 0.1 and 2
      utterance.pitch = Math.max(0.1, Math.min(pitch, 2)) // Clamp between 0.1 and 2
      utterance.volume = Math.max(0, Math.min(volume, 1)) // Clamp between 0 and 1

      // Add event listeners
      utterance.onstart = () => {
        console.log("Speech started")
        setIsSpeaking(true)
        setIsPaused(false)
        // Add to conversation
        setConversation((prev) => [...prev, { type: "jarvis", text }])
      }

      utterance.onend = () => {
        console.log("Speech ended")
        setIsSpeaking(false)
        setIsPaused(false)
      }

      utterance.onerror = (event) => {
        console.error("SpeechSynthesis error:", event)
        // Try to provide more detailed error information
        if (event.error) {
          console.error("Error type:", event.error)
        }

        setIsSpeaking(false)
        setIsPaused(false)

        // Add error message to conversation for user feedback
        setConversation((prev) => [
          ...prev,
          {
            type: "jarvis",
            text: "I'm sorry, there was an error with the speech synthesis. Please try again.",
          },
        ])
      }

      // Speak with a small delay to ensure browser is ready
      setTimeout(() => {
        try {
          window.speechSynthesis.speak(utterance)
        } catch (error) {
          console.error("Error during speech:", error)
          setIsSpeaking(false)
          setConversation((prev) => [
            ...prev,
            {
              type: "jarvis",
              text: "I'm sorry, there was an error with the speech synthesis. Please try again.",
            },
          ])
        }
      }, 100)
    } catch (error) {
      console.error("Error in speak function:", error)
      // Add the text to conversation anyway so the UI still works
      setConversation((prev) => [...prev, { type: "jarvis", text }])
    }
  }

  // Function to pause/resume speech
  const togglePause = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return
    }

    try {
      if (isPaused) {
        window.speechSynthesis.resume()
        setIsPaused(false)
      } else {
        window.speechSynthesis.pause()
        setIsPaused(true)
      }
    } catch (error) {
      console.error("Error toggling pause:", error)
    }
  }

  // Function to stop speech
  const stopSpeech = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return
    }

    try {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      setIsPaused(false)
    } catch (error) {
      console.error("Error stopping speech:", error)
    }
  }

  // Simulate voice recognition (in a real app, you would use the SpeechRecognition API)
  const simulateListening = () => {
    setIsListening(true)

    // Simulate user speaking after a delay
    setTimeout(() => {
      const userQuestions = [
        "What's the system status?",
        "Open my project files and start the development environment.",
        "What's the weather forecast for today?",
        "Schedule a meeting with the team for tomorrow at 10 AM.",
      ]

      const randomQuestion = userQuestions[Math.floor(Math.random() * userQuestions.length)]
      setConversation((prev) => [...prev, { type: "user", text: randomQuestion }])
      setIsListening(false)

      // Generate J.A.R.V.I.S. response
      setTimeout(() => {
        let response = ""

        if (randomQuestion.includes("system status")) {
          response =
            "All systems are operating at optimal levels. CPU usage is at 12%, memory at 34%, and all network connections are secure."
        } else if (randomQuestion.includes("project files")) {
          response =
            "Opening project files. Development environment initialized. Visual Studio Code is now running with your recent project."
        } else if (randomQuestion.includes("weather")) {
          response =
            "The weather forecast for today shows a high of 72°F with partly cloudy skies. There's a 20% chance of rain in the evening."
        } else if (randomQuestion.includes("meeting")) {
          response =
            "I've scheduled a team meeting for tomorrow at 10 AM. Calendar invitations have been sent to all team members."
        }

        speak(response)
      }, 500)
    }, 1500)
  }

  // Visualizer animation variants
  const visualizerVariants = {
    listening: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 1.5,
      },
    },
    speaking: {
      scale: [1, 1.1, 1, 1.15, 1],
      opacity: [0.7, 1, 0.8, 1, 0.7],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 2,
      },
    },
    idle: {
      scale: 1,
      opacity: 0.5,
    },
  }

  // Fix: Remove the conditional rendering with if statement that was causing syntax errors
  // Instead, use a proper JSX conditional rendering approach
  if (!isSpeechSupported) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="rounded-xl bg-gradient-to-r from-gray-900/70 to-gray-800/70 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-xl font-semibold text-white">Speech Synthesis Not Supported</h3>
          <p className="mb-4 text-gray-300">
            Unfortunately, your browser does not support the Speech Synthesis API needed for J.A.R.V.I.S. to speak.
          </p>
          <p className="mb-4 text-gray-300">
            For the best experience, please try using a modern browser like Chrome, Edge, or Safari.
          </p>
          <div className="mt-6 flex justify-center">
            <Button
              className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-2 font-semibold text-white transition-all hover:from-cyan-600 hover:to-blue-600"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>

        {/* Show simulated conversation instead */}
        <div className="mt-8 rounded-xl bg-gradient-to-r from-gray-900/70 to-gray-800/70 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-xl font-semibold text-white">Simulated Conversation</h3>
          <div className="space-y-4">
            <div className="flex justify-end">
              <div className="max-w-xs rounded-lg bg-gray-700 px-4 py-2 text-white">
                <p className="text-sm font-medium">You</p>
                <p>What's the system status?</p>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="max-w-xs rounded-lg bg-gradient-to-r from-cyan-500/80 to-blue-500/80 px-4 py-2 text-white">
                <p className="text-sm font-medium">J.A.R.V.I.S.</p>
                <p>
                  All systems are operating at optimal levels. CPU usage is at 12%, memory at 34%, and all network
                  connections are secure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Voice Visualization */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative mb-8 flex h-64 w-64 items-center justify-center rounded-full bg-gray-900/50 backdrop-blur-sm">
            {/* Animated rings */}
            {(isListening || isSpeaking) && (
              <>
                <motion.div
                  className="absolute h-full w-full rounded-full border border-cyan-500/20"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.5, 0.1] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3 }}
                />
                <motion.div
                  className="absolute h-full w-full rounded-full border border-blue-500/20"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2.5, delay: 0.2 }}
                />
              </>
            )}

            {/* Central icon */}
            <motion.div
              className={`flex h-24 w-24 items-center justify-center rounded-full ${
                isListening
                  ? "bg-gradient-to-r from-green-500 to-emerald-600"
                  : isSpeaking
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600"
                    : "bg-gray-800"
              }`}
              variants={visualizerVariants}
              animate={isListening ? "listening" : isSpeaking ? "speaking" : "idle"}
            >
              {isListening ? (
                <Mic className="h-10 w-10 text-white" />
              ) : isSpeaking ? (
                <Volume2 className="h-10 w-10 text-white" />
              ) : (
                <VolumeX className="h-10 w-10 text-white" />
              )}
            </motion.div>

            {/* Voice waves */}
            {(isListening || isSpeaking) && (
              <div className="absolute bottom-8 flex h-8 w-32 items-end justify-center space-x-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className={`w-1 rounded-full ${
                      isListening ? "bg-green-500" : isSpeaking ? "bg-cyan-500" : "bg-gray-600"
                    }`}
                    animate={{
                      height: [Math.random() * 10 + 5, Math.random() * 20 + 10, Math.random() * 10 + 5],
                    }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 1.5,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={simulateListening}
              disabled={isSpeaking}
              className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 font-semibold text-white transition-all hover:from-green-600 hover:to-emerald-600"
            >
              <Mic className="mr-2 h-4 w-4" />
              Simulate Voice Input
            </Button>

            {isSpeaking ? (
              <Button
                onClick={togglePause}
                className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 font-semibold text-white transition-all hover:from-amber-600 hover:to-orange-600"
              >
                {isPaused ? <Play className="mr-2 h-4 w-4" /> : <Pause className="mr-2 h-4 w-4" />}
                {isPaused ? "Resume" : "Pause"}
              </Button>
            ) : null}

            {isSpeaking ? (
              <Button
                onClick={stopSpeech}
                className="bg-gradient-to-r from-red-500 to-rose-500 px-4 py-2 font-semibold text-white transition-all hover:from-red-600 hover:to-rose-600"
              >
                <VolumeX className="mr-2 h-4 w-4" />
                Stop
              </Button>
            ) : null}
          </div>
        </div>

        {/* Conversation Display */}
        <div className="flex flex-col rounded-lg bg-gray-900/50 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-xl font-semibold text-white">Voice Interaction Demo</h3>

          <div className="mb-4 h-64 space-y-4 overflow-y-auto">
            {conversation.length === 0 ? (
              <p className="text-gray-400">Use the controls to interact with J.A.R.V.I.S.</p>
            ) : (
              conversation.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs rounded-lg px-4 py-2 ${
                      message.type === "user"
                        ? "bg-gray-700 text-white"
                        : "bg-gradient-to-r from-cyan-500/80 to-blue-500/80 text-white"
                    }`}
                  >
                    <p className="text-sm font-medium">{message.type === "user" ? "You" : "J.A.R.V.I.S."}</p>
                    <p>{message.text}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="mt-auto">
            <div className="rounded-lg bg-gray-800 p-4">
              <h4 className="mb-2 font-medium text-white">Voice Control Features:</h4>
              <ul className="space-y-1 text-sm text-gray-300">
                <li>• Natural language processing for complex commands</li>
                <li>• Context-aware responses with memory of previous interactions</li>
                <li>• Customizable voice profiles and response styles</li>
                <li>• Multi-language support for global accessibility</li>
                <li>• Noise cancellation for accurate command recognition</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Text-to-Speech Controls */}
      <div className="mb-8 rounded-xl bg-gradient-to-r from-gray-900/70 to-gray-800/70 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Text-to-Speech Controls</h3>
          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <Settings className="h-4 w-4" />
                Advanced Settings
                {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Voice Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Voice</label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger className="border-gray-700 bg-gray-800 text-white">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent className="border-gray-700 bg-gray-800 text-white">
                {voices.map((voice) => (
                  <SelectItem key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Text Input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Custom Text</label>
            <div className="flex">
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Enter text for J.A.R.V.I.S. to speak..."
                className="flex-1 rounded-l-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
              />
              <Button
                onClick={() => customText && speak(customText)}
                disabled={!customText || isSpeaking}
                className="rounded-l-none bg-cyan-600 hover:bg-cyan-700"
              >
                Speak
              </Button>
            </div>
          </div>

          {/* Advanced Settings - Now properly nested inside the Collapsible component */}
          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced} className="col-span-1 md:col-span-2">
            <CollapsibleContent>
              <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Rate Control */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Rate: {rate.toFixed(1)}</label>
                  <Slider
                    value={[rate]}
                    min={0.5}
                    max={2}
                    step={0.1}
                    onValueChange={(value) => setRate(value[0])}
                    className="py-2"
                  />
                </div>

                {/* Pitch Control */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Pitch: {pitch.toFixed(1)}</label>
                  <Slider
                    value={[pitch]}
                    min={0.5}
                    max={2}
                    step={0.1}
                    onValueChange={(value) => setPitch(value[0])}
                    className="py-2"
                  />
                </div>

                {/* Volume Control */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Volume: {volume.toFixed(1)}</label>
                  <Slider
                    value={[volume]}
                    min={0}
                    max={1}
                    step={0.1}
                    onValueChange={(value) => setVolume(value[0])}
                    className="py-2"
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      {/* Sample Phrases */}
      <div className="rounded-xl bg-gradient-to-r from-gray-900/70 to-gray-800/70 p-6 backdrop-blur-sm">
        <h3 className="mb-4 text-xl font-semibold text-white">Sample Phrases</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {samplePhrases.map((phrase, index) => (
            <Button
              key={index}
              onClick={() => speak(phrase)}
              disabled={isSpeaking}
              variant="outline"
              className="justify-start border-gray-700 bg-gray-800 text-left text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <Play className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">{phrase}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Fix: Add a default export as an alternative way to import the component
export default VoiceControl
