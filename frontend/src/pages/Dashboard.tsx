import { Layout } from '../components/Layout';
import { colors } from '../styles/colors';

export function Dashboard() {
  return (
    <Layout>
      <div style={{
        backgroundColor: colors.white,
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: `1px solid ${colors.green.border}`,
        marginBottom: '2rem'
      }}>
        <h1 style={{
          color: colors.green.dark,
          fontSize: '2rem',
          fontWeight: '700',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          🎾 Bem-vindo ao PLACAR360
        </h1>
        
        <p style={{
          color: colors.green.medium,
          fontSize: '1.1rem',
          textAlign: 'center',
          lineHeight: '1.6',
          marginBottom: '2rem'
        }}>
          Sua plataforma completa para gerenciar clubes, torneios e partidas de padel!
        </p>

        {/* Feature Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          {/* Court Booking Card */}
          <div style={{
            backgroundColor: colors.green.lightText + '10',
            borderRadius: '12px',
            padding: '1.5rem',
            border: `2px solid ${colors.green.border}`,
            textAlign: 'center',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
            <h3 style={{
              color: colors.green.dark,
              fontSize: '1.2rem',
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}>
              Reservar Quadra
            </h3>
            <p style={{
              color: colors.green.medium,
              fontSize: '0.9rem',
              lineHeight: '1.4'
            }}>
              Agende sua quadra favorita com facilidade
            </p>
          </div>

          {/* Tournaments Card */}
          <div style={{
            backgroundColor: colors.orange.light + '10',
            borderRadius: '12px',
            padding: '1.5rem',
            border: `2px solid ${colors.orange.base}`,
            textAlign: 'center',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
            <h3 style={{
              color: colors.green.dark,
              fontSize: '1.2rem',
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}>
              Torneios
            </h3>
            <p style={{
              color: colors.green.medium,
              fontSize: '0.9rem',
              lineHeight: '1.4'
            }}>
              Participe de torneios e competições
            </p>
          </div>

          {/* Friends Card */}
          <div style={{
            backgroundColor: colors.green.lightText + '10',
            borderRadius: '12px',
            padding: '1.5rem',
            border: `2px solid ${colors.green.border}`,
            textAlign: 'center',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👫</div>
            <h3 style={{
              color: colors.green.dark,
              fontSize: '1.2rem',
              fontWeight: '600',
              marginBottom: '0.5rem'
            }}>
              Amigos
            </h3>
            <p style={{
              color: colors.green.medium,
              fontSize: '0.9rem',
              lineHeight: '1.4'
            }}>
              Conecte-se com outros jogadores
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{
          marginTop: '3rem',
          padding: '2rem',
          backgroundColor: colors.green.dark + '10',
          borderRadius: '12px',
          border: `1px solid ${colors.green.border}`
        }}>
          <h2 style={{
            color: colors.green.dark,
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            📊 Suas Estatísticas
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '1rem',
              backgroundColor: colors.white,
              borderRadius: '8px',
              border: `1px solid ${colors.green.border}`
            }}>
              <div style={{ fontSize: '2rem', color: colors.orange.base, marginBottom: '0.5rem' }}>🎾</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '600', color: colors.green.dark }}>12</div>
              <div style={{ fontSize: '0.9rem', color: colors.green.medium }}>Partidas</div>
            </div>
            
            <div style={{
              textAlign: 'center',
              padding: '1rem',
              backgroundColor: colors.white,
              borderRadius: '8px',
              border: `1px solid ${colors.green.border}`
            }}>
              <div style={{ fontSize: '2rem', color: colors.orange.base, marginBottom: '0.5rem' }}>🏆</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '600', color: colors.green.dark }}>3</div>
              <div style={{ fontSize: '0.9rem', color: colors.green.medium }}>Torneios</div>
            </div>
            
            <div style={{
              textAlign: 'center',
              padding: '1rem',
              backgroundColor: colors.white,
              borderRadius: '8px',
              border: `1px solid ${colors.green.border}`
            }}>
              <div style={{ fontSize: '2rem', color: colors.orange.base, marginBottom: '0.5rem' }}>👥</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '600', color: colors.green.dark }}>8</div>
              <div style={{ fontSize: '0.9rem', color: colors.green.medium }}>Amigos</div>
            </div>
            
            <div style={{
              textAlign: 'center',
              padding: '1rem',
              backgroundColor: colors.white,
              borderRadius: '8px',
              border: `1px solid ${colors.green.border}`
            }}>
              <div style={{ fontSize: '2rem', color: colors.orange.base, marginBottom: '0.5rem' }}>⭐</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '600', color: colors.green.dark }}>4.8</div>
              <div style={{ fontSize: '0.9rem', color: colors.green.medium }}>Rating</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}