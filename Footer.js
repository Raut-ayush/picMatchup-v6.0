// Footer.js
import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <p>© 2024 Ayush's Image Comparison App</p>
            <p>&copy; {new Date().getFullYear()} Ayush Raut Productions |   
              <a href="http://localhost:3000/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a> |   
              <a href="http://localhost:3000/terms-of-service" target="_blank" rel="noopener noreferrer">Terms of Service</a> |   
              Made with <span style={{ color: 'red' }}>&hearts;</span> by Ayush Raut.</p>
        </footer>
    );
};

export default Footer;
