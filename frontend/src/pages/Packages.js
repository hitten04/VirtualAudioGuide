import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Form, Badge, Alert, Button } from 'react-bootstrap';
import { FaFilter, FaSearch, FaMoneyBillWave, FaClock, FaSortAmountDown, FaSync } from 'react-icons/fa';
import PackageCard from '../components/PackageCard';
import apiService from '../services/api';
import './Packages.css';

// Fallback data to show if API fails
const dummyPackages = [
  {
    id: 1,
    name: "Gujarat Heritage Tour",
    description: "Explore the rich cultural heritage of Gujarat with this 3-day tour of the most iconic historical sites. Visit ancient temples, palaces, and monuments while experiencing the unique traditions and cuisine of the region.",
    price: 7999,
    duration: "3 days, 2 nights",
    discount: 10,
    places: [
      { id: 1, name: "Somnath Temple" },
      { id: 2, name: "Nilambag Palace" },
      { id: 3, name: "Vintage Car Museum" }
    ]
  },
  {
    id: 2,
    name: "Spiritual Gujarat Tour",
    description: "Experience the spiritual side of Gujarat with visits to sacred temples and ashrams. This 5-day tour takes you on a journey of self-discovery while exploring the religious heritage of the state. Perfect for those seeking peace and enlightenment.",
    price: 12999,
    duration: "5 days, 4 nights",
    discount: 15,
    places: [
      { id: 4, name: "Adalaj Vav" },
      { id: 5, name: "Ambardi Safari Park" },
      { id: 6, name: "Hathising Jain Temple" }
    ]
  },
  {
    id: 3,
    name: "Gujarat Adventure Tour",
    description: "Embark on an exciting adventure across Gujarat, exploring its diverse landscapes from the Rann of Kutch to the beaches of Diu. This comprehensive 7-day tour offers a perfect mix of adventure, culture, and relaxation.",
    price: 19999,
    duration: "7 days, 6 nights",
    discount: 5,
    places: [
      { id: 5, name: "Ambardi Safari Park" },
      { id: 3, name: "Vintage Car Museum" },
      { id: 6, name: "Hathising Jain Temple" }
    ]
  }
];

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    duration: '',
  });
  const [sortBy, setSortBy] = useState('featured');
  const [isUsingDummyData, setIsUsingDummyData] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getPackages();
      const packagesData = response.results || response;
      
      if (packagesData && packagesData.length > 0) {
        setPackages(packagesData);
        setFilteredPackages(packagesData);
        setIsUsingDummyData(false);
      } else {
        // If API returns empty, use dummy data
        console.log("No packages returned from API. Using fallback data.");
        setPackages(dummyPackages);
        setFilteredPackages(dummyPackages);
        setIsUsingDummyData(true);
      }
    } catch (err) {
      console.error('Error fetching packages:', err);
      setError('Failed to load packages from server. Showing sample packages instead.');
      setPackages(dummyPackages);
      setFilteredPackages(dummyPackages);
      setIsUsingDummyData(true);
    } finally {
      setLoading(false);
    }
  };

  const retryFetchPackages = () => {
    fetchPackages();
  };

  useEffect(() => {
    applyFilters();
  }, [filters, packages, sortBy]);

  const applyFilters = () => {
    let filtered = [...packages];

    if (filters.minPrice) {
      filtered = filtered.filter(
        pkg => parseFloat(pkg.price) >= parseFloat(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(
        pkg => parseFloat(pkg.price) <= parseFloat(filters.maxPrice)
      );
    }

    if (filters.duration) {
      filtered = filtered.filter(pkg => {
        // Assuming duration format like "3 days, 2 nights" or "5 days"
        const daysMatch = pkg.duration.match(/(\d+)\s*days?/i);
        if (daysMatch && daysMatch[1]) {
          const days = parseInt(daysMatch[1]);
          return filters.duration === 'short' ? days <= 3 
            : filters.duration === 'medium' ? (days > 3 && days <= 7)
            : days > 7;
        }
        return true;
      });
    }

    // Sort the filtered packages
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'duration-short':
        filtered.sort((a, b) => {
          const getDays = (duration) => {
            const match = duration.match(/(\d+)\s*days?/i);
            return match && match[1] ? parseInt(match[1]) : 0;
          };
          return getDays(a.duration) - getDays(b.duration);
        });
        break;
      case 'duration-long':
        filtered.sort((a, b) => {
          const getDays = (duration) => {
            const match = duration.match(/(\d+)\s*days?/i);
            return match && match[1] ? parseInt(match[1]) : 0;
          };
          return getDays(b.duration) - getDays(a.duration);
        });
        break;
      default:
        // featured - keep original order
        break;
    }

    setFilteredPackages(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      duration: '',
    });
    setSortBy('featured');
  };

  return (
    <div className="packages-page">
      <div className="packages-header">
        <Container>
          <h1 className="packages-title">Tour Packages</h1>
          <p className="packages-subtitle">
            Choose from our carefully crafted tour packages to experience the best of Gujarat
          </p>
        </Container>
      </div>

      <Container className="packages-container">
        {isUsingDummyData && (
          <Alert variant="info" className="mb-4">
            <Alert.Heading>Using Demo Data</Alert.Heading>
            <p>Currently displaying sample package data. {error && 'There was an issue connecting to the server.'}</p>
            <div className="d-flex justify-content-end">
              <Button onClick={retryFetchPackages} variant="outline-info" size="sm">
                <FaSync className="me-2" /> Retry Connection
              </Button>
            </div>
          </Alert>
        )}
        
        <Row>
          <Col lg={3} className="filters-sidebar">
            <div className="filters-card">
              <h3 className="filters-title">
                <FaFilter className="me-2" /> Filter Packages
              </h3>
              
              <Form className="filters-form">
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaMoneyBillWave className="me-2" /> Min Price (₹)
                  </Form.Label>
                  <Form.Control 
                    type="number" 
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="Min price"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaMoneyBillWave className="me-2" /> Max Price (₹)
                  </Form.Label>
                  <Form.Control 
                    type="number" 
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="Max price"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaClock className="me-2" /> Duration
                  </Form.Label>
                  <Form.Select
                    name="duration"
                    value={filters.duration}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Durations</option>
                    <option value="short">Short Trip (1-3 days)</option>
                    <option value="medium">Medium Trip (4-7 days)</option>
                    <option value="long">Long Trip (8+ days)</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    <FaSortAmountDown className="me-2" /> Sort By
                  </Form.Label>
                  <Form.Select
                    value={sortBy}
                    onChange={handleSortChange}
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="duration-short">Duration: Shortest First</option>
                    <option value="duration-long">Duration: Longest First</option>
                  </Form.Select>
                </Form.Group>

                <div className="d-grid mt-4">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary" 
                    onClick={clearFilters}
                  >
                    Clear All Filters
                  </button>
                </div>
              </Form>
            </div>
          </Col>
          
          <Col lg={9}>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Loading packages...</p>
              </div>
            ) : filteredPackages.length === 0 ? (
              <div className="text-center py-5">
                <p>No packages found matching your filter criteria.</p>
                <button 
                  className="btn btn-primary mt-3" 
                  onClick={clearFilters}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="results-count">
                    <h5 className="mb-0">
                      Showing <Badge bg="primary">{filteredPackages.length}</Badge> packages
                    </h5>
                  </div>
                </div>
                <Row className="packages-row">
                  {filteredPackages.map((pkg, index) => (
                    <Col md={6} key={pkg.id || index} className="mb-4 package-card-wrapper">
                      <PackageCard package={pkg} />
                    </Col>
                  ))}
                </Row>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Packages; 