import { useEffect, useState } from 'react'
import { fetchAssignedEvidence, getEvidenceCustodyHistory } from '../api/api'

interface AssignedItem {
  evidenceId: string
  status?: string
  custody?: string
  caseId?: string
  description?: string
  uploadedBy?: string
  uploadedAt?: string
  hash?: string
}

interface HistoryItem {
  action: string
  timestamp: string
  actor: string
  details?: string
}

export default function AnalystDashboard() {
  const [items, setItems] = useState<AssignedItem[]>([])
  const [selectedEvidence, setSelectedEvidence] = useState<AssignedItem | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    fetchAssignedEvidence().then(setItems).catch(console.error)
    setAnimate(true)
  }, [])

  const handleSelectEvidence = async (item: AssignedItem) => {
    setSelectedEvidence(item)
    setLoading(true)
    try {
      const data = await getEvidenceCustodyHistory(item.evidenceId)
      setHistory(data.blockchainHistory || [])
    } catch (error) {
      console.error('Failed to fetch history:', error)
      setHistory([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page" style={{ opacity: animate ? 1 : 0, transform: animate ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out' }}>
      <div className="hero">
        <div>
          <p className="muted">Forensic Workbench</p>
          <h1>Analyst Desk</h1>
          <p>Review evidence assigned to you and coordinate with custody officers.</p>
        </div>
      </div>
      <div className="grid two">
        <div className="card" style={{ opacity: animate ? 1 : 0, transform: animate ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out 0.2s' }}>
          <h3>Assigned Evidence ({items.length})</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {items.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Status</th>
                    <th>Custody</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr 
                      key={item.evidenceId}
                      onClick={() => handleSelectEvidence(item)}
                      style={{ cursor: 'pointer', backgroundColor: selectedEvidence?.evidenceId === item.evidenceId ? '#f0f0f0' : 'transparent' }}
                    >
                      <td>{item.evidenceId}</td>
                      <td>{item.status || 'Registered'}</td>
                      <td>{item.custody || 'Lab'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="muted center" style={{ padding: '20px', textAlign: 'center' }}>
                No evidence assigned yet.
              </p>
            )}
          </div>
        </div>

        {selectedEvidence && (
          <div className="card" style={{ opacity: animate ? 1 : 0, transform: animate ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out 0.3s' }}>
            <h3>Evidence Details</h3>
            <div style={{ marginBottom: '16px' }}>
              <p className="muted">ID</p>
              <p style={{ fontWeight: 500 }}>{selectedEvidence.evidenceId}</p>
            </div>
            {selectedEvidence.caseId && (
              <div style={{ marginBottom: '16px' }}>
                <p className="muted">Case ID</p>
                <p style={{ fontWeight: 500 }}>{selectedEvidence.caseId}</p>
              </div>
            )}
            {selectedEvidence.description && (
              <div style={{ marginBottom: '16px' }}>
                <p className="muted">Description</p>
                <p>{selectedEvidence.description}</p>
              </div>
            )}
            {selectedEvidence.hash && (
              <div style={{ marginBottom: '16px' }}>
                <p className="muted">Hash (First 16 chars)</p>
                <code style={{ fontSize: '0.85rem', wordBreak: 'break-all' }}>{selectedEvidence.hash.substring(0, 16)}...</code>
              </div>
            )}
            {selectedEvidence.uploadedBy && (
              <div style={{ marginBottom: '16px' }}>
                <p className="muted">Uploaded By</p>
                <p>{selectedEvidence.uploadedBy}</p>
              </div>
            )}
            {selectedEvidence.uploadedAt && (
              <div>
                <p className="muted">Uploaded At</p>
                <p>{new Date(selectedEvidence.uploadedAt).toLocaleString()}</p>
              </div>
            )}

            {history.length > 0 && (
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #ddd' }}>
                <h4>Custody Chain</h4>
                {loading ? (
                  <p className="muted">Loading...</p>
                ) : (
                  <div style={{ fontSize: '0.875rem' }}>
                    {history.map((item, idx) => (
                      <div key={idx} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: idx < history.length - 1 ? '1px solid #eee' : 'none' }}>
                        <p className="muted" style={{ marginBottom: '4px' }}>{item.timestamp}</p>
                        <p style={{ marginBottom: '4px' }}><strong>{item.action}</strong></p>
                        {item.details && <p className="muted">{item.details}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
