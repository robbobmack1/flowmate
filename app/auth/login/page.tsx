'use client'

import { useState } from 'react'
import { createClient } from '../../supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '40px', fontFamily: 'Arial' }}>
      <h1 style={{ color: '#1B2A4A', marginBottom: '8px' }}>Welcome back</h1>
      <p style={{ color: '#666', marginBottom: '32px' }}>Log in to your FlowMate account</p>

      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box' }}
      />

      {error && <p style={{ color: 'red', marginBottom: '16px' }}>{error}</p>}

      <button
        onClick={handleLogin}
        style={{ width: '100%', padding: '14px', backgroundColor: '#1B2A4A', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}
      >
        Log In
      </button>

      <p style={{ textAlign: 'center', marginTop: '24px', color: '#666' }}>
        No account yet? <a href="/auth/signup" style={{ color: '#2E75B6' }}>Sign up free</a>
      </p>
    </div>
  )
}