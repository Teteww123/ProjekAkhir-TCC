const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Movie = sequelize.define('Movie', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  poster_url: DataTypes.STRING,
  year: DataTypes.INTEGER,
});

module.exports = Movie;