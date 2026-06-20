import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '/src/styles/index.css'
import App from './App.jsx'
import 'navium-ui-lib/dist/navium-ui-lib.esm.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
