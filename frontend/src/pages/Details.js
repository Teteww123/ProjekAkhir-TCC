import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/AxiosInstance.js";
import { BASE_URL } from "../utils/Utils.js";
import useAuth from "../auth/UseAuth.js";

function Detail() {
  const { id } = useParams();
  const { accessToken } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favMsg, setFavMsg] = useState("");
  const [favMsgType, setFavMsgType] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const movieRes = await axios.get(`${BASE_URL}/movie/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setMovie(movieRes.data.data);

        // Cek apakah sudah jadi favorite
        const favRes = await axios.get(`${BASE_URL}/favorite`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const favList = favRes.data.data || [];
        setIsFavorite(favList.some((fav) => fav.movieId === Number(id)));
      } catch (error) {
        console.error("Error fetching movie detail:", error);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };
    if (accessToken) fetchDetail();
  }, [id, accessToken]);

  const handleAddFavorite = async () => {
    setFavMsg("");
    setFavMsgType("");
    try {
      await axios.post(
        `${BASE_URL}/favorite`,
        { movieId: Number(id), notes: "Film favorit saya" },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setFavMsg("Berhasil ditambahkan ke favorite!");
      setFavMsgType("success");
      setIsFavorite(true);
    } catch (error) {
      setFavMsg("Gagal menambah ke favorite!");
      setFavMsgType("error");
    }
  };

  const handleRemoveFavorite = async () => {
    setFavMsg("");
    setFavMsgType("");
    try {
      // Cari id favorite
      const favRes = await axios.get(`${BASE_URL}/favorite`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const favList = favRes.data.data || [];
      const fav = favList.find((f) => f.movieId === Number(id));
      if (fav) {
        await axios.delete(`${BASE_URL}/favorite/${fav.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setFavMsg("Berhasil dihapus dari favorite!");
        setFavMsgType("success");
        setIsFavorite(false);
      }
    } catch (error) {
      setFavMsg("Gagal menghapus favorite!");
      setFavMsgType("error");
    }
  };

  if (loading) {
    return (
      <section className="section has-text-centered">
        <p className="is-size-4 has-text-grey">Loading...</p>
      </section>
    );
  }

  if (!movie) {
    return (
      <section className="section has-text-centered">
        <p className="is-size-4 has-text-danger">Film tidak ditemukan.</p>
      </section>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage:
          'url("https://storage.googleapis.com/project-storage-konser/images/konser.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      <section className="section" style={{ width: "100%", maxWidth: "600px" }}>
        <div className="container">
          <div className="card">
            <div className="card-image has-text-centered p-4">
              {movie.poster_url ? (
                <figure
                  className="image is-3by4 mx-auto"
                  style={{ maxWidth: "300px" }}
                >
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    style={{ objectFit: "cover", borderRadius: "8px" }}
                  />
                </figure>
              ) : (
                <div
                  className="has-background-grey-lighter has-text-grey-light is-flex is-justify-content-center is-align-items-center"
                  style={{ height: "400px", borderRadius: "8px" }}
                >
                  No Poster
                </div>
              )}
            </div>
            <div className="card-content">
              <h1 className="title is-4 has-text-centered">{movie.title}</h1>
              <div className="content has-text-centered">
                <p>
                  <strong>Genre:</strong> {movie.genre}
                </p>
                <p>
                  <strong>Tahun:</strong> {movie.year}
                </p>
                <p>
                  <strong>Deskripsi:</strong> {movie.description}
                </p>
              </div>
              <div className="buttons mt-4 is-flex is-justify-content-center">
                {isFavorite ? (
                  <button className="button is-danger" onClick={handleRemoveFavorite}>
                    Hapus dari Favorite
                  </button>
                ) : (
                  <button className="button is-warning" onClick={handleAddFavorite}>
                    Tambah ke Favorite
                  </button>
                )}
                <button
                  className="button is-light"
                  onClick={() => navigate(-1)}
                >
                  Kembali
                </button>
              </div>
              {favMsg && (
                <div
                  className={`mt-3 has-text-centered ${
                    favMsgType === "error"
                      ? "has-text-danger"
                      : "has-text-success"
                  }`}
                >
                  {favMsg}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Detail;