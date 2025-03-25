import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Badge, Button, Spinner, Alert, Card, ListGroup, Tab, Nav } from 'react-bootstrap';
import { 
  FaClock, FaRupeeSign, FaPercent, FaMapMarkedAlt, FaCalendarAlt, 
  FaUsers, FaPhone, FaInfoCircle, FaArrowLeft, FaHeart, FaShare
} from 'react-icons/fa';
import apiService from '../services/api';
import './PackageDetail.css';

const PackageDetail = () => {
  const { id } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPackageDetails();
  }, [id]);

  const fetchPackageDetails = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPackageById(id);
      setPackageData(response);
    } catch (err) {
      console.error('Error fetching package details:', err);
      setError('Failed to load package details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate discounted price if there's a discount
  const calculateDiscountedPrice = () => {
    if (!packageData) return null;
    
    return packageData.discount > 0 
      ? (packageData.price - (packageData.price * packageData.discount / 100)).toFixed(2)
      : packageData.price;
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading package details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!packageData) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Package not found.</Alert>
        <Link to="/packages" className="btn btn-primary mt-3">
          <FaArrowLeft className="me-2" /> Back to Packages
        </Link>
      </Container>
    );
  }

  const discountedPrice = calculateDiscountedPrice();

  return (
    <div className="package-detail-page">
      <div className="package-detail-header">
        <Container>
          <Link to="/packages" className="back-link">
            <FaArrowLeft /> Back to Packages
          </Link>
          
          <Row className="align-items-center">
            <Col lg={8}>
              <h1 className="package-detail-title">{packageData.name}</h1>
              
              <div className="package-meta">
                <span className="package-duration">
                  <FaClock /> {packageData.duration}
                </span>
                
                {packageData.places && packageData.places.length > 0 && (
                  <span className="package-places-count">
                    <FaMapMarkedAlt /> {packageData.places.length} Places
                  </span>
                )}
                
                {packageData.discount > 0 && (
                  <span className="package-discount">
                    <FaPercent /> {packageData.discount}% OFF
                  </span>
                )}
              </div>
            </Col>
            
            <Col lg={4} className="text-lg-end mt-4 mt-lg-0">
              <div className="package-price-card">
                <div className="price-tag">
                  {packageData.discount > 0 && (
                    <span className="original-price">
                      <FaRupeeSign />{packageData.price}
                    </span>
                  )}
                  <div className="current-price">
                    <FaRupeeSign />{discountedPrice}
                  </div>
                  <span className="price-note">per person</span>
                </div>
                
                <Button 
                  variant="success" 
                  size="lg" 
                  className="book-now-btn w-100"
                  onClick={() => navigate(`/book/${id}`)}
                >
                  Book Now
                </Button>
                
                <div className="action-buttons mt-3">
                  <Button variant="outline-primary" className="action-btn">
                    <FaHeart /> Save
                  </Button>
                  <Button variant="outline-secondary" className="action-btn">
                    <FaShare /> Share
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      
      <Container className="package-detail-content">
        <Row>
          <Col lg={8}>
            <Tab.Container id="package-tabs" defaultActiveKey="overview" onSelect={(k) => setActiveTab(k)}>
              <Nav variant="tabs" className="package-tabs">
                <Nav.Item>
                  <Nav.Link eventKey="overview" className="tab-link">
                    <FaInfoCircle className="me-2" /> Overview
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="itinerary" className="tab-link">
                    <FaCalendarAlt className="me-2" /> Itinerary
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="places" className="tab-link">
                    <FaMapMarkedAlt className="me-2" /> Places
                  </Nav.Link>
                </Nav.Item>
              </Nav>
              
              <Tab.Content className="package-tab-content">
                <Tab.Pane eventKey="overview" className="tab-pane-content">
                  <div className="overview-section">
                    <h3 className="section-title">About This Package</h3>
                    <p className="package-description">{packageData.description}</p>
                    
                    <div className="package-highlights">
                      <h4>Highlights</h4>
                      <ul className="highlights-list">
                        <li>Experience the rich cultural heritage of Gujarat</li>
                        <li>Visit historical monuments and sacred temples</li>
                        <li>Expert guide narration at all locations</li>
                        <li>Comfortable transportation between destinations</li>
                        <li>Experience local cuisine and traditional hospitality</li>
                      </ul>
                    </div>
                    
                    <div className="package-includes">
                      <h4>Package Includes</h4>
                      <Row>
                        <Col md={6}>
                          <ul className="includes-list">
                            <li>Hotel accommodation as per itinerary</li>
                            <li>Daily breakfast and dinner</li>
                            <li>Entrance fees to monuments</li>
                            <li>Experienced tour guide</li>
                          </ul>
                        </Col>
                        <Col md={6}>
                          <ul className="includes-list">
                            <li>Air-conditioned transportation</li>
                            <li>Welcome drink on arrival</li>
                            <li>All applicable taxes</li>
                            <li>Audio guide services at historical sites</li>
                          </ul>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Tab.Pane>
                
                <Tab.Pane eventKey="itinerary" className="tab-pane-content">
                  <div className="itinerary-section">
                    <h3 className="section-title">Tour Itinerary</h3>
                    
                    <div className="timeline">
                      <div className="timeline-item">
                        <div className="timeline-badge">Day 1</div>
                        <div className="timeline-content">
                          <h4>Arrival and Welcome</h4>
                          <p>Arrive at the designated meeting point. Transfer to hotel for check-in. Evening welcome dinner and orientation about the tour.</p>
                        </div>
                      </div>
                      
                      <div className="timeline-item">
                        <div className="timeline-badge">Day 2</div>
                        <div className="timeline-content">
                          <h4>Historical Exploration</h4>
                          <p>Morning visit to the first historical site with audio guide. Afternoon lunch at a local restaurant. Evening visit to another significant monument.</p>
                        </div>
                      </div>
                      
                      <div className="timeline-item">
                        <div className="timeline-badge">Day 3</div>
                        <div className="timeline-content">
                          <h4>Cultural Experience</h4>
                          <p>Full day tour of cultural sites. Opportunity to interact with local artisans. Evening cultural program and dinner.</p>
                        </div>
                      </div>
                      
                      {packageData.duration.includes("4") && (
                        <div className="timeline-item">
                          <div className="timeline-badge">Day 4</div>
                          <div className="timeline-content">
                            <h4>Spiritual Journey</h4>
                            <p>Visit to sacred temples and spiritual sites. Guided meditation session. Evening at leisure.</p>
                          </div>
                        </div>
                      )}
                      
                      {packageData.duration.includes("5") && (
                        <div className="timeline-item">
                          <div className="timeline-badge">Day 5</div>
                          <div className="timeline-content">
                            <h4>Natural Beauty</h4>
                            <p>Excursion to natural attractions. Picnic lunch at a scenic spot. Evening shopping at local market.</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="timeline-item">
                        <div className="timeline-badge">Last Day</div>
                        <div className="timeline-content">
                          <h4>Departure</h4>
                          <p>Morning leisure time. Check-out from hotel. Departure with fond memories.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab.Pane>
                
                <Tab.Pane eventKey="places" className="tab-pane-content">
                  <div className="places-section">
                    <h3 className="section-title">Places You'll Visit</h3>
                    
                    {packageData.places && packageData.places.length > 0 ? (
                      <Row>
                        {packageData.places.map(place => (
                          <Col md={6} key={place.id} className="mb-4">
                            <Card className="place-card">
                              {place.imageUrl && (
                                <Card.Img 
                                  variant="top" 
                                  src={place.imageUrl} 
                                  alt={place.name}
                                  className="place-img" 
                                />
                              )}
                              <Card.Body>
                                <Card.Title className="place-name">{place.name}</Card.Title>
                                <Card.Text className="place-location">
                                  <FaMapMarkedAlt className="me-2" />
                                  {place.location || 'Gujarat, India'}
                                </Card.Text>
                                <Card.Text className="place-description">
                                  {place.description 
                                    ? place.description.substring(0, 120) + '...' 
                                    : 'Explore this fascinating historical location as part of your tour package.'}
                                </Card.Text>
                                <Link to={`/places/${place.id}`} className="btn btn-outline-primary btn-sm">
                                  View Details
                                </Link>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    ) : (
                      <Alert variant="info">
                        No specific places information available for this package.
                      </Alert>
                    )}
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Col>
          
          <Col lg={4}>
            <div className="sidebar-section">
              <Card className="booking-info-card">
                <Card.Header as="h5">Booking Information</Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <FaCalendarAlt className="me-2" /> <strong>Duration:</strong> {packageData.duration}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <FaUsers className="me-2" /> <strong>Group Size:</strong> 2-15 people
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <FaMapMarkedAlt className="me-2" /> <strong>Tour Type:</strong> Guided tour
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <FaInfoCircle className="me-2" /> <strong>Languages:</strong> English, Hindi, Gujarati
                  </ListGroup.Item>
                </ListGroup>
              </Card>
              
              <Card className="contact-card mt-4">
                <Card.Header as="h5">Need Help?</Card.Header>
                <Card.Body>
                  <Card.Text>
                    Have questions about this package? Contact our customer support team for assistance.
                  </Card.Text>
                  <div className="contact-info">
                    <p>
                      <FaPhone className="me-2" /> +91 1234567890
                    </p>
                    <p>
                      <i className="far fa-envelope me-2"></i> support@virtualaudioguide.com
                    </p>
                  </div>
                  <Button variant="primary" className="w-100">
                    Send Inquiry
                  </Button>
                </Card.Body>
              </Card>
              
              <Card className="related-packages-card mt-4">
                <Card.Header as="h5">You May Also Like</Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item className="related-package-item">
                    <Link to="/packages/1" className="related-package-link">
                      <div className="related-package-name">Gujarat Heritage Tour</div>
                      <div className="related-package-price">
                        <FaRupeeSign />7,199
                      </div>
                    </Link>
                  </ListGroup.Item>
                  <ListGroup.Item className="related-package-item">
                    <Link to="/packages/2" className="related-package-link">
                      <div className="related-package-name">Spiritual Gujarat Tour</div>
                      <div className="related-package-price">
                        <FaRupeeSign />11,049
                      </div>
                    </Link>
                  </ListGroup.Item>
                  <ListGroup.Item className="related-package-item">
                    <Link to="/packages/3" className="related-package-link">
                      <div className="related-package-name">Gujarat Adventure Tour</div>
                      <div className="related-package-price">
                        <FaRupeeSign />18,999
                      </div>
                    </Link>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PackageDetail; 