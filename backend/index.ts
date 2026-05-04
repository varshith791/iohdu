import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'apple_minimal_secret_key_123';

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.status(401).json({ error: 'Token missing' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Token invalid' });
    req.user = user;
    next();
  });
};

// Admin Middleware
const isAdmin = (req: any, res: any, next: any) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admin access required' });
  next();
};

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role: requestedRole } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const userCount = await prisma.user.count();
    let role = userCount === 0 ? 'ADMIN' : 'MEMBER';
    if (requestedRole) role = requestedRole;

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });
    
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, role: user.role, email: user.email } });
  } catch (err) {
    res.status(400).json({ error: 'Email already in use' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: 'User not found' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Invalid credentials' });
  
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
  res.json({ token, user: { id: user.id, name: user.name, role: user.role, email: user.email } });
});

// Attendance Routes
app.post('/api/attendance/login', authenticateToken, async (req: any, res) => {
  // Check if there is an active session (logout_time is null)
  const activeSession = await prisma.attendance.findFirst({
    where: { user_id: req.user.id, logout_time: null }
  });
  if (activeSession) return res.json(activeSession);

  const attendance = await prisma.attendance.create({
    data: { user_id: req.user.id },
  });
  res.json(attendance);
});

app.post('/api/attendance/logout', authenticateToken, async (req: any, res) => {
  const lastAttendance = await prisma.attendance.findFirst({
    where: { user_id: req.user.id, logout_time: null },
    orderBy: { login_time: 'desc' },
  });

  if (!lastAttendance) return res.status(404).json({ error: 'No active session found' });

  const logoutTime = new Date();
  const durationMs = logoutTime.getTime() - lastAttendance.login_time.getTime();
  const totalHours = durationMs / (1000 * 60 * 60);

  const updated = await prisma.attendance.update({
    where: { id: lastAttendance.id },
    data: { logout_time: logoutTime, total_hours: totalHours },
  });

  res.json(updated);
});

app.get('/api/attendance', authenticateToken, isAdmin, async (req, res) => {
  const attendance = await prisma.attendance.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { login_time: 'desc' },
  });
  res.json(attendance);
});

// Tasks Routes
app.get('/api/tasks', authenticateToken, async (req: any, res) => {
  const { userId } = req.query;
  
  if (req.user.role === 'ADMIN') {
    // Admin gets all tasks, or filtered by user if requested
    const where = userId ? { assigned_to: userId as string } : {};
    const tasks = await prisma.task.findMany({
      where,
      include: { assignedTo: { select: { name: true } }, createdBy: { select: { name: true } } }
    });
    return res.json(tasks);
  } else {
    // Member gets only their tasks
    const tasks = await prisma.task.findMany({
      where: { assigned_to: req.user.id },
      include: { assignedTo: { select: { name: true } } }
    });
    return res.json(tasks);
  }
});

app.post('/api/tasks', authenticateToken, isAdmin, async (req: any, res) => {
  const { title, description, assigned_to, deadline, priority } = req.body;
  const task = await prisma.task.create({
    data: {
      title,
      description,
      assigned_to,
      created_by: req.user.id,
      deadline: deadline ? new Date(deadline) : null,
      priority: priority || 'MEDIUM',
      status: 'NOT_STARTED'
    },
  });
  res.json(task);
});

app.put('/api/tasks/:id', authenticateToken, async (req: any, res) => {
  const { status, title, description, assigned_to, deadline, priority } = req.body;
  
  // Members can only update status
  if (req.user.role === 'MEMBER') {
    const task = await prisma.task.update({
      where: { id: req.params.id, assigned_to: req.user.id },
      data: { status }
    });
    return res.json(task);
  }

  // Admin can update everything
  const task = await prisma.task.update({
    where: { id: req.params.id },
    data: {
      status,
      title,
      description,
      assigned_to,
      deadline: deadline ? new Date(deadline) : undefined,
      priority
    }
  });
  res.json(task);
});

app.delete('/api/tasks/:id', authenticateToken, isAdmin, async (req, res) => {
  await prisma.task.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

// Users list for Admin
app.get('/api/users', authenticateToken, isAdmin, async (req, res) => {
  const users = await prisma.user.findMany({
    where: { role: 'MEMBER' },
    select: { id: true, name: true, email: true }
  });
  res.json(users);
});

app.post('/api/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: 'MEMBER' },
    });
    res.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(400).json({ error: 'Email already in use' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
