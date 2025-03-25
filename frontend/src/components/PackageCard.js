import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaClock, FaRupeeSign, FaPercent, FaArrowRight, FaCalendarCheck, FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import './PackageCard.css';

const PackageCard = ({ package: tourPackage, isBestValue }) => {
  const navigate = useNavigate();

  // Calculate discounted price if there's a discount
  const discountedPrice = 
    tourPackage.discount > 0 
      ? (tourPackage.price - (tourPackage.price * tourPackage.discount / 100)).toFixed(2)
      : null;
  
  // Format price for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price);
  };

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };
      
  return (
    <Card className="package-card h-100">
      {isBestValue && (
        <div className="best-value-tag">
          <FaStar className="me-1" /> Best Value
        </div>
      )}
      
      {tourPackage.discount > 0 && (
        <div className="discount-badge">
          <FaPercent /> {tourPackage.discount}% OFF
        </div>
      )}
      
      <Card.Body className="card-content">
        <Card.Title className="package-title">{tourPackage.name}</Card.Title>
        
        <div className="package-duration">
          <FaClock /> {tourPackage.duration}
        </div>
        
        <div className="package-price">
          {discountedPrice ? (
            <>
              <span className="original-price">
                <FaRupeeSign />{formatPrice(tourPackage.price)}
              </span>
              <span className="discounted-price">
                <FaRupeeSign />{formatPrice(discountedPrice)}
              </span>
            </>
          ) : (
            <span>
              <FaRupeeSign />{formatPrice(tourPackage.price)}
            </span>
          )}
        </div>
        
        <Card.Text className="package-description">
          {tourPackage.description}
        </Card.Text>
        
        <div className="places-included">
          <div className="places-included-title">Places included:</div>
          <div className="places-included-list">
            {tourPackage.places && tourPackage.places.slice(0, 3).map((place, index) => (
              <span key={index} className="place-tag">
                <FaMapMarkerAlt /> {place.name}
              </span>
            ))}
            {tourPackage.places && tourPackage.places.length > 3 && (
              <span className="place-tag">
                +{tourPackage.places.length - 3} more
              </span>
            )}
          </div>
        </div>
      </Card.Body>
      
      <Card.Footer className="package-footer">
        <Button 
          variant="outline-primary" 
          className="view-package-btn"
          onClick={() => handleNavigation(`/packages/${tourPackage.id}`)}
        >
          View Package <FaArrowRight />
        </Button>
        <Button 
          variant="outline-success" 
          className="book-now-btn"
          onClick={() => handleNavigation(`/book/${tourPackage.id}`)}
        >
          Book Now <FaCalendarCheck />
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default PackageCard; 