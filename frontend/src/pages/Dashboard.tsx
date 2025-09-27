import { useAuth } from '../contexts/AuthContext'
import { Logo } from '../components/Logo'

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Logo size="small" />
          <h1>Dashboard</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Olá, {user?.name || user?.email}!</span>
          <button
            onClick={logout}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Sair
          </button>
        </div>
      </div>

      <div style={{ 
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2>Bem-vindo ao Placar360!</h2>
        <p style={{ marginTop: '1rem', color: '#666' }}>
          Esta é a área logada do sistema. Aqui você poderá gerenciar torneios, 
          partidas e muito mais.
        </p>
        
        <div style={{ marginTop: '2rem' }}>
          <h3>Funcionalidades em desenvolvimento:</h3>
          <ul style={{ marginTop: '1rem', paddingLeft: '2rem' }}>
            <li>Gerenciamento de torneios</li>
            <li>Controle de partidas</li>
            <li>Ranking de jogadores</li>
            <li>Histórico de resultados</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
