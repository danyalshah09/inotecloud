import React from 'react';
import './About.css'; // Add a custom CSS file for styles

const About = () => {
  return (
    <div className="about-section container min-h-screen">
      <div className="row align-items-center">
        {/* Left Column: Image */}
        <div className="col-md-6 text-center">
          <img
            src="/notes.webp"
            alt="About Notes App"
            className="img-fluid about-image"
          />
        </div>

        {/* Right Column: Content */}
        <div className="col-md-6">
          <h1 className="about-title text-white">Welcome to Notes App!</h1>
          <p className="about-description">
            Our Notes App is designed to simplify your life by helping you organize and manage your tasks, ideas, and important information efficiently.
            Create, edit, and manage notes seamlessly with our user-friendly interface.
          </p>
          <ul className="about-features list-unstyled">
            <li>
              <i className="fas fa-check-circle text-success me-2"></i> Add and edit notes with ease
            </li>
            <li>
              <i className="fas fa-check-circle text-success me-2"></i> Organize notes with tags and categories
            </li>
            <li>
              <i className="fas fa-check-circle text-success me-2"></i> Set reminders for important tasks
            </li>
            <li>
              <i className="fas fa-check-circle text-success me-2"></i> Access your notes securely anytime, anywhere
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
