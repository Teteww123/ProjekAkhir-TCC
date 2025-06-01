import React from 'react';
import { useAuth } from '../features/auth/AuthContext';

const HomePage = () => {
  const { logout, isAuthenticated } = useAuth();
  return (
    <div>
      <h1>Welcome to the Movie App</h1>
      {isAuthenticated && <button onClick={logout}>Logout</button>}
    </div>
  );
};

export default HomePage;