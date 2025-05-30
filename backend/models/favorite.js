const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./user');
const Movie = require('./movie');

const Favorite = sequelize.define('Favorite', {
  note: DataTypes.STRING,
});

User.hasMany(Favorite);
Favorite.belongsTo(User);

Movie.hasMany(Favorite);
Favorite.belongsTo(Movie);

module.exports = Favorite;