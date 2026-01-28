import { FormEvent, useEffect, useState } from 'react'
import { transferCustody } from '../api/api'

export default function CustodyTransfer() {
  const [evidenceId, setEvidenceId] = useState('')
  const [to, setTo] = useState('')
  const [note, setNote] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(true)
  }, [])

  const handleSubmit = async (evt: FormEvent) => {
    evt.preventDefault()
    setStatus(null)
    setLoading(true)
    try {
      await transferCustody({ evidenceId, to, note })
      setStatus('Custody transfer recorded. Blockchain transaction reference issued by backend.')
      setEvidenceId('')
      setTo('')
      setNote('')
    } catch (err) {
      console.error(err)
      setStatus('Transfer failed. Please confirm details and retry.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="card" style={{ opacity: animate ? 1 : 0, transform: animate ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out' }}>
        <h1>Transfer Custody</h1>
        <p className="muted">Document every handoff to preserve evidentiary integrity.</p>
        <form className="form" onSubmit={handleSubmit}>
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
            Recipient (name or unit)
            <input required value={to} onChange={(e) => setTo(e.target.value)} placeholder="Forensic Lab A" />
          </label>
          <label>
            Transfer Notes
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Sealed evidence bag; handed over with witness present"
              rows={3}
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Recording…' : 'Record Transfer'}
          </button>
          {status && <div className="info">{status}</div>}
        </form>
      </div>
    </div>
  )
}
