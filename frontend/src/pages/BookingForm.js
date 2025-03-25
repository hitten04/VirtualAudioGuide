import React, { useState, useEffect } from 'react';
import { Container, Form, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaRupeeSign, FaUser, FaCalendarAlt, FaPhone, FaEnvelope, FaCreditCard, FaMobile } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import './BookingForm.css';

const BookingForm = () => {
  const { packageId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState({
    full_name: '',
    email: '',
    phone: '',
    date: '',
    num_persons: 1,
    special_requests: '',
    payment_method: 'upi' // Default to UPI
  });
  const [showPayment, setShowPayment] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // UPI ID - you can change this to your actual UPI ID
  const UPI_ID = 'hp040912@oksbi';
  
  // Fetch package details when component mounts
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setLoading(true);
        const data = await apiService.getPackageById(packageId);
        setPackageData(data);
        
        // Pre-fill form if user is logged in
        if (currentUser) {
          setBookingData(prev => ({
            ...prev,
            full_name: `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || '',
            email: currentUser.email || '',
            phone: currentUser.phone || ''
          }));
        }
      } catch (err) {
        console.error('Failed to fetch package:', err);
        setError('Failed to load package details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPackage();
  }, [packageId, currentUser]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPayment(true);
  };
  
  const calculateTotal = () => {
    if (!packageData) return 0;
    
    let price = packageData.price;
    if (packageData.discount > 0) {
      price = price - (price * packageData.discount / 100);
    }
    
    return (price * bookingData.num_persons).toFixed(2);
  };
  
  const handleUpiPayment = async () => {
    try {
      setProcessingPayment(true);
      
      // In a real app, you would call your backend to create an order/booking
      // For demo purposes, we'll simulate a successful payment after a delay
      setTimeout(async () => {
        try {
          // Create booking in the backend
          const bookingPayload = {
            package: packageId,
            package_name: packageData.name,
            booking_date: bookingData.date,
            num_persons: bookingData.num_persons,
            special_requests: bookingData.special_requests,
            amount: calculateTotal(),
            status: 'Confirmed',
            payment_method: 'UPI',
            payment_status: 'Paid'
          };
          
          const booking = await apiService.createBooking(bookingPayload);
          console.log('Booking created:', booking);
          
          setPaymentSuccess(true);
          setProcessingPayment(false);
          
          // Redirect to profile after successful payment
          setTimeout(() => {
            navigate('/profile');
          }, 3000);
        } catch (err) {
          console.error('Error creating booking:', err);
          setError('Payment was successful but there was an error saving your booking. Please contact support.');
          setProcessingPayment(false);
        }
      }, 2000);
    } catch (err) {
      console.error('Payment failed:', err);
      setError('Payment processing failed. Please try again.');
      setProcessingPayment(false);
    }
  };
  
  const initializeRazorpay = async () => {
    setProcessingPayment(true);
    
    // In a real app, you would call your backend to create an order
    // and get an order ID, which you would pass to Razorpay
    
    // For demo purposes, we'll use a fake order ID
    const options = {
      key: 'rzp_test_YOUR_KEY_ID', // Replace with your Razorpay key
      amount: calculateTotal() * 100, // Amount in paisa
      currency: 'INR',
      name: 'Virtual Audio Guide',
      description: `Booking for ${packageData.name}`,
      image: 'https://your-company-logo.png', // Replace with your logo
      order_id: 'order_' + new Date().getTime(), // Replace with actual order ID from backend
      handler: function (response) {
        // Handle success
        console.log('Payment successful', response);
        
        // Create booking in the backend
        const bookingPayload = {
          package: packageId,
          package_name: packageData.name,
          booking_date: bookingData.date,
          num_persons: bookingData.num_persons,
          special_requests: bookingData.special_requests,
          amount: calculateTotal(),
          status: 'Confirmed',
          payment_method: 'Razorpay',
          payment_status: 'Paid',
          payment_id: response.razorpay_payment_id
        };
        
        apiService.createBooking(bookingPayload)
          .then(booking => {
            console.log('Booking created:', booking);
            setPaymentSuccess(true);
            setProcessingPayment(false);
            
            // Redirect to profile after successful payment
            setTimeout(() => {
              navigate('/profile');
            }, 3000);
          })
          .catch(err => {
            console.error('Error creating booking:', err);
            setError('Payment was successful but there was an error saving your booking. Please contact support.');
            setProcessingPayment(false);
          });
      },
      prefill: {
        name: bookingData.full_name,
        email: bookingData.email,
        contact: bookingData.phone
      },
      theme: {
        color: '#3d8d7a'
      }
    };
    
    try {
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setProcessingPayment(false);
    } catch (err) {
      console.error('Razorpay initialization failed:', err);
      setError('Payment gateway initialization failed. Please try again.');
      setProcessingPayment(false);
    }
  };
  
  const handlePaymentStart = () => {
    if (bookingData.payment_method === 'razorpay') {
      // Check if Razorpay is loaded
      if (window.Razorpay) {
        initializeRazorpay();
      } else {
        setError('Payment gateway is not available. Please try the UPI option.');
      }
    } else if (bookingData.payment_method === 'upi') {
      handleUpiPayment();
    }
  };
  
  const handleBackToForm = () => {
    setShowPayment(false);
  };
  
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading package details...</p>
      </Container>
    );
  }
  
  if (error && !packageData) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error}
          <div className="mt-3">
            <Button variant="primary" onClick={() => navigate('/packages')}>
              Browse Other Packages
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }
  
  if (!packageData) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          Package not found. Please select another package.
          <div className="mt-3">
            <Button variant="primary" onClick={() => navigate('/packages')}>
              Browse Packages
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (paymentSuccess) {
    return (
      <Container className="py-5">
        <Card className="booking-success-card">
          <Card.Body className="text-center">
            <div className="success-icon">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="#4CAF50" fillOpacity="0.2" />
                <path d="M40 55L45 60L60 45" stroke="#4CAF50" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="50" cy="50" r="40" stroke="#4CAF50" strokeWidth="3" />
              </svg>
            </div>
            <h1 className="mt-4">Booking Successful!</h1>
            <p className="success-message">
              Thank you for booking the {packageData.name} package. Your tour has been confirmed.
            </p>
            <p>You can view your booking details in your profile.</p>
            <div className="mt-4">
              <Button variant="primary" onClick={() => navigate('/profile')}>
                Go to My Bookings
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }
  
  return (
    <Container className="booking-container py-5">
      <h1 className="booking-title">Book Your Tour</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row>
        <Col lg={7} className="mb-4">
          {!showPayment ? (
            <Card className="booking-form-card">
              <Card.Header>
                <h4 className="mb-0">Booking Information</h4>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group controlId="full_name">
                        <Form.Label><FaUser className="me-2" /> Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="full_name"
                          value={bookingData.full_name}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="email">
                        <Form.Label><FaEnvelope className="me-2" /> Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={bookingData.email}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group controlId="phone">
                        <Form.Label><FaPhone className="me-2" /> Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={bookingData.phone}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="date">
                        <Form.Label><FaCalendarAlt className="me-2" /> Tour Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="date"
                          value={bookingData.date}
                          onChange={handleChange}
                          required
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3" controlId="num_persons">
                    <Form.Label>Number of Travelers</Form.Label>
                    <Form.Control
                      type="number"
                      name="num_persons"
                      value={bookingData.num_persons}
                      onChange={handleChange}
                      min="1"
                      max="10"
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4" controlId="special_requests">
                    <Form.Label>Special Requests (Optional)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="special_requests"
                      value={bookingData.special_requests}
                      onChange={handleChange}
                      placeholder="Any special requirements or requests for your tour?"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4" controlId="payment_method">
                    <Form.Label>Select Payment Method</Form.Label>
                    <div className="payment-method-selection">
                      <div 
                        className={`payment-option ${bookingData.payment_method === 'upi' ? 'selected' : ''}`}
                        onClick={() => setBookingData({...bookingData, payment_method: 'upi'})}
                      >
                        <FaMobile size={24} />
                        <div className="payment-option-text">
                          <span className="payment-name">UPI Payment</span>
                          <span className="payment-desc">Pay using Google Pay, PhonePe, etc.</span>
                        </div>
                      </div>
                      
                      <div 
                        className={`payment-option ${bookingData.payment_method === 'razorpay' ? 'selected' : ''}`}
                        onClick={() => setBookingData({...bookingData, payment_method: 'razorpay'})}
                      >
                        <FaCreditCard size={24} />
                        <div className="payment-option-text">
                          <span className="payment-name">Card / Net Banking</span>
                          <span className="payment-desc">Pay using Credit/Debit Card or Net Banking</span>
                        </div>
                      </div>
                    </div>
                  </Form.Group>
                  
                  <div className="text-end">
                    <Button type="submit" variant="primary" size="lg">
                      Continue to Payment
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          ) : (
            <Card className="payment-card">
              <Card.Header>
                <h4 className="mb-0">Payment Details</h4>
              </Card.Header>
              <Card.Body>
                {processingPayment ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Processing your payment...</p>
                  </div>
                ) : (
                  <>
                    <div className="payment-method-info">
                      {bookingData.payment_method === 'upi' ? (
                        <div className="upi-payment">
                          <div className="upi-icon mb-3">
                            <FaMobile size={40} color="#3d8d7a" />
                          </div>
                          <h5>Pay using UPI</h5>
                          <p>Make your payment directly to our UPI ID:</p>
                          <div className="upi-id">
                            <span>{UPI_ID}</span>
                            <Button 
                              variant="outline-secondary" 
                              size="sm"
                              onClick={() => {
                                navigator.clipboard.writeText(UPI_ID);
                                alert('UPI ID copied to clipboard!');
                              }}
                            >
                              Copy
                            </Button>
                          </div>
                          <p className="mt-3">
                            After completing the payment, click on the "Confirm Payment" button below.
                          </p>
                        </div>
                      ) : (
                        <div className="razorpay-payment">
                          <div className="razorpay-icon mb-3">
                            <FaCreditCard size={40} color="#3d8d7a" />
                          </div>
                          <h5>Pay using Card / Net Banking</h5>
                          <p>You will be redirected to Razorpay's secure payment gateway.</p>
                          <p>You can pay using:</p>
                          <ul>
                            <li>Credit / Debit Card</li>
                            <li>Net Banking</li>
                            <li>Wallets</li>
                            <li>UPI</li>
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 d-flex justify-content-between">
                      <Button variant="outline-secondary" onClick={handleBackToForm}>
                        Back to Form
                      </Button>
                      <Button variant="success" onClick={handlePaymentStart}>
                        {bookingData.payment_method === 'upi' ? 'Confirm Payment' : 'Proceed to Pay'}
                      </Button>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
        
        <Col lg={5}>
          <Card className="booking-summary-card">
            <Card.Header>
              <h4 className="mb-0">Booking Summary</h4>
            </Card.Header>
            <Card.Body>
              <div className="package-image-container mb-3">
                <img 
                  src={packageData.image_url || 'https://via.placeholder.com/600x400?text=Tour+Package'} 
                  alt={packageData.name} 
                  className="package-image"
                />
              </div>
              
              <h5 className="package-name">{packageData.name}</h5>
              
              <div className="booking-detail">
                <span className="detail-label">Tour Duration:</span>
                <span className="detail-value">{packageData.duration}</span>
              </div>
              
              <div className="booking-detail">
                <span className="detail-label">Tour Date:</span>
                <span className="detail-value">
                  {bookingData.date ? new Date(bookingData.date).toLocaleDateString() : 'Not selected'}
                </span>
              </div>
              
              <div className="booking-detail">
                <span className="detail-label">Number of Travelers:</span>
                <span className="detail-value">{bookingData.num_persons}</span>
              </div>
              
              <hr />
              
              <div className="price-breakdown">
                <div className="price-row">
                  <span>Package Price:</span>
                  <span>
                    <FaRupeeSign /> {packageData.price} x {bookingData.num_persons}
                  </span>
                </div>
                
                {packageData.discount > 0 && (
                  <div className="price-row discount">
                    <span>Discount ({packageData.discount}%):</span>
                    <span>- <FaRupeeSign /> {(packageData.price * packageData.discount / 100 * bookingData.num_persons).toFixed(2)}</span>
                  </div>
                )}
                
                <div className="price-row total">
                  <span>Total Amount:</span>
                  <span><FaRupeeSign /> {calculateTotal()}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
          
          <Card className="mt-4">
            <Card.Body>
              <h5>Need Help?</h5>
              <p>If you have any questions about your booking, please contact our support team:</p>
              <p><FaPhone className="me-2" /> +91 9999988888</p>
              <p><FaEnvelope className="me-2" /> support@virtualaudioguide.com</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingForm; 