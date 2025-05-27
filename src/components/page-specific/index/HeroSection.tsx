
import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <section className="mb-8">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-whirl-purple via-whirl-pink to-whirl-orange text-transparent bg-clip-text">
          WHIRL-WIN
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-4">
          15-second video battles. Vote, win, dominate.
        </p>
        <div className="flex space-x-4">
          <Link to="/upload" className="animate-pulse-glow rounded-md">
            <button className="bg-whirl-purple hover:bg-whirl-deep-purple text-white px-6 py-2 rounded-md font-semibold transition-all hover:scale-105">
              Upload & Battle
            </button>
          </Link>
          <Link to="/leaderboard">
            <button className="bg-transparent border border-whirl-purple text-white px-6 py-2 rounded-md font-semibold transition-all hover:scale-105">
              View Leaderboard
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

