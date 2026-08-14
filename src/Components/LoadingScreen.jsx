import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-gray-700 border-t-red-600 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingScreen;