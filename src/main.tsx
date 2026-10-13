import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WalletProvider } from './components/Wallet';
import './styles.css';
import './components/correspondence-journey.css';
import './components/landing-v6.css';
import './components/landing-motion.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><WalletProvider><App /></WalletProvider></React.StrictMode>,
);
