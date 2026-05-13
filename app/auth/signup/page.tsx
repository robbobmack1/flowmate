'use client'

import { useState } from 'react'
import { createClient } from '../../supabase'
import { useRouter } from 'next/navigation'

export default function SignUp() {
  const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [error, setError] = useState('')
const [agreed, setAgreed] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignUp = async () => {
    if (!agreed) {
      setError('Please agree to the Terms of Service and Privacy Policy')
      return
    }
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
    } else {
      // Save user email to our users table
      if (data.user) {
        await supabase.from('users').insert({
          user_id: data.user.id,
          email: data.user.email
        })
      }
      router.push('/auth/confirm')
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1B2A4A', fontFamily: 'Arial, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', position: 'relative', overflow: 'hidden' }}>

      {/* Background waves */}
      <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', opacity: 0.08 }} viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path d="M0,160 Q180,80 360,160 Q540,240 720,160 Q900,80 1080,160 Q1260,240 1440,160 L1440,320 L0,320 Z" fill="#2E75B6"/>
      </svg>
      <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', opacity: 0.05 }} viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path d="M0,200 Q180,120 360,200 Q540,280 720,200 Q900,120 1080,200 Q1260,280 1440,200 L1440,320 L0,320 Z" fill="#4A9FD4"/>
      </svg>
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', opacity: 0.06 }} viewBox="0 0 1440 200" preserveAspectRatio="none">
        <path d="M0,200 Q360,120 720,200 Q1080,280 1440,200 L1440,0 L0,0 Z" fill="#2E75B6"/>
      </svg>

      {/* Logo */}
      <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
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
        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '24px', letterSpacing: '-0.5px' }}>FlowMate</span>
      </div>

      {/* Card */}
      <div style={{ backgroundColor: '#243550', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', position: 'relative', zIndex: 1 }}>
        <h1 style={{ color: 'white', fontSize: '26px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Join FlowMate</h1>
        <p style={{ color: '#A0B4C8', fontSize: '15px', margin: '0 0 32px 0' }}>Create your free account and start saving time</p>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '14px', marginBottom: '16px', borderRadius: '10px', border: '1px solid #2E3F5C', fontSize: '15px', backgroundColor: '#1B2A4A', color: 'white', boxSizing: 'border-box', outline: 'none' }}
        />
        <input
          type="password"
          placeholder="Password — at least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '14px', marginBottom: '16px', borderRadius: '10px', border: '1px solid #2E3F5C', fontSize: '15px', backgroundColor: '#1B2A4A', color: 'white', boxSizing: 'border-box', outline: 'none' }}
        />

        {error && <p style={{ color: '#FF6B6B', marginBottom: '16px', fontSize: '14px' }}>{error}</p>}

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '20px' }}>
  <input
    type="checkbox"
    id="agree"
    checked={agreed}
    onChange={(e) => setAgreed(e.target.checked)}
    style={{ marginTop: '2px', cursor: 'pointer', width: '16px', height: '16px', flexShrink: 0 }}
  />
  <label htmlFor="agree" style={{ color: '#A0B4C8', fontSize: '13px', lineHeight: '1.5', cursor: 'pointer' }}>
    I agree to the{' '}
    <a href="/terms" target="_blank" style={{ color: '#4A9FD4', textDecoration: 'none' }}>Terms of Service</a>
    {' '}and{' '}
    <a href="/privacy" target="_blank" style={{ color: '#4A9FD4', textDecoration: 'none' }}>Privacy Policy</a>
  </label>
</div>

<button
  onClick={handleSignUp}
  disabled={!agreed}
  style={{ width: '100%', padding: '14px', backgroundColor: agreed ? '#2E75B6' : '#2E3F5C', color: agreed ? 'white' : '#64748B', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: agreed ? 'pointer' : 'not-allowed', marginBottom: '20px', transition: 'all 0.2s' }}
>
  Create Account
</button>

        <p style={{ textAlign: 'center', color: '#A0B4C8', fontSize: '14px', margin: '0 0 16px 0' }}>
          Already have an account?{' '}
          <a href="/auth/login" style={{ color: '#4A9FD4', textDecoration: 'none', fontWeight: '600' }}>Log in</a>
        </p>

        <p style={{ textAlign: 'center', color: '#64748B', fontSize: '12px', margin: 0 }}>
          No credit card required. Free forever plan available.
        </p>
      </div>
    </div>
  )
}