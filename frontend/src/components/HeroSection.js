import React, { useState, useEffect } from 'react';
import { Container, Form } from 'react-bootstrap';
import { FaSearch, FaHeadphones } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Create and animate particles
  useEffect(() => {
    const createParticle = () => {
      const particles = document.querySelector('.hero-particles');
      if (!particles) return;

      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random size between 3 and 8 pixels
      const size = Math.random() * 5 + 3;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random position
      particle.style.left = `${Math.random() * 100}%`;
      
      // Random animation duration between 10 and 20 seconds
      const duration = Math.random() * 10 + 10;
      particle.style.animationDuration = `${duration}s`;
      
      particles.appendChild(particle);
      
      // Remove particle after animation
      setTimeout(() => {
        particle.remove();
      }, duration * 1000);
    };

    // Create particles at intervals
    const interval = setInterval(createParticle, 300);
    return () => clearInterval(interval);
  }, []);

  // Scroll to content section
  const scrollToContent = () => {
    const contentSection = document.querySelector('#featured-places');
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section">
      <div className="overlay" />
      <div className="hero-particles" />
      
      <Container className="hero-content">
        <div className="icon-container">
          <FaHeadphones className="hero-icon" />
        </div>
        <div className="title-container">
          <h1 className="hero-title">
            Discover the World Through Sound
          </h1>
        </div>
        <p className="hero-subtitle">
          Immerse yourself in rich audio guides that bring destinations to life. 
          Experience history, culture, and stories like never before.
        </p>

        <Form onSubmit={handleSearch} className="search-form">
          <div className="search-container">
            <Form.Control
              type="text"
              placeholder="Search for places, tours, or experiences..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search"
            />
            <button type="submit" className="search-btn" aria-label="Search">
              <FaSearch color="white" size={28} />
            </button>
          </div>
        </Form>

        <div className="hero-features">
          <div className="feature">
            <span className="feature-number">500+</span>
            <span className="feature-text">Audio Guides</span>
          </div>
          <div className="feature">
            <span className="feature-number">50+</span>
            <span className="feature-text">Countries</span>
          </div>
          <div className="feature">
            <span className="feature-number">1M+</span>
            <span className="feature-text">Users</span>
          </div>
        </div>
      </Container>

      <div className="scroll-indicator" onClick={scrollToContent}>
        <div className="scroll-icon" />
        <span className="scroll-text">Explore</span>
      </div>
    </section>
  );
};

export default HeroSection; 