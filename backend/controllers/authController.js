const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashed });
    res.status(201).json({ message: 'User registered', user: { id: user.id, username } });
  } catch (err) {
    res.status(400).json({ message: 'Register failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1d' }
    );
    // Jika butuh refresh token juga:
    const refreshToken = jwt.sign(
      { id: user.id, username: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ accessToken: token /*, refreshToken */ });
  } catch (err) {
    res.status(400).json({ message: 'Login failed', error: err.message });
  }
};

exports.logout = async (_req, res) => {
  res.json({ message: 'Logout success. Remove token on client.' });
};