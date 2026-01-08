"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Lock, Users, TrendingUp, Download, Calendar } from "lucide-react"

interface Response {
  id: string
  name: string
  email: string
  ageRange: string
  answers: number[]
  totalScore: number
  level: number
  type: string
  createdAt: string
}

interface Stats {
  total: number
  byType: Record<string, number>
  byAgeRange: Record<string, number>
  averageLevel: string
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [responses, setResponses] = useState<Response[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/responses", {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      })

      if (res.ok) {
        const data = await res.json()
        setResponses(data.responses)
        setStats(data.stats)
        setAuthenticated(true)
      } else {
        setError("Invalid password")
      }
    } catch (err) {
      setError("Failed to connect")
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Age Range", "Type", "Level", "Total Score", "Date"]
    const rows = responses.map((r) => [
      r.name,
      r.email,
      r.ageRange,
      r.type,
      r.level,
      r.totalScore,
      new Date(r.createdAt).toLocaleDateString(),
    ])

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `quiz-responses-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  // Login Screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600 mt-2">Enter password to access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-600 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? "Loading..." : "Access Dashboard"}
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            Default password: admin123 (change in .env)
          </p>
        </motion.div>
      </div>
    )
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Quiz responses and analytics</p>
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-600">
                  Total Responses
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {stats.total}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-600">
                  Average Level
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {stats.averageLevel} / 10
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 shadow-sm text-white col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-medium">
                  Most Common Type
                </span>
              </div>
              <div className="flex items-center gap-4">
                {Object.entries(stats.byType)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 3)
                  .map(([type, count]) => (
                    <div key={type} className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{type}</span>
                      <span className="text-sm opacity-90">({count})</span>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Charts Section */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          >
            {/* By Type */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Distribution by Type
              </h3>
              <div className="space-y-3">
                {Object.entries(stats.byType).map(([type, count]) => {
                  const percentage = (count / stats.total) * 100
                  return (
                    <div key={type}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{type}</span>
                        <span className="text-gray-600">
                          {count} ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* By Age Range */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Distribution by Age
              </h3>
              <div className="space-y-3">
                {Object.entries(stats.byAgeRange).map(([age, count]) => {
                  const percentage = (count / stats.total) * 100
                  return (
                    <div key={age}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{age}</span>
                        <span className="text-gray-600">
                          {count} ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className="h-full bg-gradient-to-r from-blue-600 to-cyan-600"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Responses Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">All Responses</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {responses.map((response, index) => (
                  <motion.tr
                    key={response.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {response.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {response.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {response.ageRange}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        {response.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {response.level} / 10
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(response.createdAt).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
