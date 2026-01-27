import { FormEvent, useState } from 'react'
import { verifyEvidence } from '../api/api'

interface VerificationResult {
  matched: boolean
  transactionRef?: string
  chainTimestamp?: string
}

export default function EvidenceVerification() {
  const [evidenceId, setEvidenceId] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (evt: FormEvent) => {
    evt.preventDefault()
    setStatus(null)
    setResult(null)
    if (!file) {
      setStatus('Please attach the evidence file for verification.')
      return
    }
    setLoading(true)
    try {
      const data = await verifyEvidence({ evidenceId, file })
      setResult(data)
      setStatus(null)
    } catch (err) {
      console.error(err)
      setStatus('Verification failed. Please retry or consult the registrar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page role-judge">
      <div className="card">
        <h1>Verify Evidence Integrity</h1>
        <p className="muted">Backend compares your upload hash to the on-chain reference; no private keys are handled here.</p>
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
            Evidence File
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Verifying…' : 'Verify'}
          </button>
        </form>
        {status && <div className="error">{status}</div>}
        {result && (
          <div className="card surface">
            <h3>Legal Summary</h3>
            <p className={result.matched ? 'success' : 'error'}>
              {result.matched ? 'Hash match: integrity confirmed.' : 'Hash mismatch: integrity cannot be confirmed.'}
            </p>
            <p className="muted">Blockchain reference (from backend):</p>
            <div className="pill">
              {result.transactionRef || 'Transaction reference supplied by backend'}
            </div>
            {result.chainTimestamp && <div className="muted">Anchored at: {result.chainTimestamp}</div>}
            <p className="muted small">
              Explanation: The backend recomputed the hash of the uploaded file and compared it with the on-chain hash. The
              transaction reference above points to the notarization event without exposing raw blockchain details.
            </p>
            <ul className="verification-timeline muted small">
              <li>File received and hashed within the secure backend environment.</li>
              <li>Hash compared to on-chain reference associated with the stated evidence ID.</li>
              <li>Result rendered in plain language for judicial assessment.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
