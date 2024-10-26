import React from 'react';
import './App.css'; // Assuming global styles are here
//import './Home.css'; // Assuming Home-specific styles are here

function Home() {
  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">LPG Association</div>
        <ul className="navbar-links">
          <li><a href="/services">Services</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/login">Login</a></li>
        </ul>
      </nav>
      
      <div className="home-container">
        <h1>Welcome to the LPG Association</h1>
        <p>Stay ahead of safety—monitor your LPG gas levels in real-time.</p>
      </div>
    </>
  );
}

export default Home;
