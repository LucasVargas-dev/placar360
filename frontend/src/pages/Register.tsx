import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Logo } from '../components/Logo'
import { colors } from '../styles/colors'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(email, password, name)
      navigate('/login')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${colors.background.gradientFrom} 0%, ${colors.background.gradientVia} 50%, ${colors.background.gradientTo} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />
      
      <div style={{ 
        width: '100%', 
        maxWidth: '420px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Register Card */}
        <div style={{ 
          backgroundColor: colors.white,
          borderRadius: '16px',
          padding: '2.5rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)',
          border: `1px solid ${colors.green.border}`,
          backdropFilter: 'blur(10px)'
        }}>
          {/* Logo Section */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '2.5rem' 
          }}>
            <Logo size="large" />
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: colors.green.dark,
              marginTop: '1rem',
              marginBottom: '0.5rem'
            }}>
              Crie sua conta
            </h1>
            <p style={{
              color: colors.green.medium,
              fontSize: '0.95rem'
            }}>
              Junte-se ao PLACAR360 e comece a organizar seus torneios
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                color: colors.green.dark,
                fontWeight: '500',
                fontSize: '0.9rem'
              }}>
                Nome (opcional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite seu nome completo"
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  border: `2px solid ${colors.green.border}`,
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: colors.white,
                  color: colors.green.dark,
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.orange.base
                  e.target.style.boxShadow = `0 0 0 3px ${colors.orange.light}20`
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.green.border
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            {/* Email Field */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                color: colors.green.dark,
                fontWeight: '500',
                fontSize: '0.9rem'
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Digite seu email"
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  border: `2px solid ${colors.green.border}`,
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: colors.white,
                  color: colors.green.dark,
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.orange.base
                  e.target.style.boxShadow = `0 0 0 3px ${colors.orange.light}20`
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.green.border
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem',
                color: colors.green.dark,
                fontWeight: '500',
                fontSize: '0.9rem'
              }}>
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Digite sua senha"
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  border: `2px solid ${colors.green.border}`,
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: colors.white,
                  color: colors.green.dark,
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.orange.base
                  e.target.style.boxShadow = `0 0 0 3px ${colors.orange.light}20`
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.green.border
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div style={{ 
                color: '#DC2626', 
                marginBottom: '1.5rem',
                padding: '0.75rem',
                backgroundColor: '#FEF2F2',
                borderRadius: '8px',
                border: '1px solid #FECACA',
                fontSize: '0.9rem'
              }}>
                {error}
              </div>
            )}

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                backgroundColor: loading ? colors.green.medium : colors.orange.base,
                color: colors.white,
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: loading ? 'none' : `0 4px 12px ${colors.orange.base}40`,
                opacity: loading ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = colors.orange.hover
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = `0 6px 16px ${colors.orange.base}50`
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = colors.orange.base
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = `0 4px 12px ${colors.orange.base}40`
                }
              }}
            >
              {loading ? 'Criando...' : 'Criar Conta'}
            </button>
          </form>

          {/* Login Link */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: `1px solid ${colors.green.lightText}`
          }}>
            <p style={{ 
              color: colors.green.medium,
              fontSize: '0.9rem',
              margin: 0
            }}>
              Já tem conta?{' '}
              <Link 
                to="/login" 
                style={{
                  color: colors.orange.base,
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.orange.hover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.orange.base
                }}
              >
                Faça login
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          color: colors.white,
          fontSize: '0.85rem',
          opacity: 0.8
        }}>
          © 2025 PLACAR360. Todos os direitos reservados.
        </div>
      </div>
    </div>
  )
}
