import { Link, Navigate } from 'react-router-dom'
import { Header } from '../navigation/Header'
import { useAuth } from '../contexts/AuthContext'

export default function Home() {
  const { user, loading } = useAuth()

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center py-16 md:py-24">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Gerencie seus torneios com{' '}
            <span className="text-orange-500">Placar360</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A plataforma completa para organizar torneios, gerenciar inscrições,
            criar chaveamentos e acompanhar resultados em tempo real.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200 shadow-lg hover:shadow-xl inline-block"
            >
              Começar Agora
            </Link>
            <Link
              to="/tournaments"
              className="px-8 py-3 bg-white text-orange-500 border-2 border-orange-500 rounded-lg font-semibold hover:bg-orange-50 transition-colors duration-200 inline-block"
            >
              Ver Torneios
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Funcionalidades Principais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Gestão de Torneios
              </h3>
              <p className="text-gray-600">
                Crie e gerencie torneios de forma simples e eficiente. Controle
                inscrições, limites e períodos de registro.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Chaveamentos Automáticos
              </h3>
              <p className="text-gray-600">
                Gere chaveamentos automaticamente ou personalize conforme sua
                necessidade. Acompanhe a evolução em tempo real.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Agenda do Jogador
              </h3>
              <p className="text-gray-600">
                Tenha uma visão personalizada dos seus próximos jogos com
                notificações e lembretes automáticos.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 text-center">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Pronto para começar?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Junte-se a centenas de organizadores que já confiam no Placar360
            </p>
            <Link
              to="/register"
              className="inline-block px-8 py-3 bg-white text-orange-500 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg"
            >
              Criar Conta Gratuita
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2025 Placar360. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

