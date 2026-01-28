import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { ProtectedRoute } from './components/ProtectedRoute'
import { TopBar } from './components/TopBar'
import { useAuth } from './context/AuthContext'
import AnalystDashboard from './pages/AnalystDashboard'
import AuditorDashboard from './pages/AuditorDashboard'
import CustodyTransfer from './pages/CustodyTransfer'
import EvidenceList from './pages/EvidenceList'
import EvidenceRegistration from './pages/EvidenceRegistration'
import EvidenceVerification from './pages/EvidenceVerification'
import Home from './pages/Home'
import JudgeDashboard from './pages/JudgeDashboard'
import Login from './pages/Login'
import PoliceDashboard from './pages/PoliceDashboard'

function SplashScreen() {
  return (
    <div className="splash">
      <div className="splash__orb">
        <div style={{ fontSize: '4rem' }}>⚖️</div>
      </div>
      <div className="splash__logo-ring">
        <span className="splash__title">Evidence System</span>
        <span className="splash__subtitle">Judicial Evidence Chain</span>
      </div>
      <div className="splash__loader" aria-label="Loading application">
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}

function App() {
  const { role, isAuthenticated } = useAuth()
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  const redirectToRole = () => {
    if (!isAuthenticated) return <Navigate to="/login" replace />
    if (role === 'POLICE') return <Navigate to="/police" replace />
    if (role === 'LAB') return <Navigate to="/analyst" replace />
    if (role === 'JUDGE') return <Navigate to="/judge" replace />
    if (role === 'ADMIN') return <Navigate to="/auditor" replace />
    return <Navigate to="/login" replace />
  }

  if (showSplash) {
    return (
      <div className="app-shell">
        <SplashScreen />
      </div>
    )
  }

  return (
    <div className="app-shell">
      <TopBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute allowedRoles={['POLICE']} />}>
            <Route path="/police" element={<PoliceDashboard />} />
            <Route path="/police/register" element={<EvidenceRegistration />} />
            <Route path="/police/transfer" element={<CustodyTransfer />} />
            <Route path="/police/evidence" element={<EvidenceList />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['LAB']} />}>
            <Route path="/analyst" element={<AnalystDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['JUDGE']} />}>
            <Route path="/judge" element={<JudgeDashboard />} />
            <Route path="/judge/verify" element={<EvidenceVerification />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/auditor" element={<AuditorDashboard />} />
          </Route>

          <Route path="/dashboard" element={redirectToRole()} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
