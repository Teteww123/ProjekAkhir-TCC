const Favorite = require('../models/favorite');
const Movie = require('../models/movie');

// Ambil semua favorit dengan data movie dan notes
exports.getAll = async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      include: [{
        model: Movie,
        attributes: ['id', 'title', 'description', 'poster_url', 'year']
      }]
    });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tambah favorit (dengan notes)
exports.create = async (req, res) => {
  const { movieId, notes } = req.body;
  try {
    const favorit = await Favorite.create({ movieId, notes });
    res.status(201).json(favorit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tambahkan ini:
exports.update = async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;
  try {
    const favorite = await Favorite.findByPk(id);
    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }
    favorite.notes = notes;
    await favorite.save();
    res.json(favorite);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ...import dan handler lain...

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const favorite = await Favorite.findByPk(id);
    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }
    await favorite.destroy();
    res.json({ message: 'Favorite deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};