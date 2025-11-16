import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedPersons() {
  console.log('👥 Seeding test persons...');

  const persons = [
    {
      name: 'Lucas Pereira Vargas',
    },
    {
      name: 'Marcos Vinicius Ribeiro',

    },
    {
      name: 'Thiago Souza',
    },
    {
      name: 'João da Silva',
    },
    {
      name: 'Maria Oliveira',
    },
  ];

  const createdPersons = [];
  for (const person of persons) {
    const createdPerson = await prisma.person.create({
      data: person,
    });
    createdPersons.push(createdPerson);
    console.log(`  ✅ Created person: ${createdPerson.name}`);
  }

  console.log(`👥 Created ${createdPersons.length} test persons`);
  return createdPersons;
}

