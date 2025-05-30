const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    // Cloud SQL via Unix Socket (rekomendasi di GCP)
    host: process.env.DB_HOST,
    dialect: 'mysql', // atau 'mysql'
    dialectOptions: process.env.DB_HOST.startsWith('/cloudsql')
      ? { socketPath: process.env.DB_HOST }
      : {},
    port: process.env.DB_PORT,
    logging: false,
  }
);

module.exports = { sequelize };