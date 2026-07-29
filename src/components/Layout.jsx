import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Phone, MessageCircle } from 'lucide-react';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-cream-light font-sans text-brown">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      
      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 flex flex-col gap-3">
        {/* Call Us Button */}
        <a href="tel:+917550191869" aria-label="Call Us" className="group flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white rounded-full shadow-[0_4px_20px_rgba(37,99,235,0.4)] transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 border-2 border-white/20 relative">
          <Phone className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" />
          <span className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-lg">Call Us</span>
        </a>
        
        {/* WhatsApp Button */}
        <a href="https://wa.me/917550191869" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-[#25D366] to-[#128C7E] hover:from-[#20bd5a] hover:to-[#0f7a6e] text-white rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 border-2 border-white/20 relative">
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" />
          <span className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-lg">WhatsApp</span>
        </a>
      </div>
    </div>
  );
};

export default Layout;
