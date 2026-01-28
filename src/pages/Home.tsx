import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'

export default function Home() {
  const { isAuthenticated, role } = useAuth()
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(true)
  }, [])

  return (
    <div className="page" style={{ 
      opacity: animate ? 1 : 0, 
      transition: 'opacity 1s ease',
      padding: 0,
      maxWidth: '100%',
      background: '#e8e5d8',
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Hero Section */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#e8e5d8',
        padding: '20px',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Logo Circle */}
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: '#757f5f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '32px',
          opacity: animate ? 1 : 0,
          transform: animate ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(20px)',
          transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 8px 24px rgba(117, 127, 95, 0.2)'
        }}>
          <span style={{ fontSize: '3.5rem' }}>⚖️</span>
        </div>

        {/* Title Section */}
        <div style={{
          maxWidth: '700px',
          opacity: animate ? 1 : 0,
          transform: animate ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.2s'
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: '#757f5f',
            marginBottom: '16px'
          }}>
            Evidence System
          </div>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            lineHeight: '1.2',
            color: '#3a3d34',
            marginBottom: '20px',
            letterSpacing: '-0.02em'
          }}>
            Judicial Evidence Chain
          </h1>

          <p style={{
            fontSize: '1rem',
            lineHeight: '1.6',
            color: '#6b6d66',
            marginBottom: '32px',
            maxWidth: '600px',
            margin: '0 auto 32px'
          }}>
            Secure, immutable evidence management powered by blockchain technology.
          </p>

          {/* CTA Button */}
          {isAuthenticated ? (
            <Link 
              className="button" 
              to={role === 'officer' ? '/police' : role === 'analyst' ? '/analyst' : '/judge'}
              style={{
                display: 'inline-block',
                background: '#757f5f',
                color: '#ffffff',
                padding: '16px 48px',
                fontSize: '1rem',
                fontWeight: 600,
                border: '2px solid #757f5f',
                borderRadius: '6px',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                opacity: animate ? 1 : 0,
                transform: animate ? 'translateY(0)' : 'translateY(20px)',
                boxShadow: '0 4px 12px rgba(117, 127, 95, 0.2)'
              }}
            >
              Enter Dashboard
            </Link>
          ) : (
            <Link 
              className="button" 
              to="/login"
              style={{
                display: 'inline-block',
                background: '#757f5f',
                color: '#ffffff',
                padding: '16px 48px',
                fontSize: '1rem',
                fontWeight: 600,
                border: '2px solid #757f5f',
                borderRadius: '6px',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                opacity: animate ? 1 : 0,
                transform: animate ? 'translateY(0)' : 'translateY(20px)',
                boxShadow: '0 4px 12px rgba(117, 127, 95, 0.2)'
              }}
            >
              Access Portal
            </Link>
          )}
        </div>

        {/* Loading Dots Indicator */}
        <div style={{
          position: 'absolute',
          bottom: '30px',
          display: 'flex',
          gap: '12px',
          opacity: animate ? 0.4 : 0,
          transition: 'opacity 1s ease 0.8s'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#757f5f',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}></div>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#757f5f',
            animation: 'pulse 1.5s ease-in-out infinite 0.2s'
          }}></div>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#757f5f',
            animation: 'pulse 1.5s ease-in-out infinite 0.4s'
          }}></div>
        </div>
      </div>
    </div>
  )
}
