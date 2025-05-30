const Movie = require('../models/movie');

exports.getAll = async (_req, res) => {
  const movies = await Movie.findAll();
  res.json(movies);
};

exports.getById = async (req, res) => {
  const movie = await Movie.findByPk(req.params.id);
  if (!movie) return res.status(404).json({ message: 'Movie not found' });
  res.json(movie);
};

exports.create = async (req, res) => {
  const { title, description, poster_url, year } = req.body;
  const movie = await Movie.create({ title, description, poster_url, year });
  res.status(201).json(movie);
};

exports.update = async (req, res) => {
  const movie = await Movie.findByPk(req.params.id);
  if (!movie) return res.status(404).json({ message: 'Movie not found' });
  await movie.update(req.body);
  res.json(movie);
};

exports.delete = async (req, res) => {
  const movie = await Movie.findByPk(req.params.id);
  if (!movie) return res.status(404).json({ message: 'Movie not found' });
  await movie.destroy();
  res.json({ message: 'Movie deleted' });
};