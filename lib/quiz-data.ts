export interface QuizQuestion {
  id: number
  title: string
  scenario: string
  options: {
    label: string
    value: number // 1-4 points
  }[]
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    title: "You Notice a Problem",
    scenario: "You keep running into a small but annoying problem in daily life. Someone mentions, \"I'd pay for a solution to that.\"",
    options: [
      { label: "Ignore it and move on", value: 1 },
      { label: "Complain about it to friends", value: 2 },
      { label: "Think about how it could be fixed", value: 3 },
      { label: "Try a small experiment to improve it", value: 4 },
    ],
  },
  {
    id: 2,
    title: "A New Idea Excites You",
    scenario: "You get a new idea that feels exciting at first.",
    options: [
      { label: "The excitement fades quickly", value: 1 },
      { label: "You talk about it more than you work on it", value: 2 },
      { label: "You take a few small steps", value: 3 },
      { label: "You turn it into a real project", value: 4 },
    ],
  },
  {
    id: 3,
    title: "You Don't Know What to Do Next",
    scenario: "You want to move forward, but you're not sure what the next step is.",
    options: [
      { label: "Wait until things feel clearer", value: 1 },
      { label: "Google and watch videos for a long time", value: 2 },
      { label: "Try something small and see what happens", value: 3 },
      { label: "Ask someone and act on what you learn", value: 4 },
    ],
  },
  {
    id: 4,
    title: "First Feedback",
    scenario: "You show your idea or work to someone, and they say: \"I don't really get it.\"",
    options: [
      { label: "Feel discouraged and stop", value: 1 },
      { label: "Defend your idea", value: 2 },
      { label: "Ask what confused them", value: 3 },
      { label: "Improve it using their feedback", value: 4 },
    ],
  },
  {
    id: 5,
    title: "It's Harder Than Expected",
    scenario: "You start something, but progress is slower than you hoped.",
    options: [
      { label: "You quit", value: 1 },
      { label: "You push harder but feel frustrated", value: 2 },
      { label: "You adjust your approach", value: 3 },
      { label: "You find smarter ways to move forward", value: 4 },
    ],
  },
  {
    id: 6,
    title: "Something Fails",
    scenario: "You try something and it doesn't work at all.",
    options: [
      { label: "Take it personally", value: 1 },
      { label: "Avoid trying again", value: 2 },
      { label: "Think about what went wrong", value: 3 },
      { label: "Try again differently", value: 4 },
    ],
  },
  {
    id: 7,
    title: "Too Much to Do",
    scenario: "You have more tasks than time.",
    options: [
      { label: "Try to do everything yourself", value: 1 },
      { label: "Work longer hours", value: 2 },
      { label: "Focus on the most important things", value: 3 },
      { label: "Find tools or help to make it easier", value: 4 },
    ],
  },
  {
    id: 8,
    title: "Looking Ahead",
    scenario: "You think about the next few years of your life.",
    options: [
      { label: "\"I'll figure it out later.\"", value: 1 },
      { label: "\"I just want things to be stable.\"", value: 2 },
      { label: "\"I want to keep learning and growing.\"", value: 3 },
      { label: "\"I want to build something meaningful.\"", value: 4 },
    ],
  },
]

export interface EntrepreneurType {
  name: string
  emoji: string
  range: [number, number] // min and max score
  description: string
  strengths: string[]
  focusArea: string
  nextStep: string
  color: string
}

export const entrepreneurTypes: EntrepreneurType[] = [
  {
    name: "Explorer",
    emoji: "🌱",
    range: [1, 3],
    description: "You're curious, but you haven't practiced turning ideas into action yet.",
    strengths: ["Noticing problems", "Thinking about possibilities"],
    focusArea: "Trying small things without pressure",
    nextStep: "Do one tiny experiment this week. No pressure, just learning.",
    color: "from-green-400 to-emerald-500",
  },
  {
    name: "Builder",
    emoji: "🔧",
    range: [4, 6],
    description: "You take action and learn by doing. You're already building useful skills.",
    strengths: ["Taking action", "Learning from experience"],
    focusArea: "Finishing what you start and learning from feedback faster",
    nextStep: "Pick one project and stick with it for 14 days.",
    color: "from-blue-400 to-cyan-500",
  },
  {
    name: "Growth Builder",
    emoji: "🚀",
    range: [7, 8],
    description: "You're comfortable learning, adapting, and pushing forward.",
    strengths: ["Adapting quickly", "Working through challenges"],
    focusArea: "Working smarter, not harder. Getting help and using tools.",
    nextStep: "Share your work early and often.",
    color: "from-purple-400 to-pink-500",
  },
  {
    name: "Creator",
    emoji: "🌍",
    range: [9, 10],
    description: "You think long-term and enjoy creating things that matter.",
    strengths: ["Strategic thinking", "Building systems that scale"],
    focusArea: "Staying connected to learning and helping others grow",
    nextStep: "Teach or mentor someone one step behind you.",
    color: "from-amber-400 to-orange-500",
  },
]

export const ageRanges = [
  "Under 18",
  "18-25",
  "25-34",
  "35-44",
  "45-54",
  "55+",
]

export const confidenceMessages = [
  "Everyone starts somewhere.",
  "This isn't a label — it's a snapshot.",
  "You can grow this.",
]

export const progressMessages = [
  { range: [1, 2], message: "You're just getting started 🌱" },
  { range: [3, 4], message: "Nice momentum." },
  { range: [5, 6], message: "You're more than halfway there." },
  { range: [7, 7], message: "Almost done." },
  { range: [8, 8], message: "Last one — you've got this." },
]

export function calculateScore(answers: number[]): { totalScore: number; level: number; type: EntrepreneurType } {
  const totalScore = answers.reduce((sum, answer) => sum + answer, 0)
  const level = parseFloat((((totalScore - 8) / 24) * 9 + 1).toFixed(1))

  const type = entrepreneurTypes.find(
    t => level >= t.range[0] && level <= t.range[1]
  ) || entrepreneurTypes[0]

  return { totalScore, level, type }
}
