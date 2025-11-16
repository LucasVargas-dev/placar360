import { PrismaClient } from '@prisma/client';
// Using numeric types to match schema
// 1=MATCH_REMINDER, 2=MATCH_RESULT, 3=TOURNAMENT_UPDATE, 4=BOOKING_CONFIRMATION, 5=BOOKING_CANCELLATION, 6=TOURNAMENT_STARTING
// Channel: 1=EMAIL, 2=WHATSAPP, 3=BOTH
// Status: 1=PENDING, 2=SENT, 3=FAILED, 4=CANCELLED

const prisma = new PrismaClient();

export async function seedNotifications(users: any[], bookings: any[], tournaments: any[]) {
  console.log('🔔 Seeding test notifications...');

  const players = users.filter(u => u.code && u.code.startsWith('PLAYER'));
  const clubManager = users.find(u => u.code === 'MANAGER001') || users[0];

  if (players.length === 0) {
    console.log('⚠️  No players found. Using first users as players.');
    players.push(...users.slice(0, 3));
  }

  if (bookings.length === 0 || tournaments.length === 0) {
    console.log('⚠️  No bookings or tournaments found. Skipping notifications.');
    return [];
  }

  const notifications = [
    // Booking confirmation notifications
    {
      userId: players[0].id,
      type: '4', // BOOKING_CONFIRMATION
      channel: '3', // BOTH
      title: 'Confirmação de Reserva - Quadra Central',
      message: 'Sua reserva foi confirmada para 15/12/2024 às 09:00 na Quadra Central.',
      data: {
        bookingId: bookings[0].id,
        courtName: 'Quadra Central',
        startTime: bookings[0].startTime,
        endTime: bookings[0].endTime,
        totalAmount: 150.00,
      },
      bookingId: bookings[0].id,
      status: '2', // SENT
      sentAt: new Date(),
    },
    {
      userId: players[1] ? players[1].id : players[0].id,
      type: '4', // BOOKING_CONFIRMATION
      channel: '1', // EMAIL
      title: 'Confirmação de Reserva - Quadra 2',
      message: 'Sua reserva foi confirmada para 15/12/2024 às 11:00 na Quadra 2.',
      data: {
        bookingId: bookings[1].id,
        courtName: 'Quadra 2',
        startTime: bookings[1].startTime,
        endTime: bookings[1].endTime,
        totalAmount: 150.00,
      },
      bookingId: bookings[1].id,
      status: '2', // SENT
      sentAt: new Date(),
    },

    // Match reminder notifications
    {
      userId: players[0].id,
      type: '1', // MATCH_REMINDER
      channel: '2', // WHATSAPP
      title: 'Lembrete de Partida - Quadra Central',
      message: 'Sua partida está agendada para 15/12/2024 às 09:00 na Quadra Central. Torneio: Copa São Paulo de Tênis 2024',
      data: {
        bookingId: bookings[0].id,
        courtName: 'Quadra Central',
        startTime: bookings[0].startTime,
        endTime: bookings[0].endTime,
        tournamentName: 'Copa São Paulo de Tênis 2024',
      },
      bookingId: bookings[0].id,
      status: '1', // PENDING
      scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    },
    {
      userId: players[1] ? players[1].id : players[0].id,
      type: '1', // MATCH_REMINDER
      channel: '3', // BOTH
      title: 'Lembrete de Partida - Quadra 2',
      message: 'Sua partida está agendada para 15/12/2024 às 11:00 na Quadra 2. Torneio: Copa São Paulo de Tênis 2024',
      data: {
        bookingId: bookings[1].id,
        courtName: 'Quadra 2',
        startTime: bookings[1].startTime,
        endTime: bookings[1].endTime,
        tournamentName: 'Copa São Paulo de Tênis 2024',
      },
      bookingId: bookings[1].id,
      status: '1', // PENDING
      scheduledFor: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
    },

    // Match result notifications
    {
      userId: players[0].id,
      type: '2', // MATCH_RESULT
      channel: '3', // BOTH
      title: 'Resultado da Partida - Quadra Central',
      message: 'Sua partida na Quadra Central foi finalizada. Resultado: Vitória. Placar: 6-4, 6-2',
      data: {
        bookingId: bookings[0].id,
        courtName: 'Quadra Central',
        startTime: bookings[0].startTime,
        endTime: bookings[0].endTime,
        result: 'Vitória',
        score: '6-4, 6-2',
        tournamentName: 'Copa São Paulo de Tênis 2024',
      },
      bookingId: bookings[0].id,
      status: '2', // SENT
      sentAt: new Date(),
    },

    // Tournament update notifications
    {
      userId: clubManager.id,
      type: '3', // TOURNAMENT_UPDATE
      channel: '3', // BOTH
      title: 'Atualização do Torneio - Copa São Paulo de Tênis 2024',
      message: 'O torneio "Copa São Paulo de Tênis 2024" foi criado com sucesso! As inscrições estão abertas até 10/12/2024.',
      data: {
        tournamentId: tournaments[0].id,
        tournamentName: 'Copa São Paulo de Tênis 2024',
        updateType: 'REGISTRATION_OPEN',
        message: 'O torneio "Copa São Paulo de Tênis 2024" foi criado com sucesso! As inscrições estão abertas até 10/12/2024.',
      },
      tournamentId: tournaments[0].id,
      status: '2', // SENT
      sentAt: new Date(),
    },
    {
      userId: players[0].id,
      type: '3', // TOURNAMENT_UPDATE
      channel: '1', // EMAIL
      title: 'Atualização do Torneio - Rio Tennis Championship',
      message: 'O status do torneio "Rio Tennis Championship" mudou de "Em Planejamento" para "Inscrições Abertas".',
      data: {
        tournamentId: tournaments[1].id,
        tournamentName: 'Rio Tennis Championship',
        updateType: 'REGISTRATION_OPEN',
        message: 'O status do torneio "Rio Tennis Championship" mudou de "Em Planejamento" para "Inscrições Abertas".',
      },
      tournamentId: tournaments[1].id,
      status: '2', // SENT
      sentAt: new Date(),
    },

    // Tournament starting notifications
    {
      userId: players[0].id,
      type: '6', // TOURNAMENT_STARTING
      channel: '3', // BOTH
      title: 'Torneio Iniciando - Copa São Paulo de Tênis 2024',
      message: 'O torneio "Copa São Paulo de Tênis 2024" está começando em breve! Local: Tennis Club São Paulo',
      data: {
        tournamentId: tournaments[0].id,
        tournamentName: 'Copa São Paulo de Tênis 2024',
        startDate: tournaments[0].startDate,
        location: 'Tennis Club São Paulo',
      },
      tournamentId: tournaments[0].id,
      status: '1', // PENDING
      scheduledFor: new Date(new Date(tournaments[0].startDate).getTime() - 30 * 60 * 1000), // 30 minutes before
    },

    // Failed notification (for testing error handling)
    {
      userId: players[2] ? players[2].id : players[0].id,
      type: '4', // BOOKING_CONFIRMATION
      channel: '2', // WHATSAPP
      title: 'Confirmação de Reserva - Quadra A',
      message: 'Sua reserva foi confirmada para 10/01/2025 às 10:00 na Quadra A.',
      data: {
        bookingId: bookings[5] ? bookings[5].id : bookings[0].id,
        courtName: 'Quadra A',
        startTime: bookings[5] ? bookings[5].startTime : bookings[0].startTime,
        endTime: bookings[5] ? bookings[5].endTime : bookings[0].endTime,
        totalAmount: 100.00,
      },
      bookingId: bookings[5] ? bookings[5].id : bookings[0].id,
      status: '3', // FAILED
    },

    // Cancelled notification
    {
      userId: players[1] ? players[1].id : players[0].id,
      type: '5', // BOOKING_CANCELLATION
      channel: '1', // EMAIL
      title: 'Cancelamento de Reserva - Quadra 2',
      message: 'Sua reserva para 15/12/2024 às 11:00 na Quadra 2 foi cancelada.',
      data: {
        bookingId: bookings[1].id,
        courtName: 'Quadra 2',
        startTime: bookings[1].startTime,
        endTime: bookings[1].endTime,
      },
      bookingId: bookings[1].id,
      status: '2', // SENT
      sentAt: new Date(),
    },
  ];

  const createdNotifications = [];
  for (const notificationData of notifications) {
    const notification = await prisma.notification.create({
      data: notificationData,
    });
    createdNotifications.push(notification);
  }

  console.log(`✅ Created ${createdNotifications.length} test notifications`);
  return createdNotifications;
}

