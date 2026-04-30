'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../supabase'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [gmailConnected, setGmailConnected] = useState(false)
  const [suggestion, setSuggestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [automationsAccepted, setAutomationsAccepted] = useState(0)
  const [accepted, setAccepted] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user?.app_metadata?.providers?.includes('google')) {
        setGmailConnected(true)
      }
      if (user?.id) {
        const { data: automations } = await supabase
          .from('automations')
          .select('*')
          .eq('user_id', user.id)
        if (automations && automations.length > 0) {
          setAutomationsAccepted(automations.length)
        }
      }
    }
    getUser()
  }, [])

  const connectGmail = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/gmail.readonly',
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })
  }

  const getSuggestion = async () => {
    setLoading(true)
    setSuggestion('')
    setAccepted(false)
    try {
      const gmailRes = await fetch('/api/gmail')
      const gmailData = await gmailRes.json()
      if (gmailData.error) {
        setSuggestion('Could not fetch emails. Please reconnect Gmail.')
        setLoading(false)
        return
      }
      const suggestRes = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailPatterns: gmailData.patterns })
      })
      const suggestData = await suggestRes.json()
      setSuggestion(suggestData.suggestion || 'No suggestion generated.')
    } catch (error) {
      setSuggestion('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  const acceptAutomation = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    console.log('Session user ID:', session?.user?.id)
    console.log('Suggestion:', suggestion)

    const { data, error } = await supabase.from('automations').insert({
      user_id: session?.user?.id,
      suggestion: suggestion,
      accepted_at: new Date().toISOString()
    })

    console.log('Insert result:', data, 'Error:', error)

    setAutomationsAccepted(prev => prev + 1)
    setAccepted(true)
  }
  

  const efficiencyScore = Math.min(automationsAccepted * 10, 100)
  const timeSaved = automationsAccepted * 3

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0F4F8', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Navbar */}
      <nav style={{ backgroundColor: '#1B2A4A', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="48" height="32" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 2 L4 26" stroke="white" strokeWidth="3" strokeLinecap="round"/>
  <path d="M4 2 L18 2" stroke="white" strokeWidth="3" strokeLinecap="round"/>
  <path d="M4 13 L15 13" stroke="white" strokeWidth="3" strokeLinecap="round"/>
  <path d="M4 26 Q4 32 11 32 Q18 32 18 26" stroke="#4A9FD4" strokeWidth="3" strokeLinecap="round"/>
  <path d="M18 26 L18 2" stroke="white" strokeWidth="3" strokeLinecap="round"/>
  <path d="M18 2 L30 18" stroke="white" strokeWidth="3" strokeLinecap="round"/>
  <path d="M30 18 L42 2" stroke="white" strokeWidth="3" strokeLinecap="round"/>
  <path d="M42 2 L42 26" stroke="white" strokeWidth="3" strokeLinecap="round"/>
</svg>
<span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px', letterSpacing: '-0.5px', marginLeft: '8px' }}>FlowMate</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
  <div style={{ width: '36px', height: '36px', backgroundColor: '#2E75B6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>{user?.email?.[0]?.toUpperCase() || 'U'}</span>
  </div>
  <span style={{ color: '#A0B4C8', fontSize: '14px' }}>{user?.email || 'Loading...'}</span>
  <button
    onClick={async () => { await supabase.auth.signOut(); window.location.href = '/' }}
    style={{ padding: '8px 16px', backgroundColor: 'transparent', color: '#A0B4C8', border: '1px solid #2E3F5C', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}
  >
    Log out
  </button>
</div>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* Welcome Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ color: '#1B2A4A', fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
            Good afternoon! 👋
          </h1>
          <p style={{ color: '#64748B', fontSize: '16px', margin: 0 }}>
            Here is your automation overview for today.
          </p>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
          
          {/* Efficiency Score */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderTop: '4px solid #2E75B6' }}>
            <p style={{ color: '#64748B', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px 0' }}>Efficiency Score</p>
            <p style={{ color: '#1B2A4A', fontSize: '42px', fontWeight: 'bold', margin: '0 0 4px 0' }}>{efficiencyScore}<span style={{ fontSize: '20px', color: '#64748B' }}>/100</span></p>
            <p style={{ color: '#2E75B6', fontSize: '13px', margin: 0 }}>Accept automations to increase</p>
          </div>

          {/* Time Saved */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderTop: '4px solid #00897B' }}>
            <p style={{ color: '#64748B', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px 0' }}>Time Saved</p>
            <p style={{ color: '#1B2A4A', fontSize: '42px', fontWeight: 'bold', margin: '0 0 4px 0' }}>{timeSaved}<span style={{ fontSize: '20px', color: '#64748B' }}>hrs</span></p>
            <p style={{ color: '#00897B', fontSize: '13px', margin: 0 }}>This month</p>
          </div>

          {/* Automations Running */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderTop: '4px solid #E65100' }}>
            <p style={{ color: '#64748B', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px 0' }}>Automations</p>
            <p style={{ color: '#1B2A4A', fontSize: '42px', fontWeight: 'bold', margin: '0 0 4px 0' }}>{automationsAccepted}</p>
            <p style={{ color: '#E65100', fontSize: '13px', margin: 0 }}>Currently running</p>
          </div>
        </div>

        {/* Gmail Connection Card */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h2 style={{ color: '#1B2A4A', fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0' }}>📧 Gmail Connection</h2>
              <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>Connect your Gmail so FlowMate can detect automation opportunities</p>
            </div>
            {gmailConnected && (
              <span style={{ backgroundColor: '#E8F5E9', color: '#00897B', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
                ✅ Connected
              </span>
            )}
          </div>

          {gmailConnected ? (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={getSuggestion}
                disabled={loading}
                style={{ padding: '12px 24px', backgroundColor: loading ? '#94A3B8' : '#2E75B6', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '600', transition: 'all 0.2s' }}
              >
                {loading ? '🤖 Analysing your emails...' : '✨ Get Automation Suggestion'}
              </button>
              <button
                onClick={connectGmail}
                style={{ padding: '12px 24px', backgroundColor: 'transparent', color: '#64748B', border: '1px solid #E2E8F0', borderRadius: '10px', fontSize: '15px', cursor: 'pointer' }}
              >
                🔄 Reconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connectGmail}
              style={{ padding: '12px 24px', backgroundColor: '#1B2A4A', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', cursor: 'pointer', fontWeight: '600' }}
            >
              Connect Gmail
            </button>
          )}
        </div>

        {/* Suggestion Card */}
        {suggestion && (
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '24px', borderLeft: '5px solid #2E75B6' }}>
            <h2 style={{ color: '#2E75B6', fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0' }}>💡 Automation Suggestion</h2>
            <p style={{ color: '#1B2A4A', fontSize: '16px', lineHeight: '1.7', margin: '0 0 24px 0' }}>{suggestion}</p>
            {!accepted ? (
              <button
                onClick={acceptAutomation}
                style={{ padding: '12px 28px', backgroundColor: '#00897B', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', cursor: 'pointer', fontWeight: '600' }}
              >
                ✅ Accept This Automation
              </button>
            ) : (
              <div style={{ backgroundColor: '#E8F5E9', padding: '12px 20px', borderRadius: '10px', color: '#00897B', fontWeight: '600', display: 'inline-block' }}>
                🎉 Automation accepted! Your Efficiency Score has increased.
              </div>
            )}
          </div>
        )}

        {/* Ghost Mode Card */}
        <div style={{ backgroundColor: '#1B2A4A', borderRadius: '16px', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0' }}>👻 Ghost Mode Active</h2>
          <p style={{ color: '#A0B4C8', fontSize: '14px', margin: 0, lineHeight: '1.6' }}>
            FlowMate is quietly observing your email patterns in the background. The more you use your email, the smarter the suggestions become. Check back regularly for new automation opportunities tailored specifically to how you work.
          </p>
        </div>
        {/* Feedback Card */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginTop: '24px', borderLeft: '5px solid #00897B' }}>
          <h2 style={{ color: '#00897B', fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0' }}>💬 Share Your Feedback</h2>
          <p style={{ color: '#64748B', fontSize: '14px', margin: '0 0 20px 0', lineHeight: '1.6' }}>
            You are one of FlowMate's first ever users! Your feedback directly shapes what we build next. It takes less than 2 minutes.
          </p>
          
            <a href="https://tally.so/r/ZjPjB5"
            target="_blank"
            style={{ display: 'inline-block', padding: '12px 24px', backgroundColor: '#00897B', color: 'white', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}
          >
            Give Feedback 
          </a>
        </div>
      </div>
    </div>
  )
}