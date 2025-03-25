import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaHeadphones, FaAward, FaGlobe, FaUsers, FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';
import './About.css';

const About = () => {
  const [isVisible, setIsVisible] = useState({
    mission: false,
    stats: false,
    team: false,
    timeline: false
  });

  // Handle scroll animations
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      
      // Get elements
      const missionEl = document.querySelector('.mission-section');
      const statsEl = document.querySelector('.stats-section');
      const teamEl = document.querySelector('.team-section');
      const timelineEl = document.querySelector('.timeline-section');
      
      // Check if elements are in viewport
      if (missionEl && scrollPosition > missionEl.offsetTop + 100) {
        setIsVisible(prev => ({ ...prev, mission: true }));
      }
      
      if (statsEl && scrollPosition > statsEl.offsetTop + 100) {
        setIsVisible(prev => ({ ...prev, stats: true }));
      }
      
      if (teamEl && scrollPosition > teamEl.offsetTop + 100) {
        setIsVisible(prev => ({ ...prev, team: true }));
      }
      
      if (timelineEl && scrollPosition > timelineEl.offsetTop + 100) {
        setIsVisible(prev => ({ ...prev, timeline: true }));
      }
    };
    
    // Initial check
    handleScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: 'Aisha Patel',
      role: 'Founder & CEO',
      image: 'https://randomuser.me/api/portraits/women/32.jpg',
      bio: 'Travel enthusiast with 10+ years experience in tourism technology.',
      socials: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    },
    {
      id: 2,
      name: 'Raj Sharma',
      role: 'CTO',
      image: 'https://randomuser.me/api/portraits/men/41.jpg',
      bio: 'Audio engineering expert with passion for creating immersive experiences.',
      socials: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      role: 'Head of Content',
      image: 'https://randomuser.me/api/portraits/women/45.jpg',
      bio: "Historian and storyteller bringing Gujarat's rich heritage to life.",
      socials: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    },
    {
      id: 4,
      name: 'Ankit Patel',
      role: 'Lead Developer',
      image: 'https://randomuser.me/api/portraits/men/36.jpg',
      bio: 'Full-stack developer with expertise in building interactive web applications.',
      socials: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    }
  ];
  
  // Timeline data
  const timelineEvents = [
    {
      year: '2018',
      title: 'Company Founded',
      description: 'VirtualAudioGuide was established with the mission to revolutionize tourism through audio technology.',
    },
    {
      year: '2019',
      title: 'First Audio Guide Launch',
      description: 'Released our first collection of audio guides for historical sites in Ahmedabad.',
    },
    {
      year: '2020',
      title: 'Platform Expansion',
      description: 'Expanded our platform to include 100+ locations across Gujarat.',
    },
    {
      year: '2021',
      title: 'Mobile App Launch',
      description: 'Launched our mobile application for iOS and Android platforms.',
    },
    {
      year: '2022',
      title: 'Partnership Program',
      description: 'Started collaborating with local historians and storytellers.',
    },
    {
      year: '2023',
      title: 'Virtual Reality Integration',
      description: 'Introduced VR-enhanced audio experiences for premium destinations.',
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="about-hero">
        <Container>
          <h1>About VirtualAudioGuide</h1>
          <p>Bringing Gujarat's heritage to life through immersive audio experiences</p>
        </Container>
      </div>
      
      {/* Mission Section */}
      <section className={`mission-section ${isVisible.mission ? 'visible' : ''}`}>
        <Container>
          <div className="section-header">
            <FaHeadphones className="section-icon" />
            <h2>Our Mission</h2>
          </div>
          
          <Row className="align-items-center">
            <Col md={6}>
              <div className="mission-content">
                <h3>Why We Started</h3>
                <p>
                  At VirtualAudioGuide, we believe that every place has a story waiting to be told. 
                  Our mission is to transform the way people experience Gujarat's rich cultural 
                  heritage through immersive audio storytelling.
                </p>
                <p>
                  We combine historical research, local knowledge, and cutting-edge audio technology 
                  to create guides that educate, entertain, and inspire exploration.
                </p>
                <h3>Our Vision</h3>
                <p>
                  To become the leading audio guide platform for cultural and historical sites across India, 
                  making rich cultural experiences accessible to everyone, regardless of their background, 
                  language, or abilities.
                </p>
              </div>
            </Col>
            <Col md={6}>
              <div className="mission-image">
                <img 
                  src="https://images.unsplash.com/photo-1632292220916-e9c34dd75db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Historical site in Gujarat" 
                  className="img-fluid rounded shadow"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Stats Section */}
      <section className={`stats-section ${isVisible.stats ? 'visible' : ''}`}>
        <Container>
          <div className="section-header">
            <FaAward className="section-icon" />
            <h2>Our Impact</h2>
          </div>
          
          <Row>
            <Col md={3} sm={6}>
              <div className="stat-card">
                <div className="stat-number">500+</div>
                <div className="stat-label">Audio Guides</div>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-card">
                <div className="stat-number">50+</div>
                <div className="stat-label">Historical Sites</div>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-card">
                <div className="stat-number">10+</div>
                <div className="stat-label">Languages</div>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-card">
                <div className="stat-number">1M+</div>
                <div className="stat-label">Users Worldwide</div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Team Section */}
      <section className={`team-section ${isVisible.team ? 'visible' : ''}`}>
        <Container>
          <div className="section-header">
            <FaUsers className="section-icon" />
            <h2>Our Team</h2>
            <p>Meet the passionate people behind VirtualAudioGuide</p>
          </div>
          
          <Row>
            {teamMembers.map((member, index) => (
              <Col lg={3} md={6} key={member.id} className="mb-4">
                <Card className="team-card" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="member-image">
                    <img src={member.image} alt={member.name} />
                    <div className="member-social">
                      <a href={member.socials.linkedin} aria-label="LinkedIn">
                        <FaLinkedin />
                      </a>
                      <a href={member.socials.twitter} aria-label="Twitter">
                        <FaTwitter />
                      </a>
                      <a href={member.socials.github} aria-label="GitHub">
                        <FaGithub />
                      </a>
                    </div>
                  </div>
                  <Card.Body>
                    <h4>{member.name}</h4>
                    <p className="member-role">{member.role}</p>
                    <p className="member-bio">{member.bio}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      
      {/* Timeline Section */}
      <section className={`timeline-section ${isVisible.timeline ? 'visible' : ''}`}>
        <Container>
          <div className="section-header">
            <FaGlobe className="section-icon" />
            <h2>Our Journey</h2>
            <p>How we've grown over the years</p>
          </div>
          
          <div className="timeline">
            {timelineEvents.map((event, index) => (
              <div 
                key={index} 
                className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                <div className="timeline-content">
                  <div className="timeline-year">{event.year}</div>
                  <h4>{event.title}</h4>
                  <p>{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
      
      {/* Values Section */}
      <section className="values-section">
        <Container>
          <div className="section-header">
            <h2>Our Values</h2>
          </div>
          
          <Row>
            <Col md={4}>
              <div className="value-card">
                <h3>Authenticity</h3>
                <p>
                  We prioritize historical accuracy and cultural authenticity in every audio guide we create, 
                  collaborating with historians and local experts.
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="value-card">
                <h3>Accessibility</h3>
                <p>
                  We believe in making cultural experiences accessible to everyone through 
                  technology, multiple languages, and inclusive design.
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="value-card">
                <h3>Innovation</h3>
                <p>
                  We continuously explore new technologies and storytelling techniques to create 
                  increasingly immersive and engaging audio experiences.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default About; 