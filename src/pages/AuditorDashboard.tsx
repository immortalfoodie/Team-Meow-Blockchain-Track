import { useEffect, useState } from 'react'

export default function AuditorDashboard() {
  const [animate, setAnimate] = useState(false)
  const [auditTrail, setAuditTrail] = useState([
    {
      id: 'EVD-001',
      action: 'Evidence Uploaded',
      user: 'Officer John Doe',
      role: 'Police Officer',
      timestamp: '2026-01-28 09:15:23',
      txHash: '0x7a3f9c...8d2e1b',
      status: 'Verified'
    },
    {
      id: 'EVD-001',
      action: 'Evidence Verified',
      user: 'Dr. Sarah Smith',
      role: 'Forensic Analyst',
      timestamp: '2026-01-28 11:30:45',
      txHash: '0x4b8e2a...3c9f7d',
      status: 'Verified'
    },
    {
      id: 'EVD-002',
      action: 'Evidence Accessed',
      user: 'Judge Williams',
      role: 'Judge',
      timestamp: '2026-01-28 14:22:10',
      txHash: '0x9d5c1f...6e4a2b',
      status: 'Viewed'
    }
  ])

  useEffect(() => {
    setAnimate(true)
  }, [])

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
          <div className="stat__value">47</div>
          <div className="stat__note">Total Transactions</div>
        </div>
        <div className="stat">
          <div className="stat__value">12</div>
          <div className="stat__note">Evidence Items</div>
        </div>
        <div className="stat">
          <div className="stat__value">45</div>
          <div className="stat__note">Verified</div>
        </div>
        <div className="stat">
          <div className="stat__value">2</div>
          <div className="stat__note">Pending</div>
        </div>
      </div>

      {/* Blockchain Transaction List */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <h2 style={{ marginBottom: '24px' }}>Blockchain Transaction Ledger</h2>
        <div style={{ overflowX: 'auto' }}>
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
                  <td><strong>{entry.id}</strong></td>
                  <td>{entry.action}</td>
                  <td>{entry.user}</td>
                  <td>
                    <span className="pill" style={{
                      background: entry.role === 'Police Officer' ? 'var(--accent-officer)' : 
                                 entry.role === 'Forensic Analyst' ? 'var(--accent-analyst)' : 
                                 'var(--accent-judge)',
                      color: '#ffffff'
                    }}>
                      {entry.role}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.875rem' }}>{entry.timestamp}</td>
                  <td>
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
                    >
                      {entry.txHash} ↗
                    </a>
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: '3px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: entry.status === 'Verified' ? '#d1fae5' : '#fef3c7',
                      color: entry.status === 'Verified' ? '#065f46' : '#92400e'
                    }}>
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Evidence Audit Trail */}
      <div className="card">
        <h2 style={{ marginBottom: '24px' }}>Evidence Lifecycle Timeline</h2>
        <ul className="verification-timeline">
          <li>
            <strong>2026-01-28 09:15:23</strong> — Evidence uploaded by Officer John Doe
            <br />
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Hash generated: 0x7a3f9c8b...2e1b4d6a
            </span>
          </li>
          <li>
            <strong>2026-01-28 09:16:01</strong> — Blockchain transaction confirmed
            <br />
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Tx: 0x7a3f9c...8d2e1b
            </span>
          </li>
          <li>
            <strong>2026-01-28 11:30:45</strong> — Forensic verification completed by Dr. Sarah Smith
            <br />
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Status: Hash matched ✓
            </span>
          </li>
          <li>
            <strong>2026-01-28 14:22:10</strong> — Evidence accessed by Judge Williams
            <br />
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Purpose: Case review
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}
