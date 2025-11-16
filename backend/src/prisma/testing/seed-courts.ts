import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedCourts(clubs: any[]) {
  console.log('🏟️ Seeding test courts...');

  const courts = [
    // Tennis Club São Paulo courts
    {
      clubId: clubs[0].id,
      name: 'Quadra Central',
      sportType: 'TENNIS',
      surface: 'CLAY',
      defaultSlotMinutes: 60,
      hourlyRate: 80.00,
      isActive: true,
    },
    {
      clubId: clubs[0].id,
      name: 'Quadra 2',
      sportType: 'TENNIS',
      surface: 'SYNTHETIC',
      defaultSlotMinutes: 60,
      hourlyRate: 70.00,
      isActive: true,
    },
    {
      clubId: clubs[0].id,
      name: 'Quadra 3',
      sportType: 'TENNIS',
      surface: 'GRASS',
      defaultSlotMinutes: 60,
      hourlyRate: 90.00,
      isActive: true,
    },

    // Rio Tennis Academy courts
    {
      clubId: clubs[1].id,
      name: 'Quadra Principal',
      sportType: 'TENNIS',
      surface: 'CLAY',
      defaultSlotMinutes: 90,
      hourlyRate: 100.00,
      isActive: true,
    },
    {
      clubId: clubs[1].id,
      name: 'Quadra de Treino',
      sportType: 'TENNIS',
      surface: 'SYNTHETIC',
      defaultSlotMinutes: 60,
      hourlyRate: 60.00,
      isActive: true,
    },

    // Sr Padel courts
    {
      clubId: clubs[2].id,
      name: 'Quadra A',
      sportType: 'PADEL',
      surface: 'HARD',
      defaultSlotMinutes: 60,
      hourlyRate: 50.00,
      isActive: true,
    },
    {
      clubId: clubs[2].id,
      name: 'Quadra B',
      sportType: 'PADEL',
      surface: 'CLAY',
      defaultSlotMinutes: 60,
      hourlyRate: 45.00,
      isActive: true,
    },

    // Santa Clara Padel courts
    {
      clubId: clubs[3].id,
      name: 'Quadra Central',
      sportType: 'PADEL',
      surface: 'CLAY',
      defaultSlotMinutes: 60,
      hourlyRate: 55.00,
      isActive: true,
    },
    {
      clubId: clubs[3].id,
      name: 'Quadra Moderna',
      sportType: 'PADEL',
      surface: 'SYNTHETIC',
      defaultSlotMinutes: 60,
      hourlyRate: 65.00,
      isActive: true,
    },
    {
      clubId: clubs[3].id,
      name: 'Quadra Social',
      sportType: 'PADEL',
      surface: 'SYNTHETIC',
      defaultSlotMinutes: 60,
      hourlyRate: 50.00,
      isActive: true,
    },
  ];

  const createdCourts = [];
  for (const court of courts) {
    const createdCourt = await prisma.court.create({
      data: court,
    });
    createdCourts.push(createdCourt);
    console.log(`  ✅ Created court: ${createdCourt.name} (${createdCourt.sportType}) - R$ ${createdCourt.hourlyRate}/hour`);
  }

  console.log(`🏟️ Created ${createdCourts.length} test courts with complete information`);
  return createdCourts;
}

