import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Box,
  Users,
  Bell,
  TrendingUp,
  DollarSign,
  Camera,
  Layers,
  Maximize2,
  Minimize2,
  History,
  ShieldCheck
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { subscribeOrders } from '../../services/firebaseService';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const AdminLayout = () => {
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();
  const { showToast } = useToast();
  const { storeSettings } = useStoreSettings();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarExpanded, setIsDesktopSidebarExpanded] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isOrdersSubmenuOpen, setIsOrdersSubmenuOpen] = useState(true);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [isFullscreenPos, setIsFullscreenPos] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();
  const mainRef = useRef(null);

  const handleConfirmLogout = async () => {
    setShowLogoutModal(false);
    try {
      await logout();
      showToast('Signed out of admin session successfully.', 'info');
      navigate('/admin/login');
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const isBillingPage = location.pathname.startsWith('/admin/billing');

  const toggleFullscreen = () => {
    if (!isFullscreenPos) {
      setIsFullscreenPos(true);
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => { });
      }
    } else {
      setIsFullscreenPos(false);
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => { });
      }
    }
  };

  // Subscribe to live orders to update badge & notifications in real-time
  useEffect(() => {
    const unsub = subscribeOrders((firestoreOrders) => {
      if (Array.isArray(firestoreOrders)) {
        const pending = firestoreOrders.filter(o => !o.status || o.status === 'Pending').length;
        setPendingOrdersCount(pending);
      }
    });
    return () => unsub();
  }, []);

  // Auto-close mobile sidebar & orders submenu when navigating to any admin page
  useEffect(() => {
    setIsMobileSidebarOpen(false);
    if (!location.pathname.startsWith('/admin/orders')) {
      setIsOrdersSubmenuOpen(false);
    }
  }, [location.pathname]);

  // Automatically scroll main content area to top when navigating between admin pages
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, location.search]);

  // Listen to main element scroll position to toggle Floating Scroll To Top button
  useEffect(() => {
    const handleScroll = () => {
      if (mainRef.current) {
        setShowScrollTop(mainRef.current.scrollTop > 150);
      }
    };

    const mainEl = mainRef.current;
    if (mainEl) {
      mainEl.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (mainEl) {
        mainEl.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const scrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={22} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart size={22} /> },
    { name: 'History', path: '/admin/history', icon: <History size={22} /> },
    { name: 'Billing / POS', path: '/admin/billing', icon: <FileText size={22} /> },
    { name: 'Products', path: '/admin/products', icon: <Box size={22} /> },
    { name: 'Inventory', path: '/admin/inventory', icon: <Package size={22} /> },
    { name: 'Customers', path: '/admin/customers', icon: <Users size={22} /> },
    { name: 'Expenses Tracker', path: '/admin/expenses', icon: <DollarSign size={22} /> },
    { name: 'Reports & Analytics', path: '/admin/reports', icon: <TrendingUp size={22} /> },
    { name: 'Gallery Management', path: '/admin/gallery', icon: <Camera size={22} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={22} /> },
  ];

  return (
    <div className="h-screen w-full bg-[#F4F1EA] flex font-sans overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-[#4A0E0E] to-[#250606] border-r border-red-950/40 shadow-[4px_0_24px_rgba(0,0,0,0.2)] transition-all duration-300 ease-in-out flex flex-col h-full
          ${isMobileSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'} 
          lg:translate-x-0 lg:static lg:inset-0 ${isDesktopSidebarExpanded ? 'lg:w-72' : 'lg:w-20'}
        `}
      >
        <div className={`flex items-center ${isDesktopSidebarExpanded ? 'justify-between px-6' : 'justify-center px-2'} h-20 border-b border-red-900/30 shrink-0`}>
          <Link to="/admin" className="flex items-center gap-3 overflow-hidden">
            <img 
              src={storeSettings?.logo || storeSettings?.companyLogo || "https://res.cloudinary.com/vf0fqhwo/image/upload/v1786363324/logo_q7lezq.jpg"} 
              alt={storeSettings?.companyName || "Karuppa Crackers"} 
              className="w-10 h-10 rounded-xl object-contain border border-amber-400/40 shadow-sm shrink-0 bg-white" 
            />
            <span className={`font-serif font-extrabold text-white text-xl tracking-tight whitespace-nowrap transition-opacity duration-300 ${!isDesktopSidebarExpanded ? 'lg:hidden' : 'block'}`}>
              {storeSettings?.companyName || 'Karuppa Crackers'}
            </span>
          </Link>
          
          {/* Mobile Close Button */}
          <button 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden text-red-200 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
          
          {/* Desktop Collapse Toggle */}
          <button 
            onClick={() => setIsDesktopSidebarExpanded(!isDesktopSidebarExpanded)}
            className="hidden lg:flex absolute -right-4 top-6 w-8 h-8 bg-white border border-gray-100 shadow-md rounded-full items-center justify-center text-[#c00000] hover:text-[#8B1E1E] hover:scale-110 transition-all z-10"
          >
            {isDesktopSidebarExpanded ? <ChevronLeft size={18} strokeWidth={3} /> : <ChevronRight size={18} strokeWidth={3} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileSidebarOpen(false)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                  isActive 
                    ? 'bg-[#FFD700]/15 text-[#FFD700] font-black backdrop-blur-sm border border-[#FFD700]/30 shadow-md' 
                    : 'text-red-100/80 hover:bg-white/10 hover:text-white font-bold'
                }`}
                title={!isDesktopSidebarExpanded ? item.name : ""}
              >
                <div className={`${isActive ? 'text-[#FFD700]' : 'text-red-200 group-hover:text-white'} transition-colors shrink-0`}>
                  {item.icon}
                </div>
                <span className={`font-bold whitespace-nowrap transition-opacity duration-300 ${!isDesktopSidebarExpanded ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'}`}>
                  {item.name}
                </span>
                
                {/* Active Indicator dot for collapsed view */}
                {isActive && !isDesktopSidebarExpanded && (
                  <div className="hidden lg:block absolute right-2 w-2 h-2 rounded-full bg-[#FFD700]"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Distinctive User / Logout Section */}
        <div className="p-4 border-t border-red-900/40 shrink-0 bg-black/10">
          <button 
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className={`flex items-center ${isDesktopSidebarExpanded ? 'gap-3.5 px-4 py-3' : 'justify-center p-3'} rounded-2xl transition-all duration-300 w-full group overflow-hidden cursor-pointer bg-gradient-to-r from-rose-950/80 via-red-950/90 to-rose-950/80 hover:from-rose-700 hover:to-red-800 border-2 border-rose-500/30 hover:border-rose-400 text-rose-200 hover:text-white shadow-sm hover:shadow-[0_4px_18px_rgba(225,29,72,0.4)] hover:scale-[1.02] active:scale-[0.98]`}
            title={!isDesktopSidebarExpanded ? "Logout / Sign Out" : ""}
          >
            <div className="shrink-0 text-rose-400 group-hover:text-white group-hover:rotate-12 transition-transform duration-300">
              <LogOut size={20} strokeWidth={2.5} />
            </div>
            <span className={`font-black uppercase text-xs tracking-wider whitespace-nowrap transition-opacity duration-300 ${!isDesktopSidebarExpanded ? 'lg:hidden' : 'block'}`}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 h-full overflow-hidden">
        {/* Top Header - Matches Sidebar Color */}
        <header className="h-20 bg-gradient-to-r from-[#4A0E0E] to-[#330909] border-b border-red-950/40 flex items-center justify-between px-6 lg:px-10 z-10 shrink-0 shadow-md">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden text-red-200 hover:text-white p-2 bg-red-950/40 rounded-xl cursor-pointer"
            >
              <Menu size={22} />
            </button>
            <h2 className="text-xl font-serif font-black text-white tracking-wide">
              Admin Portal
            </h2>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Fullscreen Toggle Navbar Button (Icon on Mobile, Icon + Label on Desktop) */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className={`p-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 shadow-sm border-2 cursor-pointer ${
                isFullscreenPos
                  ? 'bg-[#FFD700] text-[#4A0E0E] border-amber-300 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 border-white/20 text-white hover:border-amber-300'
              }`}
              title={isFullscreenPos ? "Exit Full Screen Mode" : "Full Screen Mode"}
            >
              {isFullscreenPos ? (
                <>
                  <Minimize2 size={16} className="text-[#4A0E0E] stroke-[2.5]" />
                  <span className="hidden sm:inline">Exit Full Screen</span>
                </>
              ) : (
                <>
                  <Maximize2 size={16} className="text-[#FFD700] stroke-[2.5]" />
                  <span className="hidden sm:inline">Full Screen</span>
                </>
              )}
            </button>

            {/* Top Navbar Logout Action Button (Desktop / Tablet only, in mobile it's accessible via Sidebar) */}
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="hidden sm:flex px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black transition-all items-center gap-1.5 shadow-sm border-2 bg-red-950/60 hover:bg-red-900 border-red-800/40 text-red-200 hover:text-white cursor-pointer"
              title="Sign Out of Admin Portal"
            >
              <LogOut size={16} className="text-red-300 stroke-[2.5]" />
              <span className="hidden md:inline">Logout</span>
            </button>

            <div className="flex items-center gap-3 sm:gap-4 pl-1 sm:border-l sm:border-red-900/40">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white leading-tight">
                  {currentUser?.displayName || 'Mahesh Admin'}
                </p>
                <p className="text-[11px] font-medium text-red-200">
                  {currentUser?.email || 'admin@karuppacrackers.com'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FFD700] to-amber-500 flex items-center justify-center text-[#4A0E0E] font-black text-base shadow-sm">
                {(currentUser?.email?.charAt(0) || 'M').toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Body Canvas */}
        <main ref={mainRef} className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F4F1EA]">
          <Outlet context={{ isDesktopSidebarExpanded, isFullscreenPos, toggleFullscreen }} />
        </main>
      </div>
      
      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Floating Scroll to Top Action Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-gradient-to-tr from-[#4A0E0E] to-[#701515] text-[#FFD700] rounded-2xl shadow-[0_8px_25px_rgba(74,14,14,0.4)] border-2 border-amber-400/50 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_30px_rgba(74,14,14,0.6)] group animate-in fade-in slide-in-from-bottom-4"
          title="Scroll to Top"
        >
          <ChevronUp size={24} strokeWidth={3} className="group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-amber-900/20 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 text-[#4A0E0E] flex items-center justify-center font-black">
              <LogOut size={26} />
            </div>
            
            <div>
              <h3 className="text-lg font-serif font-black text-gray-900">Confirm Admin Logout</h3>
              <p className="text-xs font-bold text-gray-600 mt-1 leading-relaxed">
                Are you sure you want to end your current session and sign out from Karuppa Crackers Admin Control Panel?
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="flex-1 py-3 bg-[#4A0E0E] hover:bg-[#3B0B0B] text-[#FFD700] rounded-xl font-black text-xs shadow-md transition-all cursor-pointer"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
