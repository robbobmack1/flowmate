'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../supabase'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [gmailConnected, setGmailConnected] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [accepted, setAccepted] = useState<number[]>([])
  const [sheetsSuggestions, setSheetsSuggestions] = useState<string[]>([])
  const [sheetsLoading, setSheetsLoading] = useState(false)
  const [sheetsAccepted, setSheetsAccepted] = useState<number[]>([])
  const [automationsAccepted, setAutomationsAccepted] = useState(0)
  const [enhancedMode, setEnhancedMode] = useState(false)
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
        const { data: prefs } = await supabase
          .from('preferences')
          .select('*')
          .eq('user_id', user.id)
          .single()
        if (prefs) {
          setEnhancedMode(prefs.enhanced_mode)
        }
      }
    }
    getUser()
  }, [])

  const connectGmail = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/spreadsheets.readonly',
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })
  }

  const getSuggestions = async () => {
    setLoading(true)
    setSuggestions([])
    setAccepted([])
    try {
      const gmailRes = await fetch(`/api/gmail?enhanced=${enhancedMode}`)
      const gmailData = await gmailRes.json()
      if (gmailData.error) {
        setSuggestions(['Could not fetch emails. Please reconnect Gmail.'])
        setLoading(false)
        return
      }
      const results: string[] = []
      for (let i = 0; i < 3; i++) {
        const suggestRes = await fetch('/api/suggest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emailPatterns: gmailData.patterns, variation: i })
        })
        const suggestData = await suggestRes.json()
        if (suggestData.suggestion) results.push(suggestData.suggestion)
      }
      setSuggestions(results)
    } catch (error) {
      setSuggestions(['Something went wrong. Please try again.'])
    }
    setLoading(false)
  }

  const getSheetsSuggestions = async () => {
    setSheetsLoading(true)
    setSheetsSuggestions([])
    setSheetsAccepted([])
    try {
      const sheetsRes = await fetch('/api/sheets')
      const sheetsData = await sheetsRes.json()
      if (sheetsData.error) {
        setSheetsSuggestions(['Could not fetch sheets. Please reconnect Google Sheets.'])
        setSheetsLoading(false)
        return
      }
      const results: string[] = []
      for (let i = 0; i < 3; i++) {
        const suggestRes = await fetch('/api/suggest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emailPatterns: sheetsData.patterns, variation: i })
        })
        const suggestData = await suggestRes.json()
        if (suggestData.suggestion) results.push(suggestData.suggestion)
      }
      setSheetsSuggestions(results)
    } catch (error) {
      setSheetsSuggestions(['Something went wrong. Please try again.'])
    }
    setSheetsLoading(false)
  }

  const acceptAutomation = async (text: string, index: number, type: 'gmail' | 'sheets') => {
    const { data: { session } } = await supabase.auth.getSession()
    await supabase.from('automations').insert({
      user_id: session?.user?.id,
      suggestion: text,
      accepted_at: new Date().toISOString()
    })
    setAutomationsAccepted(prev => prev + 1)
    if (type === 'gmail') {
      setAccepted(prev => [...prev, index])
    } else {
      setSheetsAccepted(prev => [...prev, index])
    }
  }

  const toggleEnhancedMode = async (value: boolean) => {
    setEnhancedMode(value)
    const { data: { user } } = await supabase.auth.getUser()
    const { data: existing } = await supabase
      .from('preferences')
      .select('*')
      .eq('user_id', user?.id)
      .single()
    if (existing) {
      await supabase.from('preferences').update({ enhanced_mode: value }).eq('user_id', user?.id)
    } else {
      await supabase.from('preferences').insert({ user_id: user?.id, enhanced_mode: value })
    }
  }

  const efficiencyScore = Math.min(automationsAccepted * 10, 100)
  const timeSaved = automationsAccepted * 3

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0F4F8', fontFamily: 'Arial, sans-serif' }}>

      {/* Navbar */}
      <nav style={{ backgroundColor: '#1B2A4A', padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="48" height="32" viewBox="0 0 48 32" fill="none">
            <path d="M4 2 L4 26" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <path d="M4 2 L18 2" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <path d="M4 13 L15 13" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <path d="M4 26 Q4 32 11 32 Q18 32 18 26" stroke="#4A9FD4" strokeWidth="3" strokeLinecap="round"/>
            <path d="M18 26 L18 2" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <path d="M18 2 L30 18" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <path d="M30 18 L42 2" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <path d="M42 2 L42 26" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px', letterSpacing: '-0.5px' }}>FlowMate</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#2E75B6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>{user?.email?.[0]?.toUpperCase() || 'U'}</span>
          </div>
          <span className="desktop-only" style={{ color: '#A0B4C8', fontSize: '13px', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email || 'Loading...'}</span>
          <button
            onClick={async () => { await supabase.auth.signOut(); window.location.href = '/' }}
            style={{ padding: '6px 12px', backgroundColor: 'transparent', color: '#A0B4C8', border: '1px solid #2E3F5C', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', flexShrink: 0 }}
          >
            Log out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>

        {/* Welcome Header */}
<div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
  <div>
    <h1 style={{ color: '#1B2A4A', fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Good afternoon! 👋</h1>
    <p style={{ color: '#64748B', fontSize: '16px', margin: 0 }}>Here is your automation overview for today.</p>
  </div>
  
     <a href="/history"
    style={{ padding: '10px 20px', backgroundColor: 'white', color: '#2E75B6', border: '1px solid #2E75B6', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}
  >
    📋 View History
  </a>
</div>

        {/* Stats Row */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderTop: '4px solid #2E75B6' }}>
              <p style={{ color: '#64748B', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px 0' }}>Efficiency Score</p>
              <p style={{ color: '#1B2A4A', fontSize: '42px', fontWeight: 'bold', margin: '0 0 4px 0' }}>{efficiencyScore}<span style={{ fontSize: '20px', color: '#64748B' }}>/100</span></p>
              <p style={{ color: '#2E75B6', fontSize: '13px', margin: 0 }}>Accept automations to increase</p>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderTop: '4px solid #00897B' }}>
              <p style={{ color: '#64748B', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 8px 0' }}>Time Saved</p>
              <p style={{ color: '#1B2A4A', fontSize: '42px', fontWeight: 'bold', margin: '0 0 4px 0' }}>{timeSaved}<span style={{ fontSize: '20px', color: '#64748B' }}>hrs</span></p>
              <p style={{ color: '#00897B', fontSize: '13px', margin: 0 }}>This month</p>
            </div>
          </div>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderTop: '4px solid #E65100', maxWidth: '48%', margin: '0 auto' }}>
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
              <span style={{ backgroundColor: '#E8F5E9', color: '#00897B', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>✅ Connected</span>
            )}
          </div>
          {gmailConnected ? (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={getSuggestions}
                disabled={loading}
                style={{ padding: '12px 24px', backgroundColor: loading ? '#94A3B8' : '#2E75B6', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '600' }}
              >
                {loading ? '🤖 Analysing your emails...' : '✨ Get 3 Suggestions'}
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

        {/* Gmail Suggestions */}
        {suggestions.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ color: '#1B2A4A', fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0' }}>💡 Your Gmail Suggestions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {suggestions.map((s, i) => (
                <div key={i} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderLeft: '5px solid #2E75B6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ backgroundColor: '#EBF3FB', color: '#2E75B6', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>Suggestion {i + 1}</span>
                  </div>
                  <p style={{ color: '#1B2A4A', fontSize: '15px', lineHeight: '1.7', margin: '0 0 20px 0' }}>{s}</p>
                  {!accepted.includes(i) ? (
                    <button
                      onClick={() => acceptAutomation(s, i, 'gmail')}
                      style={{ padding: '10px 20px', backgroundColor: '#00897B', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontWeight: '600' }}
                    >
                      ✅ Accept This Automation
                    </button>
                  ) : (
                    <div style={{ backgroundColor: '#E8F5E9', padding: '10px 16px', borderRadius: '8px', color: '#00897B', fontWeight: '600', display: 'inline-block', fontSize: '14px' }}>
                      🎉 Accepted!
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Google Sheets Card */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h2 style={{ color: '#1B2A4A', fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0' }}>📊 Google Sheets</h2>
              <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>Connect Google Sheets so FlowMate can detect spreadsheet automation opportunities</p>
            </div>
            {gmailConnected && (
              <span style={{ backgroundColor: '#E8F5E9', color: '#00897B', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>✅ Connected</span>
            )}
          </div>
          {gmailConnected ? (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={getSheetsSuggestions}
                disabled={sheetsLoading}
                style={{ padding: '12px 24px', backgroundColor: sheetsLoading ? '#94A3B8' : '#00897B', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', cursor: sheetsLoading ? 'not-allowed' : 'pointer', fontWeight: '600' }}
              >
                {sheetsLoading ? '🤖 Analysing...' : '📊 Get 3 Sheets Suggestions'}
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
              style={{ padding: '12px 24px', backgroundColor: '#00897B', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', cursor: 'pointer', fontWeight: '600' }}
            >
              Connect Google Sheets
            </button>
          )}
        </div>

        {/* Sheets Suggestions */}
        {sheetsSuggestions.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ color: '#1B2A4A', fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0' }}>📊 Your Sheets Suggestions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {sheetsSuggestions.map((s, i) => (
                <div key={i} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderLeft: '5px solid #00897B' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ backgroundColor: '#E8F5E9', color: '#00897B', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>Suggestion {i + 1}</span>
                  </div>
                  <p style={{ color: '#1B2A4A', fontSize: '15px', lineHeight: '1.7', margin: '0 0 20px 0' }}>{s}</p>
                  {!sheetsAccepted.includes(i) ? (
                    <button
                      onClick={() => acceptAutomation(s, i, 'sheets')}
                      style={{ padding: '10px 20px', backgroundColor: '#00897B', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontWeight: '600' }}
                    >
                      ✅ Accept This Automation
                    </button>
                  ) : (
                    <div style={{ backgroundColor: '#E8F5E9', padding: '10px 16px', borderRadius: '8px', color: '#00897B', fontWeight: '600', display: 'inline-block', fontSize: '14px' }}>
                      🎉 Accepted!
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preferences Card */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '24px' }}>
          <h2 style={{ color: '#1B2A4A', fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0' }}>⚙️ Email Reading Preferences</h2>
          <p style={{ color: '#64748B', fontSize: '14px', margin: '0 0 24px 0', lineHeight: '1.6' }}>Choose how FlowMate reads your emails to generate suggestions.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              onClick={() => toggleEnhancedMode(false)}
              style={{ padding: '16px 20px', borderRadius: '10px', border: !enhancedMode ? '2px solid #2E75B6' : '2px solid #E2E8F0', backgroundColor: !enhancedMode ? '#EBF3FB' : 'white', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #2E75B6', backgroundColor: !enhancedMode ? '#2E75B6' : 'white', flexShrink: 0 }}/>
                <div>
                  <p style={{ color: '#1B2A4A', fontWeight: '600', fontSize: '15px', margin: '0 0 4px 0' }}>🔒 Basic Mode — Maximum Privacy</p>
                  <p style={{ color: '#64748B', fontSize: '13px', margin: 0 }}>Reads subject lines and senders only. No email content is ever accessed.</p>
                </div>
              </div>
            </div>
            <div
              onClick={() => toggleEnhancedMode(true)}
              style={{ padding: '16px 20px', borderRadius: '10px', border: enhancedMode ? '2px solid #00897B' : '2px solid #E2E8F0', backgroundColor: enhancedMode ? '#E8F5E9' : 'white', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #00897B', backgroundColor: enhancedMode ? '#00897B' : 'white', flexShrink: 0 }}/>
                <div>
                  <p style={{ color: '#1B2A4A', fontWeight: '600', fontSize: '15px', margin: '0 0 4px 0' }}>✨ Enhanced Mode — Better Suggestions</p>
                  <p style={{ color: '#64748B', fontSize: '13px', margin: 0 }}>Reads the first line of emails for more accurate and relevant suggestions.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ghost Mode Card */}
        <div style={{ backgroundColor: '#1B2A4A', borderRadius: '16px', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '24px' }}>
          <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0' }}>👻 Ghost Mode Active</h2>
          <p style={{ color: '#A0B4C8', fontSize: '14px', margin: 0, lineHeight: '1.6' }}>
            FlowMate is quietly observing your email patterns in the background. The more you use your email, the smarter the suggestions become. Check back regularly for new automation opportunities tailored specifically to how you work.
          </p>
        </div>
{/* Weekly Digest Card */}
<div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '24px', borderLeft: '5px solid #2E75B6' }}>
  <h2 style={{ color: '#2E75B6', fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0' }}>📬 Weekly Email Digest</h2>
  <p style={{ color: '#64748B', fontSize: '14px', margin: '0 0 20px 0', lineHeight: '1.6' }}>
    Get a weekly summary of your automations, time saved and efficiency score sent straight to your inbox every Monday morning.
  </p>
  <button
    onClick={async () => {
      const res = await fetch('/api/digest', { method: 'POST' })
      const data = await res.json()
      if (data.success) alert('Weekly digest sent to your email!')
      else alert('Something went wrong. Please try again.')
    }}
    style={{ padding: '12px 24px', backgroundColor: '#2E75B6', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', cursor: 'pointer', fontWeight: '600' }}
  >
    📧 Send Me This Week's Digest
  </button>
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