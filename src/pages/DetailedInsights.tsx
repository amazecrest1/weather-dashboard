import React from 'react';
import { Link } from 'react-router-dom';

const DetailedInsights: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Detailed Insights</h1>
          <Link 
            to="/" 
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Back to Overview
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Weather Analytics</h2>
          <p className="text-gray-600">
            Detailed weather analytics and insights will be displayed here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetailedInsights; 