import { useEffect, useState } from "react";
import useAuth from "../auth/UseAuth.js";
import axios from "../api/AxiosInstance.js";
import { BASE_URL } from "../utils/Utils.js";

const FavoritePage = () => {
  const { accessToken } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch all favorites
  const fetchFavorites = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await axios.get(`${BASE_URL}/favorite`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setFavorites(res.data.data || []);
    } catch (error) {
      setErrorMsg("Gagal mengambil data favorite");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (accessToken) {
      fetchFavorites();
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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#222",
        padding: "2rem 0",
      }}
    >
      <div className="container">
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
            {favorites.map((fav) => (
              <div className="column is-one-third" key={fav.id}>
                <div className="card">
                  <div className="card-content">
                    <p className="title is-5">
                      {fav.movie?.title || `Movie ID: ${fav.movieId}`}
                    </p>
                    <p className="subtitle is-6">
                      {fav.movie?.genre} | {fav.movie?.year}
                    </p>
                    <p>{fav.notes}</p>
                    <button
                      className="button is-danger mt-3"
                      onClick={() => handleDeleteFavorite(fav.id)}
                    >
                      Hapus dari Favorite
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritePage;