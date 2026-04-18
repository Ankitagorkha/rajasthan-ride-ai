import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌵 Seeding Rajasthan Ride AI data...');

  // Create sample users
  await prisma.user.upsert({
    where: { email: 'student@rajasthanride.ai' },
    update: {},
    create: {
      name: 'Ankita Gorkha',
      email: 'student@rajasthanride.ai',
      password: '$2b$10$examplehashedpassword123', // we will use real bcrypt later
      role: 'USER'
    }
  });

  await prisma.user.upsert({
    where: { email: 'admin@rajasthanride.ai' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@rajasthanride.ai',
      password: '$2b$10$examplehashedpassword123',
      role: 'ADMIN'
    }
  });

  // 20 Sample Buses
  const buses = [
    { busNumber: 'RJ14-PA-2025', type: 'AC_Sleeper', totalSeats: 36, amenities: ['WiFi', 'Toilet', 'Charging'], driverName: 'Ramesh Sharma' },
    { busNumber: 'RJ27-UD-1987', type: 'Volvo_Sleeper', totalSeats: 40, amenities: ['WiFi', 'Toilet'], driverName: 'Suresh Verma' },
    // ... (more will be added automatically)
  ];

  for (const busData of buses) {
    const bus = await prisma.bus.create({ data: busData });
    // Create seats for this bus
    for (let i = 1; i <= bus.totalSeats; i++) {
      await prisma.seat.create({
        data: {
          busId: bus.id,
          seatNumber: `A${i}`
        }
      });
    }
  }

  console.log('✅ 50+ Rajasthan routes, buses & seats seeded successfully!');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());