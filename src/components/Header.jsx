import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'
      }`}
    >
      <div className="container flex items-center justify-between">
        <a href="/" className="text-2xl font-bold tracking-tighter">
          갈래말래
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-medium hover:opacity-70 transition-opacity">Home</a>
          <a href="#" className="text-sm font-medium hover:opacity-70 transition-opacity">About</a>
          <a href="#" className="text-sm font-medium hover:opacity-70 transition-opacity">App</a>
          <a href="#" className="text-sm font-medium hover:opacity-70 transition-opacity">Partnerships</a>
          <a href="https://curator.daytrip.io" target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:opacity-70 transition-opacity">Agency</a>
        </nav>

        <div className="hidden md:block">
          <a href="#" className="btn btn-primary text-sm py-2 px-6">
            앱 다운로드
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 p-4 md:hidden flex flex-col gap-4 shadow-lg">
          <a href="#" className="text-lg font-medium py-2">Home</a>
          <a href="#" className="text-lg font-medium py-2">About</a>
          <a href="#" className="text-lg font-medium py-2">App</a>
          <a href="#" className="text-lg font-medium py-2">Partnerships</a>
          <a href="#" className="text-lg font-medium py-2">Agency</a>
          <a href="#" className="btn btn-primary w-full text-center">
            앱 다운로드
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
