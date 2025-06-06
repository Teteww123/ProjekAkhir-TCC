import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../auth/UseAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPass] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!username) {
      setError("Username tidak boleh kosong !");
      return;
    }
    try {
      // Jika backend butuh token (misal: untuk refresh login), tambahkan di sini
      // const token = "Bearer ..."; // isi token jika memang sudah punya
      // const result = await login(username, password, token);

      // Jika tidak, cukup seperti ini:
      const result = await login(username, password);
      if (result) {
        navigate("/home", { state: { username } });
      } else {
        setError("Username atau Password Salah !");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError(error.response?.data?.message || "Login failed");
    }
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
        alignItems: "center",
        justifyContent: "center",
        backgroundImage:
          'url("https://getwallpapers.com/wallpaper/full/1/b/d/829640-gorgerous-movie-backgrounds-1920x1080-ipad-pro.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "320px",
          backgroundColor: "rgba(44, 44, 44, 0.85)",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          color: "white",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 className="title has-text-white has-text-centered mb-6">Log In</h2>
        <form onSubmit={handleLogin}>
          <input
            className="input mb-3"
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <input
            className="input mb-4"
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPass(e.target.value)}
            autoComplete="current-password"
          />
          <button
            className="button is-primary is-fullwidth mb-3"
            type="submit"
          >
            Login
          </button>
        </form>
        {error && <p className="has-text-danger has-text-centered">{error}</p>}
        <p className="has-text-centered mt-4">
          Belum Punya Akun?{" "}
          <Link to="/register" className="has-text-link">
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;