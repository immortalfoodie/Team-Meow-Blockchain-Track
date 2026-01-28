import { FormEvent, useEffect, useState } from 'react'
import { registerEvidence } from '../api/api'

export default function EvidenceRegistration() {
  const [evidenceId, setEvidenceId] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(true)
  }, [])

  const handleSubmit = async (evt: FormEvent) => {
    evt.preventDefault()
    setStatus(null)
    if (!file) {
      setStatus('Please attach the evidence file.')
      return
    }
    setLoading(true)
    try {
      await registerEvidence({ evidenceId, description, file })
      setStatus('Evidence registered. Blockchain reference recorded by backend.')
      setEvidenceId('')
      setDescription('')
      setFile(null)
    } catch (err) {
      console.error(err)
      setStatus('Registration failed. Please try again or contact an administrator.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="card" style={{ opacity: animate ? 1 : 0, transform: animate ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out' }}>
        <h1>Register Evidence</h1>
        <p className="muted">Uploads are hashed server-side; only hashes anchor to the chain.</p>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-grid-two">
            <label>
              Evidence ID
              <input
                required
                value={evidenceId}
                onChange={(e) => setEvidenceId(e.target.value)}
                placeholder="EV-2026-034"
              />
            </label>
            <label>
              Evidence File
              <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required />
            </label>
            <label className="full-span">
              Description / Context
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Scene details, date/time, collection notes"
                rows={3}
              />
            </label>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting…' : 'Register Evidence'}
          </button>
          {status && <div className="info">{status}</div>}
        </form>
      </div>
    </div>
  )
}
