import { useEffect, useState } from "react";
import axios from "../api/AxiosInstance.js";
import { BASE_URL } from "../utils/Utils.js";
import useAuth from "../auth/UseAuth.js";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { accessToken } = useAuth();
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  // Fetch all movies
  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/movie`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setMovies(res.data.data || []);
    } catch (error) {
      setErrorMsg("Gagal mengambil data movie");
    }
    setLoading(false);
  };

  // Fetch favorites
  const fetchFavorites = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/favorite`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setFavorites(res.data.data || []);
    } catch (error) {
      // Optional: handle error
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchMovies();
      fetchFavorites();
    }
    // eslint-disable-next-line
  }, [accessToken]);

  const handleAddFavorite = async (movieId) => {
    try {
      await axios.post(
        `${BASE_URL}/favorite`,
        { movieId, notes: "Film favorit saya" },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      fetchFavorites();
    } catch (error) {
      setErrorMsg("Gagal menambah ke favorite");
    }
  };

  const handleRemoveFavorite = async (favId) => {
    try {
      await axios.delete(`${BASE_URL}/favorite/${favId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      fetchFavorites();
    } catch (error) {
      setErrorMsg("Gagal menghapus favorite");
    }
  };

  const isFavorite = (movieId) =>
    favorites.some((fav) => fav.movieId === movieId);

  if (loading) {
    return <div className="has-text-centered">Loading...</div>;
  }

  return (
    <div className="section" style={{ minHeight: "100vh", background: "#222" }}>
      <div className="container">
        <h1 className="title has-text-white">Daftar Movie</h1>
        {errorMsg && <div className="notification is-danger">{errorMsg}</div>}
        <div className="columns is-multiline">
          {movies.map((movie) => (
            <div className="column is-one-quarter" key={movie.id}>
              <div className="card">
                <div className="card-image">
                  <figure className="image is-4by3">
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      style={{ objectFit: "cover" }}
                    />
                  </figure>
                </div>
                <div className="card-content">
                  <p className="title is-5">{movie.title}</p>
                  <p className="subtitle is-6">
                    {movie.genre} | {movie.year}
                  </p>
                  <p>{movie.description}</p>
                  <div className="buttons mt-2">
                    <button
                      className="button is-link"
                      onClick={() => navigate(`/movie/${movie.id}`)}
                    >
                      Detail
                    </button>
                    {isFavorite(movie.id) ? (
                      <button
                        className="button is-danger"
                        onClick={() => {
                          const fav = favorites.find(
                            (f) => f.movieId === movie.id
                          );
                          handleRemoveFavorite(fav.id);
                        }}
                      >
                        Hapus Favorite
                      </button>
                    ) : (
                      <button
                        className="button is-warning"
                        onClick={() => handleAddFavorite(movie.id)}
                      >
                        Tambah Favorite
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;