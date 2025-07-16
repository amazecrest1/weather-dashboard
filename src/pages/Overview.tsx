import React from 'react';
import { Link } from 'react-router-dom';

const Overview: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Weather Dashboard</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="text-gray-600 mb-4">
            Welcome to the Weather Dashboard. This application provides comprehensive weather data and insights.
          </p>
          <Link 
            to="/detailed" 
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            View Detailed Insights
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Overview; 