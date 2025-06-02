import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuthContext } from "./auth/AuthProvider";
import HomePage from "./pages/HomePage.js";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage.js";
import Detail from "./pages/Details.js";
import ProfilePage from "./pages/ProfilePage.js";
import FavoritePage from "./pages/FavoritePage.js";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

function AppRoutes() {
  const { accessToken } = useAuthContext();
  const isAuthenticated = !!accessToken;

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/home"
        element={isAuthenticated ? <HomePage /> : <Navigate to="/home" />}
      />
      <Route
        path="/home/:id"
        element={isAuthenticated ? <Detail /> : <Navigate to="/login" />}
      />
      <Route
        path="/profile"
        element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
      />
      <Route
        path="/favorite"
        element={isAuthenticated ? <FavoritePage /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;