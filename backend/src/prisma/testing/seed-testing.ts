import { PrismaClient } from '@prisma/client';
import { seedPersons } from './seed-persons';
import { seedUsers } from './seed-users';
import { seedClubs } from './seed-clubs';
import { seedCourts } from './seed-courts';
import { seedTournaments } from './seed-tournaments';
import { seedBookings } from './seed-bookings';
import { seedNotifications } from './seed-notifications';

const prisma = new PrismaClient();

async function main() {
  console.log('🧪 Starting comprehensive testing data seeding...\n');

  try {
    // Get existing roles (they should be created by the main seed)
    const roles = await prisma.role.findMany();
    if (roles.length === 0) {
      console.log('⚠️  No roles found. Please run the main seed first: npm run prisma:seed');
      return;
    }

    // 1. Seed persons
    const persons = await seedPersons();
    console.log('');

    // 2. Seed users
    const users = await seedUsers(persons, roles);
    console.log('');

    // 3. Seed clubs
    const clubs = await seedClubs();
    console.log('');

    // 4. Seed courts
    const courts = await seedCourts(clubs);
    console.log('');

    // 5. Seed tournaments
    const tournaments = await seedTournaments(clubs, users);
    console.log('');

    // 6. Seed bookings
    const bookings = await seedBookings(courts, users, tournaments);
    console.log('');

    // 7. Seed notifications
    const notifications = await seedNotifications(users, bookings, tournaments);
    console.log('');

    // 8. Create user-club relationships
    console.log('🔗 Creating user-club relationships...');
    const userClubRelations = [];
    for (let i = 0; i < clubs.length; i++) {
      const club = clubs[i];
      const user = users[i % users.length]; // Distribute users across clubs
      
      const userClub = await prisma.userClub.upsert({
        where: {
          userId_clubId: {
            userId: user.id,
            clubId: club.id,
          },
        },
        update: {},
        create: {
          userId: user.id,
          clubId: club.id,
          relationshipType: 'MEMBER',
          isActive: true,
        },
      });
      userClubRelations.push(userClub);
    }
    console.log(`✅ Created ${userClubRelations.length} user-club relationships\n`);

    // 9. Create tournament participants
    console.log('👥 Creating tournament participants...');
    const participants = [];
    for (const tournament of tournaments) {
      const players = users.filter(u => u.code.startsWith('PLAYER'));
      for (let i = 0; i < Math.min(3, players.length); i++) {
        const participant = await prisma.tournamentParticipant.upsert({
          where: {
            tournamentId_userId: {
              tournamentId: tournament.id,
              userId: players[i].id,
            },
          },
          update: {},
          create: {
            userId: players[i].id,
            tournamentId: tournament.id,
            status: 'REGISTERED',
          },
        });
        participants.push(participant);
      }
    }
    console.log(`✅ Created ${participants.length} tournament participants\n`);

    // 10. Create notification preferences for users
    console.log('⚙️ Creating notification preferences...');
    const preferences = [];
    for (const user of users) {
      const preference = await prisma.notificationPreferences.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          emailEnabled: true,
          whatsappEnabled: true,
          matchReminders: true,
          matchResults: true,
          tournamentUpdates: true,
          tournamentStarting: true,
          bookingConfirmations: true,
          bookingCancellations: true,
          reminderMinutesBefore: 60,
        },
      });
      preferences.push(preference);
    }
    console.log(`✅ Created ${preferences.length} notification preferences\n`);

    // Summary
    console.log('🎉 Testing data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   👥 Persons: ${persons.length}`);
    console.log(`   👤 Users: ${users.length}`);
    console.log(`   🏢 Clubs: ${clubs.length}`);
    console.log(`   🏟️ Courts: ${courts.length}`);
    console.log(`   🏆 Tournaments: ${tournaments.length}`);
    console.log(`   📅 Bookings: ${bookings.length}`);
    console.log(`   🔔 Notifications: ${notifications.length}`);
    console.log(`   🔗 User-Club Relations: ${userClubRelations.length}`);
    console.log(`   👥 Tournament Participants: ${participants.length}`);
    console.log(`   ⚙️ Notification Preferences: ${preferences.length}`);

    console.log('\n🧪 Test Data IDs (for testing):');
    console.log(`   👤 Admin User ID: ${users.find(u => u.code === 'ADMIN001')?.id}`);
    console.log(`   👤 Manager User ID: ${users.find(u => u.code === 'MANAGER001')?.id}`);
    console.log(`   👤 Player 1 ID: ${users.find(u => u.code === 'PLAYER001')?.id}`);
    console.log(`   🏢 Club 1 ID: ${clubs[0]?.id}`);
    console.log(`   🏟️ Court 1 ID: ${courts[0]?.id}`);
    console.log(`   🏆 Tournament 1 ID: ${tournaments[0]?.id}`);
    console.log(`   📅 Booking 1 ID: ${bookings[0]?.id}`);
    console.log(`   🔔 Notification 1 ID: ${notifications[0]?.id}`);

    console.log('\n🚀 Ready for testing! You can now:');
    console.log('   1. Run the notification tests: node test-notification-script.js');
    console.log('   2. Use the HTTP test file: test-notifications.http');
    console.log('   3. Test the API endpoints with the provided IDs');

  } catch (error) {
    console.error('❌ Error during testing data seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error during testing seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

