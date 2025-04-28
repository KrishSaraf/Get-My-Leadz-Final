import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import emailjs from '@emailjs/browser';
import App from './App.tsx';
import './index.css';
import 'leaflet/dist/leaflet.css';

// Initialize EmailJS
emailjs.init({
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  limitRate: true,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);