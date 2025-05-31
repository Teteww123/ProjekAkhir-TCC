const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Movie = sequelize.define('Movie', {
  id: {
    type: DataTypes.INTEGER,      // <--- PENTING!
    autoIncrement: true,
    primaryKey: true
  },
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  genre: DataTypes.STRING,
  poster_url: DataTypes.STRING,
  year: DataTypes.INTEGER
});

module.exports = Movie;