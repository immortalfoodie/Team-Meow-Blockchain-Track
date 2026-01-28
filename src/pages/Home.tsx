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
      background: '#e8e5d8'
    }}>
      {/* Hero Section */}
      <div style={{
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#e8e5d8',
        padding: '60px 40px',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Logo Circle */}
        <div style={{
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: '#757f5f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '48px',
          opacity: animate ? 1 : 0,
          transform: animate ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(20px)',
          transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 8px 24px rgba(117, 127, 95, 0.2)'
        }}>
          <span style={{ fontSize: '5rem' }}>⚖️</span>
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
            fontSize: '3rem',
            fontWeight: 700,
            lineHeight: '1.2',
            color: '#3a3d34',
            marginBottom: '32px',
            letterSpacing: '-0.02em'
          }}>
            Judicial Evidence Chain
          </h1>

          <p style={{
            fontSize: '1.125rem',
            lineHeight: '1.7',
            color: '#6b6d66',
            marginBottom: '48px',
            maxWidth: '600px',
            margin: '0 auto 48px'
          }}>
            Secure, immutable evidence management powered by blockchain technology. 
            Ensuring integrity and transparency in the judicial process.
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
          bottom: '60px',
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

      {/* Features Section */}
      <div style={{
        background: '#f5f2e8',
        padding: '80px 40px',
        opacity: animate ? 1 : 0,
        transition: 'opacity 1s ease 0.5s'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '60px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 24px',
              borderRadius: '50%',
              background: '#757f5f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem'
            }}>🔒</div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 600, 
              marginBottom: '12px',
              color: '#3a3d34'
            }}>Immutable Records</h3>
            <p style={{ 
              fontSize: '0.9375rem', 
              color: '#6b6d66',
              lineHeight: '1.6'
            }}>Blockchain-anchored evidence that cannot be altered or deleted</p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 24px',
              borderRadius: '50%',
              background: '#757f5f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem'
            }}>🔗</div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 600, 
              marginBottom: '12px',
              color: '#3a3d34'
            }}>Chain of Custody</h3>
            <p style={{ 
              fontSize: '0.9375rem', 
              color: '#6b6d66',
              lineHeight: '1.6'
            }}>Complete audit trail from collection to courtroom</p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 24px',
              borderRadius: '50%',
              background: '#757f5f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem'
            }}>✓</div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 600, 
              marginBottom: '12px',
              color: '#3a3d34'
            }}>Role-Based Access</h3>
            <p style={{ 
              fontSize: '0.9375rem', 
              color: '#6b6d66',
              lineHeight: '1.6'
            }}>Secure authentication for officers, analysts, and judges</p>
          </div>
        </div>
      </div>
    </div>
  )
}
