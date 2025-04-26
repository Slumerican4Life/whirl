
import { useState, useEffect } from "react";
import { getBattlesByCategory, getVideosByCategory, videos, Battle } from "@/lib/data";
import NavBar from "@/components/NavBar";
import BattleCard from "@/components/BattleCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const SlumericanPage = () => {
  const [battles, setBattles] = useState<Battle[]>([]);
  
  useEffect(() => {
    const slumericanBattles = getBattlesByCategory('Slumerican');
    setBattles(slumericanBattles);
  }, []);

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-16 bg-gradient-to-b from-whirl-slumerican-black to-whirl-dark">
      <NavBar />
      
      <main className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <section className="mb-12 rounded-lg overflow-hidden">
          <div className="flex flex-col items-center bg-black p-8 border border-whirl-slumerican-red rounded-lg">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">
              <span className="bg-gradient-to-r from-whirl-slumerican-red via-whirl-slumerican-gold to-white text-transparent bg-clip-text">
                SLUMERICAN CORNER
              </span>
            </h1>
            <div className="w-20 h-1 bg-whirl-slumerican-red mb-6"></div>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl text-center">
              Dedicated to Yelawolf and authentic street culture. Raw talent, real stories, no filter.
            </p>
            <Link to="/upload">
              <Button className="bg-whirl-slumerican-red hover:bg-white hover:text-whirl-slumerican-red transition-colors">
                Submit Your Slumerican Video
              </Button>
            </Link>
          </div>
        </section>
        
        {/* About Section */}
        <section className="mb-12">
          <Card className="bg-black/70 border-whirl-slumerican-gold p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">About Slumerican</h2>
            <p className="text-gray-300 mb-4">
              Slumerican is a cultural movement and record label founded by Yelawolf, representing the fusion of Southern culture, hip-hop, and raw creativity. This corner of Whirl is dedicated to videos that embody the Slumerican spirit - authentic, gritty, and straight from the streets.
            </p>
            <p className="text-gray-300">
              Whether you're showcasing freestyle skills, street art, skateboarding, or any form of raw, unfiltered talent - this is your platform to shine.
            </p>
          </Card>
        </section>
        
        {/* Battles Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-white">Slumerican Battles</h2>
          
          {battles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {battles.map((battle) => (
                <BattleCard key={battle.id} battle={battle} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-black/30 rounded-lg">
              <p className="text-lg text-gray-300">
                No Slumerican battles right now.
              </p>
              <p className="text-md text-gray-400">
                Be the first to upload a Slumerican video and start the movement!
              </p>
              <Link to="/upload" className="mt-4 inline-block">
                <Button className="mt-4 bg-whirl-slumerican-red hover:bg-whirl-slumerican-gold">
                  Upload Now
                </Button>
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default SlumericanPage;
