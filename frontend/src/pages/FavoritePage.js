import { useEffect, useState } from "react";
import useAuth from "../auth/UseAuth.js";
import axios from "../api/AxiosInstance.js";
import { BASE_URL } from "../utils/Utils.js";
import { useNavigate } from "react-router-dom";

const FavoritePage = () => {
  const { accessToken } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [editNotes, setEditNotes] = useState({});
  const [savingNotes, setSavingNotes] = useState({});
  const navigate = useNavigate();

  const fetchFavorites = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await axios.get(`${BASE_URL}/favorite`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setFavorites(res.data || []);
      let notesInit = {};
      (res.data || []).forEach(fav => {
        notesInit[fav.id] = fav.notes || "";
      });
      setEditNotes(notesInit);
    } catch (error) {
      setErrorMsg("Gagal mengambil data favorite");
    }
    setLoading(false);
  };

  const fetchMovies = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/movie`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setMovies(res.data || []);
    } catch (error) {}
  };

  useEffect(() => {
    if (accessToken) {
      fetchFavorites();
      fetchMovies();
    }
    // eslint-disable-next-line
  }, [accessToken]);

  const handleDeleteFavorite = async (favId) => {
    try {
      await axios.delete(`${BASE_URL}/favorite/${favId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      fetchFavorites();
    } catch (error) {
      setErrorMsg("Gagal menghapus favorite");
    }
  };

  const handleSaveNotes = async (favId) => {
    setSavingNotes(prev => ({ ...prev, [favId]: true }));
    setErrorMsg("");
    try {
      await axios.put(
        `${BASE_URL}/favorite/${favId}`,
        { notes: editNotes[favId] },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      fetchFavorites();
    } catch (error) {
      setErrorMsg("Gagal menyimpan notes");
    }
    setSavingNotes(prev => ({ ...prev, [favId]: false }));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#222", padding: "2rem 0" }}>
      <div className="container">
        {/* Tombol kembali ke Home */}
          <button
          className="button is-light mb-4"
          onClick={() => navigate("/home")}
        >
          ← Kembali ke Home
        </button>
        <h1 className="title has-text-white">Daftar Movie Favorite</h1>
        {errorMsg && (
          <div className="notification is-danger">{errorMsg}</div>
        )}
        {loading ? (
          <div className="has-text-white">Loading...</div>
        ) : favorites.length === 0 ? (
          <div className="has-text-white">Belum ada movie favorite.</div>
        ) : (
          <div className="columns is-multiline">
            {favorites.map((fav) => {
              const movie = movies.find((m) => m.id === fav.movieId);
              return (
                <div className="column is-one-third" key={fav.id}>
                  <div className="card" style={{ background: "#17181c", color: "#fff", boxShadow: "0 4px 16px #1113" }}>
                    <div className="card-content">
                      <p className="title is-5" style={{ color: "#fff" }}>
                        {movie ? movie.title : `Movie ID: ${fav.movieId}`}
                      </p>
                      <p className="subtitle is-6" style={{ color: "#bbb" }}>
                        {movie ? `${movie.genre} | ${movie.year}` : ""}
                      </p>
                      <textarea
                        className="textarea"
                        rows={2}
                        value={editNotes[fav.id] ?? ""}
                        onChange={e =>
                          setEditNotes({ ...editNotes, [fav.id]: e.target.value })
                        }
                        style={{ marginBottom: '0.5rem', background: "#222", color: "#fff", border: "1px solid #333" }}
                        placeholder="Tambahkan catatan..."
                      />
                      <button
                        className="button is-link is-small"
                        style={{ marginRight: '0.5rem' }}
                        disabled={savingNotes[fav.id]}
                        onClick={() => handleSaveNotes(fav.id)}
                      >
                        {savingNotes[fav.id] ? "Menyimpan..." : "Edit Notes"}
                      </button>
                      <button
                        className="button is-danger is-small"
                        onClick={() => handleDeleteFavorite(fav.id)}
                      >
                        Hapus dari Favorite
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritePage;