import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login2: React.FC = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateLogin = (input: string): boolean => {
    if (input.length === 0) return false;
    return input.length >= 3;
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const input = e.target.value;
    setEmailOrUsername(input);

    if (input.length > 0 && input.length < 3) {
      setLoginError('Must be at least 3 characters');
    } else {
      setLoginError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const password = e.target.value;
    setPassword(password);

    if (password.length > 0 && !validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters long');
    } else {
      setPasswordError('');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailOrUsername || !password) {
      setError('Please enter both email/username and password');
      return;
    }

    try {
      const storedUsers = localStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      // Check if login input matches either email or username
      const validUser = users.find(
        (user: any) => 
          (user.email === emailOrUsername || user.username === emailOrUsername) && 
          user.password === password
      );

      if (!validUser) {
        setError('Invalid email/username or password');
        return;
      }

      // Store both email and username for session
      localStorage.setItem('loggedInUser', validUser.email);
      localStorage.setItem('loggedInUsername', validUser.username);

      // Redirect to todos
      navigate('/todos');
    } catch (err) {
      setError('An error occurred during login');
      console.error('Login error:', err);
    }
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      position: 'relative',
      background: '#f5f5f5', 
      backgroundImage: 'none' 
    }}>
      <div className="container" style={{
        backgroundImage: 'none', // Override any inherited background
        background: 'transparent'
      }}>
        <div className="top"></div>
        <div className="center">
          <h2>Please Sign In</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Email or Username"
              value={emailOrUsername}
              onChange={handleLoginChange}
              style={{ width: '100%', padding: '15px', margin: '5px', borderRadius: '1px', border: '1px solid #ccc' }}
            />
            {loginError && <p style={{ color: 'red', margin: '5px 0' }}>{loginError}</p>}

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              style={{ width: '100%', padding: '15px', margin: '5px', borderRadius: '1px', border: '1px solid #ccc' }}
            />
            {passwordError && <p style={{ color: 'red', margin: '5px 0' }}>{passwordError}</p>}
            {error && <p style={{ color: 'red', margin: '5px 0' }}>{error}</p>}
            
            <div style={{ marginTop: '20px' }}>
              <button 
                type="submit" 
                style={{ 
                  marginRight: '10px', 
                  padding: '10px 20px', 
                  background: '#333', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '1px', 
                  cursor: 'pointer' 
                }}
              >
                Login
              </button>
              <button 
                type="button" 
                onClick={() => navigate('/register')}
                style={{ 
                  padding: '10px 20px', 
                  background: '#333', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '1px', 
                  cursor: 'pointer' 
                }}
              >
                Register
              </button>
            </div>
          </form>
        </div>
        <div className="bottom"></div>
      </div>
    </div>
  );
};

export default Login2;