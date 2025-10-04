import React, { useState } from 'react';
import Login from './Login';
import Main from './Main';

const App = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return <Main user={user} onLogout={handleLogout} />;
};

export default App;