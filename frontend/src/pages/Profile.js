// src/pages/Profile.jsx
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return <p>Memuat data profil...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>👤 Profil Saya</h2>
      <p><strong>Nama:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <button onClick={handleLogout} style={{ marginTop: '20px' }}>
        🚪 Logout
      </button>
    </div>
  );
}
