import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST() {
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

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Get user's automations
    const { data: automations } = await supabase
      .from('automations')
      .select('*')
      .eq('user_id', user.id)

    const totalAutomations = automations?.length || 0
    const timeSaved = totalAutomations * 3
    const efficiencyScore = Math.min(totalAutomations * 10, 100)

    // Send the digest email
    await resend.emails.send({
      from: 'FlowMate <onboarding@resend.dev>',
      to: user.email!,
      subject: '📊 Your Weekly FlowMate Digest',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="margin: 0; padding: 0; background-color: #F0F4F8; font-family: Arial, sans-serif;">
          
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            
            <!-- Header -->
            <div style="background-color: #1B2A4A; borderRadius: 16px; padding: 32px; text-align: center; margin-bottom: 24px; border-radius: 16px;">
              <h1 style="color: white; font-size: 28px; margin: 0 0 8px 0;">FlowMate</h1>
              <p style="color: #A0B4C8; font-size: 16px; margin: 0;">Your weekly automation digest</p>
            </div>

            <!-- Greeting -->
            <div style="background-color: white; border-radius: 16px; padding: 28px; margin-bottom: 24px;">
              <h2 style="color: #1B2A4A; font-size: 22px; margin: 0 0 12px 0;">Good morning! 👋</h2>
              <p style="color: #64748B; font-size: 16px; line-height: 1.6; margin: 0;">
                Here is your FlowMate summary for this week. You are making great progress!
              </p>
            </div>

            <!-- Stats -->
            <div style="display: grid; margin-bottom: 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="32%" style="padding-right: 8px;">
                    <div style="background-color: white; border-radius: 12px; padding: 20px; text-align: center; border-top: 4px solid #2E75B6;">
                      <p style="color: #64748B; font-size: 11px; font-weight: 600; text-transform: uppercase; margin: 0 0 8px 0;">Efficiency Score</p>
                      <p style="color: #1B2A4A; font-size: 32px; font-weight: bold; margin: 0;">${efficiencyScore}<span style="font-size: 16px; color: #64748B;">/100</span></p>
                    </div>
                  </td>
                  <td width="32%" style="padding: 0 4px;">
                    <div style="background-color: white; border-radius: 12px; padding: 20px; text-align: center; border-top: 4px solid #00897B;">
                      <p style="color: #64748B; font-size: 11px; font-weight: 600; text-transform: uppercase; margin: 0 0 8px 0;">Time Saved</p>
                      <p style="color: #1B2A4A; font-size: 32px; font-weight: bold; margin: 0;">${timeSaved}<span style="font-size: 16px; color: #64748B;">hrs</span></p>
                    </div>
                  </td>
                  <td width="32%" style="padding-left: 8px;">
                    <div style="background-color: white; border-radius: 12px; padding: 20px; text-align: center; border-top: 4px solid #E65100;">
                      <p style="color: #64748B; font-size: 11px; font-weight: 600; text-transform: uppercase; margin: 0 0 8px 0;">Automations</p>
                      <p style="color: #1B2A4A; font-size: 32px; font-weight: bold; margin: 0;">${totalAutomations}</p>
                    </div>
                  </td>
                </tr>
              </table>
            </div>

            <!-- CTA -->
            <div style="background-color: #1B2A4A; border-radius: 16px; padding: 28px; text-align: center; margin-bottom: 24px;">
              <h2 style="color: white; font-size: 20px; margin: 0 0 12px 0;">Ready for new suggestions? ✨</h2>
              <p style="color: #A0B4C8; font-size: 15px; margin: 0 0 24px 0;">
                Head to your dashboard to get this week's fresh automation suggestions based on your latest email patterns.
              </p>
              <a href="https://flowmate-nine.vercel.app/dashboard" 
                style="display: inline-block; background-color: #2E75B6; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 16px;">
                Go to My Dashboard →
              </a>
            </div>

            <!-- Footer -->
            <div style="text-align: center; padding: 20px;">
              <p style="color: #94A3B8; font-size: 13px; margin: 0;">
                © 2026 FlowMate. You are receiving this because you have a FlowMate account.
              </p>
            </div>

          </div>
        </body>
        </html>
      `
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Digest error:', error)
    return NextResponse.json({ error: 'Failed to send digest' }, { status: 500 })
  }
}