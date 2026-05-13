import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import PuxxViewer from './pages/PuxxViewer'
import IPhoneHero from './pages/IPhoneHero'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/puxx" element={<PuxxViewer />} />
        <Route path="/iphone-hero" element={<IPhoneHero />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
