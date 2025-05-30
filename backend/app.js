require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
// const authRoutes = require('./routes/auth');
// app.use('/api/auth', authRoutes);
// Tambah routes lain sesuai struktur projectmu

app.get('/', (req, res) => {
  res.send('Backend running!');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log('Server berjalan di http://localhost:' + PORT));