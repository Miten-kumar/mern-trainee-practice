const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const ROUNDS = Number(process.env.BCRYPT_ROUNDS || 12);
const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

function cookieOptions(maxAgeMs) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: maxAgeMs,
    path: '/',
  };
}

function signToken(user) {
  return jwt.sign(
    { sub: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
}

/**
 * AUDIT NOTE (finding SEC-02b, privilege escalation): the original register
 * handler did `const role = req.body.role || 'user'`, so any client could
 * POST { "role": "admin" } and self-promote. Fixed by simply never reading
 * role from the request — every new account is hardcoded to 'user'; role
 * elevation is an out-of-band admin action only.
 */
async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;

    if (User.findByUsername(username) || User.findByEmail(email)) {
      // Same generic message for both cases — don't reveal which field
      // collided (avoids user enumeration, finding SEC-10).
      return res.status(409).json({ error: 'Registration failed. Try different details.' });
    }

    const passwordHash = await bcrypt.hash(password, ROUNDS);
    const result = User.create({ username, email, passwordHash, role: 'user' });
    const user = User.findById(result.lastInsertRowid);

    const token = signToken(user);
    res.cookie('access_token', token, cookieOptions(15 * 60 * 1000));
    return res.status(201).json({ user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    return next(err);
  }
}

/**
 * AUDIT NOTE (finding SEC-10, user enumeration + brute force): the original
 * login returned "user not found" vs "wrong password" as distinct messages,
 * and had no attempt limiting. Fixed: identical generic error for both
 * cases, plus per-account lockout after repeated failures, plus the
 * express-rate-limit middleware applied at the route level.
 */
async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const user = User.findByUsername(username);
    const genericError = () => res.status(401).json({ error: 'Invalid username or password.' });

    if (!user) return genericError();

    if (user.locked_until && user.locked_until > Date.now()) {
      return res.status(423).json({ error: 'Account temporarily locked. Try again later.' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      const count = user.failed_login_count + 1;
      const lockedUntil = count >= LOCKOUT_THRESHOLD ? Date.now() + LOCKOUT_MS : null;
      User.recordFailedLogin(user.id, lockedUntil);
      return genericError();
    }

    User.clearFailedLogins(user.id);
    const token = signToken(user);
    res.cookie('access_token', token, cookieOptions(15 * 60 * 1000));
    return res.json({ user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    return next(err);
  }
}

function logout(req, res) {
  res.clearCookie('access_token', { path: '/' });
  res.json({ message: 'Logged out.' });
}

function me(req, res) {
  res.json({ user: req.user });
}

module.exports = { register, login, logout, me };
