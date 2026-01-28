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

  useEffect(() => {
    setAnimate(true)
  }, [])

  const handleSubmit = async (evt: FormEvent) => {
    evt.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError('Login failed. Please check your credentials.')
      console.error(err)
    } finally {
      setLoading(false)
    }
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
            display: 'inline-block',
            width: '64px',
            height: '64px',
            background: '#1a1a1a',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px'
          }}>🔐</div>
          <h1 style={{ fontSize: '2rem', marginBottom: '12px' }}>Secure Access</h1>
          <p className="muted" style={{ fontSize: '0.875rem' }}>Judicial evidence logging portal</p>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            <span style={{ fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="officer@agency.gov"
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
              placeholder="••••••••"
              style={{ marginTop: '8px' }}
            />
          </label>
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading} style={{ width: '100%', marginTop: '8px' }}>
            {loading ? 'Authenticating…' : 'Login'}
          </button>
        </form>
        <div style={{ 
          marginTop: '32px', 
          padding: '20px', 
          background: 'rgba(26, 26, 26, 0.03)',
          borderLeft: '3px solid #1a1a1a',
          fontSize: '0.875rem',
          lineHeight: '1.6'
        }}>
          <div style={{ fontWeight: 600, marginBottom: '12px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Demo Accounts</div>
          <div style={{ display: 'grid', gap: '8px', fontSize: '0.8125rem' }}>
            <div><strong>Officer:</strong> officer@demo.gov / officer123</div>
            <div><strong>Analyst:</strong> analyst@demo.gov / analyst123</div>
            <div><strong>Judge:</strong> judge@demo.gov / judge123</div>
          </div>
        </div>
        <div className="legal-note" style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.75rem' }}>
          Access is restricted to authorized roles. All actions are logged and auditable.
        </div>
      </div>
    </div>
  )
}
