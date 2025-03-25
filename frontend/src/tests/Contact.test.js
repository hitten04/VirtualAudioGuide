import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Contact from '../pages/Contact';

// Mock the intersection observer
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

describe('Contact Page', () => {
  test('renders the contact page with main sections', () => {
    render(
      <BrowserRouter>
        <Contact />
      </BrowserRouter>
    );
    
    // Check for main title
    expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    
    // Check for section titles
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
    expect(screen.getByText('Send us a Message')).toBeInTheDocument();
    expect(screen.getByText('Find Us')).toBeInTheDocument();
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
  });

  test('renders contact information', () => {
    render(
      <BrowserRouter>
        <Contact />
      </BrowserRouter>
    );
    
    // Check for contact details
    expect(screen.getByText('Our Location')).toBeInTheDocument();
    expect(screen.getByText('Phone Number')).toBeInTheDocument();
    expect(screen.getByText('Email Address')).toBeInTheDocument();
    expect(screen.getByText('Working Hours')).toBeInTheDocument();
  });

  test('renders and validates contact form', async () => {
    render(
      <BrowserRouter>
        <Contact />
      </BrowserRouter>
    );
    
    // Get form fields
    const nameInput = screen.getByPlaceholderText('Enter your full name');
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const subjectInput = screen.getByPlaceholderText('What is this regarding?');
    const messageInput = screen.getByPlaceholderText('Write your message here...');
    const submitButton = screen.getByText('Send Message');
    
    // Test form validation - submit empty form
    fireEvent.click(submitButton);
    
    // Wait for validation messages
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Subject is required')).toBeInTheDocument();
      expect(screen.getByText('Message is required')).toBeInTheDocument();
    });
    
    // Fill form with valid data
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
    fireEvent.change(messageInput, { target: { value: 'This is a test message that is long enough to pass validation.' } });
    
    // Submit form - no validation errors should appear
    fireEvent.click(submitButton);
    
    // The success message would appear in a real scenario
    // We're not testing the full submission as it's simulated
  });
}); 