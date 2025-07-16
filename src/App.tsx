import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Overview from './pages/Overview';
import DetailedInsights from './pages/DetailedInsights';
import { useTheme } from './hooks/useTheme';

function App() {
  useTheme(); // Initialize theme at app level

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
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