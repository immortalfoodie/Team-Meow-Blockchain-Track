import { useEffect, useState } from 'react'
import { getAllUsers } from '../api/api'

interface AuditEntry {
  id?: string
  action: string
  user?: string
  username?: string
  role: string
  timestamp: string
  txHash?: string
  status?: string
  userId?: string
  evidenceId?: string
  details?: any
}

interface UserData {
  id: string
  username: string
  name: string
  role: string
}

export default function AuditorDashboard() {
  const [animate, setAnimate] = useState(false)
  const [stats, setStats] = useState({
    totalTransactions: 0,
    evidenceItems: 0,
    verified: 0,
    pending: 0
  })
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([])
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAuditData()
    setAnimate(true)
  }, [])

  const loadAuditData = async () => {
    try {
      // Fetch users to build a user directory
      const userList = await getAllUsers()
      setUsers(userList || [])

      // In a real system, you'd fetch audit logs from the backend
      // For now, we'll show a demo with backend logs from localStorage or API
      const demoAuditTrail: AuditEntry[] = [
        {
          id: 'EVD-001',
          action: 'Evidence Uploaded',
          username: 'officer_sharma',
          role: 'POLICE',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          txHash: '0x7a3f9c8b2d1e4f5a9c3b6d8e1f4a7b9c',
          status: 'Verified',
          evidenceId: 'EV-2026-001'
        },
        {
          id: 'EVD-001',
          action: 'Evidence Verified',
          username: 'lab_verma',
          role: 'LAB',
          timestamp: new Date(Date.now() - 43200000).toISOString(),
          txHash: '0x4b8e2a9f3c1d5e7a2b6f8c1e4d7a9b3f',
          status: 'Verified',
          evidenceId: 'EV-2026-001'
        },
        {
          id: 'EVD-002',
          action: 'Evidence Accessed',
          username: 'judge_mehta',
          role: 'JUDGE',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          txHash: '0x9d5c1f2a8b4e7c3d6f1a4b8e2c5d9f3a',
          status: 'Viewed',
          evidenceId: 'EV-2026-002'
        }
      ]

      setAuditTrail(auditTrail.length > 0 ? auditTrail : demoAuditTrail)

      // Calculate stats
      setStats({
        totalTransactions: auditTrail.length || demoAuditTrail.length,
        evidenceItems: new Set(auditTrail.map(a => a.evidenceId || a.id)).size || 2,
        verified: auditTrail.filter(a => a.status === 'Verified').length || 2,
        pending: auditTrail.filter(a => a.status === 'Pending').length || 0
      })
    } catch (error) {
      console.error('Failed to load audit data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getUserName = (username: string) => {
    const user = users.find(u => u.username === username)
    return user?.name || username
  }

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'POLICE': return '#3b82f6'
      case 'LAB': return '#10b981'
      case 'JUDGE': return '#f59e0b'
      case 'ADMIN': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <div className="page" style={{ opacity: animate ? 1 : 0, transform: animate ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out' }}>
      <div style={{ marginBottom: '32px' }}>
        <p className="muted" style={{ marginBottom: '12px' }}>SYSTEM OVERVIEW</p>
        <h1 style={{ marginBottom: '16px' }}>Audit Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
          Complete ledger view of all blockchain transactions and evidence lifecycle events
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid two" style={{ marginBottom: '48px' }}>
        <div className="stat">
          <div className="stat__value">{stats.totalTransactions}</div>
          <div className="stat__note">Total Transactions</div>
        </div>
        <div className="stat">
          <div className="stat__value">{stats.evidenceItems}</div>
          <div className="stat__note">Evidence Items</div>
        </div>
        <div className="stat">
          <div className="stat__value">{stats.verified}</div>
          <div className="stat__note">Verified</div>
        </div>
        <div className="stat">
          <div className="stat__value">{stats.pending}</div>
          <div className="stat__note">Pending</div>
        </div>
      </div>

      {/* Blockchain Transaction List */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <h2 style={{ marginBottom: '24px' }}>Blockchain Transaction Ledger</h2>
        {loading ? (
          <p className="muted">Loading audit trail...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            {auditTrail.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Evidence ID</th>
                    <th>Action</th>
                    <th>User</th>
                    <th>Role</th>
                    <th>Timestamp</th>
                    <th>Transaction Hash</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {auditTrail.map((entry, index) => (
                    <tr key={index}>
                      <td><strong>{entry.evidenceId || entry.id}</strong></td>
                      <td>{entry.action}</td>
                      <td>{getUserName(entry.username || entry.user || '')}</td>
                      <td>
                        <span className="pill" style={{
                          background: getRoleColor(entry.role),
                          color: '#ffffff',
                          padding: '4px 8px',
                          borderRadius: '3px',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}>
                          {entry.role}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.875rem' }}>
                        {new Date(entry.timestamp).toLocaleString()}
                      </td>
                      <td>
                        {entry.txHash ? (
                          <a 
                            href={`https://sepolia.etherscan.io/tx/${entry.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ 
                              color: 'var(--accent-primary)', 
                              textDecoration: 'none',
                              fontFamily: 'monospace',
                              fontSize: '0.875rem'
                            }}
                            title={entry.txHash}
                          >
                            {entry.txHash.substring(0, 10)}... ↗
                          </a>
                        ) : (
                          <span className="muted">Pending</span>
                        )}
                      </td>
                      <td>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '3px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          background: entry.status === 'Verified' ? '#d1fae5' : entry.status === 'Viewed' ? '#dbeafe' : '#fef3c7',
                          color: entry.status === 'Verified' ? '#065f46' : entry.status === 'Viewed' ? '#0c4a6e' : '#92400e'
                        }}>
                          {entry.status || 'Recorded'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="muted" style={{ textAlign: 'center', padding: '20px' }}>No audit records available yet.</p>
            )}
          </div>
        )}
      </div>

      {/* Evidence Audit Trail */}
      <div className="card">
        <h2 style={{ marginBottom: '24px' }}>Evidence Lifecycle Timeline</h2>
        <ul className="verification-timeline">
          {auditTrail.length > 0 ? (
            auditTrail.map((entry, idx) => (
              <li key={idx}>
                <strong>{new Date(entry.timestamp).toLocaleString()}</strong> — {entry.action} by {getUserName(entry.username || entry.user || 'Unknown')}
                <br />
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Evidence: {entry.evidenceId || entry.id} | Role: {entry.role}
                  {entry.txHash && <> | Tx: {entry.txHash.substring(0, 16)}...</>}
                </span>
              </li>
            ))
          ) : (
            <li>
              <span className="muted">No audit trail records available.</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
