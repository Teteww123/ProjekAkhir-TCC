const Favorite = require('../models/favorite');
const Movie = require('../models/movie');

exports.getAll = async (req, res) => {
  const favorites = await Favorite.findAll({ where: { UserId: req.user.id }, include: [Movie] });
  res.json(favorites);
};

exports.add = async (req, res) => {
  const { movieId, note } = req.body;
  const favorite = await Favorite.create({ UserId: req.user.id, MovieId: movieId, note });
  res.status(201).json(favorite);
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  const fav = await Favorite.findOne({ where: { id, UserId: req.user.id } });
  if (!fav) return res.status(404).json({ message: 'Favorite not found' });
  await fav.destroy();
  res.json({ message: 'Favorite deleted' });
};