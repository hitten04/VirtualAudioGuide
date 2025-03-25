import React, { useEffect, useState, useRef } from 'react';
import { Container, Button, ButtonGroup, Card, Tab, Nav, Alert, Spinner } from 'react-bootstrap';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaVolumeUp, FaDownload, FaLock } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const PlaceDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [audioError, setAudioError] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const audioRef = useRef(null);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'details');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        console.log(`Fetching place with ID: ${id}`);
        const response = await axios.get(`http://localhost:8000/api/places/${id}/`);
        console.log('Place data received:', response.data);
        setPlace(response.data);
        
        // If the place has audio guides, select the first one by default
        if (response.data.audio_guides && response.data.audio_guides.length > 0) {
          setSelectedLanguage(response.data.audio_guides[0].language);
        }
      } catch (err) {
        console.error('Error fetching place details:', err);
        if (err.response) {
          console.error('Response data:', err.response.data);
          console.error('Response status:', err.response.status);
          setError(`Failed to load place details: ${err.response.status} ${err.response.statusText}`);
        } else if (err.request) {
          console.error('No response received:', err.request);
          setError('Failed to load place details: No response from server');
        } else {
          console.error('Request error:', err.message);
          setError(`Failed to load place details: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPlace();
    } else {
      setError('No place ID provided');
      setLoading(false);
    }
  }, [id]);

  // Effect to fetch audio file when language changes
  useEffect(() => {
    let isActive = true;
    
    const fetchAudio = async () => {
      if (!place || !selectedLanguage) return;
      
      const audioGuide = place.audio_guides.find(guide => guide.language === selectedLanguage);
      if (!audioGuide) return;
      
      setAudioLoading(true);
      setAudioError(null);
      setAudioBlob(null);
      
      try {
        // Fix the URL - make sure we're not duplicating the domain
        const audioUrl = audioGuide.audio_file.startsWith('http') 
          ? audioGuide.audio_file 
          : `http://localhost:8000${audioGuide.audio_file}`;
        
        console.log('Audio guide data:', audioGuide);
        console.log('Fetching audio from URL:', audioUrl);
        
        // Fetch the audio file as a blob
        const response = await fetch(audioUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to load audio: ${response.status} ${response.statusText}`);
        }
        
        console.log('Audio fetch response:', response);
        
        const blob = await response.blob();
        console.log('Audio blob created:', blob.type, blob.size);
        
        if (isActive) {
          // Create a blob URL that can be used in the audio element
          const blobUrl = URL.createObjectURL(blob);
          console.log('Created blob URL:', blobUrl);
          setAudioBlob(blobUrl);
        }
      } catch (err) {
        console.error('Error fetching audio file:', err);
        if (isActive) {
          setAudioError(`Could not load audio file: ${err.message}`);
        }
      } finally {
        if (isActive) {
          setAudioLoading(false);
        }
      }
    };
    
    fetchAudio();
    
    // Cleanup function to revoke blob URL and cancel any pending operations
    return () => {
      isActive = false;
      if (audioBlob) {
        URL.revokeObjectURL(audioBlob);
      }
    };
  }, [place, selectedLanguage]);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setAudioError(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    // The useEffect will handle fetching the new audio file
  };

  const handleAudioError = (e) => {
    console.error('Audio playback error:', e);
    setAudioError(`Audio playback error: ${e.target.error ? e.target.error.message : 'Unknown error'}`);
  };

  // Function to handle login redirect
  const handleLoginRedirect = () => {
    navigate('/login', { 
      state: { 
        from: `/places/${id}?tab=audio`,
        message: 'Please log in to access audio guides'
      } 
    });
  };

  if (loading) return <div className="text-center p-5"><h3>Loading place details...</h3></div>;
  if (error) return (
    <Container className="py-5">
      <Alert variant="danger">
        <Alert.Heading>Error</Alert.Heading>
        <p>{error}</p>
        <hr />
        <p className="mb-0">
          Please check that your backend server is running at http://localhost:8000 and try again.
        </p>
      </Alert>
    </Container>
  );
  if (!place) return (
    <Container className="py-5">
      <Alert variant="warning">
        <Alert.Heading>Place not found</Alert.Heading>
        <p>The place you're looking for doesn't exist or has been removed.</p>
      </Alert>
    </Container>
  );

  // Fix image URL construction
  const imageUrl = place.image 
    ? place.image.startsWith('http')
      ? place.image
      : `http://localhost:8000${place.image}`
    : 'https://via.placeholder.com/800x400?text=No+Image+Available';
  
  // Get the currently selected audio guide
  const currentAudioGuide = place.audio_guides?.find(guide => guide.language === selectedLanguage);
  
  // Map language codes to human-readable names
  const languageNames = {
    'en': 'English',
    'hi': 'Hindi',
    'gu': 'Gujarati'
  };

  return (
    <Container className="py-5">
      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="details">Details</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="audio">Audio Guide</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="details">
            <div className="row">
              <div className="col-md-6">
                <img 
                  src={imageUrl} 
                  alt={place.name} 
                  className="img-fluid rounded shadow"
                  style={{ 
                    width: '100%', 
                    height: '400px', 
                    objectFit: 'cover',
                    backgroundColor: '#f8f9fa'
                  }}
                  onError={(e) => {
                    console.error('Image failed to load:', imageUrl);
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
                  }}
                />
              </div>
              <div className="col-md-6">
                <h1 className="mb-3">{place.name}</h1>
                <p className="text-muted mb-4">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  {place.location}
                </p>
                <div>
                  <h3 className="mb-3">Description</h3>
                  <p className="text-justify lead">{place.description}</p>
                </div>
              </div>
            </div>
          </Tab.Pane>

          <Tab.Pane eventKey="audio">
            <div className="row justify-content-center">
              <div className="col-md-8">
                <Card>
                  <Card.Header className="bg-primary text-white">
                    <FaVolumeUp className="me-2" />
                    Audio Guide
                  </Card.Header>
                  <Card.Body>
                    {!currentUser ? (
                      <div className="text-center py-4">
                        <Alert variant="warning">
                          <FaLock className="me-2" /> 
                          <strong>Authentication Required</strong>
                          <p className="mt-2">Please log in to access audio guides</p>
                          <Button 
                            variant="primary" 
                            className="mt-2"
                            onClick={handleLoginRedirect}
                          >
                            Log In
                          </Button>
                        </Alert>
                      </div>
                    ) : place.audio_guides && place.audio_guides.length > 0 ? (
                      <>
                        <h5 className="mb-4">Select Language</h5>
                        <ButtonGroup className="d-flex mb-4">
                          {place.audio_guides.map((guide) => (
                            <Button
                              key={guide.language}
                              variant={selectedLanguage === guide.language ? 'primary' : 'outline-primary'}
                              onClick={() => handleLanguageSelect(guide.language)}
                              className="flex-fill"
                              disabled={audioLoading}
                            >
                              {languageNames[guide.language]}
                            </Button>
                          ))}
                        </ButtonGroup>
                        
                        {selectedLanguage && currentAudioGuide && (
                          <div className="audio-player">
                            <div className="card mb-4">
                              <div className="card-header bg-light">
                                <h6 className="mb-0">Now Playing: {languageNames[selectedLanguage]}</h6>
                              </div>
                              <div className="card-body">
                                {audioLoading ? (
                                  <div className="text-center py-4">
                                    <Spinner animation="border" variant="primary" />
                                    <p className="mt-2">Loading audio file...</p>
                                  </div>
                                ) : audioBlob ? (
                                  /* Use the blob URL which bypasses CORS restrictions */
                                  <audio 
                                    ref={audioRef}
                                    src={audioBlob}
                                    controls
                                    onError={handleAudioError}
                                    className="w-100"
                                    autoPlay={false}
                                  />
                                ) : (
                                  <div className="text-center py-3">
                                    <p>Audio player will appear here once file is loaded.</p>
                                  </div>
                                )}
                                
                                {audioError && (
                                  <Alert variant="warning" className="mt-3">
                                    <p className="mb-0">{audioError}</p>
                                  </Alert>
                                )}
                                
                                <div className="d-flex justify-content-center mt-3">
                                  <a 
                                    href={currentAudioGuide.audio_file.startsWith('http') 
                                      ? currentAudioGuide.audio_file 
                                      : `http://localhost:8000${currentAudioGuide.audio_file}`} 
                                    download
                                    className="btn btn-success"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <FaDownload className="me-2" /> Download Audio File
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="alert alert-info">
                        No audio guides available yet for this place.
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </div>
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default PlaceDetail;