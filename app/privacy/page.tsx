import Link from 'next/link'

export default function PrivacyPolicy() {
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
        
        <h1 style={{ color: '#1B2A4A', fontSize: '40px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Privacy Policy</h1>
        <p style={{ color: '#64748B', fontSize: '15px', margin: '0 0 48px 0' }}>Last updated: May 2026</p>

        {[
          {
            title: '1. Who We Are',
            content: 'FlowMate is an AI-powered workflow automation service operated from Rotherham, United Kingdom. We help small businesses save time by automatically detecting repetitive tasks in their email and suggesting automations. If you have any questions about this policy, you can contact us by phone at +44 7494 073988.'
          },
          {
            title: '2. What Data We Collect',
            content: 'We collect the following information when you use FlowMate: your email address and password when you create an account; your name if you provide it; Gmail metadata including email subject lines and sender addresses only — we never read the body content of your emails; automations you have accepted within the app; and usage data such as when you log in and which features you use.'
          },
          {
            title: '3. What We Do NOT Collect',
            content: 'We want to be completely transparent. FlowMate does not read the body content of your emails under any circumstances. We do not collect payment card details. We do not collect data from contacts in your address book. We do not sell your data to any third party. We do not use your data for advertising purposes.'
          },
          {
            title: '4. How We Use Your Data',
            content: 'We use your data to provide the FlowMate service — specifically to analyse your email patterns and generate automation suggestions. We use your email address to send you service-related communications such as password resets and weekly summaries. We do not use your data for any purpose beyond providing and improving FlowMate.'
          },
          {
            title: '5. Who We Share Your Data With',
            content: 'We use a small number of trusted third party services to operate FlowMate. Supabase stores your account data and accepted automations securely. OpenAI processes anonymised email pattern data to generate suggestions — no personally identifiable information is sent to OpenAI. Google OAuth is used to connect your Gmail account with your explicit permission. None of these providers are permitted to use your data for their own purposes.'
          },
          {
            title: '6. Your Rights Under GDPR',
            content: 'As a UK or EU resident you have the following rights regarding your personal data: the right to access the data we hold about you; the right to correct any inaccurate data; the right to request deletion of your data at any time; the right to withdraw consent for Gmail access at any time through your Google account settings; the right to data portability; and the right to lodge a complaint with the Information Commissioner\'s Office (ICO) at ico.org.uk.'
          },
          {
            title: '7. How Long We Keep Your Data',
            content: 'We keep your account data for as long as your account is active. If you delete your account we will permanently delete all your personal data within 30 days. Email metadata used to generate suggestions is not stored permanently — it is processed in real time and discarded.'
          },
          {
            title: '8. Security',
            content: 'We take security seriously. All data is encrypted in transit using HTTPS. Your account is protected by Supabase\'s enterprise-grade authentication. Gmail access tokens are stored securely and never exposed. We regularly review our security practices to ensure your data is protected.'
          },
          {
            title: '9. Cookies',
            content: 'FlowMate uses only essential cookies required for the service to function — specifically to keep you logged in between sessions. We do not use advertising cookies or tracking cookies of any kind.'
          },
          {
            title: '10. Changes to This Policy',
            content: 'If we make significant changes to this privacy policy we will notify you by email before the changes take effect. Continued use of FlowMate after that date constitutes acceptance of the updated policy.'
          },
          {
            title: '11. Contact Us',
            content: 'If you have any questions about this privacy policy or want to exercise your data rights, please contact us by phone at +44 7494 073988. We aim to respond to all data requests within 30 days.'
          },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#1B2A4A', fontSize: '20px', fontWeight: 'bold', margin: '0 0 12px 0' }}>{section.title}</h2>
            <p style={{ color: '#444', fontSize: '16px', lineHeight: '1.8', margin: 0 }}>{section.content}</p>
          </div>
        ))}

        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '32px', marginTop: '16px' }}>
          <p style={{ color: '#64748B', fontSize: '14px' }}>© 2026 FlowMate. All rights reserved. <Link href="/terms" style={{ color: '#2E75B6', textDecoration: 'none' }}>Terms of Service</Link></p>
        </div>

      </div>
    </div>
  )
}