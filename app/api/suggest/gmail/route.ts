import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options))
          },
        },
      }
    )

    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.provider_token) {
      return NextResponse.json({ error: 'No Gmail connection found' }, { status: 401 })
    }

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const dateFilter = thirtyDaysAgo.toISOString().split('T')[0].replace(/-/g, '/')

    const gmailResponse = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=in:sent after:${dateFilter}&maxResults=50`,
      {
        headers: { Authorization: `Bearer ${session.provider_token}` }
      }
    )

    const gmailData = await gmailResponse.json()

    if (!gmailData.messages) {
      return NextResponse.json({ patterns: [], message: 'No emails found' })
    }

    const emailDetails = await Promise.all(
      gmailData.messages.slice(0, 20).map(async (msg: any) => {
        const detail = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=To&metadataHeaders=Subject`,
          {
            headers: { Authorization: `Bearer ${session.provider_token}` }
          }
        )
        return detail.json()
      })
    )

    const patterns = emailDetails.map((email: any) => {
      const headers = email.payload?.headers || []
      const to = headers.find((h: any) => h.name === 'To')?.value || 'Unknown'
      const subject = headers.find((h: any) => h.name === 'Subject')?.value || 'No subject'
      return { to, subject }
    })

    return NextResponse.json({ patterns })

  } catch (error) {
    console.error('Gmail fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 })
  }
}