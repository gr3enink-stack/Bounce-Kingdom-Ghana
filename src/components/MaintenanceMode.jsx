import React from 'react';
import './MaintenanceMode.css';

const MaintenanceMode = () => {
  return (
    <div className="maintenance-mode">
      <div className="maintenance-content">
        <div className="maintenance-icon">🚧</div>
        <h1>Under Maintenance</h1>
        <p>We're currently making improvements to our website to serve you better.</p>
        <p>Please check back soon!</p>
        <div className="maintenance-timer">
          <p>Estimated time remaining: <strong>30 minutes</strong></p>
        </div>
        <div className="maintenance-contact">
          <p>Need immediate assistance?</p>
          <p>Contact us at: <a href="tel:+233123456789">+233 123 456 789</a></p>
          <p>Or email: <a href="mailto:info@bouncekingdomghana.com">info@bouncekingdomghana.com</a></p>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceMode;