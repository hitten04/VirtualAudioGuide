import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaSignInAlt } from 'react-icons/fa';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirm: '',
    phone: '',
    address: ''
  });
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear validation error when field is edited
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.password_confirm) newErrors.password_confirm = 'Please confirm your password';
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password strength validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    
    // Password match validation
    if (formData.password && formData.password_confirm && 
        formData.password !== formData.password_confirm) {
      newErrors.password_confirm = 'Passwords do not match';
    }
    
    // Phone format validation (optional field)
    if (formData.phone) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid 10-digit phone number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      setServerError('');
      
      const success = await register(formData);
      
      if (success) {
        navigate('/');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setServerError('Registration failed. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="register-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="register-card">
              <Card.Body>
                <div className="text-center mb-4">
                  <h2 className="register-title">Create an Account</h2>
                  <p className="register-subtitle">
                    Join VirtualAudioGuide to book tours and access exclusive audio guides
                  </p>
                </div>
                
                {serverError && (
                  <Alert variant="danger" className="mb-4">{serverError}</Alert>
                )}
                
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <div className="input-icon-wrapper">
                          <Form.Control
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            isInvalid={!!errors.first_name}
                          />
                          <FaUser className="input-icon" />
                        </div>
                        {errors.first_name && (
                          <Form.Text className="text-danger">{errors.first_name}</Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <div className="input-icon-wrapper">
                          <Form.Control
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            isInvalid={!!errors.last_name}
                          />
                          <FaUser className="input-icon" />
                        </div>
                        {errors.last_name && (
                          <Form.Text className="text-danger">{errors.last_name}</Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <div className="input-icon-wrapper">
                      <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        isInvalid={!!errors.username}
                      />
                      <FaUser className="input-icon" />
                    </div>
                    {errors.username && (
                      <Form.Text className="text-danger">{errors.username}</Form.Text>
                    )}
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <div className="input-icon-wrapper">
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                      />
                      <FaEnvelope className="input-icon" />
                    </div>
                    {errors.email && (
                      <Form.Text className="text-danger">{errors.email}</Form.Text>
                    )}
                  </Form.Group>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <div className="input-icon-wrapper">
                          <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            isInvalid={!!errors.password}
                          />
                          <FaLock className="input-icon" />
                        </div>
                        {errors.password && (
                          <Form.Text className="text-danger">{errors.password}</Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <div className="input-icon-wrapper">
                          <Form.Control
                            type="password"
                            name="password_confirm"
                            value={formData.password_confirm}
                            onChange={handleChange}
                            isInvalid={!!errors.password_confirm}
                          />
                          <FaLock className="input-icon" />
                        </div>
                        {errors.password_confirm && (
                          <Form.Text className="text-danger">{errors.password_confirm}</Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number (Optional)</Form.Label>
                    <div className="input-icon-wrapper">
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        isInvalid={!!errors.phone}
                      />
                      <FaPhone className="input-icon" />
                    </div>
                    {errors.phone && (
                      <Form.Text className="text-danger">{errors.phone}</Form.Text>
                    )}
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Address (Optional)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="register-btn" 
                    disabled={submitting}
                  >
                    {submitting ? 'Signing Up...' : 'Sign Up'}
                  </Button>
                </Form>
                
                <div className="text-center mt-4">
                  <p className="login-link">
                    Already have an account? <Link to="/login">Log in <FaSignInAlt /></Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register; 