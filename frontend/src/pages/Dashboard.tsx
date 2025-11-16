import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, GraduationCap, MapPin, Trophy } from 'lucide-react';
import { Layout } from '@pages/_shared/Layout';
import { useAuth } from '../contexts/AuthContext';

const quickActions = [
  {
    title: 'Reservar Quadra',
    description: 'Agende sua quadra favorita com poucos cliques.',
    icon: <Calendar size={40} className="text-orange-500" />,
    to: '/bookings',
  },
  {
    title: 'Torneios',
    description: 'Explore torneios em andamento e faça sua inscrição.',
    icon: <Trophy size={40} className="text-orange-500" />,
    to: '/tournaments',
  },
  {
    title: 'Aulas',
    description: 'Encontre treinadores e melhore seu desempenho.',
    icon: <GraduationCap size={40} className="text-orange-500" />,
    to: '/lessons',
  },
];

type TournamentStatusTone = 'default' | 'alert' | 'neutral';

interface HighlightedTournament {
  id: string;
  name: string;
  description: string;
  startDate: string;
  slots: string;
  location: string;
  status: string;
  statusTone: TournamentStatusTone;
}

const highlightedTournaments: HighlightedTournament[] = [
  {
    id: 'open-placar-2025',
    name: 'Open Placar360 2025',
    description: 'Categoria A e B • Masculino | Feminino • Inscrições até 15/02',
    startDate: '12/02/2025',
    slots: '24 duplas',
    location: 'Clube Padel Pro',
    status: 'Inscrições abertas',
    statusTone: 'default',
  },
  {
    id: 'summer-cup',
    name: 'Summer Cup',
    description: 'Categoria Mista • Chaveamento garantido • Prize R$ 8.000',
    startDate: '05/03/2025',
    slots: '16 duplas',
    location: 'Arena Beach Padel',
    status: 'Poucas vagas',
    statusTone: 'alert',
  },
  {
    id: 'padel-champions',
    name: 'Padel Champions',
    description: 'Categoria Pro • Transmissão ao vivo • Ranking nacional',
    startDate: '21/03/2025',
    slots: '32 duplas',
    location: 'Center Court',
    status: 'Convites enviados',
    statusTone: 'neutral',
  },
];

const tournamentStatusStyles: Record<TournamentStatusTone, { wrapper: string; text: string }> = {
  default: {
    wrapper: 'bg-orange-50 border border-orange-200',
    text: 'text-orange-600',
  },
  alert: {
    wrapper: 'bg-orange-100 border border-orange-300',
    text: 'text-orange-700',
  },
  neutral: {
    wrapper: 'bg-white border border-orange-200',
    text: 'text-orange-600',
  },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userGreetingName = useMemo(() => {
    if (user?.name?.trim()) {
      return user.name.split(' ')[0];
    }

    if (user?.email) {
      return user.email.split('@')[0];
    }

    return 'Jogador';
  }, [user]);

  return (
    <Layout>
      <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
          {/* Hero */}
          <section className="bg-white rounded-2xl shadow-md border border-orange-100 p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-sm font-semibold text-orange-500 uppercase tracking-wide">
                  Bem-vindo de volta
                </p>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                  {userGreetingName}, vamos jogar?
                </h1>
                <p className="text-lg text-gray-600 mt-4 max-w-2xl">
                  Reserva uma quadra agora!
                </p>
              </div>
              <div className="rounded-xl bg-orange-100 px-6 py-4 text-orange-700 font-medium shadow-inner border border-orange-200">
                <span className="text-sm uppercase tracking-widest">Agenda rápida</span>
                <p className="text-lg mt-2">Próximo jogo: Sábado, 14h • Quadra 3</p>
              </div>
            </div>
          </section>

          {/* Quick actions */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Principais ações
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action) => (
                <button
                  key={action.title}
                  onClick={() => navigate(action.to)}
                  className="bg-white border-2 border-orange-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 rounded-xl text-left p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
                >
                  <div className="flex flex-col gap-4 h-full">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-50 text-orange-500 border border-orange-200">
                      {action.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2">
                        {action.description}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-orange-600 mt-auto">
                      Acessar {action.title.toLowerCase()} ↗
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Highlighted tournaments */}
          <section>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Campeonatos em destaque
              </h2>
              <button
                type="button"
                onClick={() => navigate('/tournaments')}
                className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
              >
                Ver todos os torneios
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {highlightedTournaments.map((tournament) => (
                <div
                  key={tournament.id}
                  className="h-full rounded-2xl border-2 border-orange-100 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                >
                  <div className="flex h-full flex-col p-6 space-y-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {tournament.name}
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                          {tournament.description}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tournamentStatusStyles[tournament.statusTone].wrapper} ${tournamentStatusStyles[tournament.statusTone].text}`}
                      >
                        {tournament.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span className="inline-flex items-center gap-2">
                        <Calendar size={18} className="text-orange-500" />
                        <span>
                          Início <span className="font-medium text-gray-900">{tournament.startDate}</span>
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Trophy size={18} className="text-orange-500" />
                        <span>
                          Vagas <span className="font-medium text-gray-900">{tournament.slots}</span>
                        </span>
                      </span>
                    </div>

                    <div className="mt-auto flex items-center justify-between text-sm">
                      <span className="inline-flex items-center gap-2 text-gray-500">
                        <MapPin size={16} className="text-orange-400" />
                        {tournament.location}
                      </span>
                      <button
                        type="button"
                        onClick={() => navigate(`/tournaments/${tournament.id}`)}
                        className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                      >
                        Ver detalhes
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}