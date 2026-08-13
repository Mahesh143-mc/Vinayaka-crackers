import { Outlet, Link, useLocation } from 'react-router-dom';
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
  Globe
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const AdminLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarExpanded, setIsDesktopSidebarExpanded] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isOrdersSubmenuOpen, setIsOrdersSubmenuOpen] = useState(true);
  const location = useLocation();
  const mainRef = useRef(null);

  // Auto-close orders submenu when navigating away from orders section
  useEffect(() => {
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
    { name: 'Products', path: '/admin/products', icon: <Box size={22} /> },
    { name: 'Inventory', path: '/admin/inventory', icon: <Package size={22} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart size={22} /> },
    { name: 'Billing / POS', path: '/admin/billing', icon: <FileText size={22} /> },
    { name: 'Reports & Analytics', path: '/admin/reports', icon: <TrendingUp size={22} /> },
    { name: 'Expenses Tracker', path: '/admin/expenses', icon: <DollarSign size={22} /> },
    { name: 'Website Management', path: '/admin/website', icon: <Globe size={22} /> },
    { name: 'Customers', path: '/admin/customers', icon: <Users size={22} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={22} /> },
  ];

  const orderSubItems = [
    { name: 'All Orders', path: '/admin/orders?status=All', status: 'All' },
    { name: 'Complete Orders', path: '/admin/orders?status=Delivered', status: 'Delivered' },
    { name: 'Pending Orders', path: '/admin/orders?status=Pending', status: 'Pending' },
    { name: 'Processing Orders', path: '/admin/orders?status=Processing', status: 'Processing' },
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
        <div className="flex items-center justify-between h-20 px-6 border-b border-red-900/30 shrink-0">
          <Link to="/admin" className={`flex items-center gap-3 overflow-hidden ${!isDesktopSidebarExpanded && 'lg:hidden'}`}>
            <img 
              src="https://res.cloudinary.com/vf0fqhwo/image/upload/v1786363324/logo_q7lezq.jpg" 
              alt="Karuppa Crackers Logo" 
              className="w-9 h-9 rounded-xl object-contain border border-amber-400/40 shadow-sm shrink-0" 
            />
            <span className="font-serif font-extrabold text-white text-xl tracking-tight whitespace-nowrap">
              Karuppa Admin
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
            
            if (item.name === 'Orders') {
              return (
                <div key={item.name} className="space-y-1">
                  <Link
                    to={item.path}
                    onClick={() => setIsOrdersSubmenuOpen(!isOrdersSubmenuOpen)}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group relative cursor-pointer select-none ${
                      isActive 
                        ? 'bg-[#FFD700]/15 text-[#FFD700] font-black backdrop-blur-sm border border-[#FFD700]/30 shadow-md' 
                        : 'text-red-100/80 hover:bg-white/10 hover:text-white font-bold'
                    }`}
                    title={!isDesktopSidebarExpanded ? item.name : ""}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`${isActive ? 'text-[#FFD700]' : 'text-red-200 group-hover:text-white'} transition-colors shrink-0`}>
                        {item.icon}
                      </div>
                      <span className={`font-bold whitespace-nowrap transition-opacity duration-300 ${!isDesktopSidebarExpanded ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'}`}>
                        {item.name}
                      </span>
                    </div>

                    {/* Arrow Indicator */}
                    {isDesktopSidebarExpanded && (
                      <div className="p-1 text-amber-300 group-hover:text-white transition-colors shrink-0">
                        {isOrdersSubmenuOpen ? <ChevronUp size={18} strokeWidth={2.5} /> : <ChevronDown size={18} strokeWidth={2.5} />}
                      </div>
                    )}
                  </Link>

                  {/* Render 4 Submenus when Orders is open */}
                  {isOrdersSubmenuOpen && isDesktopSidebarExpanded && (
                    <div className="ml-7 pl-3 border-l-2 border-amber-400/30 my-1 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                      {orderSubItems.map((sub) => {
                        const currentSearchParams = new URLSearchParams(location.search);
                        const activeStatusParam = currentSearchParams.get('status') || 'All';
                        const isSubActive = location.pathname.startsWith('/admin/orders') && 
                          (activeStatusParam.toLowerCase() === sub.status.toLowerCase() || 
                           (sub.status === 'Delivered' && (activeStatusParam.toLowerCase() === 'complete' || activeStatusParam.toLowerCase() === 'completed')));

                        return (
                          <Link
                            key={sub.name}
                            to={sub.path}
                            onClick={() => setIsOrdersSubmenuOpen(false)}
                            className={`block px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                              isSubActive
                                ? 'bg-[#FFD700]/20 text-[#FFD700] font-black border border-[#FFD700]/40 shadow-sm backdrop-blur-md'
                                : 'text-amber-200/90 hover:bg-white/10 hover:text-white font-bold'
                            }`}
                          >
                            {sub.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                to={item.path}
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

        {/* User / Logout Section */}
        <div className="p-4 border-t border-red-900/30 shrink-0">
          <button className={`flex items-center gap-4 px-4 py-3 text-red-200 hover:text-white hover:bg-black/20 rounded-2xl transition-all duration-300 w-full group overflow-hidden`}
                  title={!isDesktopSidebarExpanded ? "Logout" : ""}>
            <div className="shrink-0 group-hover:rotate-12 transition-transform">
              <LogOut size={22} />
            </div>
            <span className={`font-bold whitespace-nowrap ${!isDesktopSidebarExpanded ? 'lg:opacity-0 lg:w-0 lg:hidden' : 'opacity-100'}`}>Logout</span>
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
              className="lg:hidden text-red-200 hover:text-white p-2 bg-red-950/40 rounded-xl"
            >
              <Menu size={22} />
            </button>
            <h2 className="text-xl font-serif font-black text-white tracking-wide">
              Admin Portal
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-red-200 hover:text-white transition-colors bg-red-950/40 rounded-xl">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FFD700] rounded-full animate-pulse"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-red-900/40">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white leading-tight">Mahesh Admin</p>
                <p className="text-[11px] font-medium text-red-200">admin@karuppacrackers.com</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FFD700] to-amber-500 flex items-center justify-center text-[#4A0E0E] font-black text-base shadow-sm">
                M
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Body Canvas */}
        <main ref={mainRef} className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F4F1EA]">
          <Outlet context={{ isDesktopSidebarExpanded }} />
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
    </div>
  );
};

export default AdminLayout;
