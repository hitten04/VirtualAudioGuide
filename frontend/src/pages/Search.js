import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Spinner, Tab, Tabs } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import PlaceCard from '../components/PlaceCard';
import PackageCard from '../components/PackageCard';
import apiService from '../services/api';
import { FaSearch, FaTimes } from 'react-icons/fa';
import './Search.css';

const Search = () => {
  const [places, setPlaces] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get search query from URL
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    } else {
      setLoading(false);
    }
  }, [location.search]);
  
  const performSearch = async (query) => {
    try {
      setLoading(true);
      
      // Fetch places and packages in parallel
      const [placesResponse, packagesResponse] = await Promise.all([
        apiService.getPlaces(),
        apiService.getPackages()
      ]);
      
      const placesData = placesResponse.results || placesResponse;
      const packagesData = packagesResponse.results || packagesResponse;
      
      // Filter results based on query
      const filteredPlaces = placesData.filter(place => 
        place.name.toLowerCase().includes(query.toLowerCase()) ||
        place.location.toLowerCase().includes(query.toLowerCase()) ||
        (place.description && place.description.toLowerCase().includes(query.toLowerCase()))
      );
      
      const filteredPackages = packagesData.filter(pkg => 
        pkg.name.toLowerCase().includes(query.toLowerCase()) ||
        (pkg.description && pkg.description.toLowerCase().includes(query.toLowerCase()))
      );
      
      setPlaces(filteredPlaces);
      setPackages(filteredPackages);
      
    } catch (err) {
      console.error('Error performing search:', err);
      setError('Failed to load search results. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    navigate('/');
  };
  
  const renderResults = () => {
    const totalResults = places.length + packages.length;
    
    if (loading) {
      return (
        <div className="search-loading">
          <Spinner animation="border" variant="primary" />
          <p>Searching...</p>
        </div>
      );
    }
    
    if (error) {
      return <div className="search-error">{error}</div>;
    }
    
    if (totalResults === 0) {
      return (
        <div className="no-results">
          <div className="no-results-icon">😕</div>
          <h3>No results found</h3>
          <p>We couldn't find anything matching "{searchQuery}"</p>
          <p>Try different keywords or check for spelling mistakes</p>
        </div>
      );
    }
    
    return (
      <div className="search-results-tabs">
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4"
        >
          <Tab eventKey="all" title={`All (${totalResults})`}>
            {places.length > 0 && (
              <div className="search-category">
                <h3>Places ({places.length})</h3>
                <Row className="row-cols-1 row-cols-md-2 row-cols-lg-3">
                  {places.map(place => (
                    <Col key={place.id} className="mb-4">
                      <PlaceCard place={place} />
                    </Col>
                  ))}
                </Row>
              </div>
            )}
            
            {packages.length > 0 && (
              <div className="search-category">
                <h3>Packages ({packages.length})</h3>
                <Row className="row-cols-1 row-cols-md-2 row-cols-lg-3">
                  {packages.map(pkg => (
                    <Col key={pkg.id} className="mb-4">
                      <PackageCard package={pkg} />
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </Tab>
          
          <Tab eventKey="places" title={`Places (${places.length})`}>
            {places.length > 0 ? (
              <Row className="row-cols-1 row-cols-md-2 row-cols-lg-3">
                {places.map(place => (
                  <Col key={place.id} className="mb-4">
                    <PlaceCard place={place} />
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="no-category-results">
                <p>No places found matching "{searchQuery}"</p>
              </div>
            )}
          </Tab>
          
          <Tab eventKey="packages" title={`Packages (${packages.length})`}>
            {packages.length > 0 ? (
              <Row className="row-cols-1 row-cols-md-2 row-cols-lg-3">
                {packages.map(pkg => (
                  <Col key={pkg.id} className="mb-4">
                    <PackageCard package={pkg} />
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="no-category-results">
                <p>No packages found matching "{searchQuery}"</p>
              </div>
            )}
          </Tab>
        </Tabs>
      </div>
    );
  };
  
  return (
    <div className="search-page">
      <div className="search-header">
        <Container>
          <h1 className="search-title">Search Results</h1>
          
          <Form onSubmit={handleSearchSubmit} className="search-form">
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search for places, tours, or experiences..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <InputGroup.Text 
                  className="clear-search" 
                  onClick={clearSearch}
                >
                  <FaTimes />
                </InputGroup.Text>
              )}
            </InputGroup>
          </Form>
        </Container>
      </div>
      
      <Container className="search-container">
        {renderResults()}
      </Container>
    </div>
  );
};

export default Search; 