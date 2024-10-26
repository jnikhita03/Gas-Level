// src/components/Login.js
import React, { useState } from 'react';
import { auth } from '../firebase'; // Ensure this is correctly imported
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import the function

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Use signInWithEmailAndPassword function from firebase/auth
      await signInWithEmailAndPassword(auth, email, password);
     // alert("Login successful!");
      window.location.href = '/dashboard'; // Redirect to dashboard after login
    } catch (error) {
      console.error("Error logging in:", error);
      alert(error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>Email:</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password:</label>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a href="/signup">Sign up</a></p>
    </div>
  );
}

export default Login;
