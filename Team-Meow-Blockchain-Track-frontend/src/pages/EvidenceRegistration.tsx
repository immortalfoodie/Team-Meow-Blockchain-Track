import { FormEvent, useEffect, useState } from 'react'
import { registerEvidence } from '../api/api'

interface RegistrationResult {
  success: boolean
  evidenceId: string
  caseId: string
  hash: string
  txHash: string
  uploadedBy: string
  uploadedAt: string
}

export default function EvidenceRegistration() {
  const [evidenceId, setEvidenceId] = useState('')
  const [caseId, setCaseId] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [result, setResult] = useState<RegistrationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(true)
  }, [])

  const handleSubmit = async (evt: FormEvent) => {
    evt.preventDefault()
    setStatus(null)
    setResult(null)
    if (!file) {
      setStatus('Please attach the evidence file.')
      return
    }
    if (!caseId) {
      setStatus('Please enter a Case ID.')
      return
    }
    setLoading(true)
    try {
      const response = await registerEvidence({ evidenceId, caseId, description, file })
      setResult(response)
      setEvidenceId('')
      setCaseId('')
      setDescription('')
      setFile(null)
    } catch (err: any) {
      console.error(err)
      const errorMsg = err?.response?.data?.error || 'Registration failed. Please try again.'
      setStatus(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setResult(null)
    setStatus(null)
  }

  return (
    <div className="page">
      <div className="card" style={{ opacity: animate ? 1 : 0, transform: animate ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out' }}>
        <h1>Register Evidence</h1>
        <p className="muted">Uploads are hashed server-side; only hashes anchor to the chain.</p>
        
        {result ? (
          <div style={{ marginTop: '24px' }}>
            <div style={{ 
              background: '#d4edda', 
              border: '1px solid #c3e6cb', 
              borderRadius: '8px', 
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h3 style={{ color: '#155724', marginBottom: '16px' }}>✓ Evidence Registered Successfully</h3>
              
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #c3e6cb', paddingBottom: '8px' }}>
                  <strong>Evidence ID:</strong>
                  <span style={{ fontFamily: 'monospace' }}>{result.evidenceId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #c3e6cb', paddingBottom: '8px' }}>
                  <strong>Case ID:</strong>
                  <span style={{ fontFamily: 'monospace' }}>{result.caseId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #c3e6cb', paddingBottom: '8px' }}>
                  <strong>Uploaded By:</strong>
                  <span>{result.uploadedBy}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #c3e6cb', paddingBottom: '8px' }}>
                  <strong>Timestamp:</strong>
                  <span>{new Date(result.uploadedAt).toLocaleString()}</span>
                </div>
                <div>
                  <strong>File Hash (SHA-256):</strong>
                  <div style={{ 
                    fontFamily: 'monospace', 
                    fontSize: '0.8rem', 
                    background: '#f8f9fa', 
                    padding: '8px', 
                    borderRadius: '4px',
                    marginTop: '4px',
                    wordBreak: 'break-all'
                  }}>
                    {result.hash}
                  </div>
                </div>
                <div>
                  <strong>Blockchain Transaction:</strong>
                  <div style={{ 
                    fontFamily: 'monospace', 
                    fontSize: '0.8rem', 
                    background: '#f8f9fa', 
                    padding: '8px', 
                    borderRadius: '4px',
                    marginTop: '4px',
                    wordBreak: 'break-all'
                  }}>
                    {result.txHash}
                  </div>
                </div>
              </div>
            </div>
            
            <button onClick={resetForm} style={{ width: '100%' }}>
              Register Another Evidence
            </button>
          </div>
        ) : (
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
                Case ID
                <input
                  required
                  value={caseId}
                  onChange={(e) => setCaseId(e.target.value)}
                  placeholder="CASE-2026-001"
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
              {loading ? 'Submitting...' : 'Register Evidence'}
            </button>
            {status && <div className="info" style={{ color: '#721c24', background: '#f8d7da', padding: '12px', borderRadius: '4px', marginTop: '12px' }}>{status}</div>}
          </form>
        )}
      </div>
    </div>
  )
}
