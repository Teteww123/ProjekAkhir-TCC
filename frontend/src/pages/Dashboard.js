import { useState, useEffect } from "react";
import { BASE_URL } from "../utils/utils.js";
import axios from "../api/AxiosInstance.js";
import useAuth from "../auth/UseAuth.js";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

function Dashboard() {
  const { accessToken } = useAuth();
  const [konserList, setKonserList] = useState([]);
  const [filteredKonser, setFilteredKonser] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const userEmail = location.state?.email || "";
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || ""
  );

  const fetchKonser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/konser`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setKonserList(response.data.data || []);
      setFilteredKonser(response.data.data || []);
    } catch (error) {
      console.error("Error fetching konser:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/users/${userEmail}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUserName(res.data.data.nama);
      localStorage.setItem("userName", res.data.data.nama);
      localStorage.setItem("email", res.data.data.email);
    } catch (error) {
      setUserName("");
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchUser();
      fetchKonser();
    }
  }, [accessToken]);

  const handleCardClick = (konser) => {
    navigate(`/dashboard/${konser.id}`);
  };

  const handleProfile = async () => {
    navigate("/profile");
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = konserList.filter((konser) =>
      konser.nama.toLowerCase().includes(query)
    );
    setFilteredKonser(filtered);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "flex-start",
        backgroundImage:
          'url("https://storage.googleapis.com/project-storage-konser/images/konser.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
        overflowY: "auto",
      }}
    >
      <nav
        className="navbar is-dark-grey"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <span className="navbar-item has-text-weight-bold is-size-5">
            Halo, {userName} !
          </span>
        </div>
        <div className="navbar-end">
          <div className="navbar-item">
            <input
              type="text"
              className="input"
              placeholder="Cari konser..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="navbar-item">
            <button
              onClick={handleProfile}
              className="button is-dark"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <FaUserCircle size={28} color="white" />
            </button>
          </div>
        </div>
      </nav>

      <section className="section" style={{ flexGrow: 1 }}>
        <div className="container">
          {filteredKonser.length > 0 ? (
            <div className="columns is-multiline">
              {filteredKonser.map((konser) => (
                <div key={konser.id} className="column is-3">
                  <div
                    className="card is-clickable"
                    onClick={() => handleCardClick(konser)}
                  >
                    <div className="card-image">
                      {konser.poster ? (
                        <figure className="image is-4by3">
                          <img
                            src={konser.poster}
                            alt={konser.nama}
                            style={{ objectFit: "cover" }}
                          />
                        </figure>
                      ) : (
                        <div
                          className="has-background-grey-lighter has-text-grey-light is-flex is-justify-content-center is-align-items-center"
                          style={{ height: "180px" }}
                        >
                          No Poster
                        </div>
                      )}
                    </div>
                    <div className="card-content">
                      <p className="title is-5 has-text-centered">
                        {konser.nama}
                      </p>
                      <p className="subtitle is-6 has-text-centered">
                        {konser.lokasi} - {konser.tanggal}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="has-text-centered"
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#000000",
                padding: "1rem",
              }}
            >
              Tidak ada konser!
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;