// src/pages/Movies.jsx
import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovies = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/movie', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMovies(res.data);
    } catch (err) {
      console.error('Gagal mengambil data film', err);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (movieId) => {
    try {
      const token = localStorage.getItem('token');
      await api.post('/favorite', { movieId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Berhasil ditambahkan ke favorit!');
    } catch (err) {
      console.error('Gagal menambahkan ke favorit', err);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  if (loading) return <p>Loading film...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>🎬 Daftar Semua Film</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {movies.map((movie) => (
          <div key={movie.id} style={{ border: '1px solid #ccc', padding: '10px', width: '250px' }}>
            <h3>{movie.title}</h3>
            <p><strong>Genre:</strong> {movie.genre}</p>
            <p><strong>Deskripsi:</strong> {movie.description || '-'}</p>
            <button onClick={() => addToFavorites(movie.id)}>❤️ Tambah ke Favorit</button>
          </div>
        ))}
      </div>
    </div>
  );
}
