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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortYear, setSortYear] = useState("desc"); // "asc" or "desc"
  const [showCreate, setShowCreate] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: "",
    description: "",
    genre: "",
    poster_url: "",
    year: "",
  });
  const [editMovieId, setEditMovieId] = useState(null);
  const [editMovie, setEditMovie] = useState({
    title: "",
    description: "",
    genre: "",
    poster_url: "",
    year: "",
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
  };

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
      setMovies(res.data || []);
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
      setFavorites(res.data.data || res.data || []);
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
    const notes = window.prompt("Masukkan catatan untuk favorite ini:", "Film favorit saya") || "Film favorit saya";
    try {
      await axios.post(
        `${BASE_URL}/favorite`,
        { movieId, notes },
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

  // FILTERING BERDASARKAN SEARCH TERM
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // SORTING BERDASARKAN TAHUN
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    if (sortYear === "asc") {
      return Number(a.year) - Number(b.year);
    } else {
      return Number(b.year) - Number(a.year);
    }
  });

  // CREATE MOVIE HANDLER
  const handleCreateMovie = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!newMovie.title || !newMovie.genre || !newMovie.year) {
      setErrorMsg("Judul, genre, dan tahun wajib diisi!");
      return;
    }
    try {
      await axios.post(
        `${BASE_URL}/movie`,
        newMovie,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setShowCreate(false);
      setNewMovie({
        title: "",
        description: "",
        genre: "",
        poster_url: "",
        year: "",
      });
      fetchMovies();
    } catch (error) {
      setErrorMsg("Gagal menambah film baru");
    }
  };

  // EDIT MOVIE HANDLER
  const openEditModal = (movie) => {
    setEditMovieId(movie.id);
    setEditMovie({
      title: movie.title,
      description: movie.description,
      genre: movie.genre,
      poster_url: movie.poster_url,
      year: movie.year,
    });
    setShowCreate(false);
  };

  const handleEditMovie = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!editMovie.title || !editMovie.genre || !editMovie.year) {
      setErrorMsg("Judul, genre, dan tahun wajib diisi!");
      return;
    }
    try {
      await axios.put(
        `${BASE_URL}/movie/${editMovieId}`,
        { ...editMovie, year: Number(editMovie.year) },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setEditMovieId(null);
      setEditMovie({
        title: "",
        description: "",
        genre: "",
        poster_url: "",
        year: "",
      });
      fetchMovies();
    } catch (error) {
      setErrorMsg("Gagal mengedit data film");
    }
  };

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
    <div className="section" style={{ minHeight: "100vh", background: "#181818" }}>
      {/* Header */}
      <nav className="navbar mb-5" style={{ background: "rgba(30,30,30,0.95)", borderRadius: "8px" }}>
        <div className="navbar-brand">
          <span className="navbar-item">
            <span className="icon is-large mr-2">
              <i className="fas fa-film fa-2x" style={{ color: "#ffdd57" }}></i>
            </span>
            <span className="title is-4 has-text-white">MovieApp</span>
          </span>
        </div>
        <div className="navbar-end">
          <div className="navbar-item">
            <button className="button is-success" onClick={() => setShowCreate(true)}>
              <span className="icon"><i className="fas fa-plus"></i></span>
              <span>Tambah Film</span>
            </button>
          </div>
          <div className="navbar-item">
            <button className="button is-warning" onClick={() => navigate("/favorite")}>
              <span className="icon"><i className="fas fa-star"></i></span>
              <span>Favorite</span>
            </button>
          </div>
          <div className="navbar-item">
            <button className="button is-danger" onClick={handleLogout}>
              <span className="icon"><i className="fas fa-sign-out-alt"></i></span>
              <span>Logout</span>
            </button>
          </div>
          <div className="navbar-item">
            <span className="icon is-medium">
              <i className="fas fa-user-circle fa-lg" style={{ color: "#fff" }}></i>
            </span>
          </div>
        </div>
      </nav>

      {/* Modal Create Movie */}
      {showCreate && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setShowCreate(false)}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Tambah Film Baru</p>
              <button className="delete" aria-label="close" onClick={() => setShowCreate(false)}></button>
            </header>
            <section className="modal-card-body">
              <form onSubmit={handleCreateMovie}>
                <div className="field">
                  <label className="label">Judul</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      value={newMovie.title}
                      onChange={e => setNewMovie({ ...newMovie, title: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Deskripsi</label>
                  <div className="control">
                    <textarea
                      className="textarea"
                      value={newMovie.description}
                      onChange={e => setNewMovie({ ...newMovie, description: e.target.value })}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Genre</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      value={newMovie.genre}
                      onChange={e => setNewMovie({ ...newMovie, genre: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Tahun</label>
                  <div className="control">
                    <input
                      className="input"
                      type="number"
                      value={newMovie.year}
                      onChange={e => setNewMovie({ ...newMovie, year: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Poster URL</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      value={newMovie.poster_url}
                      onChange={e => setNewMovie({ ...newMovie, poster_url: e.target.value })}
                    />
                  </div>
                </div>
                <button className="button is-success mt-3" type="submit">
                  Simpan
                </button>
              </form>
            </section>
          </div>
        </div>
      )}

      {/* Modal Edit Movie */}
      {editMovieId && (
        <div className="modal is-active">
          <div className="modal-background" onClick={() => setEditMovieId(null)}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Edit Film</p>
              <button className="delete" aria-label="close" onClick={() => setEditMovieId(null)}></button>
            </header>
            <section className="modal-card-body">
              <form onSubmit={handleEditMovie}>
                <div className="field">
                  <label className="label">Judul</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      value={editMovie.title}
                      onChange={e => setEditMovie({ ...editMovie, title: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Deskripsi</label>
                  <div className="control">
                    <textarea
                      className="textarea"
                      value={editMovie.description}
                      onChange={e => setEditMovie({ ...editMovie, description: e.target.value })}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Genre</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      value={editMovie.genre}
                      onChange={e => setEditMovie({ ...editMovie, genre: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Tahun</label>
                  <div className="control">
                    <input
                      className="input"
                      type="number"
                      value={editMovie.year}
                      onChange={e => setEditMovie({ ...editMovie, year: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Poster URL</label>
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      value={editMovie.poster_url}
                      onChange={e => setEditMovie({ ...editMovie, poster_url: e.target.value })}
                    />
                  </div>
                </div>
                <button className="button is-success mt-3" type="submit">
                  Simpan Perubahan
                </button>
              </form>
            </section>
          </div>
        </div>
      )}

      <div className="container">
        <h1 className="title has-text-white">Selamat Datang di HomePage</h1>
        <p className="subtitle has-text-white mb-5">
          Temukan dan tambahkan film favoritmu!
        </p>

        {/* INPUT SEARCH */}
        <div className="field mb-3" style={{ maxWidth: 400 }}>
          <div className="control has-icons-left">
            <input
              className="input"
              type="text"
              placeholder="Cari judul film..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <span className="icon is-left">
              <i className="fas fa-search"></i>
            </span>
          </div>
        </div>

        {/* SORTING BY YEAR */}
        <div className="field mb-5" style={{ maxWidth: 300 }}>
          <label className="label has-text-white">Urutkan berdasarkan tahun</label>
          <div className="control">
            <div className="select">
              <select
                value={sortYear}
                onChange={e => setSortYear(e.target.value)}
              >
                <option value="desc">Terbaru ke Terlama</option>
                <option value="asc">Terlama ke Terbaru</option>
              </select>
            </div>
          </div>
        </div>

        {errorMsg && <div className="notification is-danger">{errorMsg}</div>}
        <div className="columns is-multiline">
          {sortedMovies.map((movie) => (
            <div className="column is-one-quarter" key={movie.id}>
              <div className="card" style={{ minHeight: "100%" }}>
                <div className="card-image">
                  <figure className="image is-4by3" style={{ background: "#222" }}>
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
                    <button
                      className="button is-info"
                      title="Edit"
                      onClick={() => openEditModal(movie)}
                    >
                      Edit
                    </button>
                    {isFavorite(movie.id) ? (
                      <button
                        className="button is-danger"
                        title="Hapus Favorite"
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
                        title="Tambah Favorite"
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
          {sortedMovies.length === 0 && (
            <div className="column">
              <div className="notification is-warning has-text-centered">
                Tidak ada film ditemukan.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;