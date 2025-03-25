import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import About from '../pages/About';

// Mock the intersection observer
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

describe('About Page', () => {
  test('renders the about page with main sections', () => {
    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );
    
    // Check for main title
    expect(screen.getByText('About VirtualAudioGuide')).toBeInTheDocument();
    
    // Check for section titles
    expect(screen.getByText('Our Mission')).toBeInTheDocument();
    expect(screen.getByText('Our Impact')).toBeInTheDocument();
    expect(screen.getByText('Our Team')).toBeInTheDocument();
    expect(screen.getByText('Our Journey')).toBeInTheDocument();
    expect(screen.getByText('Our Values')).toBeInTheDocument();
  });

  test('renders team member cards', () => {
    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );
    
    // Check for team members
    expect(screen.getByText('Aisha Patel')).toBeInTheDocument();
    expect(screen.getByText('Raj Sharma')).toBeInTheDocument();
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('Ankit Patel')).toBeInTheDocument();
  });

  test('renders value cards', () => {
    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );
    
    // Check for values
    expect(screen.getByText('Authenticity')).toBeInTheDocument();
    expect(screen.getByText('Accessibility')).toBeInTheDocument();
    expect(screen.getByText('Innovation')).toBeInTheDocument();
  });
}); 