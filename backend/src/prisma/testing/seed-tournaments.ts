import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const cityCache = new Map<string, number>();

async function resolveCityId(cityName?: string | null, stateUf?: string | null) {
	if (!cityName || !stateUf) return undefined;
	const cacheKey = `${cityName.toLowerCase()}-${stateUf.toLowerCase()}`;
	if (cityCache.has(cacheKey)) {
		return cityCache.get(cacheKey);
	}

	const city = await prisma.city.findFirst({
		where: {
			name: cityName,
			state: {
				is: {
					uf: stateUf,
				},
			},
		},
		select: {
			id: true,
		},
	});

	if (city?.id) {
		cityCache.set(cacheKey, city.id);
		return city.id;
	}

	return undefined;
}

export async function seedTournaments(clubs: any[], users: any[]) {
  console.log('🏆 Seeding test tournaments...');

  // Get organizers - use the first user if specific codes don't exist
  const clubManager = users.find(u => u.code === 'MANAGER001') || users[0];
  const admin = users.find(u => u.code === 'ADMIN001') || users[1] || users[0];

  if (!clubManager || !admin) {
    console.log('⚠️  No users found for tournament organizers. Skipping tournaments.');
    return [];
  }

  const tournaments = [
    {
      clubId: clubs[0].id,
      organizerId: clubManager.id,
      name: 'Copa São Paulo de Tênis 2024',
      description: 'Torneio de tênis profissional em São Paulo',
      sportType: 'TENNIS',
      startDate: new Date('2024-12-15T09:00:00Z'),
      endDate: new Date('2024-12-17T18:00:00Z'),
      registrationStart: new Date('2024-11-01T00:00:00Z'),
      registrationEnd: new Date('2024-12-10T23:59:59Z'),
      maxParticipants: 32,
      status: '1', // PLANNING
      prizes: 'Troféu e medalhas para os vencedores',
      isActive: true,
    },
    {
      clubId: clubs[1].id,
      organizerId: clubManager.id,
      name: 'Rio Tennis Championship',
      description: 'Campeonato de tênis no Rio de Janeiro',
      sportType: 'TENNIS',
      startDate: new Date('2024-12-20T08:00:00Z'),
      endDate: new Date('2024-12-22T17:00:00Z'),
      registrationStart: new Date('2024-11-15T00:00:00Z'),
      registrationEnd: new Date('2024-12-15T23:59:59Z'),
      maxParticipants: 16,
      status: '2', // REGISTRATION_OPEN
      prizes: 'R$ 5.000 em prêmios',
      isActive: true,
    },
    {
      clubId: clubs[2].id,
      organizerId: admin.id,
      name: 'Torneio Sr Padel - Lajeado',
      description: 'Torneio de padel em Lajeado',
      sportType: 'PADEL',
      startDate: new Date('2025-01-10T10:00:00Z'),
      endDate: new Date('2025-01-12T16:00:00Z'),
      registrationStart: new Date('2024-12-01T00:00:00Z'),
      registrationEnd: new Date('2025-01-05T23:59:59Z'),
      maxParticipants: 24,
      status: '1', // PLANNING
      prizes: 'Medalhas e troféus',
      isActive: true,
    },
    {
      clubId: clubs[3].id,
      organizerId: clubManager.id,
      name: 'Santa Clara Padel Masters',
      description: 'Torneio master de padel em Santa Clara',
      sportType: 'PADEL',
      startDate: new Date('2025-01-25T09:00:00Z'),
      endDate: new Date('2025-01-27T18:00:00Z'),
      registrationStart: new Date('2024-12-15T00:00:00Z'),
      registrationEnd: new Date('2025-01-20T23:59:59Z'),
      maxParticipants: 20,
      status: '1', // PLANNING
      prizes: 'Troféu e certificado',
      isActive: true,
    },
  ];

  const createdTournaments = [];
  for (const tournamentData of tournaments) {
    const sourceClub = clubs.find(club => club.id === tournamentData.clubId);
    const cityId = await resolveCityId(sourceClub?.city, sourceClub?.state);
    const { clubId, ...tournamentPayload } = tournamentData;

    const createdTournament = await prisma.tournament.create({
      data: {
        ...tournamentPayload,
        cityId,
      },
    });

    await prisma.clubHasTournament.upsert({
      where: {
        clubId_tournamentId: {
          clubId,
          tournamentId: createdTournament.id,
        },
      },
      update: {
        deletedAt: null,
      },
      create: {
        clubId,
        tournamentId: createdTournament.id,
      },
    });

    createdTournaments.push(createdTournament);
  }

  console.log(`✅ Created ${createdTournaments.length} test tournaments`);
  return createdTournaments;
}

