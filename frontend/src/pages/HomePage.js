import { useEffect, useState } from "react";
import axios from "../api/AxiosInstance.js";
import { BASE_URL } from "../utils/Utils.js";
import useAuth from "../auth/UseAuth.js";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const { accessToken } = useAuth();
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }
  }, [accessToken, navigate]);

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
    return (
      <div
        className="has-text-centered"
        style={{ color: "#fff", marginTop: "3rem" }}
      >
        <span className="loader"></span>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div
      className="section"
      style={{ minHeight: "100vh", background: "#181818" }}
    >
      {/* Header */}
      <nav
        className="navbar mb-5"
        style={{
          background: "rgba(30,30,30,0.95)",
          borderRadius: "8px",
        }}
      >
        <div className="navbar-brand">
          <span className="navbar-item">
            <span className="icon is-large mr-2">
              <i
                className="fas fa-film fa-2x"
                style={{ color: "#ffdd57" }}
              ></i>
            </span>
            <span className="title is-4 has-text-white">MovieApp</span>
          </span>
        </div>
        <div className="navbar-end">
          <div className="navbar-item">
            <span className="icon is-medium">
              <i className="fas fa-user-circle fa-lg" style={{ color: "#fff" }}></i>
            </span>
          </div>
        </div>
      </nav>

      <div className="container">
        <h1 className="title has-text-white">Selamat Datang di HomePage</h1>
        <p className="subtitle has-text-white mb-5">
          Temukan dan tambahkan film favoritmu!
        </p>
        {errorMsg && <div className="notification is-danger">{errorMsg}</div>}
        <div className="columns is-multiline">
          {movies.map((movie) => (
            <div className="column is-one-quarter" key={movie.id}>
              <div className="card" style={{ minHeight: "100%" }}>
                <div className="card-image">
                  <figure
                    className="image is-4by3"
                    style={{ background: "#222" }}
                  >
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      style={{
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </figure>
                  {isFavorite(movie.id) && (
                    <span
                      className="tag is-warning"
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                      }}
                    >
                      <i className="fas fa-star"></i> Favorite
                    </span>
                  )}
                </div>
                <div className="card-content">
                  <p className="title is-5">{movie.title}</p>
                  <p className="subtitle is-6">
                    {movie.genre} | {movie.year}
                  </p>
                  <p style={{ minHeight: "60px" }}>{movie.description}</p>
                  <div className="buttons mt-2">
                    <button
                      className="button is-link"
                      onClick={() => navigate(`/home/${movie.id}`)}
                    >
                      <span className="icon">
                        <i className="fas fa-info-circle"></i>
                      </span>
                      <span>Detail</span>
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
                        <span className="icon">
                          <i className="fas fa-heart-broken"></i>
                        </span>
                        <span>Hapus Favorite</span>
                      </button>
                    ) : (
                      <button
                        className="button is-warning"
                        onClick={() => handleAddFavorite(movie.id)}
                      >
                        <span className="icon">
                          <i className="fas fa-star"></i>
                        </span>
                        <span>Tambah Favorite</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {movies.length === 0 && (
            <div className="column">
              <div className="notification is-warning has-text-centered">
                Tidak ada film tersedia.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;