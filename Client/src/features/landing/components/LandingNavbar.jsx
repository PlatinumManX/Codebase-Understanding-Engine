import React, { useState, useEffect } from 'react';
import useRoute from '../../../shared/hooks/useRoute';
import Button from '../../../shared/components/Button';

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('landing');
  const { route, navigate } = useRoute();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (route !== 'landing') {
      setActiveSection(route);
      return;
    }

    const sections = [
      { id: 'landing', label: 'Home' },
      { id: 'decoding-section', label: 'Features' },
      { id: 'flow-section', label: 'Architecture' },
      { id: 'pricing-section', label: 'Pricing' },
      { id: 'docs-section', label: 'Documentation' },
      { id: 'about-section', label: 'About Us' },
      { id: 'contact-section', label: 'Contact' }
    ];

    const handleSectionScroll = () => {
      const scrollPos = window.scrollY + 200; // Trigger point
      
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleSectionScroll);
    handleSectionScroll(); // Run immediately
    return () => window.removeEventListener('scroll', handleSectionScroll);
  }, [route]);

  const handleLinkClick = (e, targetRoute, anchorId) => {
    e.preventDefault();
    if (targetRoute === 'landing') {
      if (!anchorId) {
        if (route === 'landing') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          navigate('landing');
        }
      } else {
        if (route === 'landing') {
          const element = document.getElementById(anchorId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          navigate('landing',true);
          setTimeout(() => {
            const element = document.getElementById(anchorId);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 150);
        }
      }
    } else {
      navigate(targetRoute);
      if (anchorId) {
        setTimeout(() => {
          const element = document.getElementById(anchorId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      }
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
          <span className="text-base font-bold tracking-wider text-white font-mono">
            CODEMAP<span className="text-[#00f0ff]">AI</span>
          </span>
        </div>

        {/* Links (Increased size: 16px - 18px) */}
        <div className="hidden lg:flex items-center gap-8 text-[19px] font-semibold font-mono">
          <a 
            href="/" 
            onClick={(e) => handleLinkClick(e, 'landing')}
            className={`relative py-2 transition-colors duration-200 hover:text-white ${
              activeSection === 'landing' ? 'text-[#00f0ff]' : 'text-slate-400'
            }`}
          >
            Home
            {activeSection === 'landing' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#00f0ff] to-[#a855f7] rounded-full shadow-[0_1px_8px_#00f0ff]" />
            )}
          </a>
          <a 
            href="#decoding-section" 
            onClick={(e) => handleLinkClick(e, 'landing', 'decoding-section')}
            className={`relative py-2 transition-colors duration-200 hover:text-white ${
              activeSection === 'decoding-section' ? 'text-[#00f0ff]' : 'text-slate-400'
            }`}
          >
            Features
            {activeSection === 'decoding-section' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#00f0ff] to-[#a855f7] rounded-full shadow-[0_1px_8px_#00f0ff]" />
            )}
          </a>
          <a 
            href="#flow-section" 
            onClick={(e) => handleLinkClick(e, 'landing', 'flow-section')}
            className={`relative py-2 transition-colors duration-200 hover:text-white ${
              activeSection === 'flow-section' ? 'text-[#00f0ff]' : 'text-slate-400'
            }`}
          >
            Architecture
            {activeSection === 'flow-section' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#00f0ff] to-[#a855f7] rounded-full shadow-[0_1px_8px_#00f0ff]" />
            )}
          </a>
          <a 
            href="/pricing" 
            onClick={(e) => handleLinkClick(e, 'pricing')}
            className={`relative py-2 transition-colors duration-200 hover:text-white ${
              activeSection === 'pricing' || activeSection === 'pricing-section' ? 'text-[#00f0ff]' : 'text-slate-400'
            }`}
          >
            Pricing
            {(activeSection === 'pricing' || activeSection === 'pricing-section') && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#00f0ff] to-[#a855f7] rounded-full shadow-[0_1px_8px_#00f0ff]" />
            )}
          </a>
          <a 
            href="/docs" 
            onClick={(e) => handleLinkClick(e, 'docs')}
            className={`relative py-2 transition-colors duration-200 hover:text-white ${
              activeSection === 'docs' || activeSection === 'docs-section' ? 'text-[#00f0ff]' : 'text-slate-400'
            }`}
          >
            Documentation
            {(activeSection === 'docs' || activeSection === 'docs-section') && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#00f0ff] to-[#a855f7] rounded-full shadow-[0_1px_8px_#00f0ff]" />
            )}
          </a>
          <a 
            href="/about" 
            onClick={(e) => handleLinkClick(e, 'about')}
            className={`relative py-2 transition-colors duration-200 hover:text-white ${
              activeSection === 'about' || activeSection === 'about-section' ? 'text-[#00f0ff]' : 'text-slate-400'
            }`}
          >
            About Us
            {(activeSection === 'about' || activeSection === 'about-section') && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#00f0ff] to-[#a855f7] rounded-full shadow-[0_1px_8px_#00f0ff]" />
            )}
          </a>
          <a 
            href="/contact" 
            onClick={(e) => handleLinkClick(e, 'contact')}
            className={`relative py-2 transition-colors duration-200 hover:text-white ${
              activeSection === 'contact' || activeSection === 'contact-section' ? 'text-[#00f0ff]' : 'text-slate-400'
            }`}
          >
            Contact
            {(activeSection === 'contact' || activeSection === 'contact-section') && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#00f0ff] to-[#a855f7] rounded-full shadow-[0_1px_8px_#00f0ff]" />
            )}
          </a>
        </div>

        {/* Actions (Launch App only) */}
        <div className="flex items-center">
          <a href="/dashboard" onClick={(e) => handleLinkClick(e, 'dashboard')}>
            <Button variant="primary" size="md" className="font-mono text-[16px] cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.15)] border-[#00f0ff]/40">
              Launch App
            </Button>
          </a>
        </div>
      </div>
    </nav>
  );
}
