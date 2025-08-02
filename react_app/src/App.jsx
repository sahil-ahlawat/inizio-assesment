import { useState } from 'react';
import Auth from './Auth';
import Dashboard from './Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <>
      {token ? (
        <Dashboard token={token} handleLogout={handleLogout} />
      ) : (
        <Auth setToken={setToken} />
      )}
    </>
  );
}

export default App;