import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email: string): Boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username: string): Boolean => {
    return username.length >= 3 && username.length <= 15 && /^[a-zA-Z0-9_]+$/.test(username);
  };

  const validatePassword = (password: string): Boolean => {
    return password.length >= 8;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const email = e.target.value;
    setEmail(email);

    if (!validateEmail(email)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const username = e.target.value;
    setUsername(username);
    if (!validateUsername(username)) {
      setUsernameError('Username must be 3-15 characters long and contain only letters, numbers, and underscores');
    } else {
      setUsernameError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const password = e.target.value;
    setPassword(password);

    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters long');
    } else {
      setPasswordError('');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !username || !password) {
      setError('Email, username, and password are required');
      return;
    }

    // Check validation before proceeding
    if (emailError || passwordError || usernameError) {
      setError('Please fix the validation errors');
      return;
    }

    const storedUsers = localStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    // Check if email already exists
    const emailExists = users.find((user: any) => user.email === email);
    if (emailExists) {
      setError('Email already exists');
      return;
    }

    // Check if username already exists
    const usernameExists = users.find((user: any) => user.username === username);
    if (usernameExists) {
      setError('Username already exists');
      return;
    }

    const newUser = { email, username, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    navigate('/login'); // Redirect to login page
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      position: 'relative',
      background: '#f5f5f5', // Add a clean background color
      backgroundImage: 'none' // Explicitly remove any background image
    }}>
      <div className="container" style={{
        backgroundImage: 'none', // Override any inherited background
        background: 'transparent'
      }}>
        <div className="top"></div>
        <div className="center">
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
              />
              {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
            </div>
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={handleUsernameChange}
              />
              {usernameError && <p style={{ color: 'red' }}>{usernameError}</p>}
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
              />
              {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <div style={{ marginTop: '20px' }}>
              <button type="submit" style={{ marginRight: '10px' }}>Register</button>
              <button type="button" onClick={() => navigate('/')}>Back to Login</button>
            </div>
          </form>
        </div>
        <div className="bottom"></div>
      </div>
    </div>
  );
};

export default Register;