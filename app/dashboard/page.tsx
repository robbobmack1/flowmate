'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../supabase'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [gmailConnected, setGmailConnected] = useState(false)
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
          <div style={{ padding: '12px 20px', backgroundColor: '#E8F5E9', borderRadius: '8px', color: '#00897B', fontWeight: 'bold', display: 'inline-block' }}>
            ✅ Gmail Connected — Ghost Mode Active!
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

      <div style={{ padding: '30px', backgroundColor: '#EBF3FB', borderRadius: '12px', borderLeft: '6px solid #2E75B6' }}>
        <h2 style={{ color: '#2E75B6', marginBottom: '8px' }}>👻 Ghost Mode</h2>
        <p style={{ color: '#444' }}>Once you connect Gmail, FlowMate will quietly observe your email patterns for 7 days and then suggest automations tailored to how you actually work.</p>
      </div>
    </div>
  )
}