import React from 'react';
import ReactDOM from 'react-dom/client'; // Note the change here
import App from './App';

// Get the root element from the HTML
const rootElement = document.getElementById('root');

// Create a React root
const root = ReactDOM.createRoot(rootElement);

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);