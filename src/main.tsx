
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { apiManager } from './services/apiManager'

// Initialize API Manager with Odds API key
// Replace with your actual Odds API key from https://the-odds-api.com/
const ODDS_API_KEY = '15439ae06549fa60c219cc8dd7bf8cc6';
apiManager.initialize(ODDS_API_KEY);

createRoot(document.getElementById("root")!).render(<App />);
