import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-cream-light font-sans text-brown">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      
      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 flex flex-col gap-2.5">
        {/* Call Us Button */}
        <a href="tel:+917550191869" className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1e488f] hover:bg-[#16366d] text-white rounded-full flex flex-col items-center justify-center shadow-lg transition-transform hover:scale-110">
          <span className="text-[9px] sm:text-[10px] font-bold leading-tight">CALL</span>
          <span className="text-[9px] sm:text-[10px] font-bold leading-tight">US!</span>
        </a>
        
        {/* WhatsApp Button */}
        <a href="https://wa.me/917550191869" target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-12 sm:h-12 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full flex flex-col items-center justify-center shadow-lg transition-transform hover:scale-110">
          <span className="text-lg sm:text-xl">💬</span>
          <span className="text-[7px] sm:text-[8px] font-bold">WhatsApp</span>
        </a>
      </div>
    </div>
  );
};

export default Layout;
