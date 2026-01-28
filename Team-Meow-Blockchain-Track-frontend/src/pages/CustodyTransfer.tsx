import { FormEvent, useEffect, useState } from 'react'
import { transferCustody } from '../api/api'

interface TransferResult {
  success: boolean
  evidenceId: string
  previousOwner: string
  newOwner: string
  txHash: string
}

export default function CustodyTransfer() {
  const [evidenceId, setEvidenceId] = useState('')
  const [to, setTo] = useState('')
  const [note, setNote] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [result, setResult] = useState<TransferResult | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(true)
  }, [])

  const handleSubmit = async (evt: FormEvent) => {
    evt.preventDefault()
    setStatus('idle')
    setResult(null)
    setErrorMsg('')
    setLoading(true)
    try {
      const data = await transferCustody({ evidenceId, to, note })
      setResult(data)
      setStatus('success')
      setEvidenceId('')
      setTo('')
      setNote('')
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err?.response?.data?.error || 'Transfer failed. Please confirm details and retry.')
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setStatus('idle')
    setResult(null)
    setErrorMsg('')
  }

  return (
    <div className="page">
      <div className="card" style={{ opacity: animate ? 1 : 0, transform: animate ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out' }}>
        <h1>Transfer Custody</h1>
        <p className="muted">Document every handoff to preserve evidentiary integrity.</p>

        {status === 'success' && result ? (
          <div style={{ 
            background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)', 
            padding: '24px', 
            borderRadius: '12px',
            border: '2px solid #28a745'
          }}>
            <h2 style={{ color: '#155724', margin: '0 0 16px 0' }}>✓ Custody Transfer Recorded</h2>
            
            <div style={{ display: 'grid', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>Evidence ID</label>
                <div style={{ fontFamily: 'monospace', fontWeight: 600 }}>{result.evidenceId}</div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>From</label>
                  <div>{result.previousOwner}</div>
                </div>
                <div style={{ fontSize: '1.5rem' }}>→</div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>To</label>
                  <div style={{ fontWeight: 600, color: '#28a745' }}>{result.newOwner}</div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>Blockchain Transaction</label>
                <div style={{ 
                  fontFamily: 'monospace', 
                  fontSize: '0.75rem', 
                  background: '#fff',
                  padding: '10px',
                  borderRadius: '4px',
                  wordBreak: 'break-all'
                }}>
                  {result.txHash}
                </div>
              </div>
            </div>

            <button onClick={resetForm} style={{ marginTop: '20px', width: '100%' }}>
              Transfer Another Evidence
            </button>
          </div>
        ) : (
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
              Recipient (username)
              <input required value={to} onChange={(e) => setTo(e.target.value)} placeholder="lab_verma" />
              <small style={{ color: '#666', fontSize: '0.75rem' }}>
                Available: officer_sharma, officer_patel, lab_verma, lab_khan, judge_mehta, judge_reddy
              </small>
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
              {loading ? 'Recording on Blockchain…' : 'Record Transfer'}
            </button>
            {status === 'error' && (
              <div style={{ background: '#f8d7da', color: '#721c24', padding: '12px', borderRadius: '8px', marginTop: '12px' }}>
                {errorMsg}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
