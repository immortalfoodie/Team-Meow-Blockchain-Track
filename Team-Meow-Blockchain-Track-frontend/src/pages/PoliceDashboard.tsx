import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'

export default function PoliceDashboard() {
  const { name } = useAuth()
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(true)
  }, [])

  return (
    <div className="page role-officer" style={{ opacity: animate ? 1 : 0, transform: animate ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out' }}>
      <div className="hero">
        <div>
          <p className="muted">Evidence Intake & Custody</p>
          <h1>Officer Desk</h1>
          <p>Register new evidence, maintain chain of custody, and hand over securely.</p>
          <div className="actions">
            <Link className="button" to="/police/register">
              Register Evidence
            </Link>
            <Link className="button secondary" to="/police/transfer">
              Transfer Custody
            </Link>
          </div>
        </div>
        <div className="stat">
          <div className="muted">Logged in</div>
          <div className="stat__value">{name || 'Officer'}</div>
          <div className="stat__note">Police evidence intake operations. All actions are blockchain-notarized.</div>
        </div>
      </div>
      <div className="grid two">
        <div className="card" style={{ opacity: animate ? 1 : 0, transform: animate ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out 0.2s' }}>
          <h3>Registration checklist</h3>
          <ul className="list">
            <li>Capture agency evidence ID</li>
            <li>Upload original digital artefact</li>
            <li>Describe context and location</li>
            <li>Submit to lock hash on-chain (via backend)</li>
          </ul>
        </div>
        <div className="card" style={{ opacity: animate ? 1 : 0, transform: animate ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out 0.3s' }}>
          <h3>Custody transfer reminders</h3>
          <ul className="list">
            <li>Confirm recipient identity</li>
            <li>Record transfer notes</li>
            <li>Backend will notarize hash + timestamp</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
