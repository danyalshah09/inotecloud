// Alert.js
import React from 'react';
import '../styles/Alert.css';

export const Alert = ({ message, type }) => {
  return (
    <div className="alert-wrapper mb-4">
      <div 
        className={`alert alert-${type} fade show`} 
        role="alert"
      >
        {message}
      </div>
    </div>
  );
};
