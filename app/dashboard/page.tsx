'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../supabase'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [gmailConnected, setGmailConnected] = useState(false)
  const [suggestion, setSuggestion] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user?.app_metadata?.providers?.includes('google')) {
        setGmailConnected(true)
      }
    }
    getUser()
  }, [])

  const connectGmail = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/gmail.readonly',
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  const getSuggestion = async () => {
    setLoading(true)
    setSuggestion('')
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

  return (
    <div style={{ maxWidth: '900px', margin: '60px auto', padding: '40px', fontFamily: 'Arial' }}>
      <h1 style={{ color: '#1B2A4A', marginBottom: '8px' }}>Welcome to FlowMate 👋</h1>
      <p style={{ color: '#666', fontSize: '18px', marginBottom: '40px' }}>
        {user?.email ? `Logged in as ${user.email}` : 'Loading...'}
      </p>

      <div style={{ padding: '30px', backgroundColor: '#F5F5F5', borderRadius: '12px', marginBottom: '24px' }}>
        <h2 style={{ color: '#1B2A4A', marginBottom: '8px' }}>📧 Gmail</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>Connect your Gmail so FlowMate can detect automation opportunities</p>
        
        {gmailConnected ? (
          <div>
            <div style={{ padding: '12px 20px', backgroundColor: '#E8F5E9', borderRadius: '8px', color: '#00897B', fontWeight: 'bold', display: 'inline-block', marginBottom: '20px' }}>
              ✅ Gmail Connected — Ghost Mode Active!
            </div>
            <br />
            <button
              onClick={getSuggestion}
              disabled={loading}
              style={{ padding: '14px 28px', backgroundColor: '#2E75B6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}
            >
              {loading ? '🤖 Analysing your emails...' : '✨ Get My First Suggestion'}
            </button>
          </div>
        ) : (
          <button
            onClick={connectGmail}
            style={{ padding: '14px 28px', backgroundColor: '#1B2A4A', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}
          >
            Connect Gmail
          </button>
        )}
      </div>

      {suggestion && (
        <div style={{ padding: '30px', backgroundColor: '#EBF3FB', borderRadius: '12px', borderLeft: '6px solid #2E75B6', marginBottom: '24px' }}>
          <h2 style={{ color: '#2E75B6', marginBottom: '12px' }}>💡 Your First Automation Suggestion</h2>
          <p style={{ color: '#444', fontSize: '18px', lineHeight: '1.6' }}>{suggestion}</p>
          <button
            style={{ marginTop: '20px', padding: '12px 24px', backgroundColor: '#00897B', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}
          >
            ✅ Accept This Automation
          </button>
        </div>
      )}

      <div style={{ padding: '30px', backgroundColor: '#FFF3E0', borderRadius: '12px', borderLeft: '6px solid #E65100' }}>
        <h2 style={{ color: '#E65100', marginBottom: '8px' }}>👻 Ghost Mode</h2>
        <p style={{ color: '#444' }}>FlowMate is quietly observing your email patterns and will suggest automations tailored to how you actually work.</p>
      </div>
    </div>
  )
}