import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location state or default to home
  const from = location.state?.from || '/';
  
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
    
    // Clear login error when form changes
    if (loginError) {
      setLoginError('');
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      setLoginError('');
      
      const success = await login(formData);
      
      if (success) {
        navigate(from);
      } else {
        setLoginError('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="login-card">
              <Card.Body>
                <div className="text-center mb-4">
                  <h2 className="login-title">Welcome Back</h2>
                  <p className="login-subtitle">
                    Log in to access your VirtualAudioGuide account
                  </p>
                </div>
                
                {loginError && (
                  <Alert variant="danger" className="mb-4">{loginError}</Alert>
                )}
                
                {location.state?.message && (
                  <Alert variant="info" className="mb-4">
                    {location.state.message}
                  </Alert>
                )}
                
                <Form onSubmit={handleSubmit}>
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
                      <FaEnvelope className="input-icon" />
                    </div>
                    {errors.username && (
                      <Form.Text className="text-danger">{errors.username}</Form.Text>
                    )}
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
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
                  
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="login-btn" 
                    disabled={submitting}
                  >
                    {submitting ? 'Logging in...' : 'Log In'}
                  </Button>
                </Form>
                
                <div className="text-center mt-4">
                  <p className="signup-link">
                    Don't have an account? <Link to="/register">Sign up <FaUserPlus /></Link>
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

export default Login; 