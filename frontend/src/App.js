import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { AuthProvider } from './contexts/AuthContext';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Places from './pages/Places';
import Packages from './pages/Packages';
import Register from './pages/Register';
import Login from './pages/Login';
import PlaceDetail from './pages/PlaceDetail';
import PackageDetail from './pages/PackageDetail';
import UserProfile from './pages/UserProfile';
import BookingForm from './pages/BookingForm';
import Search from './pages/Search';
import NotFound from './pages/NotFound';
import About from './pages/About';
import Contact from './pages/Contact';

// Icons
import { 
  FaHeadphones, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube,
  FaChevronRight
} from 'react-icons/fa';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/places" element={<Places />} />
              <Route path="/places/:id" element={<PlaceDetail />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/packages/:id" element={<PackageDetail />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/profile" 
                element={<ProtectedRoute element={<UserProfile />} />} 
              />
              <Route 
                path="/book/:packageId" 
                element={<ProtectedRoute element={<BookingForm />} />} 
              />
              <Route path="/search" element={<Search />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          
          <footer className="app-footer">
            <div className="footer-wave"></div>
            <Container>
              <div className="footer-content">
                <div className="footer-column" style={{ flex: "0 0 350px" }}>
                  <div className="footer-logo">
                    <FaHeadphones className="footer-logo-icon" /> VirtualAudioGuide
                  </div>
                  <p className="company-description">
                    Experience Gujarat's rich heritage and culture through immersive audio guides 
                    that bring historical sites to life. Explore at your own pace with our curated tours.
                  </p>
                  <div className="social-links">
                    <a href="#" className="social-icon"><FaFacebookF /></a>
                    <a href="#" className="social-icon"><FaTwitter /></a>
                    <a href="#" className="social-icon"><FaInstagram /></a>
                    <a href="#" className="social-icon"><FaYoutube /></a>
                  </div>
                </div>
                
                <div className="footer-column">
                  <h4 className="footer-heading">Newsletter</h4>
                  <p className="mb-3">Subscribe to our newsletter for the latest updates on new tour packages and special offers.</p>
                  <div className="newsletter-box">
                    <p className="mb-2">Get e-mail updates about our latest tours and special offers.</p>
                    <Form className="newsletter-form">
                      <Form.Control 
                        type="email" 
                        placeholder="Your email address" 
                        className="newsletter-input"
                      />
                      <Button type="submit" className="newsletter-btn">
                        Subscribe
                      </Button>
                    </Form>
                  </div>
                </div>
              </div>
              
              <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} VirtualAudioGuide | All Rights Reserved</p>
              </div>
            </Container>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
