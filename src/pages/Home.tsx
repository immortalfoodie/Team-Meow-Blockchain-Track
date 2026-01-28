import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'

export default function Home() {
  const { isAuthenticated, role } = useAuth()
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(true)
  }, [])

  return (
    <div className="page" style={{ opacity: animate ? 1 : 0, transform: animate ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out' }}>
      <div className="hero">
        <div style={{ opacity: animate ? 1 : 0, transform: animate ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out 0.1s' }}>
          <p className="muted">Judicial Evidence Logging & Verification</p>
          <h1>Chain of custody you can audit</h1>
          <p>Frontend keeps workflow disciplined while the backend anchors hashes to Ethereum.</p>
          {isAuthenticated ? (
            <Link className="button" to={role === 'officer' ? '/police' : role === 'analyst' ? '/analyst' : '/judge'}>
              Go to your desk
            </Link>
          ) : (
            <Link className="button" to="/login">
              Sign in
            </Link>
          )}
        </div>
        <div className="card surface" style={{ opacity: animate ? 1 : 0, transform: animate ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out 0.2s' }}>
          <h3>Design notes</h3>
          <ul className="list">
            <li>JWT auth; roles gate routes</li>
            <li>Uploads via multipart/form-data</li>
            <li>Backend-only blockchain interaction</li>
            <li>Readable transaction references</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
