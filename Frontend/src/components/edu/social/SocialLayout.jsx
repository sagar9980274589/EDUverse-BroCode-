import React from 'react';
import Navbar from '../layout/Navbar';

const SocialLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-6">
        {children}
      </div>

      {/* Fixed bottom spacing to account for chat button */}
      <div className="h-16"></div>
    </div>
  );
};

export default SocialLayout;
