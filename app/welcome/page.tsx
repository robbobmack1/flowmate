'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Welcome() {
  const [step, setStep] = useState(1)
  const router = useRouter()

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
<svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', opacity: 0.04 }} viewBox="0 0 1440 160" preserveAspectRatio="none">
  <path d="M0,160 Q360,80 720,160 Q1080,240 1440,160 L1440,0 L0,0 Z" fill="#4A9FD4"/>
</svg>
      

      {/* Logo */}
      <div style={{ marginBottom: '48px', display: 'flex', alignItems: 'center', gap: '12px' }}>
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

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '48px' }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: i <= step ? '#2E75B6' : '#2E3F5C', transition: 'all 0.3s' }}/>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div style={{ textAlign: 'center', maxWidth: '560px' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>👋</div>
          <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', margin: '0 0 16px 0', lineHeight: '1.2' }}>
            Welcome to FlowMate!
          </h1>
          <p style={{ color: '#A0B4C8', fontSize: '18px', lineHeight: '1.7', margin: '0 0 40px 0' }}>
            You are one of the very first people to use FlowMate. In the next 60 seconds we will connect your Gmail and start finding ways to save you time every week.
          </p>
          <button
            onClick={() => setStep(2)}
            style={{ padding: '16px 40px', backgroundColor: '#2E75B6', color: 'white', border: 'none', borderRadius: '10px', fontSize: '17px', fontWeight: '600', cursor: 'pointer' }}
          >
            Let's get started →
          </button>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div style={{ textAlign: 'center', maxWidth: '560px' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>👻</div>
          <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', margin: '0 0 16px 0', lineHeight: '1.2' }}>
            Meet Ghost Mode
          </h1>
          <p style={{ color: '#A0B4C8', fontSize: '18px', lineHeight: '1.7', margin: '0 0 24px 0' }}>
            Once you connect Gmail, FlowMate quietly observes how you work for 7 days without touching anything.
          </p>
          <div style={{ backgroundColor: '#243550', borderRadius: '12px', padding: '24px', marginBottom: '40px', textAlign: 'left' }}>
            {[
              { icon: '📧', text: 'Reads only email subject lines and senders — never the content' },
              { icon: '🔒', text: 'Your data never leaves our secure servers' },
              { icon: '✋', text: 'Nothing is automated without your explicit approval' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: i < 2 ? '16px' : '0' }}>
                <span style={{ fontSize: '24px' }}>{item.icon}</span>
                <p style={{ color: '#A0B4C8', fontSize: '15px', margin: 0, lineHeight: '1.5' }}>{item.text}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => setStep(1)}
              style={{ padding: '16px 24px', backgroundColor: 'transparent', color: '#64748B', border: '1px solid #2E3F5C', borderRadius: '10px', fontSize: '16px', cursor: 'pointer' }}
            >
              ← Back
            </button>
            <button
              onClick={() => setStep(3)}
              style={{ padding: '16px 40px', backgroundColor: '#2E75B6', color: 'white', border: 'none', borderRadius: '10px', fontSize: '17px', fontWeight: '600', cursor: 'pointer' }}
            >
              Got it →
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div style={{ textAlign: 'center', maxWidth: '560px' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>✨</div>
          <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', margin: '0 0 16px 0', lineHeight: '1.2' }}>
            You are all set!
          </h1>
          <p style={{ color: '#A0B4C8', fontSize: '18px', lineHeight: '1.7', margin: '0 0 40px 0' }}>
            Head to your dashboard, connect Gmail, and FlowMate will start working in the background. Your first automation suggestion will be ready within minutes.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => setStep(2)}
              style={{ padding: '16px 24px', backgroundColor: 'transparent', color: '#64748B', border: '1px solid #2E3F5C', borderRadius: '10px', fontSize: '16px', cursor: 'pointer' }}
            >
              ← Back
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              style={{ padding: '16px 40px', backgroundColor: '#00897B', color: 'white', border: 'none', borderRadius: '10px', fontSize: '17px', fontWeight: '600', cursor: 'pointer' }}
            >
              Go to my dashboard →
            </button>
          </div>
        </div>
      )}

    </div>
  )
}