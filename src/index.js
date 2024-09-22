import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { RosProvider } from './contexts/RosContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RosProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </RosProvider>
);

