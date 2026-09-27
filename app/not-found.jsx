import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: '#F8FAFC',
      color: '#0F172A',
      textAlign: 'center',
      padding: '24px'
    }}>
      <div style={{ 
        background: '#FFFFFF', 
        padding: '48px 36px', 
        borderRadius: '24px', 
        border: '1px solid #E2E8F0',
        boxShadow: '0 12px 36px rgba(15, 23, 42, 0.06)',
        maxWidth: '420px',
        width: '100%'
      }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: '#0066FF', lineHeight: 1, marginBottom: 12 }}>404</h1>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>Page Not Found</h2>
        <p style={{ color: '#64748B', fontSize: '0.92rem', marginBottom: 24 }}>The page you are looking for does not exist or has been moved.</p>
        <Link 
          href="/" 
          style={{ 
            display: 'inline-flex', 
            padding: '12px 24px', 
            background: '#0066FF', 
            color: '#FFFFFF', 
            borderRadius: '9999px', 
            fontWeight: 700, 
            fontSize: '0.92rem',
            textDecoration: 'none'
          }}
        >
          Return to Portfolio
        </Link>
      </div>
    </div>
  );
}
