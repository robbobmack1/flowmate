import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

async function getValidToken(session: any): Promise<string | null> {
  // Try the provider token first
  if (session?.provider_token) {
    return session.provider_token
  }
  
  // Fall back to refresh token if available
  if (session?.provider_refresh_token) {
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          refresh_token: session.provider_refresh_token,
          grant_type: 'refresh_token',
        })
      })
      const data = await response.json()
      return data.access_token || null
    } catch {
      return null
    }
  }
  
  return null
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const enhanced = searchParams.get('enhanced') === 'true'
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
    
    const token = await getValidToken(session)
    
    if (!token) {
      return NextResponse.json({ error: 'No Gmail connection found' }, { status: 401 })
    }

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const dateFilter = thirtyDaysAgo.toISOString().split('T')[0].replace(/-/g, '/')

    const gmailResponse = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=after:${dateFilter}&maxResults=50`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    const gmailData = await gmailResponse.json()

    if (!gmailData.messages) {
      return NextResponse.json({ patterns: [], message: 'No emails found' })
    }

    const emailDetails = await Promise.all(
      gmailData.messages.slice(0, 20).map(async (msg: any) => {
        const detail = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=To&metadataHeaders=Subject`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        return detail.json()
      })
    )

   const patterns = emailDetails.map((email: any) => {
      const headers = email.payload?.headers || []
      const to = headers.find((h: any) => h.name === 'To')?.value || 'Unknown'
      const subject = headers.find((h: any) => h.name === 'Subject')?.value || 'No subject'
      
      let preview = ''
      if (enhanced && email.snippet) {
        preview = email.snippet.slice(0, 100)
      }
      
      return { to, subject, preview }
    })

    return NextResponse.json({ patterns })

  } catch (error) {
    console.error('Gmail fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 })
  }
}