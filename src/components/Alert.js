// Alert.js
import React from 'react';
import '../styles/Alert.css';

export const Alert = ({ message, type }) => {
  return (
    <div 
      className="alert-container position-fixed top-0 start-50 translate-middle-x mt-3 z-3 w-90"
      style={{ 
        maxWidth: '90%',
        zIndex: 1050,
      }}
    >
      <div className={`alert alert-${type} alert-dismissible fade show`} role="alert">
        {message}
      </div>
    </div>
  );
};
