import React from "react";

function SimpleApp() {
  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🎉 Tailwind CSS Works!
        </h1>
        <p className="text-gray-600 mb-4">
          Your frontend is working correctly with Tailwind CSS.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
          Test Button
        </button>
      </div>
    </div>
  );
}

export default SimpleApp;
