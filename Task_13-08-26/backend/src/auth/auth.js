const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db/data');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-do-not-use-in-prod';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';

function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

async function register(stats, { name, email, password }) {
  const existing = await db.getUserByEmail(stats, email);
  if (existing) {
    const err = new Error('An account with that email already exists');
    err.statusCode = 409;
    throw err;
  }
  const passwordHash = bcrypt.hashSync(password, 8);
  const user = await db.createUser(stats, { name, email, passwordHash });
  const token = signToken(user);
  return { token, user };
}

async function login(stats, { email, password }) {
  const user = await db.getUserByEmail(stats, email);
  const hash = user && db.getPasswordHash(user.id);
  if (!user || !bcrypt.compareSync(password, hash)) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }
  const token = signToken(user);
  return { token, user: { id: user.id, name: user.name, email: user.email, bio: user.bio } };
}

// Pulls a user off "Authorization: Bearer <token>", returns null if absent/invalid.
// Used identically by the REST middleware and the GraphQL context - one source of truth.
function userFromAuthHeader(header) {
  if (!header || !header.startsWith('Bearer ')) return null;
  const token = header.slice('Bearer '.length);
  const payload = verifyToken(token);
  if (!payload) return null;
  return { id: payload.sub, email: payload.email };
}

module.exports = { signToken, verifyToken, register, login, userFromAuthHeader };
