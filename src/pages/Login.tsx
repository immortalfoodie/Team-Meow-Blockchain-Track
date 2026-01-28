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
    <div className="page">
      <div className="card narrow" style={{ opacity: animate ? 1 : 0, transform: animate ? 'scale(1)' : 'scale(0.95)', transition: 'all 0.5s ease-out' }}>
        <h1>Secure Access</h1>
        <p className="muted">Judicial evidence logging portal</p>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="officer@agency.gov"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>
        <div className="legal-note">
          Access is restricted to authorized roles. All actions are logged and auditable.
        </div>
        <div className="info" style={{ marginTop: '12px', fontSize: '0.85rem' }}>
          <strong>Demo accounts (configure in backend):</strong>
          <br />
          Officer: <code>officer@demo.gov</code> / <code>officer123</code>
          <br />
          Analyst: <code>analyst@demo.gov</code> / <code>analyst123</code>
          <br />
          Judge: <code>judge@demo.gov</code> / <code>judge123</code>
        </div>
      </div>
    </div>
  )
}
