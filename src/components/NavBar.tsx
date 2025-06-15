
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { Menu, MenuButton, MenuList, MenuItem } from '@reach/menu-button';
import '@reach/menu-button/styles.css';
import { ChevronDownIcon, MenuIcon, XIcon } from '@heroicons/react/solid';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { role, loading: roleLoading } = useRole();

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/placeholder.svg" alt="Whirl Win" className="h-8 w-8" />
              <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-blue-500 text-transparent bg-clip-text">
                Whirl Win
              </span>
            </Link>

            <button onClick={toggleMenu} className="text-gray-300 hover:text-white focus:outline-none">
              {isMenuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="bg-gray-800 border-t border-gray-700 py-2">
            <div className="container mx-auto px-4 flex flex-col space-y-2">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors" onClick={closeMenu}>
                Home
              </Link>
              <Link to="/upload" className="text-gray-300 hover:text-white transition-colors" onClick={closeMenu}>
                Upload
              </Link>
              <Link to="/leaderboard" className="text-gray-300 hover:text-white transition-colors" onClick={closeMenu}>
                Leaderboard
              </Link>
              <Link to="/slumerican" className="text-gray-300 hover:text-whirl-slumerican-gold transition-colors" onClick={closeMenu}>
                Slumerican
              </Link>
               <Link to="/truth" className="text-gray-300 hover:text-amber-500 transition-colors" onClick={closeMenu}>
                Truth
              </Link>
              <Link to="/content-agents" className="text-gray-300 hover:text-blue-500 transition-colors" onClick={closeMenu}>
                AI Agents
              </Link>
              
              {user ? (
                <>
                  {(role === 'admin' || role === 'owner') && (
                    <Link to="/admin" className="text-gray-300 hover:text-green-500 transition-colors" onClick={closeMenu}>
                      Admin
                    </Link>
                  )}
                  <Link to="/profile" className="text-gray-300 hover:text-white transition-colors" onClick={closeMenu}>
                    Profile
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-300 hover:text-white transition-colors" onClick={closeMenu}>
                    Login
                  </Link>
                  <Link to="/signup" className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors" onClick={closeMenu}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/placeholder.svg" alt="Whirl Win" className="h-8 w-8" />
              <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-blue-500 text-transparent bg-clip-text">
                Whirl Win
              </span>
            </Link>

            <div className="flex items-center space-x-6">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/upload" className="text-gray-300 hover:text-white transition-colors">
                Upload
              </Link>
              <Link to="/leaderboard" className="text-gray-300 hover:text-white transition-colors">
                Leaderboard
              </Link>
              <Link to="/slumerican" className="text-gray-300 hover:text-whirl-slumerican-gold transition-colors">
                Slumerican
              </Link>
              <Link to="/truth" className="text-gray-300 hover:text-amber-500 transition-colors">
                Truth
              </Link>
              <Link to="/content-agents" className="text-gray-300 hover:text-blue-500 transition-colors">
                AI Agents
              </Link>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  {(role === 'admin' || role === 'owner') && (
                    <Link to="/admin" className="text-gray-300 hover:text-green-500 transition-colors">
                      Admin
                    </Link>
                  )}
                  <Link to="/profile" className="text-gray-300 hover:text-white transition-colors">
                    Profile
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                    Login
                  </Link>
                  <Link to="/signup" className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
