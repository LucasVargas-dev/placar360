import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedClubs() {
  console.log('🏢 Seeding test clubs...');

  const clubs = [
    {
      name: 'Tennis Club São Paulo',
      description: 'Premium tennis club in São Paulo',
      addressLine: 'Av. Paulista, 1000 - Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      phone: '+5511999888777',
      email: 'contato@tennisclubsp.com.br',
      timezone: 'America/Sao_Paulo',
      openTime: '06:00',
      closeTime: '23:00',
      isActive: true,
    },
    {
      name: 'Rio Tennis Academy',
      description: 'Professional tennis academy in Rio de Janeiro',
      addressLine: 'Rua das Flores, 500 - Copacabana',
      city: 'Rio de Janeiro',
      state: 'RJ',
      phone: '+5521988777666',
      email: 'info@riotennis.com.br',
      timezone: 'America/Sao_Paulo',
      openTime: '07:00',
      closeTime: '22:00',
      isActive: true,
    },
    {
      name: 'Sr Padel',
      description: 'Padel club in Lajeado',
      addressLine: 'Rua Oswaldo Mathias Ely, 287 - Montanha',
      city: 'Lajeado',
      state: 'RS',
      phone: '+5531987654321',
      email: 'contato@srpadel.com.br',
      timezone: 'America/Sao_Paulo',
      openTime: '06:00',
      closeTime: '23:00',
      isActive: true,
    },
    {
      name: 'Santa Clara Padel',
      description: 'Padel club in Santa Clara',
      addressLine: 'Rua Santa Clara, 100',
      city: 'Santa Clara',
      state: 'RS',
      phone: '+5541999888777',
      email: 'contato@santaclara.com.br',
      timezone: 'America/Sao_Paulo',
      openTime: '06:00',
      closeTime: '23:00',
      isActive: true,
    },
  ];

  const createdClubs = [];
  for (const clubData of clubs) {
    const club = await prisma.club.create({
      data: clubData,
    });
    createdClubs.push(club);
  }

  console.log(`✅ Created ${createdClubs.length} test clubs`);
  return createdClubs;
}

