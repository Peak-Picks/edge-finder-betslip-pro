
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { apiManager } from './services/apiManager'

// Initialize API Manager with Odds API key
// Replace with your actual Odds API key from https://the-odds-api.com/
const ODDS_API_KEY = import.meta.env.VITE_ODDS_API_KEY || 'demo-key';
apiManager.initialize(ODDS_API_KEY);

createRoot(document.getElementById("root")!).render(<App />);
