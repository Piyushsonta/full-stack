import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement newsletter signup
    alert('Thank you for subscribing to our newsletter!');
    setEmail('');
  };

  return (
    <footer className="footer bg-dark text-white py-5">
      <div className="footer-top">
        <div className="container">
          <div className="row">
            {/* Brand Section */}
            <div className="col-lg-4 mb-4">
              <div className="footer-brand">
                <h3 className="mb-3 text-primary"><i className="fas fa-utensils me-2"></i>HomeMeal</h3>
                <p className="mb-3">Connecting food lovers with amazing home chefs. Experience authentic homemade meals and create unforgettable dining moments.</p>
                <div className="contact-info mb-3">
                  <p className="mb-2"><i className="fas fa-phone me-2 text-primary"></i> +91 9529233024</p>
                  <p><i className="fas fa-envelope me-2 text-primary"></i> homemeal@gmail.com</p>
                </div>
                <div className="social-links d-flex">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon me-3 bg-primary text-white rounded-circle p-2">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon me-3 bg-info text-white rounded-circle p-2">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon me-3 bg-danger text-white rounded-circle p-2">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="social-icon bg-danger text-white rounded-circle p-2">
                    <i className="fab fa-pinterest-p"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links & For Hosts - Combined in one column */}
            <div className="col-lg-2 col-md-4 mb-4">
              <div className="footer-section">
                <h4 className="text-primary mb-3 border-bottom pb-2">Quick Links</h4>
                <ul className="list-unstyled">
                  <li className="mb-2"><Link to="/" className="text-white text-decoration-none hover-effect"><i className="fas fa-chevron-right me-2 small text-primary"></i>Home</Link></li>
                  <li className="mb-2"><Link to="/browse" className="text-white text-decoration-none hover-effect"><i className="fas fa-chevron-right me-2 small text-primary"></i>Browse Meals</Link></li>
                  <li className="mb-2"><Link to="/" className="text-white text-decoration-none hover-effect"><i className="fas fa-chevron-right me-2 small text-primary"></i>About Us</Link></li>
                  <li className="mb-2"><Link to="/" className="text-white text-decoration-none hover-effect"><i className="fas fa-chevron-right me-2 small text-primary"></i>Contact</Link></li>
                </ul>
              </div>
            </div>

            {/* For Hosts */}
            <div className="col-lg-2 col-md-4 mb-4">
              <div className="footer-section">
                <h4 className="text-primary mb-3 border-bottom pb-2">For Hosts</h4>
                <ul className="list-unstyled">
                  <li className="mb-2"><Link to="/register" className="text-white text-decoration-none hover-effect"><i className="fas fa-chevron-right me-2 small text-primary"></i>Become a Host</Link></li>
                  <li className="mb-2"><Link to="/host/meal" className="text-white text-decoration-none hover-effect"><i className="fas fa-chevron-right me-2 small text-primary"></i>Host a Meal</Link></li>
                  <li className="mb-2"><Link to="/host-dashboard" className="text-white text-decoration-none hover-effect"><i className="fas fa-chevron-right me-2 small text-primary"></i>Host Dashboard</Link></li>
                  <li className="mb-2"><Link to="/profile" className="text-white text-decoration-none hover-effect"><i className="fas fa-chevron-right me-2 small text-primary"></i>Profile</Link></li>
                </ul>
              </div>
            </div>

            {/* Support */}
            <div className="col-lg-2 col-md-4 mb-4">
              <div className="footer-section">
                <h4 className="text-primary mb-3 border-bottom pb-2">Support</h4>
                <ul className="list-unstyled">
                  <li className="mb-2"><Link to="/" className="text-white text-decoration-none hover-effect"><i className="fas fa-chevron-right me-2 small text-primary"></i>Help Center</Link></li>
                  <li className="mb-2"><Link to="/" className="text-white text-decoration-none hover-effect"><i className="fas fa-chevron-right me-2 small text-primary"></i>Safety</Link></li>
                  <li className="mb-2"><Link to="/" className="text-white text-decoration-none hover-effect"><i className="fas fa-chevron-right me-2 small text-primary"></i>Terms of Service</Link></li>
                  <li className="mb-2"><Link to="/" className="text-white text-decoration-none hover-effect"><i className="fas fa-chevron-right me-2 small text-primary"></i>Privacy Policy</Link></li>
                </ul>
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="col-lg-2 col-md-12 mb-4">
              <div className="footer-newsletter">
                <h4 className="text-primary mb-3 border-bottom pb-2">Newsletter</h4>
                <p className="mb-3">Subscribe for updates and offers!</p>
                <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
                  <div className="input-group mb-3">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button type="submit" className="btn btn-primary">
                      <i className="fas fa-paper-plane"></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Bottom */}
      <div className="footer-bottom py-3 bg-dark border-top border-secondary">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <p className="mb-0">&copy; {currentYear} HomeMeal. All rights reserved.</p>
            </div>
            <div className="col-md-6">
              <div className="footer-bottom-links text-center text-md-end mt-3 mt-md-0">
                <Link to="/" className="text-white text-decoration-none me-3">Terms</Link>
                <Link to="/" className="text-white text-decoration-none me-3">Privacy</Link>
                <Link to="/" className="text-white text-decoration-none">Cookies</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;