const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const attributes = [
    { name: 'Park' },
    { name: 'Mall' },
    { name: 'Stairs' },
    { name: 'Benches' },
    { name: 'Wifi' },
    { name: 'Sheltered' },
    { name: 'Windy' },
    { name: 'Aircon' },
  ];

  for (const attribute of attributes) {
    await prisma.attribute.upsert({
      where: { name: attribute.name },
      update: {},
      create: attribute,
    });
  }

  console.log('Seed data for attributes added!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
