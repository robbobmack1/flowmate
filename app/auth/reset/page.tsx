'use client'

import { useState } from 'react'
import { createClient } from '../../supabase'

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`
    })
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
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
        
        {!sent ? (
          <>
            <h1 style={{ color: 'white', fontSize: '26px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Reset password</h1>
            <p style={{ color: '#A0B4C8', fontSize: '15px', margin: '0 0 32px 0' }}>Enter your email and we will send you a reset link</p>

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '14px', marginBottom: '16px', borderRadius: '10px', border: '1px solid #2E3F5C', fontSize: '15px', backgroundColor: '#1B2A4A', color: 'white', boxSizing: 'border-box', outline: 'none' }}
            />

            {error && <p style={{ color: '#FF6B6B', marginBottom: '16px', fontSize: '14px' }}>{error}</p>}

            <button
              onClick={handleReset}
              style={{ width: '100%', padding: '14px', backgroundColor: '#2E75B6', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginBottom: '20px' }}
            >
              Send Reset Link
            </button>

            <p style={{ textAlign: 'center', color: '#A0B4C8', fontSize: '14px', margin: 0 }}>
              <a href="/auth/login" style={{ color: '#64748B', textDecoration: 'none' }}>Back to login</a>
            </p>
          </>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px', fontSize: '48px' }}>📧</div>
            <h1 style={{ color: 'white', fontSize: '26px', fontWeight: 'bold', margin: '0 0 8px 0', textAlign: 'center' }}>Check your email!</h1>
            <p style={{ color: '#A0B4C8', fontSize: '15px', margin: '0 0 32px 0', textAlign: 'center', lineHeight: '1.6' }}>
              We sent a password reset link to <strong style={{ color: 'white' }}>{email}</strong>. Click the link in the email to reset your password.
            </p>
            <a href="/auth/login" style={{ display: 'block', textAlign: 'center', color: '#4A9FD4', textDecoration: 'none', fontSize: '15px' }}>
              Back to login
            </a>
          </>
        )}
      </div>
    </div>
  )
}