import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)


export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    const isVercelCron = request.headers.get('x-vercel-cron') === '1'
    const isManual = authHeader === `Bearer ${process.env.CRON_SECRET}`

    console.log('Auth header:', authHeader, 'CRON_SECRET:', process.env.CRON_SECRET)

    if (!isVercelCron && !isManual) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    console.log('Service key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)

    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')

    console.log('Users found:', users?.length, 'Error:', usersError)

    if (usersError || !users) {
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }
    

    let sent = 0
    let failed = 0

    for (const user of users) {
      if (!user.email) continue

      try {
        const { data: automations } = await supabase
          .from('automations')
          .select('*')
          .eq('user_id', user.id)

        const totalAutomations = automations?.length || 0
        const timeSaved = totalAutomations * 3
        const efficiencyScore = Math.min(totalAutomations * 10, 100)

        await resend.emails.send({
          from: 'FlowMate <hello@flowmateai.co.uk>',
          to: user.email,
          subject: '📊 Your Weekly FlowMate Digest',
          html: `
            <!DOCTYPE html>
            <html>
            <body style="margin: 0; padding: 0; background-color: #F0F4F8; font-family: Arial, sans-serif;">
              <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                
                <div style="background-color: #1B2A4A; border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 24px;">
                  <h1 style="color: white; font-size: 28px; margin: 0 0 8px 0;">FlowMate</h1>
                  <p style="color: #A0B4C8; font-size: 16px; margin: 0;">Your weekly automation digest</p>
                </div>

                <div style="background-color: white; border-radius: 16px; padding: 28px; margin-bottom: 24px;">
                  <h2 style="color: #1B2A4A; font-size: 22px; margin: 0 0 12px 0;">Good morning! 👋</h2>
                  <p style="color: #64748B; font-size: 16px; line-height: 1.6; margin: 0;">Here is your FlowMate summary for this week!</p>
                </div>

                <table width="100%" cellpadding="0" cellspacing="8" style="margin-bottom: 24px;">
                  <tr>
                    <td width="33%" style="background-color: white; border-radius: 12px; padding: 20px; text-align: center; border-top: 4px solid #2E75B6;">
                      <p style="color: #64748B; font-size: 11px; font-weight: 600; text-transform: uppercase; margin: 0 0 8px 0;">Efficiency Score</p>
                      <p style="color: #1B2A4A; font-size: 32px; font-weight: bold; margin: 0;">${efficiencyScore}<span style="font-size: 16px; color: #64748B;">/100</span></p>
                    </td>
                    <td width="33%" style="background-color: white; border-radius: 12px; padding: 20px; text-align: center; border-top: 4px solid #00897B;">
                      <p style="color: #64748B; font-size: 11px; font-weight: 600; text-transform: uppercase; margin: 0 0 8px 0;">Time Saved</p>
                      <p style="color: #1B2A4A; font-size: 32px; font-weight: bold; margin: 0;">${timeSaved}<span style="font-size: 16px; color: #64748B;">hrs</span></p>
                    </td>
                    <td width="33%" style="background-color: white; border-radius: 12px; padding: 20px; text-align: center; border-top: 4px solid #E65100;">
                      <p style="color: #64748B; font-size: 11px; font-weight: 600; text-transform: uppercase; margin: 0 0 8px 0;">Automations</p>
                      <p style="color: #1B2A4A; font-size: 32px; font-weight: bold; margin: 0;">${totalAutomations}</p>
                    </td>
                  </tr>
                </table>

                <div style="background-color: #1B2A4A; border-radius: 16px; padding: 28px; text-align: center; margin-bottom: 24px;">
                  <h2 style="color: white; font-size: 20px; margin: 0 0 12px 0;">Ready for new suggestions? ✨</h2>
                  <p style="color: #A0B4C8; font-size: 15px; margin: 0 0 24px 0;">Head to your dashboard to get this week's fresh automation suggestions.</p>
                  <a href="https://flowmateai.co.uk/dashboard" style="display: inline-block; background-color: #2E75B6; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 16px;">
                    Go to My Dashboard
                  </a>
                </div>

                <div style="text-align: center; padding: 20px;">
                  <p style="color: #94A3B8; font-size: 13px; margin: 0;">© 2026 FlowMate. flowmateai.co.uk</p>
                </div>

              </div>
            </body>
            </html>
          `
        })
        sent++
      } catch (e: any) {
        console.error('Failed to send to:', user.email, e.message)
        failed++
      }
    }

    return NextResponse.json({ success: true, sent, failed })

  } catch (error: any) {
    console.error('Cron error:', error.message, error)
    return NextResponse.json({ error: 'Failed to run digest: ' + error.message }, { status: 500 })
  }
}