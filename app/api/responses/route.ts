import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, ageRange, answers, totalScore, level, type } = body

    // Validate required fields
    if (!name || !email || !ageRange || !answers || !totalScore || !level || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Save to database
    const response = await prisma.quizResponse.create({
      data: {
        name,
        email,
        ageRange,
        answers,
        totalScore,
        level,
        type,
      },
    })

    return NextResponse.json({ success: true, id: response.id })
  } catch (error) {
    console.error("Error saving response:", error)
    return NextResponse.json(
      { error: "Failed to save response" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Simple auth check - in production, use proper authentication
    const authHeader = request.headers.get("authorization")
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123"

    if (authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get all responses
    const responses = await prisma.quizResponse.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

    // Calculate statistics
    const stats = {
      total: responses.length,
      byType: responses.reduce((acc, r) => {
        acc[r.type] = (acc[r.type] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      byAgeRange: responses.reduce((acc, r) => {
        acc[r.ageRange] = (acc[r.ageRange] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      averageLevel: responses.length > 0
        ? (responses.reduce((sum, r) => sum + r.level, 0) / responses.length).toFixed(1)
        : 0,
    }

    return NextResponse.json({ responses, stats })
  } catch (error) {
    console.error("Error fetching responses:", error)
    return NextResponse.json(
      { error: "Failed to fetch responses" },
      { status: 500 }
    )
  }
}
