import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function JudgeDashboard() {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(true)
  }, [])

  return (
    <div className="page" style={{ opacity: animate ? 1 : 0, transform: animate ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out' }}>
      <div className="hero">
        <div>
          <p className="muted">Integrity & Admissibility</p>
          <h1>Judge Desk</h1>
          <p>Re-verify evidence hashes to ensure the chain of custody is intact and admissible.</p>
          <div className="actions">
            <Link className="button" to="/judge/verify">
              Verify Evidence Integrity
            </Link>
          </div>
        </div>
      </div>
      <div className="card" style={{ opacity: animate ? 1 : 0, transform: animate ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out 0.2s' }}>
        <h3>Verification approach</h3>
        <ul className="list">
          <li>Upload a copy of the evidence file provided for court</li>
          <li>Backend re-computes hash and compares to on-chain reference</li>
          <li>Result shown with human-readable status and transaction reference</li>
        </ul>
      </div>
    </div>
  )
}
