const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Movie = require('./movie');

const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  notes: DataTypes.TEXT,
  movieId: {
    type: DataTypes.INTEGER,
    references: {
      model: Movie,
      key: 'id'
    },
    allowNull: false
  }
});

// Relasi
Favorite.belongsTo(Movie, { foreignKey: 'movieId' });

module.exports = Favorite;