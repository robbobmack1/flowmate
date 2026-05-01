import Link from 'next/link'

export default function TermsOfService() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0F4F8', fontFamily: 'Arial, sans-serif' }}>

      {/* Navbar */}
      <nav style={{ backgroundColor: '#1B2A4A', padding: '0 60px', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
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
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>FlowMate</span>
        </Link>
        <Link href="/" style={{ color: '#A0B4C8', textDecoration: 'none', fontSize: '15px' }}>Back to home</Link>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px' }}>

        <h1 style={{ color: '#1B2A4A', fontSize: '40px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Terms of Service</h1>
        <p style={{ color: '#64748B', fontSize: '15px', margin: '0 0 48px 0' }}>Last updated: May 2026</p>

        {[
          {
            title: '1. Acceptance of Terms',
            content: 'By creating an account and using FlowMate you agree to these Terms of Service. If you do not agree to these terms please do not use FlowMate. These terms form a legally binding agreement between you and FlowMate, operated from Rotherham, United Kingdom.'
          },
          {
            title: '2. Description of Service',
            content: 'FlowMate is an AI-powered workflow automation tool that connects to your Gmail account, analyses email patterns, and suggests automations to save you time. FlowMate is currently in beta and features may change as we continue to develop the product.'
          },
          {
            title: '3. Your Account',
            content: 'You are responsible for maintaining the security of your account and password. You must be at least 18 years old to use FlowMate. You must provide accurate information when creating your account. You are responsible for all activity that occurs under your account. If you suspect unauthorised access to your account please contact us immediately at +44 7494 073988.'
          },
          {
            title: '4. Acceptable Use',
            content: 'You agree to use FlowMate only for lawful purposes. You must not attempt to access other users accounts or data. You must not use FlowMate to send spam or unsolicited communications. You must not attempt to reverse engineer or copy any part of FlowMate. You must not use FlowMate in any way that could damage or overburden our systems.'
          },
          {
            title: '5. Gmail Access',
            content: 'When you connect your Gmail account you grant FlowMate permission to read your email metadata including subject lines and sender addresses. We never read the body content of your emails. You can revoke this access at any time through your Google account settings at myaccount.google.com. Revoking access will prevent FlowMate from generating new suggestions but will not delete your existing account data.'
          },
          {
            title: '6. Intellectual Property',
            content: 'FlowMate and all its content, features, and functionality are owned by FlowMate and are protected by UK and international copyright laws. You may not copy, modify, distribute, or create derivative works based on FlowMate without our explicit written permission.'
          },
          {
            title: '7. Beta Service',
            content: 'FlowMate is currently in beta. This means the service is still being developed and tested. We do not guarantee that the service will be uninterrupted or error free during this period. Features may be added, changed, or removed. We appreciate your patience and feedback as we continue to improve the product.'
          },
          {
            title: '8. Pricing and Billing',
            content: 'FlowMate currently offers a free tier during the beta period. When paid plans are introduced we will give existing users at least 30 days notice before any charges begin. All prices are in GBP and inclusive of VAT where applicable. You may cancel your subscription at any time and will retain access until the end of your billing period.'
          },
          {
            title: '9. Limitation of Liability',
            content: 'FlowMate is provided on an as-is basis. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service. Our total liability to you for any claim arising from these terms shall not exceed the amount you paid to us in the 12 months preceding the claim.'
          },
          {
            title: '10. Termination',
            content: 'You may delete your account at any time. We reserve the right to suspend or terminate your account if you violate these terms. Upon termination all your data will be permanently deleted within 30 days in accordance with our Privacy Policy.'
          },
          {
            title: '11. Changes to Terms',
            content: 'We may update these terms from time to time. We will notify you by email at least 30 days before any significant changes take effect. Continued use of FlowMate after that date constitutes acceptance of the updated terms.'
          },
          {
            title: '12. Governing Law',
            content: 'These terms are governed by the laws of England and Wales. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.'
          },
          {
            title: '13. Contact',
            content: 'If you have any questions about these terms please contact us by phone at +44 7494 073988. We aim to respond to all enquiries within 2 business days.'
          },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#1B2A4A', fontSize: '20px', fontWeight: 'bold', margin: '0 0 12px 0' }}>{section.title}</h2>
            <p style={{ color: '#444', fontSize: '16px', lineHeight: '1.8', margin: 0 }}>{section.content}</p>
          </div>
        ))}

        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '32px', marginTop: '16px' }}>
          <p style={{ color: '#64748B', fontSize: '14px' }}>© 2026 FlowMate. All rights reserved. <Link href="/privacy" style={{ color: '#2E75B6', textDecoration: 'none' }}>Privacy Policy</Link></p>
        </div>

      </div>
    </div>
  )
}