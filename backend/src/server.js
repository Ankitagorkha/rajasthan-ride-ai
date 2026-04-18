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
const io = new Server(httpServer, { cors: { origin: "*" } });

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Razorpay setup (safe for deployment)
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} else {
  console.log("⚠️ Razorpay keys not found. Payment will use demo mode.");
}

app.use(helmet());
app.use(cors());
app.use(express.json());

// ====================== ROOT ROUTE (Fix for Render) ======================
app.get('/', (req, res) => {
  res.send(`
    <h1>🐪 Rajasthan Ride AI Backend</h1>
    <p><strong>Status:</strong> Running Successfully ✅</p>
    <p><strong>Time:</strong> ${new Date().toLocaleString('en-IN')}</p>
    <br>
    <p>Backend is live and connected to PostgreSQL.</p>
  `);
});

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// ====================== AUTH ROUTES ======================
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, password: hashed } });
    res.json({ message: 'Registration successful! Please login.' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, wallet: true }
    });
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Search buses
app.get('/api/buses/search', async (req, res) => {
  const { from, to } = req.query;
  const schedules = await prisma.schedule.findMany({
    where: { route: { from, to } },
    include: { bus: true, route: true }
  });
  res.json(schedules.length ? schedules : []);
});

// Razorpay - Create Order
app.post('/api/payment/create-order', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!razorpay) {
      // Demo mode if keys are not set
      return res.json({
        id: "order_demo_" + Date.now(),
        amount: amount * 100,
        currency: "INR",
        status: "created"
      });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

io.on('connection', (socket) => {
  console.log('🚌 Client connected for live tracking');
  let lat = 26.9124, lng = 75.7873;
  const interval = setInterval(() => {
    lat += (Math.random() * 0.002 - 0.001);
    lng += (Math.random() * 0.002 - 0.001);
    socket.emit('busLocation', { lat, lng });
  }, 1800);
  socket.on('disconnect', () => clearInterval(interval));
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Rajasthan Ride AI Backend running on http://localhost:${PORT}`);
});