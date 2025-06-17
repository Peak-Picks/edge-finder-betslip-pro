// src/main.tsx
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { apiManager } from './services/apiManager'

// Initialize API Manager with Odds API key
// Replace with your actual Odds API key from https://the-odds-api.com/
const ODDS_API_KEY = '15439ae06549fa60c219cc8dd7bf8cc6';

// Initialize the professional betting system
apiManager.initialize(ODDS_API_KEY);

// Log initialization status
console.log('🎲 Professional Betting System v2.0');
console.log('✅ Deterministic calculations enabled');
console.log('✅ Billy Walters methodology active');

createRoot(document.getElementById("root")!).render(<App />);
