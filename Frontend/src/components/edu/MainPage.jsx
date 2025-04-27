import React from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import CodingChallengeSection from './coding/CodingChallengeSection';
import FloatingChatbot from './FloatingChatbot';

const MainPage = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <CodingChallengeSection />
      <FloatingChatbot />
    </div>
  );
};

export default MainPage;