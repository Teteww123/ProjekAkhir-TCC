import { useEffect, useState } from "react";
import useAuth from "../auth/UseAuth.js";
import axios from "../api/AxiosInstance.js";
import { BASE_URL } from "../utils/utils.js";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";

function ProfilePage() {
  const { accessToken, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [tiketList, setTiketList] = useState([]);
  const [konserMap, setKonserMap] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const emailLocal = localStorage.getItem("email");
      const userNameLocal = localStorage.getItem("userName");
      setEmail(emailLocal || "");
      setUserName(userNameLocal || "");
      if (!emailLocal || userName) return;

      const res = await axios.get(`${BASE_URL}/pengunjung/${emailLocal}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const tiketArray = (res.data.data || []).map(
        (pengunjung) => pengunjung.tiket
      );
      setTiketList(tiketArray);

      const konserRes = await axios.get(`${BASE_URL}/konser`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const map = {};
      (konserRes.data.data || []).forEach((k) => {
        map[k.nama] = k;
      });
      setKonserMap(map);
    } catch (error) {
      console.error(error);
      setTiketList([]);
      setKonserMap({});
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (accessToken) {
      fetchProfile();
    }
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
            {userName || (
              <span style={{ color: "#999" }}>(tidak ditemukan)</span>
            )}
          </div>

          <div style={{ marginBottom: "1rem", fontSize: "1rem" }}>
            {email || <span style={{ color: "#999" }}>(tidak ditemukan)</span>}
          </div>

          <div>
            <h3 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
              Tiket yang Dimiliki:
            </h3>
            {loading ? (
              <p style={{ color: "#bbb" }}>Loading...</p>
            ) : tiketList.length > 0 ? (
              <ul
                style={{
                  listStyleType: "disc",
                  paddingLeft: "1.5rem",
                  textAlign: "left",
                }}
              >
                {tiketList.map((tiket, idx) => {
                  const konser = konserMap[tiket] || {};
                  return (
                    <li
                      key={idx}
                      style={{
                        marginBottom: "1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      {konser.poster && (
                        <img
                          src={konser.poster}
                          alt={konser.nama}
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      )}
                      <div>
                        <div style={{ fontWeight: "600" }}>
                          {konser.nama || tiket}
                        </div>
                        <div style={{ color: "#ccc", fontSize: "0.9rem" }}>
                          {konser.tanggal || "-"}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p style={{ color: "#bbb" }}>Belum ada tiket yang dimiliki</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;