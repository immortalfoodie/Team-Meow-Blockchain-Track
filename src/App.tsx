import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { ProtectedRoute } from './components/ProtectedRoute'
import { TopBar } from './components/TopBar'
import { useAuth } from './context/AuthContext'
import AnalystDashboard from './pages/AnalystDashboard'
import CustodyTransfer from './pages/CustodyTransfer'
import EvidenceRegistration from './pages/EvidenceRegistration'
import EvidenceVerification from './pages/EvidenceVerification'
import Home from './pages/Home'
import JudgeDashboard from './pages/JudgeDashboard'
import Login from './pages/Login'
import PoliceDashboard from './pages/PoliceDashboard'

function SplashScreen() {
  // Image is served from the public folder as public/meow-logo.png
  const meowLogoUrl = '/meow-logo.png'

  return (
    <div className="splash">
      <div className="splash__orb">
        <img src={meowLogoUrl} alt="Team Meow logo" className="splash__logo-image" />
      </div>
      <div className="splash__logo-ring">
        <span className="splash__title">Team Meow</span>
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
    if (role === 'officer') return <Navigate to="/police" replace />
    if (role === 'analyst') return <Navigate to="/analyst" replace />
    if (role === 'judge') return <Navigate to="/judge" replace />
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

          <Route element={<ProtectedRoute allowedRoles={['officer']} />}>
            <Route path="/police" element={<PoliceDashboard />} />
            <Route path="/police/register" element={<EvidenceRegistration />} />
            <Route path="/police/transfer" element={<CustodyTransfer />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['analyst']} />}>
            <Route path="/analyst" element={<AnalystDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['judge']} />}>
            <Route path="/judge" element={<JudgeDashboard />} />
            <Route path="/judge/verify" element={<EvidenceVerification />} />
          </Route>

          <Route path="/dashboard" element={redirectToRole()} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
