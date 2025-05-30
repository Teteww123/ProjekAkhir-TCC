const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user');

dotenv.config();

const app = express();
app.use(express.json());

app.use('/user', userRoutes)

// Import routes
// const authRoutes = require('./routes/auth');
// app.use('/api/auth', authRoutes);
// Tambah routes lain sesuai struktur projectmu

app.get('/', (req, res) => {
  res.send('Backend running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server berjalan di http://localhost:' + PORT));