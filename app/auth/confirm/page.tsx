import Link from 'next/link'

export default function ConfirmEmail() {
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
      <div style={{ backgroundColor: '#243550', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{ fontSize: '56px', marginBottom: '24px' }}>📧</div>
        <h1 style={{ color: 'white', fontSize: '26px', fontWeight: 'bold', margin: '0 0 16px 0' }}>Check your email!</h1>
        <p style={{ color: '#A0B4C8', fontSize: '15px', margin: '0 0 24px 0', lineHeight: '1.7' }}>
          We have sent you a confirmation email. Click the link inside to activate your FlowMate account.
        </p>
        <div style={{ backgroundColor: '#1B2A4A', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
          <p style={{ color: '#64748B', fontSize: '13px', margin: 0, lineHeight: '1.6' }}>
            Did not receive it? Check your spam folder or wait a few minutes. The link expires after 24 hours.
          </p>
        </div>
        <Link href="/auth/login" style={{ display: 'block', color: '#4A9FD4', textDecoration: 'none', fontSize: '15px' }}>
          Back to login
        </Link>
      </div>
    </div>
  )
}