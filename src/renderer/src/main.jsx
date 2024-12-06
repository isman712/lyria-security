import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CamarasList from './components/Camaras'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/camaras" element={<CamarasList />} />
        </Routes>
    </Router>
  </React.StrictMode>
)
