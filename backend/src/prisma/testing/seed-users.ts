import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedUsers(persons: any[], roles: any[]) {
  console.log('👤 Seeding test users...');

  const systemAdminRole = roles.find(role => role.name === 'System Admin');
  const clubManagerRole = roles.find(role => role.name === 'Club Manager');
  const playerRole = roles.find(role => role.name === 'Player');

  const users = [
    {
      code: '1',
      email: 'lucaspereiravargas@gmail.com',
      phone: '+5551996798120',
      cpf: '04668849073',
      password: '$2a$10$.0JS/P6Oz5boyviMJlD1LurtANDI/YRAg4s5ahAw5kw3qgWBhLCse',
      personId: persons[0].id,
      roleId: systemAdminRole.id,
    },
    {
      code: '2',
      email: 'marcosviniciusribeiro@gmail.com',
      phone: '+5551997890595',
      cpf: '52443186023',
      password: 'Marcos123',
      personId: persons[1].id,
      roleId: clubManagerRole.id,
    },
    {
      code: 'PLAYER001',
      email: 'player1@placar360.com',
      password: 'player123',
      cpf: '22222222222',
      phone: '+5511222222222',
      personId: persons[2].id,
      roleId: playerRole.id,
    },
    {
      code: 'PLAYER002',
      email: 'player2@placar360.com',
      password: 'player123',
      cpf: '33333333333',
      phone: '+5511333333333',
      personId: persons[3].id,
      roleId: playerRole.id,
    },
    {
      code: 'PLAYER003',
      email: 'player3@placar360.com',
      password: 'player123',
      cpf: '44444444444',
      phone: '+5511444444444',
      personId: persons[4].id,
      roleId: playerRole.id,
    },
  ];

  const createdUsers = [];
  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    });
    createdUsers.push(user);
  }

  console.log(`✅ Created ${createdUsers.length} test users`);
  return createdUsers;
}

