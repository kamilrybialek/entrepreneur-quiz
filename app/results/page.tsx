"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { calculateScore, confidenceMessages, type EntrepreneurType } from "@/lib/quiz-data"
import { Share2, Download, RotateCcw, Sparkles } from "lucide-react"
import Link from "next/link"

function ResultsContent() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<{
    level: number
    type: EntrepreneurType
    totalScore: number
  } | null>(null)
  const [userData, setUserData] = useState<{
    name: string
    email: string
    ageRange: string
  } | null>(null)
  const [saved, setSaved] = useState(false)
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const name = searchParams.get("name")
    const email = searchParams.get("email")
    const ageRange = searchParams.get("ageRange")
    const answersStr = searchParams.get("answers")

    if (name && email && ageRange && answersStr) {
      try {
        const answers = JSON.parse(answersStr) as number[]
        const calculatedResult = calculateScore(answers)

        setResult(calculatedResult)
        setUserData({ name, email, ageRange })

        // Animate through confidence messages
        let index = 0
        const interval = setInterval(() => {
          index = (index + 1) % confidenceMessages.length
          setMessageIndex(index)
        }, 1500)

        // Save to database
        fetch("/api/responses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            ageRange,
            answers,
            totalScore: calculatedResult.totalScore,
            level: calculatedResult.level,
            type: calculatedResult.type.name,
          }),
        })
          .then(() => setSaved(true))
          .catch((err) => console.error("Failed to save:", err))

        setTimeout(() => {
          clearInterval(interval)
          setLoading(false)
        }, 3000)
      } catch (error) {
        console.error("Error parsing answers:", error)
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [searchParams])

  const handleShare = async () => {
    const shareText = `I just took a quiz about how I approach ideas and growth. Turns out I'm a ${result?.type.name} ${result?.type.emoji}\n\nEveryone can build — this is my starting point.\n\nTry it here: ${window.location.origin}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Builder Type",
          text: shareText,
        })
      } catch (err) {
        console.log("Share cancelled")
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText)
      alert("Copied to clipboard!")
    }
  }

  const getConfidenceBoostMessage = () => {
    if (!result) return ""

    if (result.level <= 3) {
      return "This does NOT mean you're behind. It means you haven't practiced these skills yet — and that's completely normal."
    } else if (result.level <= 6) {
      return "You're already doing things many people never try."
    } else {
      return "You've built strong habits — and there's still room to grow."
    }
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-6xl mb-6"
          >
            {["🌱", "✨", "⭐"][messageIndex % 3]}
          </motion.div>
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xl font-medium text-gray-700"
          >
            {confidenceMessages[messageIndex]}
          </motion.p>
        </motion.div>
      </div>
    )
  }

  // Error State
  if (!result || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Oops! Something went wrong
          </h1>
          <Link
            href="/"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Go back home
          </Link>
        </div>
      </div>
    )
  }

  // Results Display
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-purple-700 font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Your Results</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Hey {userData.name}! 👋
          </h1>
        </motion.div>

        {/* Main Result Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-6"
        >
          {/* Type Badge */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className={`w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br ${result.type.color} flex items-center justify-center text-5xl shadow-lg`}
            >
              {result.type.emoji}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-3xl font-bold text-gray-900 mb-2"
            >
              Your Style: {result.type.name}
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="inline-block px-4 py-2 bg-gray-100 rounded-full"
            >
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Level: {result.level} / 10
              </span>
            </motion.div>
          </div>

          {/* Confidence Boost */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 mb-8"
          >
            <p className="text-purple-900 font-medium text-center">
              {getConfidenceBoostMessage()}
            </p>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-lg text-gray-700 mb-8 text-center leading-relaxed"
          >
            {result.type.description}
          </motion.p>

          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mb-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              You're naturally good at:
            </h3>
            <ul className="space-y-2">
              {result.type.strengths.map((strength, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600" />
                  <span className="text-gray-700">{strength}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Focus Area */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mb-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Your growth focus:
            </h3>
            <p className="text-gray-700 bg-gray-50 rounded-xl p-4">
              {result.type.focusArea}
            </p>
          </motion.div>

          {/* Next Step */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white"
          >
            <h3 className="text-xl font-bold mb-2">Your next step (this week):</h3>
            <p className="text-lg">{result.type.nextStep}</p>
          </motion.div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-purple-300 hover:bg-purple-50 transition-all"
          >
            <Share2 className="w-5 h-5" />
            Share Results
          </button>
          <Link href="/" className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-purple-300 hover:bg-purple-50 transition-all">
              <RotateCcw className="w-5 h-5" />
              Retake Quiz
            </button>
          </Link>
        </motion.div>

        {/* Retake Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="text-center text-sm text-gray-500 mt-6"
        >
          You can retake this anytime. Most people score higher after trying just one small project.
        </motion.p>
      </div>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}
