import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function TopBar() {
  const { isAuthenticated, role, name, logout } = useAuth()

  const getRoleLabel = (r: string | null) => {
    switch(r) {
      case 'POLICE': return '👮 Police'
      case 'LAB': return '🔬 Lab Analyst'
      case 'JUDGE': return '⚖️ Judge'
      case 'ADMIN': return '👨‍💼 Admin'
      default: return 'User'
    }
  }

  return (
    <header className="topbar">
      <div className="topbar__brand">⚖️ Judicial Evidence Chain</div>
      {isAuthenticated ? (
        <div className="topbar__session">
          <div className="topbar__user">
            <span className="pill">{getRoleLabel(role)}</span>
            <span>{name || 'Authenticated User'}</span>
          </div>
          <nav className="topbar__nav">
            <Link to="/">Home</Link>
            {role === 'POLICE' && (
              <>
                <Link to="/police">Officer Desk</Link>
                <Link to="/police/register">Register Evidence</Link>
                <Link to="/police/transfer">Transfer Custody</Link>
                <Link to="/police/evidence">View Evidence</Link>
              </>
            )}
            {role === 'LAB' && <Link to="/analyst">Analyst Desk</Link>}
            {role === 'JUDGE' && (
              <>
                <Link to="/judge">Judge Desk</Link>
                <Link to="/judge/verify">Verify Evidence</Link>
              </>
            )}
            {role === 'ADMIN' && (
              <>
                <Link to="/auditor">Audit Dashboard</Link>
              </>
            )}
            <button className="ghost" onClick={logout} aria-label="Logout">
              Logout
            </button>
          </nav>
        </div>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </header>
  )
}
