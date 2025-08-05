import { useState } from 'react';

const Auth = ({ setToken }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = isLogin ? `${import.meta.env.VITE_API_URL}/sanctum/token` : `${import.meta.env.VITE_API_URL}/signup`;
    const body = isLogin ? { email, password, device_name: 'react-app' } : { name, email, password, password_confirmation: passwordConfirmation };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        if (isLogin) {
          const data = await response.text();
          if (typeof data === 'string') {
            localStorage.setItem('token', data);
            setToken(data);
          } else {
            alert('Something went wrong with the login response.');
          }
        } else {
          alert('Signup successful! Please login.');
          setIsLogin(true);
        }
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px' }}>{isLogin ? 'Login' : 'Signup'}</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {!isLogin && (
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
          )}
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          {!isLogin && (
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Confirm Password:</label>
              <input
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            {loading ? 'Loading...' : (isLogin ? 'Login' : 'Signup')}
          </button>
        </form>
        <button
          onClick={() => setIsLogin(!isLogin)}
          disabled={loading}
          style={{ marginTop: '15px', width: '100%', backgroundColor: '#6c757d', color: '#fff', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {isLogin ? 'Need to signup?' : 'Have an account?'}
        </button>
      </div>
    </div>
  );
};

export default Auth;