import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Overview from './pages/Overview';
import DetailedInsights from './pages/DetailedInsights';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <main>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/detailed" element={<DetailedInsights />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 