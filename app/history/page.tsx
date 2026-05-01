'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../supabase'
import { useRouter } from 'next/navigation'

export default function History() {
  const [automations, setAutomations] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUser(user)

      const { data: automations } = await supabase
        .from('automations')
        .select('*')
        .eq('user_id', user.id)
        .order('accepted_at', { ascending: false })

      if (automations) setAutomations(automations)
      setLoading(false)
    }
    getData()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  }

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
          <button
            onClick={() => router.push('/dashboard')}
            style={{ padding: '6px 12px', backgroundColor: 'transparent', color: '#A0B4C8', border: '1px solid #2E3F5C', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}
          >
            Back to Dashboard
          </button>
          <button
            onClick={async () => { await supabase.auth.signOut(); window.location.href = '/' }}
            style={{ padding: '6px 12px', backgroundColor: 'transparent', color: '#A0B4C8', border: '1px solid #2E3F5C', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}
          >
            Log out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ color: '#1B2A4A', fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0' }}>📋 Automation History</h1>
          <p style={{ color: '#64748B', fontSize: '16px', margin: 0 }}>All the automations you have accepted so far</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderTop: '4px solid #2E75B6' }}>
            <p style={{ color: '#64748B', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', margin: '0 0 8px 0' }}>Total Automations</p>
            <p style={{ color: '#1B2A4A', fontSize: '42px', fontWeight: 'bold', margin: 0 }}>{automations.length}</p>
          </div>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderTop: '4px solid #00897B' }}>
            <p style={{ color: '#64748B', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', margin: '0 0 8px 0' }}>Time Saved</p>
            <p style={{ color: '#1B2A4A', fontSize: '42px', fontWeight: 'bold', margin: 0 }}>{automations.length * 3}<span style={{ fontSize: '20px', color: '#64748B' }}>hrs</span></p>
          </div>
        </div>

        {/* Automations List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748B' }}>
            Loading your automations...
          </div>
        ) : automations.length === 0 ? (
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '60px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✨</div>
            <h2 style={{ color: '#1B2A4A', fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px 0' }}>No automations yet</h2>
            <p style={{ color: '#64748B', fontSize: '15px', margin: '0 0 24px 0' }}>Head back to your dashboard and accept your first automation suggestion!</p>
            <button
              onClick={() => router.push('/dashboard')}
              style={{ padding: '12px 24px', backgroundColor: '#2E75B6', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', cursor: 'pointer', fontWeight: '600' }}
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {automations.map((automation, i) => (
              <div key={i} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderLeft: '5px solid #2E75B6' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ backgroundColor: '#EBF3FB', color: '#2E75B6', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                    Automation #{automations.length - i}
                  </span>
                  <span style={{ color: '#94A3B8', fontSize: '13px' }}>
                    {automation.accepted_at ? formatDate(automation.accepted_at) : 'Date unknown'}
                  </span>
                </div>
                <p style={{ color: '#1B2A4A', fontSize: '15px', lineHeight: '1.7', margin: '0 0 12px 0' }}>{automation.suggestion}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ backgroundColor: '#E8F5E9', color: '#00897B', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>✅ Active</span>
                  <span style={{ color: '#94A3B8', fontSize: '13px' }}>Saving ~3hrs/month</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}