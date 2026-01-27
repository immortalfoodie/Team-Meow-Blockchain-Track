import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function TopBar() {
  const { isAuthenticated, role, name, logout } = useAuth()

  return (
    <header className="topbar">
      <div className="topbar__brand">Judicial Evidence Chain</div>
      {isAuthenticated ? (
        <div className="topbar__session">
          <div className="topbar__user">
            <span className="pill">{role}</span>
            <span>{name || 'Authenticated User'}</span>
          </div>
          <nav className="topbar__nav">
            <Link to="/">Home</Link>
            {role === 'officer' && (
              <>
                <Link to="/police">Officer Desk</Link>
                <Link to="/police/register">Register Evidence</Link>
                <Link to="/police/transfer">Transfer Custody</Link>
              </>
            )}
            {role === 'analyst' && <Link to="/analyst">Analyst Desk</Link>}
            {role === 'judge' && (
              <>
                <Link to="/judge">Judge Desk</Link>
                <Link to="/judge/verify">Verify Evidence</Link>
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
