import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [animate, setAnimate] = useState(false)
  const [showDemoHints, setShowDemoHints] = useState(true)

  useEffect(() => {
    setAnimate(true)
  }, [])

  const handleSubmit = async (evt: FormEvent) => {
    evt.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError('Login failed. Please check your credentials.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const useDemoAccount = (account: { email: string; password: string; name: string }) => {
    setEmail(account.email)
    setPassword(account.password)
  }

  return (
    <div className="page" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
      <div className="card narrow" style={{ 
        opacity: animate ? 1 : 0, 
        transform: animate ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)', 
        transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        maxWidth: '520px',
        margin: '0 auto',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ 
            display: 'inline-flex',
            width: '64px',
            height: '64px',
            background: '#1a1a1a',
            marginBottom: '24px',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            borderRadius: '8px'
          }}>⚖️</div>
          <h1 style={{ fontSize: '2rem', marginBottom: '12px' }}>Secure Access</h1>
          <p className="muted" style={{ fontSize: '0.875rem' }}>Judicial Evidence Chain</p>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            <span style={{ fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Username</span>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="officer_sharma"
              style={{ marginTop: '8px' }}
            />
          </label>
          <label>
            <span style={{ fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password123"
              style={{ marginTop: '8px' }}
            />
          </label>
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading} style={{ width: '100%', marginTop: '8px' }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {showDemoHints && (
          <div style={{ 
            marginTop: '32px', 
            padding: '20px', 
            background: '#f0f4ff',
            borderRadius: '6px',
            borderLeft: '4px solid #3b82f6',
            fontSize: '0.875rem',
            lineHeight: '1.6'
          }}>
            <div style={{ fontWeight: 600, marginBottom: '12px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#1e3a8a' }}>Demo Accounts</div>
            <div style={{ display: 'grid', gap: '10px', fontSize: '0.8125rem' }}>
              <button 
                type="button"
                onClick={() => useDemoAccount({ email: 'officer_sharma', password: 'police123', name: 'Officer' })}
                style={{ padding: '10px 14px', textAlign: 'left', background: 'white', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', color: '#333', boxShadow: 'none', textTransform: 'none', letterSpacing: 'normal', fontWeight: 'normal' }}
              >
                <strong style={{ color: '#1e3a8a' }}>Police:</strong> officer_sharma / police123
              </button>
              <button 
                type="button"
                onClick={() => useDemoAccount({ email: 'lab_verma', password: 'lab123', name: 'Analyst' })}
                style={{ padding: '10px 14px', textAlign: 'left', background: 'white', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', color: '#333', boxShadow: 'none', textTransform: 'none', letterSpacing: 'normal', fontWeight: 'normal' }}
              >
                <strong style={{ color: '#1e3a8a' }}>Lab:</strong> lab_verma / lab123
              </button>
              <button 
                type="button"
                onClick={() => useDemoAccount({ email: 'judge_mehta', password: 'judge123', name: 'Judge' })}
                style={{ padding: '10px 14px', textAlign: 'left', background: 'white', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', color: '#333', boxShadow: 'none', textTransform: 'none', letterSpacing: 'normal', fontWeight: 'normal' }}
              >
                <strong style={{ color: '#1e3a8a' }}>Judge:</strong> judge_mehta / judge123
              </button>
              <button 
                type="button"
                onClick={() => useDemoAccount({ email: 'admin', password: 'admin123', name: 'Admin' })}
                style={{ padding: '10px 14px', textAlign: 'left', background: 'white', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', color: '#333', boxShadow: 'none', textTransform: 'none', letterSpacing: 'normal', fontWeight: 'normal' }}
              >
                <strong style={{ color: '#1e3a8a' }}>Admin:</strong> admin / admin123
              </button>
            </div>
            <button 
              type="button"
              onClick={() => setShowDemoHints(false)}
              style={{ marginTop: '12px', fontSize: '0.75rem', color: '#666', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Hide
            </button>
          </div>
        )}

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.75rem', color: '#666' }}>
          All actions are logged and auditable
        </div>
      </div>
    </div>
  )
}
