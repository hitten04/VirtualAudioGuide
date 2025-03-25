import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaHeadphones, FaEye, FaMapMarkedAlt } from 'react-icons/fa';
import './PlaceCard.css';
import { useAuth } from '../contexts/AuthContext';

const PlaceCard = ({ place, featured }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const handleAudioClick = (e) => {
    if (!currentUser) {
      e.preventDefault();
      navigate('/login', { 
        state: { 
          from: `/places/${place.id}?tab=audio`,
          message: 'Please log in to access audio guides'
        } 
      });
    } else {
      window.scrollTo(0, 0);
    }
  };

  const imageUrl = place.image 
    ? place.image.startsWith('http') 
      ? place.image 
      : `http://localhost:8000${place.image}`
    : 'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <Card className="place-card">
      {featured && (
        <span className="featured-badge">
          <FaMapMarkedAlt /> Featured
        </span>
      )}
      
      <div className="card-img-container">
        <Card.Img src={imageUrl} alt={place.name} className="place-img" />
        <div className="location-badge">
          <FaMapMarkerAlt /> {place.location || 'Gujarat, India'}
        </div>
      </div>
      
      <Card.Body className="place-body">
        <Card.Title className="place-title">{place.name}</Card.Title>
        <Card.Text className="place-description">
          {place.description.length > 100 
            ? `${place.description.substring(0, 100)}...` 
            : place.description}
        </Card.Text>
      </Card.Body>
      
      <div className="place-footer">
        <Link to={`/places/${place.id}`} onClick={() => window.scrollTo(0, 0)}>
          <Button variant="outline-primary" className="view-details-btn">
            <FaEye /> Details
          </Button>
        </Link>
        <Link to={`/places/${place.id}?tab=audio`} onClick={handleAudioClick}>
          <Button 
            variant="outline-success" 
            className="audio-btn"
          >
            <FaHeadphones /> Audio
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default PlaceCard; 