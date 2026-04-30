'use client'

import { useState } from 'react'
import { createClient } from '../../supabase'
import { useRouter } from 'next/navigation'

export default function UpdatePassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleUpdate = async () => {
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
    } else {
      setDone(true)
      setTimeout(() => router.push('/dashboard'), 3000)
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

        {!done ? (
          <>
            <h1 style={{ color: 'white', fontSize: '26px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Set new password</h1>
            <p style={{ color: '#A0B4C8', fontSize: '15px', margin: '0 0 32px 0' }}>Choose a strong password for your account</p>

            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '14px', marginBottom: '16px', borderRadius: '10px', border: '1px solid #2E3F5C', fontSize: '15px', backgroundColor: '#1B2A4A', color: 'white', boxSizing: 'border-box', outline: 'none' }}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              style={{ width: '100%', padding: '14px', marginBottom: '16px', borderRadius: '10px', border: '1px solid #2E3F5C', fontSize: '15px', backgroundColor: '#1B2A4A', color: 'white', boxSizing: 'border-box', outline: 'none' }}
            />

            {error && <p style={{ color: '#FF6B6B', marginBottom: '16px', fontSize: '14px' }}>{error}</p>}

            <button
              onClick={handleUpdate}
              style={{ width: '100%', padding: '14px', backgroundColor: '#2E75B6', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
            >
              Update Password
            </button>
          </>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '24px', fontSize: '48px' }}>✅</div>
            <h1 style={{ color: 'white', fontSize: '26px', fontWeight: 'bold', margin: '0 0 8px 0', textAlign: 'center' }}>Password updated!</h1>
            <p style={{ color: '#A0B4C8', fontSize: '15px', textAlign: 'center', lineHeight: '1.6' }}>
              Your password has been changed successfully. Taking you to your dashboard in a moment...
            </p>
          </>
        )}
      </div>
    </div>
  )
}