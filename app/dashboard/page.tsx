import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }}>

      {/* Navbar */}
      <nav style={{ backgroundColor: '#1B2A4A', padding: '0 60px', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', backgroundColor: '#2E75B6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>F</span>
          </div>
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '22px' }}>FlowMate</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link href="/auth/login" style={{ color: '#A0B4C8', textDecoration: 'none', fontSize: '15px' }}>Log in</Link>
          <Link href="/auth/signup" style={{ backgroundColor: '#2E75B6', color: 'white', padding: '10px 22px', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>Get Started Free</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ backgroundColor: '#1B2A4A', padding: '100px 60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', backgroundColor: '#2E75B6', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', marginBottom: '24px', letterSpacing: '0.5px' }}>
          🚀 NOW IN BETA — FREE TO JOIN
        </div>
        <h1 style={{ color: 'white', fontSize: '56px', fontWeight: 'bold', margin: '0 0 24px 0', lineHeight: '1.15', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
          Your business runs on <span style={{ color: '#2E75B6' }}>repetitive tasks.</span> We eliminate them.
        </h1>
        <p style={{ color: '#A0B4C8', fontSize: '20px', maxWidth: '600px', margin: '0 auto 40px auto', lineHeight: '1.7' }}>
          FlowMate watches how your team works and automatically suggests time-saving automations — no technical knowledge required.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/auth/signup" style={{ backgroundColor: '#2E75B6', color: 'white', padding: '16px 36px', borderRadius: '10px', textDecoration: 'none', fontSize: '17px', fontWeight: '600' }}>
            Start For Free →
          </Link>
          <Link href="/auth/login" style={{ backgroundColor: 'transparent', color: 'white', padding: '16px 36px', borderRadius: '10px', textDecoration: 'none', fontSize: '17px', border: '1px solid #2E75B6' }}>
            Log In
          </Link>
        </div>
        <p style={{ color: '#64748B', fontSize: '13px', marginTop: '20px' }}>No credit card required. Free forever plan available.</p>
      </div>

      {/* Stats Bar */}
      <div style={{ backgroundColor: '#F0F4F8', padding: '40px 60px', display: 'flex', justifyContent: 'center', gap: '80px', flexWrap: 'wrap' }}>
        {[
          { number: '11hrs', label: 'Average time saved per week' },
          { number: '£3,200', label: 'Average annual value per user' },
          { number: '3 mins', label: 'Average setup time' },
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <p style={{ color: '#1B2A4A', fontSize: '36px', fontWeight: 'bold', margin: '0 0 4px 0' }}>{stat.number}</p>
            <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div style={{ backgroundColor: 'white', padding: '80px 60px', textAlign: 'center' }}>
        <h2 style={{ color: '#1B2A4A', fontSize: '36px', fontWeight: 'bold', margin: '0 0 12px 0' }}>How FlowMate works</h2>
        <p style={{ color: '#64748B', fontSize: '18px', margin: '0 auto 60px auto', maxWidth: '500px' }}>Three steps to saving hours every week</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { step: '1', icon: '🔗', title: 'Connect your tools', desc: 'Link your Gmail and Google Sheets in under 60 seconds. No technical setup required.' },
            { step: '2', icon: '👻', title: 'Ghost Mode observes', desc: 'FlowMate quietly watches how you work for 7 days without touching anything.' },
            { step: '3', icon: '✨', title: 'Accept and save time', desc: 'Review your personalised suggestions and accept them with one click. Done.' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '32px 24px', backgroundColor: '#F0F4F8', borderRadius: '16px', textAlign: 'left' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#2E75B6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '24px' }}>{item.icon}</span>
              </div>
              <h3 style={{ color: '#1B2A4A', fontSize: '18px', fontWeight: 'bold', margin: '0 0 10px 0' }}>{item.title}</h3>
              <p style={{ color: '#64748B', fontSize: '15px', margin: 0, lineHeight: '1.6' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Problems We Solve */}
      <div style={{ backgroundColor: '#F0F4F8', padding: '80px 60px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ color: '#1B2A4A', fontSize: '36px', fontWeight: 'bold', margin: '0 0 12px 0', textAlign: 'center' }}>Sound familiar?</h2>
          <p style={{ color: '#64748B', fontSize: '18px', textAlign: 'center', margin: '0 auto 60px auto', maxWidth: '500px' }}>These are the tasks FlowMate eliminates for small businesses every day</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {[
              '📋 Copying data from emails into spreadsheets manually',
              '📧 Sending the same follow-up emails over and over',
              '📊 Building the same report from scratch every week',
              '🔔 Forgetting to follow up with leads and clients',
              '📁 Manually filing and organising incoming documents',
              '⏰ Chasing invoices that should chase themselves',
            ].map((item, i) => (
              <div key={i} style={{ backgroundColor: 'white', padding: '20px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: '16px', color: '#1B2A4A' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div style={{ backgroundColor: 'white', padding: '80px 60px', textAlign: 'center' }}>
        <h2 style={{ color: '#1B2A4A', fontSize: '36px', fontWeight: 'bold', margin: '0 0 12px 0' }}>Simple, honest pricing</h2>
        <p style={{ color: '#64748B', fontSize: '18px', margin: '0 auto 60px auto' }}>Start free. Upgrade when you are ready.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { name: 'Starter', price: 'Free', color: '#64748B', features: ['3 active automations', 'Gmail only', '5 AI suggestions/month', '1 user'] },
            { name: 'Growth', price: '£29/mo', color: '#2E75B6', features: ['Unlimited automations', 'Gmail + Sheets + Slack', 'Unlimited suggestions', 'Up to 10 users'], highlight: true },
            { name: 'Business', price: '£99/mo', color: '#1B2A4A', features: ['Everything in Growth', 'All integrations', 'Priority AI', 'Unlimited users'] },
          ].map((plan, i) => (
            <div key={i} style={{ padding: '32px 24px', borderRadius: '16px', border: plan.highlight ? '2px solid #2E75B6' : '2px solid #E2E8F0', backgroundColor: plan.highlight ? '#EBF3FB' : 'white', position: 'relative' }}>
              {plan.highlight && (
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#2E75B6', color: 'white', padding: '4px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                  MOST POPULAR
                </div>
              )}
              <h3 style={{ color: plan.color, fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px 0' }}>{plan.name}</h3>
              <p style={{ color: '#1B2A4A', fontSize: '32px', fontWeight: 'bold', margin: '0 0 24px 0' }}>{plan.price}</p>
              {plan.features.map((f, j) => (
                <p key={j} style={{ color: '#64748B', fontSize: '14px', margin: '0 0 10px 0', textAlign: 'left' }}>✓ {f}</p>
              ))}
              <Link href="/auth/signup" style={{ display: 'block', marginTop: '24px', backgroundColor: plan.highlight ? '#2E75B6' : '#1B2A4A', color: 'white', padding: '12px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '15px' }}>
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ backgroundColor: '#1B2A4A', padding: '80px 60px', textAlign: 'center' }}>
        <h2 style={{ color: 'white', fontSize: '40px', fontWeight: 'bold', margin: '0 0 16px 0' }}>Ready to reclaim your time?</h2>
        <p style={{ color: '#A0B4C8', fontSize: '18px', margin: '0 auto 40px auto', maxWidth: '500px' }}>Join businesses already saving hours every week with FlowMate.</p>
        <Link href="/auth/signup" style={{ backgroundColor: '#2E75B6', color: 'white', padding: '16px 40px', borderRadius: '10px', textDecoration: 'none', fontSize: '18px', fontWeight: '600' }}>
          Start For Free Today →
        </Link>
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: '#0F1C30', padding: '30px 60px', textAlign: 'center' }}>
        <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>© 2026 FlowMate. Built for small businesses that want their time back.</p>
      </div>

    </div>
  )
}