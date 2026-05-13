import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { SESSION_COOKIE } from '@/lib/auth-constants'
import { verifySession } from '@/lib/jwt'
import { buildAnalyticsFromCsv, type AiInsights } from '@/lib/educator-analytics'

async function getGeminiInsights(csvSample: string): Promise<AiInsights | null> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return null
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `You are an education data analyst.
Read this CSV sample and infer metrics carefully using these units:
- attendance is percentage out of 100
- mst1 and mst2 are marks out of 20 (not percentage)
- overall_cgpa and previous_sem_scgpa are out of 10
- backlog_count is a count (integer)
Given this CSV sample of student scores and attendance, return ONLY strict JSON:
{+
  "classSummary": "string max 220 chars",
  "keyInsights": ["string", "string", "string"],
  "recommendations": ["string", "string", "string"]
}
Use only observable trends from the CSV. Keep insights practical, specific, concise, and numeric where possible.
No markdown. No extra keys. No code fences.
CSV sample:
${csvSample}`

  let text: string | undefined
  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 280,
        responseMimeType: 'application/json',
      },
    })
    text = result.response.text()
  } catch {
    return null
  }
  if (!text) return null

  const rawJson = text
    .replace(/^```json/i, '')
    .replace(/^```/, '')
    .replace(/```$/, '')
    .trim()

  try {
    const parsed = JSON.parse(rawJson) as Partial<AiInsights>
    if (
      typeof parsed.classSummary === 'string' &&
      Array.isArray(parsed.keyInsights) &&
      Array.isArray(parsed.recommendations)
    ) {
      return {
        classSummary: parsed.classSummary,
        keyInsights: parsed.keyInsights.map(v => String(v)).slice(0, 5),
        recommendations: parsed.recommendations.map(v => String(v)).slice(0, 5),
      }
    }
    return null
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE)?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const session = await verifySession(token)
    if (!session || session.role !== 'educator') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'CSV file is required' }, { status: 400 })
    }

    const fileName = file.name.toLowerCase()
    if (!fileName.endsWith('.csv')) {
      return NextResponse.json({ error: 'Only .csv files are supported right now' }, { status: 400 })
    }

    const csvText = await file.text()
    if (!csvText.trim()) {
      return NextResponse.json({ error: 'Uploaded file is empty' }, { status: 400 })
    }

    const analytics = buildAnalyticsFromCsv(csvText)
    const sample = csvText.split(/\r?\n/).slice(0, 25).join('\n')
    const ai = await getGeminiInsights(sample)

    if (ai) {
      analytics.ai = ai
    } else {
      analytics.ai = {
        classSummary:
          'Stats are generated from your CSV. Add GEMINI_API_KEY in .env for AI narrative insights.',
        keyInsights: [
          `Class average is ${analytics.overview.averagePerformance}% across ${analytics.overview.totalStudents} students.`,
          `${analytics.overview.atRiskStudents} students are flagged as high risk based on score and attendance.`,
          `${analytics.overview.topPerformers} students are currently in the top performer range (>75).`,
        ],
        recommendations: [
          'Focus intervention on students with attendance below 45%.',
          'Run weekly remediation for subjects with the lowest averages.',
          'Set personalized targets for medium-risk students before exams.',
        ],
      }
    }
    
    return NextResponse.json(analytics)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not process dataset'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

