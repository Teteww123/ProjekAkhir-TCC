// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        const [movieRes, favRes] = await Promise.all([
          api.get('/movie', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get('/favorite', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setMovies(movieRes.data);
        setFavoritesCount(favRes.data.length);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Halo, {user?.name || 'User'} 👋</h2>
      <p>Favorit kamu: {favoritesCount} film</p>

      <div>
        <h3>Film Rekomendasi:</h3>
        <ul>
          {movies.slice(0, 5).map((movie) => (
            <li key={movie.id}>
              <strong>{movie.title}</strong> — {movie.genre}
            </li>
          ))}
        </ul>
      </div>

      <nav style={{ marginTop: '20px' }}>
        <Link to="/movies">🎬 Lihat Semua Film</Link> |{' '}
        <Link to="/favorites">❤️ Favorit Saya</Link> |{' '}
        <Link to="/profile">👤 Profil</Link>
      </nav>
    </div>
  );
}
