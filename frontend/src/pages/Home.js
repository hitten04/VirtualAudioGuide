import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import PlaceCard from '../components/PlaceCard';
import PackageCard from '../components/PackageCard';
import apiService from '../services/api';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const [featuredPlaces, setFeaturedPlaces] = useState([]);
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [places, setPlaces] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const autoplayTimerRef = useRef(null);
  const [transitionKey, setTransitionKey] = useState(0);

  useEffect(() => {
    const fetchFeaturedData = async () => {
      try {
        setLoading(true);
        const [placesResponse, packagesResponse, allPlacesResponse] = await Promise.all([
          apiService.getFeaturedPlaces(),
          apiService.getFeaturedPackages(),
          apiService.getPlaces() // Fetch all places
        ]);
        
        setFeaturedPlaces(placesResponse.results || placesResponse);
        setFeaturedPackages(packagesResponse.results || packagesResponse);
        setPlaces(allPlacesResponse.results || allPlacesResponse);
      } catch (err) {
        console.error('Error fetching content:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedData();
  }, []);
  
  // Handle autoplay
  useEffect(() => {
    if (!places.length || !isAutoplay) return;
    
    const startAutoplay = () => {
      clearInterval(autoplayTimerRef.current); // Clear any existing interval first
      autoplayTimerRef.current = setInterval(() => {
        setActiveIndex(prev => (prev + 1) % places.length);
      }, 3000); // 3 seconds
    };
    
    startAutoplay();
    
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [places.length, isAutoplay]);
  
  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, []);
  
  const handleCardClick = (index) => {
    setActiveIndex(index);
    resetAutoplayTimer();
  };
  
  const handlePrev = () => {
    setActiveIndex(prev => (prev === 0 ? places.length - 1 : prev - 1));
    setTransitionKey(prev => prev + 1); // Force re-render with new key
    resetAutoplayTimer();
  };
  
  const handleNext = () => {
    setActiveIndex(prev => (prev + 1) % places.length);
    setTransitionKey(prev => prev + 1); // Force re-render with new key
    resetAutoplayTimer();
  };
  
  const resetAutoplayTimer = () => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
    
    if (isAutoplay) {
      autoplayTimerRef.current = setInterval(() => {
        setActiveIndex(prev => (prev + 1) % places.length);
      }, 3000); // 3 seconds
    }
  };
  
  // Calculate position and style for each card
  const getCardStyle = (index) => {
    if (!places.length) return {};
    
    // Ensure we have a valid number of places
    if (places.length <= 1) {
      return {
        transform: 'translate3d(0, 0, 0) rotateY(0) scale3d(1, 1, 1)',
        zIndex: 30,
        opacity: 1
      };
    }
    
    // Calculate relative position with proper circular wrapping
    let diff = index - activeIndex;
    
    // Normalize diff to ensure smooth transitions between first and last cards
    const totalCards = places.length;
    
    // Create a proper wrapping effect that always takes the shortest path
    if (diff > totalCards / 2) diff -= totalCards;
    if (diff < -totalCards / 2) diff += totalCards;
    
    // Calculate a smooth z-index value based on the card's position
    const zIndex = diff === 0 ? 30 : 20 - Math.abs(diff) * 2;
    
    // Active card (center)
    if (diff === 0) {
      return {
        transform: 'translate3d(0, 0, 0) rotateY(0) scale3d(1, 1, 1)',
        zIndex: 30,
        opacity: 1,
        transition: 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.7s ease',
        WebkitFontSmoothing: 'antialiased'
      };
    }
    
    // First card to the right
    if (diff === 1) {
      return {
        transform: 'translate3d(calc(50% + 40px), 0, 0) rotateY(-15deg) scale3d(0.85, 0.85, 1)',
        zIndex: 20,
        opacity: 0.85,
        transition: 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        WebkitFontSmoothing: 'antialiased'
      };
    }
    
    // Second card to the right
    if (diff === 2) {
      return {
        transform: 'translate3d(calc(90% + 60px), 0, 0) rotateY(-20deg) scale3d(0.7, 0.7, 1)',
        zIndex: 10,
        opacity: 0.7,
        transition: 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        WebkitFontSmoothing: 'antialiased'
      };
    }
    
    // First card to the left
    if (diff === -1) {
      return {
        transform: 'translate3d(calc(-50% - 40px), 0, 0) rotateY(15deg) scale3d(0.85, 0.85, 1)',
        zIndex: 20,
        opacity: 0.85,
        transition: 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        WebkitFontSmoothing: 'antialiased'
      };
    }
    
    // Second card to the left
    if (diff === -2) {
      return {
        transform: 'translate3d(calc(-90% - 60px), 0, 0) rotateY(20deg) scale3d(0.7, 0.7, 1)',
        zIndex: 10,
        opacity: 0.7,
        transition: 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        WebkitFontSmoothing: 'antialiased'
      };
    }
    
    // Handle edge cases (cards further away - left side)
    if (diff < -2) {
      return {
        transform: 'translate3d(calc(-110% - 80px), 0, 0) rotateY(30deg) scale3d(0.5, 0.5, 1)',
        zIndex,
        opacity: 0.3,
        transition: 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        WebkitFontSmoothing: 'antialiased'
      };
    }
    
    // Handle edge cases (cards further away - right side)
    return {
      transform: 'translate3d(calc(110% + 80px), 0, 0) rotateY(-30deg) scale3d(0.5, 0.5, 1)',
      zIndex,
      opacity: 0.3,
      transition: 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      WebkitFontSmoothing: 'antialiased'
    };
  };

  return (
    <div className="home-page">
      <HeroSection />
      
      {/* Places Section with Unique Stacked Carousel */}
      <section className="featured-places-section">
        <Container fluid>
          <div className="section-header">
            <h2 className="section-title">Explore Historical Places of Gujarat</h2>
            <p className="section-subtitle">
              Discover the rich heritage and culture of Gujarat through our featured destinations
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-5">Loading...</div>
          ) : error ? (
            <div className="text-center py-5 text-danger">{error}</div>
          ) : places.length === 0 ? (
            <div className="text-center py-5">No places found</div>
          ) : (
            <>
              <div className="stacked-carousel-container">
                <button 
                  className="carousel-nav-btn prev-btn" 
                  onClick={handlePrev}
                  aria-label="Previous"
                >
                  <FaArrowLeft />
                </button>
                
                <div className="stacked-carousel-stage">
                  <div className="stacked-carousel-deck" key={transitionKey}>
                    {places.map((place, index) => (
                      <div 
                        key={place.id} 
                        className={`stacked-carousel-card ${index === activeIndex ? 'active' : ''}`}
                        style={getCardStyle(index)}
                        onClick={() => handleCardClick(index)}
                        role="button"
                        tabIndex={0}
                        aria-label={`View ${place.name}`}
                      >
                        <div className="card-content">
                          <PlaceCard place={place} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button 
                  className="carousel-nav-btn next-btn" 
                  onClick={handleNext}
                  aria-label="Next"
                >
                  <FaArrowRight />
                </button>
                
                <div className="carousel-counter">
                  {activeIndex + 1} / {places.length}
                </div>
              </div>
              
              <div className="text-center mt-5 pt-3">
                <Link to="/places">
                  <Button variant="outline-primary" className="view-all-btn">
                    View All Places <FaArrowRight />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </Container>
      </section>
      
      {/* Featured Packages Section */}
      <section className="featured-packages-section">
        <Container>
          <div className="section-header">
            <h2 className="section-title">Popular Tour Packages</h2>
            <p className="section-subtitle">
              Experience the best of Gujarat with our carefully crafted tour packages
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">Loading packages...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <Alert variant="danger">{error}</Alert>
            </div>
          ) : (
            <>
              <Row className="packages-highlight">
                {featuredPackages.map((pkg, index) => (
                  <Col md={4} key={pkg.id} className="mb-4">
                    <PackageCard package={pkg} isBestValue={index === 0} />
                  </Col>
                ))}
              </Row>
              
              <div className="text-center mt-5">
                <Link to="/packages">
                  <Button variant="outline-success" className="view-all-btn">
                    Explore All Tour Packages <FaArrowRight />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </Container>
      </section>
      
      {/* Why Choose Us Section */}
      <section className="why-choose-section">
        <Container>
          <div className="section-header">
            <h2 className="section-title">Why Choose Virtual Audio Guide?</h2>
            <p className="section-subtitle">
              Experience Gujarat like never before with our unique features
            </p>
          </div>
          
          <Row className="features-row">
            <Col md={4}>
              <div className="feature-card">
                <div className="feature-icon audio-icon"></div>
                <h3 className="feature-title">Immersive Audio Guides</h3>
                <p className="feature-description">
                  Listen to captivating stories about each historical place narrated by expert guides
                </p>
              </div>
            </Col>
            
            <Col md={4}>
              <div className="feature-card">
                <div className="feature-icon personalized-icon"></div>
                <h3 className="feature-title">Personalized Experiences</h3>
                <p className="feature-description">
                  Customize your tour packages based on your interests and preferences
                </p>
              </div>
            </Col>
            
            <Col md={4}>
              <div className="feature-card">
                <div className="feature-icon accessibility-icon"></div>
                <h3 className="feature-title">Easy Accessibility</h3>
                <p className="feature-description">
                  Access audio guides offline and navigate easily through historical sites
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home; 