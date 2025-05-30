const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username dan password wajib diisi.' });

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) return res.status(400).json({ message: 'Username sudah terpakai.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword });

    res.status(201).json({ message: 'Registrasi berhasil.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Password salah.' });

    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login berhasil.', token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.profile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, { attributes: ['id', 'username'] });
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};