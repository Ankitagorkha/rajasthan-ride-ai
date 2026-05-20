import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const buses = [
  { busNumber: 'RJ14-PA-2025', type: 'AC_Sleeper', totalSeats: 36, amenities: ['WiFi', 'Toilet', 'Charging', 'CCTV'], driverName: 'Ramesh Sharma' },
  { busNumber: 'RJ27-UD-1987', type: 'Volvo_Sleeper', totalSeats: 40, amenities: ['WiFi', 'Toilet', 'Blanket'], driverName: 'Suresh Verma' },
  { busNumber: 'RJ19-JD-4567', type: 'AC_Seater', totalSeats: 44, amenities: ['Charging', 'CCTV', 'Water'], driverName: 'Imran Khan' }
];

const routes = [
  { from: 'Jaipur', to: 'Udaipur', distance: 395, duration: 525, basePrice: 650 },
  { from: 'Jodhpur', to: 'Jaisalmer', distance: 285, duration: 360, basePrice: 850 },
  { from: 'Udaipur', to: 'Mount Abu', distance: 165, duration: 240, basePrice: 450 },
  { from: 'Jaipur', to: 'Pushkar', distance: 150, duration: 190, basePrice: 300 }
];

async function main() {
  console.log("Seeding Rajasthan Rider's data...");

  const userPassword = await bcrypt.hash('student123', 10);
  const adminPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'student@rajasthanride.ai' },
    update: { password: userPassword },
    create: { name: 'Ankita Gorkha', email: 'student@rajasthanride.ai', password: userPassword, role: 'USER' }
  });

  await prisma.user.upsert({
    where: { email: 'admin@rajasthanride.ai' },
    update: { password: adminPassword, role: 'ADMIN' },
    create: { name: 'Admin', email: 'admin@rajasthanride.ai', password: adminPassword, role: 'ADMIN' }
  });

  const savedRoutes = [];
  for (const routeData of routes) {
    const existing = await prisma.route.findFirst({ where: { from: routeData.from, to: routeData.to } });
    savedRoutes.push(existing || await prisma.route.create({ data: routeData }));
  }

  for (const [index, busData] of buses.entries()) {
    const bus = await prisma.bus.upsert({
      where: { busNumber: busData.busNumber },
      update: busData,
      create: busData
    });

    const seatCount = await prisma.seat.count({ where: { busId: bus.id } });
    if (seatCount === 0) {
      await prisma.seat.createMany({
        data: Array.from({ length: bus.totalSeats }, (_, seatIndex) => ({
          busId: bus.id,
          seatNumber: `A${seatIndex + 1}`
        }))
      });
    }

    const route = savedRoutes[index % savedRoutes.length];
    const departure = new Date();
    departure.setDate(departure.getDate() + index + 1);
    departure.setHours(21 + index, 30, 0, 0);

    const arrival = new Date(departure.getTime() + route.duration * 60 * 1000);
    const existingSchedule = await prisma.schedule.findFirst({ where: { busId: bus.id, routeId: route.id } });
    if (!existingSchedule) {
      await prisma.schedule.create({
        data: {
          busId: bus.id,
          routeId: route.id,
          departure,
          arrival,
          price: route.basePrice + 600,
          availableSeats: Math.min(bus.totalSeats, 18 + index * 3)
        }
      });
    }
  }

  console.log("Seed complete. Demo logins: admin@rajasthanride.ai/admin123 and student@rajasthanride.ai/student123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
