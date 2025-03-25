import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Table } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaSave, FaTimes, FaEye, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import './UserProfile.css';

const UserProfile = () => {
  const { currentUser, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    address: ''
  });
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [profile, setProfile] = useState(null);

  // Debug current user data
  useEffect(() => {
    console.log('Current User Data:', currentUser);
  }, [currentUser]);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await apiService.getUserProfile();
        console.log('Fetched profile data:', profileData);
        setProfile(profileData);
        
        // Update form data with the fetched profile information
        if (profileData && profileData.user) {
          setFormData({
            username: profileData.user.username || '',
            email: profileData.user.email || '',
            first_name: profileData.user.first_name || '',
            last_name: profileData.user.last_name || '',
            phone: profileData.phone || '',
            address: profileData.address || ''
          });
        }
        
        fetchBookings();
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const response = await apiService.getBookings();
      setBookings(response.results || []);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare data for update based on the expected API structure
      const updateData = {
        user: {
          username: formData.username,
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name
        },
        phone: formData.phone,
        address: formData.address
      };

      const updatedProfile = await apiService.updateUserProfile(updateData);
      console.log('Profile update response:', updatedProfile);
      
      // Refresh the profile data
      const profileData = await apiService.getUserProfile();
      setProfile(profileData);
      
      // Update form data with the refreshed profile
      if (profileData && profileData.user) {
        setFormData({
          username: profileData.user.username || '',
          email: profileData.user.email || '',
          first_name: profileData.user.first_name || '',
          last_name: profileData.user.last_name || '',
          phone: profileData.phone || '',
          address: profileData.address || ''
        });
      }
      
      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err.response?.data?.detail || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to current profile data
    if (profile && profile.user) {
      setFormData({
        username: profile.user.username || '',
        email: profile.user.email || '',
        first_name: profile.user.first_name || '',
        last_name: profile.user.last_name || '',
        phone: profile.phone || '',
        address: profile.address || ''
      });
    }
    setEditing(false);
    setError(null);
  };

  if (loading && !profile) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" /> 
        <p>Loading user information...</p>
      </Container>
    );
  }

  return (
    <Container className="profile-container py-5">
      <h1 className="profile-title mb-4">My Profile</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Row>
        <Col lg={5} md={6} className="mb-4">
          <Card className="profile-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Personal Information</h5>
              {!editing ? (
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={() => setEditing(true)}
                  className="edit-btn"
                >
                  <FaEdit /> Edit
                </Button>
              ) : null}
            </Card.Header>
            <Card.Body>
              {editing ? (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  
                  <div className="d-flex justify-content-end gap-2">
                    <Button 
                      variant="outline-secondary" 
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      <FaTimes /> Cancel
                    </Button>
                    <Button 
                      variant="primary" 
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" className="me-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave /> Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              ) : (
                <div className="user-info">
                  <div className="info-item">
                    <FaUser className="info-icon" />
                    <div>
                      <div className="info-label">Username</div>
                      <div className="info-value">
                        {profile && profile.user ? profile.user.username : 'Loading...'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <FaEnvelope className="info-icon" />
                    <div>
                      <div className="info-label">Email</div>
                      <div className="info-value">
                        {profile && profile.user ? profile.user.email : 'Loading...'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <FaUser className="info-icon" />
                    <div>
                      <div className="info-label">Name</div>
                      <div className="info-value">
                        {profile && profile.user && (profile.user.first_name || profile.user.last_name) 
                          ? `${profile.user.first_name || ''} ${profile.user.last_name || ''}`
                          : 'Not provided'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <FaPhone className="info-icon" />
                    <div>
                      <div className="info-label">Phone Number</div>
                      <div className="info-value">
                        {profile && profile.phone ? profile.phone : 'Not provided'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="info-item">
                    <FaMapMarkerAlt className="info-icon" />
                    <div>
                      <div className="info-label">Address</div>
                      <div className="info-value">
                        {profile && profile.address ? profile.address : 'Not provided'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={7} md={6}>
          <Card className="booking-card">
            <Card.Header>
              <h5 className="mb-0">My Bookings</h5>
            </Card.Header>
            <Card.Body>
              {loadingBookings ? (
                <div className="text-center py-4">
                  <Spinner animation="border" />
                  <p className="mt-2">Loading your bookings...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-4">
                  <FaCalendarAlt size={40} className="text-muted mb-3" />
                  <p>You haven't made any bookings yet.</p>
                  <Button variant="primary" href="/packages">Browse Packages</Button>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>Package</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(booking => (
                        <tr key={booking.id}>
                          <td>{booking.package_name}</td>
                          <td>{new Date(booking.booking_date).toLocaleDateString()}</td>
                          <td>
                            <span className={`status-badge status-${booking.status.toLowerCase()}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td>
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              href={`/packages/${booking.package}`}
                            >
                              <FaEye /> View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile; 