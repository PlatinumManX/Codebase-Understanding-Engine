import React, { useState, useEffect } from 'react';
import useRoute from '../../../shared/hooks/useRoute';
import Button from '../../../shared/components/Button';

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { route, navigate } = useRoute();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, targetRoute, anchorId) => {
    e.preventDefault();
    if (targetRoute === 'landing' && anchorId) {
      if (route === 'landing') {
        const element = document.getElementById(anchorId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate('landing');
        // Let the page transition, then scroll to the element
        setTimeout(() => {
          const element = document.getElementById(anchorId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      }
    } else {
      navigate(targetRoute);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#040609]/85 backdrop-blur-lg py-3 shadow-[0_10px_40px_rgba(0,0,0,0.8)] border-none' 
        : 'bg-transparent py-6'
    }`}>
      <div className="px-6 flex items-center justify-between mx-10">
        {/* Brand Logo */}
        <div 
          onClick={(e) => handleLinkClick(e, 'landing')}
          className="flex items-center gap-3 select-none cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00f0ff]/20 to-[#a855f7]/20 border border-[#00f0ff]/30 flex items-center justify-center">
            <span className="text-sm font-extrabold text-[#00f0ff] font-mono">CM</span>
          </div>
          <span className="text-2xl font-bold tracking-wider text-white font-mono">
            CODEMAP<span className="text-[#00f0ff]">AI</span>
          </span>
        </div>

        {/* Links (Increased size: 16px - 18px) */}
        <div className="hidden lg:flex items-center gap-8 text-[20px] font-semibold font-mono text-slate-300">
          <a 
            href="/" 
            onClick={(e) => handleLinkClick(e, 'landing')}
            className="hover:text-[#00f0ff] transition-colors"
          >
            Home
          </a>
          <a 
            href="#decoding-section" 
            onClick={(e) => handleLinkClick(e, 'landing', 'decoding-section')}
            className="hover:text-[#00f0ff] transition-colors"
          >
            Features
          </a>
          <a 
            href="#flow-section" 
            onClick={(e) => handleLinkClick(e, 'landing', 'flow-section')}
            className="hover:text-[#00f0ff] transition-colors"
          >
            Architecture
          </a>
          <a 
            href="/pricing" 
            onClick={(e) => handleLinkClick(e, 'pricing')}
            className="hover:text-[#00f0ff] transition-colors"
          >
            Pricing
          </a>
          <a 
            href="/docs" 
            onClick={(e) => handleLinkClick(e, 'docs')}
            className="hover:text-[#00f0ff] transition-colors"
          >
            Documentation
          </a>
          <a 
            href="/about" 
            onClick={(e) => handleLinkClick(e, 'about')}
            className="hover:text-[#00f0ff] transition-colors"
          >
            About Us
          </a>
          <a 
            href="/contact" 
            onClick={(e) => handleLinkClick(e, 'contact')}
            className="hover:text-[#00f0ff] transition-colors"
          >
            Contact
          </a>
        </div>

        {/* Actions (Launch App only) */}
        <div className="flex items-center">
          <a href="/dashboard" onClick={(e) => handleLinkClick(e, 'dashboard')}>
            <Button variant="primary" size="md" className="font-mono text-[18px] cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.15)] border-[#00f0ff]/40">
              Launch App
            </Button>
          </a>
        </div>
      </div>
    </nav>
  );
}
