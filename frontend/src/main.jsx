import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import './index.css';

import { StoreSettingsProvider } from './context/StoreSettingsContext';
import { AuthProvider } from './context/AuthContext';
import { EnquiryProvider } from './context/EnquiryContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <StoreSettingsProvider>
        <AuthProvider>
          <EnquiryProvider>
            <App />
          </EnquiryProvider>
        </AuthProvider>
      </StoreSettingsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
