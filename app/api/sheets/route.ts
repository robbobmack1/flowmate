import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

async function getValidToken(session: any): Promise<string | null> {
  if (session?.provider_token) {
    return session.provider_token
  }
  
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
    
    const token = await getValidToken(session)
    
    if (!token) {
      return NextResponse.json({ error: 'No Google connection found' }, { status: 401 })
    }

    // Get list of spreadsheets from Google Drive
    const drivesResponse = await fetch(
      'https://www.googleapis.com/drive/v3/files?q=mimeType%3D%22application%2Fvnd.google-apps.spreadsheet%22&pageSize=10&fields=files(id,name,modifiedTime)',
      { headers: { Authorization: `Bearer ${token}` } }
    )

    const drivesData = await drivesResponse.json()

    if (!drivesData.files || drivesData.files.length === 0) {
      return NextResponse.json({ patterns: [], message: 'No spreadsheets found' })
    }

    // Get basic info about each spreadsheet
    const patterns = drivesData.files.map((file: any) => ({
      name: file.name,
      id: file.id,
      lastModified: file.modifiedTime
    }))

    return NextResponse.json({ patterns })

  } catch (error) {
    console.error('Sheets fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch sheets' }, { status: 500 })
  }
}