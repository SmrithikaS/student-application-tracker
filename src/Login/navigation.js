import React from "react";
import "./navigation.css";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/auth";

const Navigation = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth(); 

  const handleLogoutClick = async (event) => {
    event.preventDefault();
    await logout(); 
    navigate("/"); 
  };

  return (
    <header className="navigationbar">
      <nav className="left-menu">
        <Link to="/timeline">View Timeline</Link>
        <Link to="/home">Home</Link>
      </nav>
      <nav className="right-menu">
        {currentUser && (
          <a href="/" onClick={handleLogoutClick} className="logout-button">
            Logout
          </a>
        )}
      </nav>
    </header>
  );
};

export default Navigation;
