import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Razorpay from 'razorpay';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });
const prisma = new PrismaClient();

const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-rajasthan-ride-secret';

const demoRoutes = [
  { id: 'route-jaipur-udaipur', from: 'Jaipur', to: 'Udaipur', distance: 395, duration: 525, basePrice: 650 },
  { id: 'route-jodhpur-jaisalmer', from: 'Jodhpur', to: 'Jaisalmer', distance: 285, duration: 360, basePrice: 850 },
  { id: 'route-udaipur-mount-abu', from: 'Udaipur', to: 'Mount Abu', distance: 165, duration: 240, basePrice: 450 },
  { id: 'route-jaipur-pushkar', from: 'Jaipur', to: 'Pushkar', distance: 150, duration: 190, basePrice: 300 },
  { id: 'route-jaipur-jodhpur', from: 'Jaipur', to: 'Jodhpur', distance: 335, duration: 410, basePrice: 620 },
  { id: 'route-jaipur-ajmer', from: 'Jaipur', to: 'Ajmer', distance: 135, duration: 170, basePrice: 280 },
  { id: 'route-jaipur-kota', from: 'Jaipur', to: 'Kota', distance: 250, duration: 330, basePrice: 480 },
  { id: 'route-udaipur-jodhpur', from: 'Udaipur', to: 'Jodhpur', distance: 250, duration: 360, basePrice: 550 },
  { id: 'route-bikaner-jaipur', from: 'Bikaner', to: 'Jaipur', distance: 335, duration: 430, basePrice: 600 },
  { id: 'route-ajmer-udaipur', from: 'Ajmer', to: 'Udaipur', distance: 265, duration: 360, basePrice: 520 },
  { id: 'route-kota-udaipur', from: 'Kota', to: 'Udaipur', distance: 285, duration: 390, basePrice: 560 },
  { id: 'route-jaisalmer-bikaner', from: 'Jaisalmer', to: 'Bikaner', distance: 330, duration: 430, basePrice: 650 }
];

const demoBuses = [
  { id: 'sch-1', busNumber: 'RJ14-PA-2025', type: 'AC Sleeper', price: 1250, departure: '22:30', arrival: '07:15', seatsLeft: 8, driverName: 'Ramesh Sharma', from: 'Jaipur', to: 'Udaipur', amenities: ['WiFi', 'Charging', 'CCTV', 'Water'] },
  { id: 'sch-2', busNumber: 'RJ27-UD-1987', type: 'Volvo Sleeper', price: 1450, departure: '23:00', arrival: '08:30', seatsLeft: 14, driverName: 'Suresh Verma', from: 'Jaipur', to: 'Udaipur', amenities: ['WiFi', 'Blanket', 'Toilet'] },
  { id: 'sch-3', busNumber: 'RJ19-JD-4567', type: 'AC Seater', price: 750, departure: '06:00', arrival: '13:45', seatsLeft: 22, driverName: 'Imran Khan', from: 'Jodhpur', to: 'Jaisalmer', amenities: ['Charging', 'CCTV'] },
  { id: 'sch-4', busNumber: 'RJ14-JP-1122', type: 'Non AC Seater', price: 390, departure: '08:15', arrival: '11:05', seatsLeft: 28, driverName: 'Mahendra Singh', from: 'Jaipur', to: 'Ajmer', amenities: ['Charging', 'Water'] },
  { id: 'sch-5', busNumber: 'RJ20-KT-3301', type: 'AC Seater', price: 690, departure: '07:00', arrival: '12:30', seatsLeft: 16, driverName: 'Kailash Meena', from: 'Jaipur', to: 'Kota', amenities: ['WiFi', 'Charging', 'CCTV'] },
  { id: 'sch-6', busNumber: 'RJ19-JP-7860', type: 'Volvo Sleeper', price: 1180, departure: '21:45', arrival: '04:35', seatsLeft: 11, driverName: 'Narendra Rathore', from: 'Jaipur', to: 'Jodhpur', amenities: ['WiFi', 'Blanket', 'Charging'] },
  { id: 'sch-7', busNumber: 'RJ27-MA-4509', type: 'AC Seater', price: 620, departure: '09:30', arrival: '13:25', seatsLeft: 19, driverName: 'Bhanwar Lal', from: 'Udaipur', to: 'Mount Abu', amenities: ['Charging', 'Water', 'CCTV'] },
  { id: 'sch-8', busNumber: 'RJ27-JD-9021', type: 'AC Sleeper', price: 980, departure: '22:10', arrival: '04:10', seatsLeft: 9, driverName: 'Devendra Chouhan', from: 'Udaipur', to: 'Jodhpur', amenities: ['WiFi', 'Blanket', 'Water'] },
  { id: 'sch-9', busNumber: 'RJ07-BK-5012', type: 'Sleeper', price: 930, departure: '20:30', arrival: '03:40', seatsLeft: 13, driverName: 'Gopal Bishnoi', from: 'Bikaner', to: 'Jaipur', amenities: ['Charging', 'Blanket'] },
  { id: 'sch-10', busNumber: 'RJ01-UD-7744', type: 'AC Seater', price: 720, departure: '06:45', arrival: '12:45', seatsLeft: 24, driverName: 'Arjun Gurjar', from: 'Ajmer', to: 'Udaipur', amenities: ['WiFi', 'Water'] },
  { id: 'sch-11', busNumber: 'RJ20-UD-6120', type: 'Volvo Sleeper', price: 1050, departure: '21:00', arrival: '03:30', seatsLeft: 10, driverName: 'Rafiq Qureshi', from: 'Kota', to: 'Udaipur', amenities: ['WiFi', 'Toilet', 'Charging'] },
  { id: 'sch-12', busNumber: 'RJ15-BK-8008', type: 'AC Sleeper', price: 1100, departure: '19:40', arrival: '02:50', seatsLeft: 15, driverName: 'Himmat Singh', from: 'Jaisalmer', to: 'Bikaner', amenities: ['Blanket', 'Charging', 'Water'] },
  { id: 'sch-13', busNumber: 'RJ14-PK-2210', type: 'Non AC Seater', price: 320, departure: '10:00', arrival: '13:10', seatsLeft: 30, driverName: 'Lokesh Sharma', from: 'Jaipur', to: 'Pushkar', amenities: ['Water', 'CCTV'] }
];

