"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { quizQuestions, progressMessages, ageRanges } from "@/lib/quiz-data"
import { Check } from "lucide-react"

export default function QuizPage() {
  const router = useRouter()
  const [stage, setStage] = useState<"info" | "quiz" | "confidence">("info")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showConfidenceBoost, setShowConfidenceBoost] = useState(false)

  // User info
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [ageRange, setAgeRange] = useState("")

  const currentProgressMessage = progressMessages.find(
    (msg) =>
      currentQuestion + 1 >= msg.range[0] && currentQuestion + 1 <= msg.range[1]
  )?.message

  const handleUserInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && email && ageRange) {
      setStage("quiz")
    }
  }

  const handleAnswerSelect = (value: number) => {
    setSelectedAnswer(value)

    // Animate and proceed
    setTimeout(() => {
      const newAnswers = [...answers, value]
      setAnswers(newAnswers)

      // Show confidence boost after question 4
      if (currentQuestion === 3 && !showConfidenceBoost) {
        setStage("confidence")
        setShowConfidenceBoost(true)
        setTimeout(() => {
          setStage("quiz")
          setCurrentQuestion(currentQuestion + 1)
          setSelectedAnswer(null)
        }, 2500)
      } else if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
      } else {
        // Quiz completed, navigate to results
        const searchParams = new URLSearchParams({
          name,
          email,
          ageRange,
          answers: JSON.stringify(newAnswers),
        })
        router.push(`/results?${searchParams.toString()}`)
      }
    }, 600)
  }

  // User Info Stage
  if (stage === "info") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="text-5xl mb-4">👋</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Let's get started!
            </h1>
            <p className="text-gray-600">
              Just a few quick details before we begin
            </p>
          </motion.div>

          <form onSubmit={handleUserInfoSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age Range
              </label>
              <select
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition appearance-none bg-white"
              >
                <option value="">Select your age range</option>
                {ageRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              Start Quiz
            </button>

            <p className="text-xs text-gray-500 text-center">
              Your information is kept private and secure
            </p>
          </form>
        </motion.div>
      </div>
    )
  }

  // Confidence Boost Stage
  if (stage === "confidence") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.6 }}
            className="text-6xl mb-6"
          >
            ✨
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl font-medium text-gray-700 max-w-md"
          >
            Quick reminder: this quiz is about learning how you think — not
            judging you.
          </motion.p>
        </motion.div>
      </div>
    )
  }

  // Quiz Stage
  const question = quizQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </span>
            <span className="text-sm font-medium text-purple-600">
              {currentProgressMessage}
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {question.title}
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {question.scenario}
              </p>

              <div className="text-xs text-gray-500 mb-6 text-center">
                What do you do?
              </div>

              <div className="space-y-3">
                {question.options.map((option, index) => {
                  const isSelected = selectedAnswer === option.value
                  return (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      onClick={() => handleAnswerSelect(option.value)}
                      disabled={selectedAnswer !== null}
                      className={`w-full p-5 text-left rounded-xl border-2 transition-all duration-300 ${
                        isSelected
                          ? "border-purple-600 bg-purple-50 shadow-md scale-[1.02]"
                          : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                      } ${selectedAnswer !== null ? "cursor-not-allowed" : "cursor-pointer"} disabled:opacity-70`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800">
                          {option.label}
                        </span>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center"
                          >
                            <Check className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-sm text-gray-500 text-center mt-8"
              >
                {["Nice choice.", "Got it.", "Interesting.", "Thanks for sharing."][
                  Math.floor(Math.random() * 4)
                ]}
              </motion.p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
