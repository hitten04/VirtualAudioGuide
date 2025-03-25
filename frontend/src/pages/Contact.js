import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaCheck } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  // Add form ref
  const formRef = useRef(null);
  
  // Form state
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  // Validation state
  const [errors, setErrors] = useState({});
  
  // Form submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  
  // Animation state for elements
  const [isVisible, setIsVisible] = useState({
    info: false,
    form: false,
    map: false
  });
  
  // Handle scroll animations
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      
      // Get elements
      const infoEl = document.querySelector('.contact-info');
      const formEl = document.querySelector('.contact-form-container');
      const mapEl = document.querySelector('.map-container');
      
      // Check if elements are in viewport
      if (infoEl && scrollPosition > infoEl.offsetTop + 100) {
        setIsVisible(prev => ({ ...prev, info: true }));
      }
      
      if (formEl && scrollPosition > formEl.offsetTop + 100) {
        setIsVisible(prev => ({ ...prev, form: true }));
      }
      
      if (mapEl && scrollPosition > mapEl.offsetTop + 100) {
        setIsVisible(prev => ({ ...prev, map: true }));
      }
    };
    
    // Initial check
    handleScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formState.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formState.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formState.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formState.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formState.message.trim().length < 20) {
      newErrors.message = 'Message must be at least 20 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Submit form using FormSubmit (no account needed)
  const submitForm = () => {
    const formElement = formRef.current;
    if (formElement) {
      // Set the action to use FormSubmit with your email directly
      formElement.action = `https://formsubmit.co/hp040912@gmail.com`;
      formElement.method = 'POST';
      
      // Submit the form directly
      formElement.submit();
      
      // Show success message and reset form after simulated submission
      // Note: In a real scenario, this would happen after the redirect back
      // For now, we'll simulate success
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        submitForm();
      } catch (error) {
        console.error('Form submission failed:', error);
        setIsSubmitting(false);
        setSubmitError(true);
        
        // Hide error message after 5 seconds
        setTimeout(() => {
          setSubmitError(false);
        }, 5000);
      }
    }
  };
  
  // Contact info data
  const contactInfo = [
    {
      icon: <FaMapMarkerAlt />,
      title: 'Our Location',
      content: '123 Heritage Road, Ahmedabad, Gujarat 380009, India'
    },
    {
      icon: <FaPhone />,
      title: 'Phone Number',
      content: '+91 9558883186'
    },
    {
      icon: <FaEnvelope />,
      title: 'Email Address',
      content: 'hp040912@gmail.com'
    },
    {
      icon: <FaClock />,
      title: 'Working Hours',
      content: 'Monday - Friday: 9am to 6pm'
    }
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <div className="contact-hero">
        <Container>
          <h1>Get In Touch</h1>
          <p>We'd love to hear from you! Send us a message and we'll respond as soon as possible.</p>
        </Container>
      </div>
      
      {/* Contact Info & Form Section */}
      <section className="contact-section">
        <Container>
          <Row>
            <Col lg={4} md={12}>
              <div className={`contact-info ${isVisible.info ? 'visible' : ''}`}>
                <h2>Contact Information</h2>
                <p className="contact-subtitle">
                  Have questions or feedback? Reach out to us using any of the methods below.
                </p>
                
                <div className="info-cards">
                  {contactInfo.map((info, index) => (
                    <div 
                      className="info-card" 
                      key={index}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="info-icon">
                        {info.icon}
                      </div>
                      <div className="info-content">
                        <h4>{info.title}</h4>
                        <p>{info.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="social-links">
                  <h4>Connect With Us</h4>
                  <div className="social-icons">
                    <a href="#" className="social-icon facebook" aria-label="Facebook">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" className="social-icon twitter" aria-label="Twitter">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="social-icon instagram" aria-label="Instagram">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="#" className="social-icon linkedin" aria-label="LinkedIn">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
              </div>
            </Col>
            
            <Col lg={8} md={12}>
              <div className={`contact-form-container ${isVisible.form ? 'visible' : ''}`}>
                <div className="contact-form-card">
                  <h2>Send us a Message</h2>
                  
                  {submitSuccess && (
                    <Alert variant="success" className="success-message">
                      <FaCheck className="success-icon" />
                      <div>
                        <h5>Thank you for your message!</h5>
                        <p>We have received your inquiry and will get back to you shortly.</p>
                      </div>
                    </Alert>
                  )}
                  
                  {submitError && (
                    <Alert variant="danger">
                      There was an error sending your message. Please try again later.
                    </Alert>
                  )}
                  
                  <Form ref={formRef} onSubmit={handleSubmit} className="contact-form">
                    {/* Add hidden fields for FormSubmit */}
                    <input type="hidden" name="_captcha" value="false" />
                    <input type="hidden" name="_subject" value={`New contact form message: ${formState.subject}`} />
                    <input type="hidden" name="_next" value={window.location.href} />
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-4" controlId="formName">
                          <Form.Label>Your Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={formState.name}
                            onChange={handleInputChange}
                            isInvalid={!!errors.name}
                            disabled={isSubmitting}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.name}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group className="mb-4" controlId="formEmail">
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formState.email}
                            onChange={handleInputChange}
                            isInvalid={!!errors.email}
                            disabled={isSubmitting}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.email}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Form.Group className="mb-4" controlId="formSubject">
                      <Form.Label>Subject</Form.Label>
                      <Form.Control
                        type="text"
                        name="subject"
                        placeholder="What is this regarding?"
                        value={formState.subject}
                        onChange={handleInputChange}
                        isInvalid={!!errors.subject}
                        disabled={isSubmitting}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.subject}
                      </Form.Control.Feedback>
                    </Form.Group>
                    
                    <Form.Group className="mb-4" controlId="formMessage">
                      <Form.Label>Message</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="message"
                        rows={5}
                        placeholder="Write your message here..."
                        value={formState.message}
                        onChange={handleInputChange}
                        isInvalid={!!errors.message}
                        disabled={isSubmitting}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                    
                    <Button 
                      type="submit" 
                      className="submit-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </Form>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Map Section */}
      <section className={`map-section ${isVisible.map ? 'visible' : ''}`}>
        <Container>
          <div className="section-header">
            <h2>Find Us</h2>
            <p>Visit our office in Ahmedabad, Gujarat</p>
          </div>
          
          <div className="map-container">
            {/* Replace with your Google Maps iframe */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117501.35118932296!2d72.50423082871188!3d23.02012193851042!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1624452431932!5m2!1sen!2sin" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
              title="Office location map"
            ></iframe>
            
            <div className="map-card">
              <h4>VirtualAudioGuide</h4>
              <p>
                <FaMapMarkerAlt className="icon" />
                123 Heritage Road, Ahmedabad,<br/> Gujarat 380009, India
              </p>
              <p>
                <FaPhone className="icon" />
                +91 79 1234 5678
              </p>
              <a href="mailto:info@virtualaudioguide.com" className="map-email">
                <FaEnvelope className="icon" />
                info@virtualaudioguide.com
              </a>
            </div>
          </div>
        </Container>
      </section>
      
      {/* FAQ Section */}
      <section className="faq-section">
        <Container>
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Find quick answers to common queries</p>
          </div>
          
          <Row>
            <Col md={6}>
              <div className="faq-item">
                <h4>How do I access the audio guides?</h4>
                <p>
                  Our audio guides are available through our mobile app and website. 
                  After purchase, you can access them directly from your account.
                </p>
              </div>
              
              <div className="faq-item">
                <h4>Are there guides available in multiple languages?</h4>
                <p>
                  Yes! We currently offer guides in 10+ languages including English, 
                  Hindi, Gujarati, and major international languages.
                </p>
              </div>
            </Col>
            
            <Col md={6}>
              <div className="faq-item">
                <h4>Do I need internet access to use the guides?</h4>
                <p>
                  You can download guides for offline use. Once downloaded, you don't 
                  need an internet connection to listen to them.
                </p>
              </div>
              
              <div className="faq-item">
                <h4>How can I become a content contributor?</h4>
                <p>
                  We're always looking for experts to create authentic audio content. 
                  Please contact us with your background and areas of expertise.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Contact; 