const normalizeCity = (value = '') => String(value).trim().toLowerCase();

const findDemoBuses = (from, to) => {
  const normalizedFrom = normalizeCity(from);
  const normalizedTo = normalizeCity(to);

  return demoBuses.filter((bus) => {
    const matchesFrom = !normalizedFrom || normalizeCity(bus.from).includes(normalizedFrom) || normalizedFrom.includes(normalizeCity(bus.from));
    const matchesTo = !normalizedTo || normalizeCity(bus.to).includes(normalizedTo) || normalizedTo.includes(normalizeCity(bus.to));
    return matchesFrom && matchesTo;
  });
};

const tourismBundles = [
  { id: 'bundle-desert', title: 'Golden Desert Safari', city: 'Jaisalmer', price: 2499, duration: '1 night', includes: ['Bus add-on', 'Dune dinner', 'Camel safari', 'Folk music show'], aiTip: 'Best for sunset photos and overnight desert experience.' },
  { id: 'bundle-fort', title: 'Royal Fort Trail', city: 'Udaipur', price: 1899, duration: '1 day', includes: ['City Palace', 'Lake Pichola boat ride', 'Guide support'], aiTip: 'Pair with a morning arrival bus to avoid afternoon rush.' },
  { id: 'bundle-pushkar', title: 'Pushkar Spiritual Ride', city: 'Pushkar', price: 999, duration: 'Half day', includes: ['Brahma Temple', 'Pushkar Lake', 'Rose market walk'], aiTip: 'Good low-budget bundle for Jaipur weekend riders.' }
];

let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

app.use(helmet());
app.use(cors());
app.use(express.json());

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') return res.status(403).json({ error: 'Admin access required' });
  next();
};

const withDatabaseFallback = async (res, action, fallback) => {
  try {
    return await action();
  } catch (error) {
    console.warn('Database fallback:', error.message);
    return res.json(fallback);
  }
};

app.get('/', (req, res) => {
  res.json({
    app: "Rajasthan Rider's AI Backend",
    status: 'running',
    time: new Date().toLocaleString('en-IN'),
    endpoints: ['/api/auth/login', '/api/buses/search', '/api/tourism-bundles', '/api/ai/trip-planner']
  });
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required' });

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { name, email, password: hashed } });
    res.json({ message: 'Registration successful. Please login.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, wallet: user.wallet } });
  } catch (error) {
    if (email === 'admin@rajasthanride.ai' && password === 'admin123') {
      const user = { id: 'demo-admin', name: 'Admin', email, role: 'ADMIN', wallet: 2450 };
      return res.json({ token: jwt.sign(user, JWT_SECRET, { expiresIn: '24h' }), user });
    }
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  await withDatabaseFallback(
    res,
    async () => {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { id: true, name: true, email: true, role: true, wallet: true }
      });
      res.json(user || req.user);
    },
    req.user
  );
});

app.get('/api/routes', async (req, res) => {
  await withDatabaseFallback(
    res,
    async () => {
      const routes = await prisma.route.findMany({ orderBy: [{ from: 'asc' }, { to: 'asc' }] });
      res.json(routes.length ? routes : demoRoutes);
    },
    demoRoutes
  );
});

