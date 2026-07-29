import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Categories', path: '/categories' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white shadow-[0_4px_15px_rgba(255,215,0,0.15)]' // Pure White with soft golden shadow
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-2xl drop-shadow-[0_0_10px_rgba(255,165,0,0.8)] transform group-hover:scale-110 transition-transform">
                🪔
              </span>
              <span className="text-2xl font-serif font-extrabold text-[#c00000] tracking-tight">
                Vinayaka Crackers
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 relative">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-base font-semibold transition-colors relative py-2 ${
                    isActive ? 'text-[#c00000]' : scrolled ? 'text-gray-800 hover:text-[#c00000]' : 'text-gray-800 hover:text-[#c00000]'
                  }`}
                >
                  {link.name}
                  {/* Golden underline that appears on active */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-underline"
                      className="absolute left-0 bottom-0 w-full h-[3px] bg-[#FFD700] rounded-t-md"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side: Shop Now Button */}
          <div className="hidden md:flex items-center">
            <Link 
              to="/products" 
              className="flex items-center gap-2 bg-[#c00000] hover:bg-[#a00000] text-white font-bold py-2 px-6 rounded-full shadow-lg transition-transform hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(192,0,0,0.4)]"
            >
              Shop Now
              <ShoppingCart className="w-4 h-4 text-white" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`${scrolled ? 'text-[#c00000]' : 'text-[#c00000]'} hover:opacity-70 focus:outline-none`}
            >
              {mobileMenuOpen ? (
                <X className="h-8 w-8" />
              ) : (
                <Menu className="h-8 w-8" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-xl absolute w-full left-0 border-t border-gray-100">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-bold ${
                  location.pathname === link.path
                    ? 'text-[#c00000] bg-orange-50 border-l-4 border-[#FFD700]'
                    : 'text-gray-800 hover:text-[#c00000] hover:bg-gray-50 border-l-4 border-transparent'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 px-3">
              <Link 
                to="/products" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-[#c00000] text-white font-bold py-3 px-6 rounded-full shadow-md"
              >
                Shop Now
                <ShoppingCart className="w-5 h-5 text-white" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
