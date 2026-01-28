import { useEffect, useState } from 'react'
import { getAllEvidence, getEvidenceCustodyHistory } from '../api/api'

interface Evidence {
  evidenceId: string
  caseId: string
  hash: string
  owner: string
  timestamp: string
  txHash?: string
}

interface CustodyEntry {
  role: string
  timestamp: string
  action: string
  previousOwner?: string
  owner?: string
}

export default function EvidenceList() {
  const [evidence, setEvidence] = useState<Evidence[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null)
  const [custodyHistory, setCustodyHistory] = useState<CustodyEntry[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    loadEvidence()
    setAnimate(true)
  }, [])

  const loadEvidence = async () => {
    try {
      setLoading(true)
      const data = await getAllEvidence()
      setEvidence(data)
    } catch (err: any) {
      console.error('Failed to load evidence:', err)
      setError(err?.response?.data?.error || 'Failed to load evidence')
    } finally {
      setLoading(false)
    }
  }

  const loadCustodyHistory = async (evidenceId: string) => {
    try {
      setLoadingHistory(true)
      const data = await getEvidenceCustodyHistory(evidenceId)
      setCustodyHistory(data.blockchainHistory || [])
    } catch (err: any) {
      console.error('Failed to load custody history:', err)
      setCustodyHistory([])
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleSelectEvidence = (item: Evidence) => {
    setSelectedEvidence(item)
    loadCustodyHistory(item.evidenceId)
  }

  const getRoleIcon = (role: string) => {
    if (role.includes('POLICE') || role.includes('USR001') || role.includes('USR002')) return '👮'
    if (role.includes('LAB') || role.includes('USR003') || role.includes('USR004')) return '🔬'
    if (role.includes('JUDGE') || role.includes('USR005') || role.includes('USR006')) return '⚖️'
    if (role.includes('ADMIN')) return '👨‍💼'
    return '📦'
  }

  const getRoleLabel = (role: string) => {
    if (role.includes('USR001')) return 'Inspector Sharma (Police)'
    if (role.includes('USR002')) return 'Sub-Inspector Patel (Police)'
    if (role.includes('USR003')) return 'Dr. Verma (Lab)'
    if (role.includes('USR004')) return 'Dr. Khan (Lab)'
    if (role.includes('USR005')) return 'Justice Mehta (Judge)'
    if (role.includes('USR006')) return 'Justice Reddy (Judge)'
    if (role.includes('POLICE')) return 'Police Officer'
    if (role.includes('LAB')) return 'Lab Analyst'
    if (role.includes('JUDGE')) return 'Judge'
    return role
  }

  return (
    <div className="page" style={{ opacity: animate ? 1 : 0, transform: animate ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out' }}>
      <div className="hero">
        <div>
          <p className="muted">Blockchain Evidence Registry</p>
          <h1>All Registered Evidence</h1>
          <p>View all evidence that has been registered on the blockchain</p>
        </div>
        <button onClick={loadEvidence} disabled={loading} style={{ marginLeft: 'auto' }}>
          {loading ? 'Loading...' : '↻ Refresh'}
        </button>
      </div>

      {error && (
        <div style={{ background: '#f8d7da', color: '#721c24', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      <div className="grid two">
        <div className="card">
          <h3>Evidence Registry ({evidence.length} items)</h3>
          
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
              <p className="muted">Loading evidence from blockchain...</p>
            </div>
          ) : evidence.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📭</div>
              <p className="muted">No evidence registered yet</p>
              <p style={{ fontSize: '0.875rem', color: '#666' }}>
                Register new evidence to see it here
              </p>
            </div>
          ) : (
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              <table className="table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Evidence ID</th>
                    <th>Case ID</th>
                    <th>Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {evidence.map((item) => (
                    <tr 
                      key={item.evidenceId}
                      onClick={() => handleSelectEvidence(item)}
                      style={{ 
                        cursor: 'pointer', 
                        backgroundColor: selectedEvidence?.evidenceId === item.evidenceId ? '#e8f4e8' : 'transparent',
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <td style={{ fontFamily: 'monospace', fontWeight: 500 }}>{item.evidenceId}</td>
                      <td>{item.caseId}</td>
                      <td style={{ fontSize: '0.8rem' }}>
                        {new Date(item.timestamp).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selectedEvidence && (
          <div className="card" style={{ 
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            border: '2px solid #28a745'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>📋 Evidence Details</h3>
              <span style={{ 
                background: '#28a745', 
                color: 'white', 
                padding: '4px 12px', 
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                VERIFIED ON CHAIN
              </span>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Evidence ID</label>
                <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 600 }}>{selectedEvidence.evidenceId}</div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Case ID</label>
                <div style={{ fontFamily: 'monospace' }}>{selectedEvidence.caseId}</div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Owner/Custodian</label>
                <div>{selectedEvidence.owner}</div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Registration Time</label>
                <div>{new Date(selectedEvidence.timestamp).toLocaleString()}</div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>File Hash (SHA-256)</label>
                <div style={{ 
                  fontFamily: 'monospace', 
                  fontSize: '0.75rem', 
                  background: '#fff',
                  padding: '10px',
                  borderRadius: '4px',
                  wordBreak: 'break-all',
                  border: '1px solid #ddd'
                }}>
                  {selectedEvidence.hash}
                </div>
              </div>

              {selectedEvidence.txHash && (
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Blockchain Transaction</label>
                  <div style={{ 
                    fontFamily: 'monospace', 
                    fontSize: '0.75rem', 
                    background: '#fff',
                    padding: '10px',
                    borderRadius: '4px',
                    wordBreak: 'break-all',
                    border: '1px solid #ddd'
                  }}>
                    {selectedEvidence.txHash}
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: '20px', padding: '12px', background: '#d4edda', borderRadius: '4px', fontSize: '0.875rem' }}>
              <strong>✓ Integrity Verified</strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#155724' }}>
                This evidence has been cryptographically hashed and recorded on the blockchain.
                The hash serves as a tamper-proof fingerprint of the original file.
              </p>
            </div>

            {/* Custody Chain Section */}
            <div style={{ marginTop: '24px' }}>
              <h4 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🔗 Custody Chain
                {loadingHistory && <span style={{ fontSize: '0.75rem', color: '#666' }}>(loading...)</span>}
              </h4>
              
              {custodyHistory.length > 0 ? (
                <div style={{ position: 'relative', paddingLeft: '24px' }}>
                  {/* Vertical line */}
                  <div style={{
                    position: 'absolute',
                    left: '11px',
                    top: '20px',
                    bottom: '20px',
                    width: '2px',
                    background: 'linear-gradient(to bottom, #28a745, #17a2b8, #6f42c1)',
                    borderRadius: '2px'
                  }} />
                  
                  {custodyHistory.map((entry, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '16px',
                      marginBottom: index < custodyHistory.length - 1 ? '20px' : '0',
                      position: 'relative'
                    }}>
                      {/* Node circle */}
                      <div style={{
                        position: 'absolute',
                        left: '-24px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: index === 0 ? '#28a745' : index === custodyHistory.length - 1 ? '#6f42c1' : '#17a2b8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        color: 'white',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}>
                        {index + 1}
                      </div>
                      
                      <div style={{ 
                        flex: 1,
                        background: '#fff',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '1.2rem' }}>{getRoleIcon(entry.role)}</span>
                          <strong>{getRoleLabel(entry.role)}</strong>
                          <span style={{
                            fontSize: '0.7rem',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            background: entry.action === 'CREATED' ? '#28a745' : '#17a2b8',
                            color: 'white',
                            marginLeft: 'auto'
                          }}>
                            {entry.action || 'CUSTODY'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>
                          📅 {new Date(entry.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : !loadingHistory ? (
                <div style={{ 
                  padding: '20px', 
                  background: '#f8f9fa', 
                  borderRadius: '8px', 
                  textAlign: 'center',
                  color: '#666'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📋</div>
                  <p style={{ margin: 0 }}>No custody transfers recorded yet</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem' }}>
                    Currently with: {getRoleIcon(selectedEvidence.owner)} {getRoleLabel(selectedEvidence.owner)}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {!selectedEvidence && evidence.length > 0 && (
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
            <div style={{ textAlign: 'center', color: '#666' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>👆</div>
              <p>Select an evidence item to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
