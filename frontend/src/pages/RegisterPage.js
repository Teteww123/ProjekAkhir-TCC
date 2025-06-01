import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/Utils.js";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPass] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!username) {
      setErrorMsg("Username tidak boleh kosong !");
      return;
    }
    if (!password) {
      setErrorMsg("Password tidak boleh kosong !");
      return;
    }
    try {
      await axios.post(`${BASE_URL}/user/register`, {
        username,
        password,
      });
      navigate("/login");
    } catch (error) {
      console.error("Register Error:", error.response?.data || error.message);
      setErrorMsg(error.response?.data?.message || "Registrasi gagal !");
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
          'url("https://storage.googleapis.com/project-storage-konser/images/konser.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
      }}
    >
      <div
        className="box"
        style={{
          width: "384px",
          backgroundColor: "rgba(44, 44, 44, 0.85)",
          color: "white",
        }}
      >
        <h2 className="title has-text-white has-text-centered">Register</h2>
        <form onSubmit={handleRegister}>
          <input
            className="input mb-3"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="input mb-4"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPass(e.target.value)}
          />
          <button
            className="button is-success is-fullwidth mb-3"
            type="submit"
          >
            Register
          </button>
        </form>
        {errorMsg && (
          <p className="has-text-centered has-text-danger mb-2">{errorMsg}</p>
        )}
        <p className="has-text-centered">
          Sudah Punya Akun?{" "}
          <Link to="/login" className="has-text-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;