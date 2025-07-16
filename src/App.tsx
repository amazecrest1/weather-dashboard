import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Overview from './pages/Overview';
import DetailedInsights from './pages/DetailedInsights';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/detailed" element={<DetailedInsights />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 