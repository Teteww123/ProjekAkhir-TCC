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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const movieRes = await axios.get(`${BASE_URL}/movie/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setMovie(movieRes.data);
      } catch (error) {
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };
    if (accessToken) fetchDetail();
  }, [id, accessToken]);

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
                <button
                  className="button is-light"
                  onClick={() => navigate(-1)}
                >
                  Kembali
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Detail;