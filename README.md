# Entrepreneur Quiz - What Kind of Builder Are You?

A beautiful, interactive personality quiz to help people discover their entrepreneurial style. Built with Next.js 14, TypeScript, Framer Motion, and PostgreSQL.

## Features

- 🎯 **8 Scenario-Based Questions** - Playful, relatable scenarios instead of abstract self-assessment
- ✨ **Smooth Animations** - Micro-interactions and progress feedback with Framer Motion
- 📊 **4 Personality Types** - Explorer, Builder, Growth Builder, and Creator
- 🎨 **Beautiful UI** - Gradient backgrounds, rounded corners, and modern design
- 📱 **Fully Responsive** - Works perfectly on mobile and desktop
- 💾 **Data Collection** - Saves responses to PostgreSQL database
- 📈 **Admin Dashboard** - View stats, export data to CSV
- 🔗 **Shareable Results** - Users can share their builder type on social media
- 🎉 **Motivational Messaging** - Confidence boost messages and encouraging copy

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Database:** PostgreSQL with Prisma ORM
- **Icons:** Lucide React
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or use Vercel Postgres)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/entrepreneur-quiz.git
cd entrepreneur-quiz
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/entrepreneur_quiz?schema=public"
ADMIN_PASSWORD="your-secure-password"
```

4. **Set up the database**

```bash
npx prisma generate
npx prisma db push
```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
entrepreneur-quiz/
├── app/
│   ├── page.tsx              # Landing page
│   ├── quiz/
│   │   └── page.tsx          # Quiz page with questions
│   ├── results/
│   │   └── page.tsx          # Results page
│   ├── admin/
│   │   └── page.tsx          # Admin dashboard
│   └── api/
│       └── responses/
│           └── route.ts      # API for saving/fetching responses
├── components/               # Reusable components (if any)
├── lib/
│   ├── utils.ts             # Utility functions
│   ├── prisma.ts            # Prisma client
│   └── quiz-data.ts         # Quiz questions and scoring logic
├── prisma/
│   └── schema.prisma        # Database schema
└── public/                  # Static assets
```

## Quiz Flow

1. **Landing Page** - Hero section with call-to-action
2. **User Info Collection** - Name, email, age range
3. **Quiz (8 Questions)** - Scenario-based questions with animations
4. **Confidence Boost** - Motivational message after question 4
5. **Results** - Personalized results with type, level, strengths, and next steps
6. **Share** - Option to share results or retake quiz

## Admin Dashboard

Access the admin dashboard at `/admin`:

- **Default Password:** Set via `ADMIN_PASSWORD` environment variable
- **Features:**
  - View total responses
  - See average level and type distribution
  - Age range demographics
  - Export all data to CSV
  - View detailed table of all responses

## Deploying to Vercel

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial commit - Entrepreneur Quiz"
git branch -M main
git remote add origin https://github.com/yourusername/entrepreneur-quiz.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure environment variables:
   - `DATABASE_URL` - Your PostgreSQL connection string (use Vercel Postgres for easy setup)
   - `ADMIN_PASSWORD` - Your admin panel password
5. Click "Deploy"

### Step 3: Set up Database

**Option A: Use Vercel Postgres (Recommended)**

1. In your Vercel project, go to Storage tab
2. Create a new Postgres database
3. Copy the connection string to `DATABASE_URL`
4. Run migrations:

```bash
npx prisma db push
```

**Option B: Use your own PostgreSQL database**

1. Set `DATABASE_URL` in Vercel environment variables
2. Run migrations from your local machine

### Step 4: Test Your Deployment

1. Visit your Vercel URL
2. Complete a quiz to test data collection
3. Visit `/admin` to verify admin panel works

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `ADMIN_PASSWORD` | Password for admin dashboard | Yes |

## Customization

### Changing Quiz Questions

Edit `lib/quiz-data.ts`:

```typescript
export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    title: "Your Question Title",
    scenario: "Your scenario description...",
    options: [
      { label: "Option A", value: 1 },
      { label: "Option B", value: 2 },
      { label: "Option C", value: 3 },
      { label: "Option D", value: 4 },
    ],
  },
  // Add more questions...
]
```

### Changing Entrepreneur Types

Edit the `entrepreneurTypes` array in `lib/quiz-data.ts`:

```typescript
export const entrepreneurTypes: EntrepreneurType[] = [
  {
    name: "Your Type",
    emoji: "🌟",
    range: [1, 3], // Score range
    description: "Your description...",
    strengths: ["Strength 1", "Strength 2"],
    focusArea: "What to focus on...",
    nextStep: "Next actionable step...",
    color: "from-blue-400 to-cyan-500", // Tailwind gradient
  },
]
```

## Database Schema

```prisma
model QuizResponse {
  id         String   @id @default(cuid())
  createdAt  DateTime @default(now())
  name       String
  email      String
  ageRange   String
  answers    Json
  totalScore Int
  level      Float
  type       String
}
```

## API Endpoints

### POST `/api/responses`

Save a quiz response

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "ageRange": "25-34",
  "answers": [3, 4, 2, 3, 4, 3, 3, 4],
  "totalScore": 26,
  "level": 7.5,
  "type": "Growth Builder"
}
```

### GET `/api/responses`

Get all responses (requires authentication)

**Headers:**
```
Authorization: Bearer YOUR_ADMIN_PASSWORD
```

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

Built with ❤️ using Next.js and TypeScript