app.get('/api/buses/search', async (req, res) => {
  const { from, to } = req.query;
  const fallback = findDemoBuses(from, to);

  await withDatabaseFallback(
    res,
    async () => {
      const schedules = await prisma.schedule.findMany({
        where: {
          route: {
            from: { equals: from, mode: 'insensitive' },
            to: { equals: to, mode: 'insensitive' }
          }
        },
        include: { bus: true, route: true },
        orderBy: { departure: 'asc' }
      });

      if (schedules.length === 0) return res.json(fallback);

      res.json(schedules.map((schedule) => ({
        id: schedule.id,
        busNumber: schedule.bus.busNumber,
        type: schedule.bus.type.replaceAll('_', ' '),
        price: schedule.price,
        departure: schedule.departure.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        arrival: schedule.arrival.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        seatsLeft: schedule.availableSeats,
        driverName: schedule.bus.driverName,
        from: schedule.route.from,
        to: schedule.route.to,
        amenities: schedule.bus.amenities
      })));
    },
    fallback
  );
});

app.get('/api/buses', authenticateToken, requireAdmin, async (req, res) => {
  await withDatabaseFallback(res, async () => res.json(await prisma.bus.findMany({ include: { schedules: true } })), demoBuses);
});

app.post('/api/buses', authenticateToken, requireAdmin, async (req, res) => {
  const { busNumber, type, totalSeats, driverName, amenities = [] } = req.body;
  if (!busNumber || !type || !totalSeats || !driverName) {
    return res.status(400).json({ error: 'busNumber, type, totalSeats and driverName are required' });
  }

  try {
    const bus = await prisma.bus.create({
      data: {
        busNumber,
        type,
        totalSeats: Number(totalSeats),
        driverName,
        amenities: Array.isArray(amenities) ? amenities : String(amenities).split(',').map((item) => item.trim()),
        seats: {
          create: Array.from({ length: Number(totalSeats) }, (_, index) => ({ seatNumber: `A${index + 1}` }))
        }
      },
      include: { seats: true }
    });
    res.status(201).json(bus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tourism-bundles', (req, res) => res.json(tourismBundles));

app.post('/api/ai/trip-planner', (req, res) => {
  const { from = 'Jaipur', to = 'Udaipur', budget = 3000, mood = 'royal forts' } = req.body;
  const bundle = tourismBundles.find((item) => item.city.toLowerCase() === String(to).toLowerCase()) || tourismBundles[0];
  const bus = demoBuses.find((item) => item.from === from && item.to === to) || demoBuses[0];
  const total = bus.price + bundle.price;

  res.json({
    title: `${from} to ${to} smart trip`,
    summary: `AI recommends ${bus.busNumber} with the ${bundle.title} bundle for a ${mood} focused Rajasthan journey.`,
    estimatedTotal: total,
    budgetFit: total <= Number(budget) ? 'Within budget' : `Over budget by Rs ${total - Number(budget)}`,
    plan: [
      `Take ${bus.busNumber} at ${bus.departure}.`,
      `Track the bus live from the tracking page after booking.`,
      `Add ${bundle.title}: ${bundle.includes.join(', ')}.`,
      bundle.aiTip
    ]
  });
});

app.get('/api/bookings', authenticateToken, (req, res) => {
  res.json([
    { id: 'B001', busNumber: 'RJ14-PA-2025', route: 'Jaipur to Udaipur', date: '20 May 2026', seats: ['A3', 'A4'], amount: 2500, status: 'Confirmed' },
    { id: 'B002', busNumber: 'RJ27-UD-1987', route: 'Jodhpur to Jaisalmer', date: '15 May 2026', seats: ['B12'], amount: 1450, status: 'Completed' }
  ]);
});

app.get('/api/admin/summary', authenticateToken, requireAdmin, (req, res) => {
  res.json({
    buses: demoBuses.length,
    activeTrips: 12,
    tourismBundles: tourismBundles.length,
    todayRevenue: 84500,
    aiAlerts: ['RJ14-PA-2025 demand is high tonight', 'Pushkar bundle needs 6 more seats', 'Jaipur to Udaipur route is trending']
  });
});

app.post('/api/payment/create-order', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!razorpay) {
      return res.json({ id: `order_demo_${Date.now()}`, amount: Number(amount) * 100, currency: 'INR', status: 'created' });
    }
    res.json(await razorpay.orders.create({ amount: Number(amount) * 100, currency: 'INR', receipt: `rcpt_${Date.now()}` }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

io.on('connection', (socket) => {
  let lat = 26.9124;
  let lng = 75.7873;
  const interval = setInterval(() => {
    lat += Math.random() * 0.01 - 0.005;
    lng += Math.random() * 0.01 - 0.005;
    socket.emit('busLocation', { lat, lng, eta: '42 min', speed: Math.round(48 + Math.random() * 22) });
  }, 1500);
  socket.on('disconnect', () => clearInterval(interval));
});

httpServer.listen(PORT, () => {
  console.log(`Rajasthan Rider's AI backend running on http://localhost:${PORT}`);
});
