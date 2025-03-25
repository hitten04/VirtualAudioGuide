import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Spinner } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import PlaceCard from '../components/PlaceCard';
import apiService from '../services/api';
import { FaSearch } from 'react-icons/fa';
import './Places.css';

const Places = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  
  const location = useLocation();
  
  useEffect(() => {
    // Check if there's a search query in the URL
    const params = new URLSearchParams(location.search);
    const urlSearchQuery = params.get('search');
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
    }
    
    fetchPlaces();
  }, [location.search]);
  
  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPlaces();
      const placesData = response.results || response;
      setPlaces(placesData);
      setFilteredPlaces(placesData);
    } catch (err) {
      console.error('Error fetching places:', err);
      setError('Failed to load places. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Filter places based on search query
    if (searchQuery.trim() === '') {
      setFilteredPlaces(places);
    } else {
      const filtered = places.filter(place => 
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPlaces(filtered);
    }
  }, [searchQuery, places]);
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  return (
    <div className="places-page">
      <div className="places-header">
        <Container>
          <h1 className="places-title">Historical Places of Gujarat</h1>
          <p className="places-subtitle">
            Explore the rich heritage and culture of Gujarat through its iconic historical sites
          </p>
          
          <Form className="places-search-form">
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search by name, location, or description..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </InputGroup>
          </Form>
        </Container>
      </div>
      
      <Container className="places-container">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading places...</p>
          </div>
        ) : error ? (
          <div className="text-center py-5 text-danger">{error}</div>
        ) : filteredPlaces.length === 0 ? (
          <div className="text-center py-5">
            <p>No places found matching your search criteria.</p>
          </div>
        ) : (
          <Row className="row-cols-1 row-cols-md-2 row-cols-lg-3">
            {filteredPlaces.map(place => (
              <Col key={place.id} className="mb-4">
                <PlaceCard place={place} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Places; 