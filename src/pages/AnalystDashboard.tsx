import { useEffect, useState } from 'react'
import { fetchAssignedEvidence } from '../api/api'

interface AssignedItem {
  evidenceId: string
  status: string
  custody: string
}

export default function AnalystDashboard() {
  const [items, setItems] = useState<AssignedItem[]>([])

  useEffect(() => {
    fetchAssignedEvidence().then(setItems).catch(console.error)
  }, [])

  return (
    <div className="page">
      <div className="hero">
        <div>
          <p className="muted">Forensic Workbench</p>
          <h1>Analyst Desk</h1>
          <p>Review evidence assigned to you and coordinate with custody officers.</p>
        </div>
      </div>
      <div className="card">
        <h3>Assigned Evidence</h3>
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
              <tr key={item.evidenceId}>
                <td>{item.evidenceId}</td>
                <td>{item.status}</td>
                <td>{item.custody}</td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td colSpan={3} className="muted center">
                  No assignments yet. Backend can populate this list via /api/evidence/assigned.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
