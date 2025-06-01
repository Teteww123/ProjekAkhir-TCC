// src/pages/Favorites.jsx
import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/favorite', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(res.data);
    } catch (err) {
      console.error('Gagal mengambil data favorit', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/favorite/${favoriteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh list after deletion
      setFavorites((prev) => prev.filter((fav) => fav.id !== favoriteId));
    } catch (err) {
      console.error('Gagal menghapus favorit', err);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) return <p>Loading favorit...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>❤️ Film Favorit Saya</h2>
      {favorites.length === 0 ? (
        <p>Kamu belum menambahkan film ke favorit.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {favorites.map((fav) => (
            <div key={fav.id} style={{ border: '1px solid #ccc', padding: '10px', width: '250px' }}>
              <h3>{fav.movie?.title}</h3>
              <p><strong>Genre:</strong> {fav.movie?.genre}</p>
              <p><strong>Deskripsi:</strong> {fav.movie?.description || '-'}</p>
              <button onClick={() => removeFavorite(fav.id)}>🗑️ Hapus dari Favorit</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
