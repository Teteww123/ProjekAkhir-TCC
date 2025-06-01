import { useEffect, useState } from "react";
import useAuth from "../auth/UseAuth.js";
import axios from "../api/AxiosInstance.js";
import { BASE_URL } from "../utils/Utils.js";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";

function ProfilePage() {
  const { accessToken, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      // Ambil data user (asumsi backend mengembalikan user yang sedang login)
      const resUser = await axios.get(`${BASE_URL}/user`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUser(resUser.data.data || null);

      // Ambil data favorite
      const resFav = await axios.get(`${BASE_URL}/favorite`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setFavorites(resFav.data.data || []);
    } catch (error) {
      setUser(null);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchProfile();
    }
    // eslint-disable-next-line
  }, [accessToken]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        backgroundImage:
          'url("https://storage.googleapis.com/project-storage-konser/images/konser.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        paddingTop: "4rem",
        boxSizing: "border-box",
      }}
    >
      <nav
        className="navbar is-dark-grey"
        role="navigation"
        aria-label="main navigation"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          backgroundColor: "rgba(0,0,0,0.8)",
          padding: "0.5rem 1rem",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            fontWeight: "bold",
            fontSize: "2rem",
            color: "white",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          &larr;
        </button>

        <button
          onClick={handleLogout}
          className="button is-dark"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <FaSignOutAlt size={28} color="red" />
        </button>
      </nav>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "2rem 1rem",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            width: "100%",
            maxWidth: "400px",
            color: "white",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              marginBottom: "1.5rem",
            }}
          >
            Profil Saya
          </h2>

          <div>
            <FaUserCircle size={100} color="white" />
          </div>
          <div style={{ fontSize: "1.5rem" }}>
            {user?.username || (
              <span style={{ color: "#999" }}>(tidak ditemukan)</span>
            )}
          </div>
          <div style={{ marginBottom: "1rem", fontSize: "1rem" }}>
            User ID: {user?.id || "-"}
          </div>

          <div>
            <h3 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
              Movie Favorite:
            </h3>
            {loading ? (
              <p style={{ color: "#bbb" }}>Loading...</p>
            ) : favorites.length > 0 ? (
              <ul
                style={{
                  listStyleType: "disc",
                  paddingLeft: "1.5rem",
                  textAlign: "left",
                }}
              >
                {favorites.map((fav, idx) => (
                  <li
                    key={idx}
                    style={{
                      marginBottom: "1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: "600" }}>
                        {fav.movie?.title || `Movie ID: ${fav.movieId}`}
                      </div>
                      <div style={{ color: "#ccc", fontSize: "0.9rem" }}>
                        {fav.notes || "-"}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: "#bbb" }}>Belum ada movie favorite</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;