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
  const { title, description, genre, poster_url, year } = req.body;
  const missingFields = [];
  if (!title) missingFields.push("title");
  if (!description) missingFields.push("description");
  if (!poster_url) missingFields.push("poster_url");
  if (!year) missingFields.push("year");
  if (!genre) missingFields.push("genre");

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Input berikut wajib diisi: ${missingFields.join(", ")}`
    });
  }

  try {
    const movie = await Movie.create({ title, description, genre, poster_url, year });
    res.status(201).json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    await movie.update(req.body);
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  const movie = await Movie.findByPk(req.params.id);
  if (!movie) return res.status(404).json({ message: 'Movie not found' });
  await movie.destroy();
  res.json({ message: 'Movie deleted' });
};