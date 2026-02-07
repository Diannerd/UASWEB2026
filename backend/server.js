require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;

/* ===================== TRUST PROXY (WAJIB DI HOSTING) ===================== */
app.set('trust proxy', 1);

/* ===================== CORS FIX (ANTI ERROR LOGIN) ===================== */
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

/* ===================== BODY PARSER ===================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===================== SESSION ===================== */
app.use(
  session({
    name: 'sicad_session',
    secret: process.env.SESSION_SECRET || 'sicad_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // ganti true kalau sudah HTTPS
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60
    }
  })
);

/* ===================== DATABASE (CPANEL FRIENDLY) ===================== */
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: false
});

/* ===================== LOGIN ===================== */
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { rows } = await pool.query(
      'SELECT id, nama, role, password FROM users WHERE username = $1',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'User tidak ditemukan' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: 'Password salah' });
    }

    req.session.user = {
      id: user.id,
      nama: user.nama,
      role: user.role
    };

    req.session.save(() => {
      res.json({
        message: 'Login berhasil',
        user: req.session.user
      });
    });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/* ===================== TEST ROUTE (WAJIB UNTUK DEBUG) ===================== */
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', time: new Date() });
});

/* ===================== START SERVER ===================== */
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SICAD server running on port ${PORT}`);
});
