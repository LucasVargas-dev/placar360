import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedBookings(courts: any[], users: any[], tournaments: any[]) {
  console.log('📅 Seeding test bookings...');

  const players = users.filter(u => u.code && u.code.startsWith('PLAYER'));
  const clubManager = users.find(u => u.code === 'MANAGER001') || users[0];

  if (players.length === 0) {
    console.log('⚠️  No players found. Using first users as players.');
    players.push(...users.slice(0, 3));
  }

  const bookings = [
    // Bookings for Tennis Club São Paulo
    {
      courtId: courts[0].id,
      userId: players[0].id,
      startTime: new Date('2024-12-15T09:00:00Z'),
      endTime: new Date('2024-12-15T10:30:00Z'),
      status: '2',
      totalAmount: 150.00,
      recurringPattern: 1,
      recurringEndDate: new Date('2024-12-31T23:59:59Z'),
      notes: 'Partida de primeira rodada', 
      type: '2',
      tournamentId: tournaments[0].id,
    },
    {
      courtId: courts[0].id,
      userId: players[1].id,
      startTime: new Date('2024-12-15T11:00:00Z'),
      endTime: new Date('2024-12-15T12:30:00Z'),
      status: '2',
      totalAmount: 150.00,
      recurringPattern: 1,
      recurringEndDate: new Date('2024-12-31T23:59:59Z'),
      notes: 'Partida de primeira rodada',
      type: '2',
      tournamentId: tournaments[0].id,
    },
    {
      courtId: courts[1].id,
      userId: players[2].id,
      startTime: new Date('2024-12-15T14:00:00Z'),
      endTime: new Date('2024-12-15T15:30:00Z'),
      status: '2',
      totalAmount: 120.00,
      recurringPattern: 1,
      recurringEndDate: new Date('2024-12-31T23:59:59Z'),
      notes: 'Partida de segunda rodada',
      type: '2',
      tournamentId: tournaments[0].id,
    },
    
    // Bookings for Rio Tennis Academy
    {
      courtId: courts[3].id,
      userId: players[0].id,
      tournamentId: tournaments[1].id,
      startTime: new Date('2024-12-20T08:00:00Z'),
      endTime: new Date('2024-12-20T09:30:00Z'),
      status: '2',
      totalAmount: 180.00,
      notes: 'Partida de abertura',
      type: '2',
    },
    {
      courtId: courts[3].id,
      userId: players[1].id,
      tournamentId: tournaments[1].id,
      startTime: new Date('2024-12-20T10:00:00Z'),
      endTime: new Date('2024-12-20T11:30:00Z'),
      status: '2',
      totalAmount: 180.00,
      notes: 'Partida de primeira rodada',
      type: '2',
    },

    // Bookings for Belo Horizonte Sports Center
    {
      courtId: courts[5].id,
      userId: players[2].id,
      tournamentId: tournaments[2].id,
      startTime: new Date('2025-01-10T10:00:00Z'),
      endTime: new Date('2025-01-10T11:30:00Z'),
      status: '1',
      totalAmount: 100.00,
      notes: 'Partida de primeira rodada',
      type: '2',
    },
    {
      courtId: courts[6].id,
      userId: players[0].id,
      tournamentId: tournaments[2].id,
      startTime: new Date('2025-01-10T14:00:00Z'),
      endTime: new Date('2025-01-10T15:30:00Z'),
      status: '1',
      totalAmount: 100.00,
      notes: 'Partida de segunda rodada',
      type: '2',
    },

    // Bookings for Curitiba Tennis Club
    {
      courtId: courts[7].id,
      userId: players[1].id,
      tournamentId: tournaments[3].id,
      startTime: new Date('2025-01-25T09:00:00Z'),
      endTime: new Date('2025-01-25T10:30:00Z'),
      status: '1',
      totalAmount: 130.00,
      notes: 'Partida de abertura',
      type: '2',
    },
    {
      courtId: courts[8].id,
      userId: players[2].id,
      tournamentId: tournaments[3].id,
      startTime: new Date('2025-01-25T11:00:00Z'),
      endTime: new Date('2025-01-25T12:30:00Z'),
      status: '1',
      totalAmount: 130.00,
      notes: 'Partida de primeira rodada',
      type: '2',
    },

    // Some regular bookings (not tournament related)
    {
      courtId: courts[0].id,
      userId: players[0].id,
      startTime: new Date('2024-12-10T16:00:00Z'),
      endTime: new Date('2024-12-10T17:30:00Z'),
      status: '2',
      totalAmount: 80.00,
      notes: 'Treino regular',
      type: '1',
    },
    {
      courtId: courts[1].id,
      userId: players[1].id,
      startTime: new Date('2024-12-11T18:00:00Z'),
      endTime: new Date('2024-12-11T19:30:00Z'),
      status: '2',
      totalAmount: 90.00,
      notes: 'Aula particular',
      type: '3',
      teacherId: clubManager.id,
    },
    {
      courtId: courts[2].id,
      userId: players[2].id,
      startTime: new Date('2024-12-12T10:00:00Z'),
      endTime: new Date('2024-12-12T11:30:00Z'),
      status: '2',
      totalAmount: 75.00,
      notes: 'Partida recreativa',
      type: '1',
    },
    {
      courtId: courts[3].id,
      userId: players[0].id,
      startTime: new Date('2024-12-13T14:00:00Z'),
      endTime: new Date('2024-12-13T15:30:00Z'),
      status: '3',
      totalAmount: 100.00,
      notes: 'Cancelado por chuva',
      type: '1',
    },
    {
      courtId: courts[4].id,
      userId: players[1].id,
      startTime: new Date('2024-12-14T09:00:00Z'),
      endTime: new Date('2024-12-14T10:30:00Z'),
      status: '4',
      totalAmount: 85.00,
      notes: 'Partida finalizada',
      type: '1',
    },
  ];

  const createdBookings = [];
  for (const bookingData of bookings) {
    const createdBooking = await prisma.booking.create({
      data: bookingData,
    });
    createdBookings.push(createdBooking);
    console.log(`  ✅ Created booking: ${createdBooking.type} - ${createdBooking.status} - R$ ${createdBooking.totalAmount}`);
  }

  console.log(`📅 Created ${createdBookings.length} test bookings with complete information`);
  return createdBookings;
}

