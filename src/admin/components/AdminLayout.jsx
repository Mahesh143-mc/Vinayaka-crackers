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
  Box,
  Users,
  Bell,
  TrendingUp,
  DollarSign,
  Globe
} from 'lucide-react';
import { useState } from 'react';

const AdminLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarExpanded, setIsDesktopSidebarExpanded] = useState(true);
  const location = useLocation();

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
            <span className="text-2xl drop-shadow-md">🪔</span>
            <span className="font-serif font-extrabold text-white text-xl tracking-tight whitespace-nowrap">
              Chimera Admin
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
                <p className="text-[11px] font-medium text-red-200">admin@chimera.com</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FFD700] to-amber-500 flex items-center justify-center text-[#4A0E0E] font-black text-base shadow-sm">
                M
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Body Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F4F1EA]">
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
    </div>
  );
};

export default AdminLayout;
