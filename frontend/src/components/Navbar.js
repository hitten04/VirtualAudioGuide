import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaHeadphones, FaUser, FaSignInAlt, FaSignOutAlt, FaInfoCircle, FaEnvelope } from 'react-icons/fa';
import './Navbar.css';

const AppNavbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="app-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand">
          <FaHeadphones className="brand-icon" /> VirtualAudioGuide
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="nav-link">Home</Nav.Link>
            <Nav.Link as={Link} to="/places" className="nav-link">Places</Nav.Link>
            <Nav.Link as={Link} to="/packages" className="nav-link">Packages</Nav.Link>
            <Nav.Link as={Link} to="/about" className="nav-link">
              <FaInfoCircle className="me-1" /> About
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className="nav-link">
              <FaEnvelope className="me-1" /> Contact
            </Nav.Link>
            {currentUser ? (
              <>
                <Nav.Link as={Link} to="/profile" className="nav-link">
                  <FaUser /> Profile
                </Nav.Link>
                <Button 
                  variant="outline-danger" 
                  className="logout-btn"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt /> Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="nav-link">
                  <FaSignInAlt /> Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="nav-link">
                  <FaUser /> Sign Up
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar; 