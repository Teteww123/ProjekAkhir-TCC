const express = require('express');
const app = express();
const sequelize = require('./config/database');
const cors = require("cors");

// Izinkan semua origin (atau bisa dibatasi sesuai kebutuhan)
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// Pastikan semua model di-load di sini!
require('./models/user');
require('./models/movie');
require('./models/favorite');

const userRoutes = require('./routes/user');
const movieRoutes = require('./routes/movie');
const favoriteRoutes = require('./routes/favorite');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running!');
});

app.use('/user', userRoutes);
app.use('/movie', movieRoutes);
app.use('/favorite', favoriteRoutes);

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database & tables created!');
    app.listen(process.env.PORT || 5000, () => {
      console.log('Server is running...');
    });
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
  });