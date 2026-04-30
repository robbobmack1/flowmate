import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { emailPatterns } = await request.json()

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are FlowMate, an AI that analyses email patterns and suggests 
          simple automations for small business owners. 
          Suggest ONE specific, practical automation based on the patterns provided.
          Keep it under 2 sentences. Be specific and friendly.
          Format: Start with what you noticed, then suggest the automation.`
        },
        {
          role: "user",
          content: `Based on these email patterns from my inbox: ${JSON.stringify(emailPatterns)}, 
          what is one automation that would save me the most time?`
        }
      ],
      max_tokens: 150,
    })

    const suggestion = completion.choices[0].message.content

    return NextResponse.json({ suggestion })

  } catch (error) {
    console.error('OpenAI error:', error)
    return NextResponse.json({ error: 'Failed to generate suggestion' }, { status: 500 })
  }
}