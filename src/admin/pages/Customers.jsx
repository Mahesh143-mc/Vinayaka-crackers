import { useState, useEffect } from 'react';
import { Search, MessageCircle, Calendar, Users, Send, X, ShoppingBag, Phone, MapPin, Award, CheckCircle2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const AdminCustomers = () => {
  const [customers] = useState([
    { id: 'CUST-001', sno: 1, name: 'Rahul Sharma', phone: '+91 9876543210', email: 'rahul.sharma@gmail.com', location: 'Sivakasi, Tamil Nadu', totalOrders: 5, totalSpent: 45500, lastActive: 'Oct 15, 2023', status: 'VIP', recentPurchases: [{ orderId: 'ORD-9842', date: 'Oct 15, 2023', items: '120 Shots Multi-color, Giant Sparklers', total: 12500 }] },
    { id: 'CUST-002', sno: 2, name: 'Priya Patel', phone: '+91 9123456789', email: 'priya.patel@gmail.com', location: 'Madurai, Tamil Nadu', totalOrders: 1, totalSpent: 8200, lastActive: 'Oct 15, 2023', status: 'New', recentPurchases: [{ orderId: 'ORD-8761', date: 'Oct 15, 2023', items: 'Flower Pots Mega, Sky Lanterns Pack', total: 8200 }] },
    { id: 'CUST-003', sno: 3, name: 'Vikram Singh', phone: '+91 9988776655', email: 'vikram.singh@gmail.com', location: 'Chennai, Tamil Nadu', totalOrders: 12, totalSpent: 122000, lastActive: 'Oct 14, 2023', status: 'Wholesale', recentPurchases: [{ orderId: 'ORD-9901', date: 'Oct 14, 2023', items: '7 Color Rockets (100pcs Bulk)', total: 45000 }] },
    { id: 'CUST-004', sno: 4, name: 'Arun Kumar', phone: '+91 9876512345', email: 'arun.kumar@gmail.com', location: 'Coimbatore, Tamil Nadu', totalOrders: 2, totalSpent: 15400, lastActive: 'Sep 10, 2023', status: 'Regular', recentPurchases: [{ orderId: 'ORD-7612', date: 'Sep 10, 2023', items: 'Electric Sparklers Gold (20pcs)', total: 9000 }] },
    { id: 'CUST-005', sno: 5, name: 'Kavitha Nathan', phone: '+91 9443322110', email: 'kavitha.n@gmail.com', location: 'Sivakasi, Tamil Nadu', totalOrders: 4, totalSpent: 28500, lastActive: 'Oct 13, 2023', status: 'VIP', recentPurchases: [{ orderId: 'ORD-8821', date: 'Oct 13, 2023', items: 'Whistling Rockets, Flower Pots', total: 12600 }] },
    { id: 'CUST-006', sno: 6, name: 'Senthil Raj', phone: '+91 9789012345', email: 'senthil.raj@yahoo.com', location: 'Tirunelveli, Tamil Nadu', totalOrders: 3, totalSpent: 19800, lastActive: 'Oct 12, 2023', status: 'Regular', recentPurchases: [{ orderId: 'ORD-8710', date: 'Oct 12, 2023', items: '7 Color Sky Rockets', total: 9800 }] },
    { id: 'CUST-007', sno: 7, name: 'Meena Sundaram', phone: '+91 9655443322', email: 'meena.s@gmail.com', location: 'Trichy, Tamil Nadu', totalOrders: 6, totalSpent: 54000, lastActive: 'Oct 12, 2023', status: 'VIP', recentPurchases: [{ orderId: 'ORD-8622', date: 'Oct 12, 2023', items: 'Chakra Ground Spinners', total: 18500 }] },
    { id: 'CUST-008', sno: 8, name: 'Ganesh Ram', phone: '+91 9543210987', email: 'ganesh.ram@outlook.com', location: 'Salem, Tamil Nadu', totalOrders: 1, totalSpent: 3400, lastActive: 'Oct 11, 2023', status: 'New', recentPurchases: [{ orderId: 'ORD-8511', date: 'Oct 11, 2023', items: 'Electric Sparklers', total: 3400 }] },
    { id: 'CUST-009', sno: 9, name: 'Anitha Ramesh', phone: '+91 9412345678', email: 'anitha.r@gmail.com', location: 'Coimbatore, Tamil Nadu', totalOrders: 4, totalSpent: 38000, lastActive: 'Oct 11, 2023', status: 'Regular', recentPurchases: [{ orderId: 'ORD-8411', date: 'Oct 11, 2023', items: 'Peacock Fountain Large', total: 15800 }] },
    { id: 'CUST-010', sno: 10, name: 'Karthik Subramanian', phone: '+91 9321098765', email: 'karthik.s@gmail.com', location: 'Chennai, Tamil Nadu', totalOrders: 15, totalSpent: 165000, lastActive: 'Oct 10, 2023', status: 'Wholesale', recentPurchases: [{ orderId: 'ORD-8302', date: 'Oct 10, 2023', items: '240 Shots Night Display', total: 27500 }] },
    { id: 'CUST-011', sno: 11, name: 'Deepak Varma', phone: '+91 9210987654', email: 'deepak.v@yahoo.com', location: 'Erode, Tamil Nadu', totalOrders: 2, totalSpent: 12500, lastActive: 'Oct 10, 2023', status: 'Regular', recentPurchases: [{ orderId: 'ORD-8201', date: 'Oct 10, 2023', items: 'Color Smoke Grenade', total: 6900 }] },
    { id: 'CUST-012', sno: 12, name: 'Sita Lakshmi', phone: '+91 9109876543', email: 'sita.l@gmail.com', location: 'Dindigul, Tamil Nadu', totalOrders: 1, totalSpent: 4800, lastActive: 'Oct 09, 2023', status: 'New', recentPurchases: [{ orderId: 'ORD-8105', date: 'Oct 09, 2023', items: 'Gold Twinkling Stars', total: 4800 }] },
    { id: 'CUST-013', sno: 13, name: 'Vijay Anand', phone: '+91 9098765432', email: 'vijay.a@gmail.com', location: 'Virudhunagar, Tamil Nadu', totalOrders: 8, totalSpent: 78000, lastActive: 'Oct 09, 2023', status: 'VIP', recentPurchases: [{ orderId: 'ORD-8010', date: 'Oct 09, 2023', items: 'Hydro Bomb High Sound', total: 19200 }] },
    { id: 'CUST-014', sno: 14, name: 'Pooja Hegde', phone: '+91 8987654321', email: 'pooja.h@gmail.com', location: 'Kanyakumari, Tamil Nadu', totalOrders: 3, totalSpent: 22400, lastActive: 'Oct 08, 2023', status: 'Regular', recentPurchases: [{ orderId: 'ORD-7911', date: 'Oct 08, 2023', items: 'Tri-Color Fountain Pot', total: 11400 }] },
    { id: 'CUST-015', sno: 15, name: 'Manoj Pillai', phone: '+91 8876543210', email: 'manoj.p@gmail.com', location: 'Thanjavur, Tamil Nadu', totalOrders: 2, totalSpent: 16800, lastActive: 'Oct 08, 2023', status: 'Regular', recentPurchases: [{ orderId: 'ORD-7812', date: 'Oct 08, 2023', items: 'Whistling Sky Rockets', total: 8600 }] },
    { id: 'CUST-016', sno: 16, name: 'Swati Krishnan', phone: '+91 8765432109', email: 'swati.k@gmail.com', location: 'Vellore, Tamil Nadu', totalOrders: 1, totalSpent: 5200, lastActive: 'Oct 07, 2023', status: 'New', recentPurchases: [{ orderId: 'ORD-7714', date: 'Oct 07, 2023', items: 'Red & Green Ground Wheel', total: 5200 }] },
    { id: 'CUST-017', sno: 17, name: 'Balaji Natarajan', phone: '+91 8654321098', email: 'balaji.n@gmail.com', location: 'Sivakasi, Tamil Nadu', totalOrders: 20, totalSpent: 210000, lastActive: 'Oct 07, 2023', status: 'Wholesale', recentPurchases: [{ orderId: 'ORD-7615', date: 'Oct 07, 2023', items: 'Diwali Deluxe Combo Pack', total: 35000 }] },
    { id: 'CUST-018', sno: 18, name: 'Divya Bharathi', phone: '+91 8543210987', email: 'divya.b@gmail.com', location: 'Karur, Tamil Nadu', totalOrders: 3, totalSpent: 18300, lastActive: 'Oct 06, 2023', status: 'Regular', recentPurchases: [{ orderId: 'ORD-7516', date: 'Oct 06, 2023', items: 'Silver Flash Sparklers', total: 7300 }] },
    { id: 'CUST-019', sno: 19, name: 'Harish Chandra', phone: '+91 8432109876', email: 'harish.c@gmail.com', location: 'Hosur, Tamil Nadu', totalOrders: 7, totalSpent: 89000, lastActive: 'Oct 06, 2023', status: 'VIP', recentPurchases: [{ orderId: 'ORD-7417', date: 'Oct 06, 2023', items: 'Garland 1000 Crackers', total: 22000 }] },
    { id: 'CUST-020', sno: 20, name: 'Lakshmi Narayan', phone: '+91 8321098765', email: 'lakshmi.n@gmail.com', location: 'Nagapattinam, Tamil Nadu', totalOrders: 2, totalSpent: 14500, lastActive: 'Oct 05, 2023', status: 'Regular', recentPurchases: [{ orderId: 'ORD-7318', date: 'Oct 05, 2023', items: '30 Shots Peacock Sky', total: 9500 }] },
    { id: 'CUST-021', sno: 21, name: 'Ramesh Babu', phone: '+91 8210987654', email: 'ramesh.b@gmail.com', location: 'Pudukkottai, Tamil Nadu', totalOrders: 5, totalSpent: 42000, lastActive: 'Oct 05, 2023', status: 'VIP', recentPurchases: [{ orderId: 'ORD-7219', date: 'Oct 05, 2023', items: 'Multi-Color Musical Fountain', total: 15600 }] },
    { id: 'CUST-022', sno: 22, name: 'Nandhini Devi', phone: '+91 8109876543', email: 'nandhini.d@gmail.com', location: 'Ramanathapuram, Tamil Nadu', totalOrders: 1, totalSpent: 4350, lastActive: 'Oct 04, 2023', status: 'New', recentPurchases: [{ orderId: 'ORD-7120', date: 'Oct 04, 2023', items: 'Crackling Sparklers (10pcs)', total: 4350 }] },
    { id: 'CUST-023', sno: 23, name: 'Srikant Acharya', phone: '+91 8098765432', email: 'srikant.a@gmail.com', location: 'Cuddalore, Tamil Nadu', totalOrders: 4, totalSpent: 36000, lastActive: 'Oct 04, 2023', status: 'Regular', recentPurchases: [{ orderId: 'ORD-7021', date: 'Oct 04, 2023', items: 'Mega Sky Thunder Bomb', total: 14400 }] },
    { id: 'CUST-024', sno: 24, name: 'Janaki Raman', phone: '+91 7987654321', email: 'janaki.r@gmail.com', location: 'Ooty, Tamil Nadu', totalOrders: 2, totalSpent: 12900, lastActive: 'Oct 03, 2023', status: 'Regular', recentPurchases: [{ orderId: 'ORD-6922', date: 'Oct 03, 2023', items: 'Kids Safe Crackers Box', total: 8900 }] },
    { id: 'CUST-025', sno: 25, name: 'Gokul Kannan', phone: '+91 7876543210', email: 'gokul.k@gmail.com', location: 'Kodaikanal, Tamil Nadu', totalOrders: 3, totalSpent: 29500, lastActive: 'Oct 03, 2023', status: 'VIP', recentPurchases: [{ orderId: 'ORD-6823', date: 'Oct 03, 2023', items: '120 Shots Multi-color', total: 16200 }] },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // 15 items per page pagination state
  const itemsPerPage = 15;
  const [currentPage, setCurrentPage] = useState(1);

  // Automatically scroll container and window to top whenever currentPage changes
  useEffect(() => {
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTop = 0;
      mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#4A0E0E] via-[#701515] to-[#4A0E0E] p-7 rounded-3xl shadow-lg text-white">
        <div>
          <h1 className="text-3xl font-serif font-black tracking-wide text-white flex items-center gap-2">
            <Users className="text-[#FFD700]" /> Customer CRM & Broadcasts
          </h1>
          <p className="text-amber-200/90 text-sm mt-1 font-medium">Manage buyer profiles, track festival spending, and launch WhatsApp offers.</p>
        </div>
        <a 
          href={`https://wa.me/?text=Hello!%20Check%20out%20special%20festive%20firecracker%20offers%20at%20Karuppa%20Crackers!`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] hover:bg-[#1ebd53] text-white px-5 py-2.5 rounded-2xl font-bold shadow-md flex items-center gap-2"
        >
          <Send size={18} /> Send WhatsApp Broadcast
        </a>
      </div>

      {/* Filter Bar & S.No Count Banner */}
      <div className="bg-[#EFEAE1] p-4 rounded-3xl border border-amber-900/10 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-800" size={19} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customers by name or phone..." 
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-amber-900/10 rounded-2xl focus:outline-none text-sm font-bold text-gray-800"
          />
        </div>

        {/* Total Customer S.No Counter */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-amber-900/10 shadow-sm">
          <Award size={18} className="text-[#4A0E0E]" />
          <span className="text-xs font-black text-gray-900">Total Registered Customers:</span>
          <span className="bg-[#FFD700] text-[#4A0E0E] font-black text-xs px-2.5 py-0.5 rounded-full border border-amber-400">
            {filteredCustomers.length} Total
          </span>
        </div>
      </div>

      {/* Customer Cards Grid with Smooth Hover BG Color Transition & S.No Tags */}
      <div key={currentPage} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
        {paginatedCustomers.map((customer) => (
          <div 
            key={customer.id} 
            onClick={() => setSelectedCustomer(customer)}
            className="bg-[#FAF7F2] hover:bg-[#F3ECE0] rounded-3xl p-6 shadow-sm border-2 border-amber-900/15 hover:border-[#4A0E0E] flex flex-col justify-between transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-md group relative overflow-hidden"
          >
            <div>
              {/* Header: S.No Tag & Avatar */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4A0E0E] to-amber-700 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-base group-hover:text-[#4A0E0E] transition-colors">{customer.name}</h3>
                    <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      customer.status === 'VIP' ? 'bg-purple-100 text-purple-900 border border-purple-300' :
                      customer.status === 'Wholesale' ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                      customer.status === 'New' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                      'bg-gray-200 text-gray-800 border border-gray-300'
                    }`}>
                      {customer.status}
                    </span>
                  </div>
                </div>

                {/* S.No Badge */}
                <span className="text-xs font-black text-[#4A0E0E] bg-[#FFD700] px-2.5 py-1 rounded-full border border-amber-400 shadow-sm shrink-0">
                  S.No #{customer.sno}
                </span>
              </div>

              {/* Phone & Last Active Info */}
              <div className="space-y-2.5 my-4 bg-white/70 group-hover:bg-white p-3 rounded-2xl border border-amber-900/10 text-xs transition-colors">
                <div className="flex items-center gap-2 text-gray-800 font-bold">
                  <MessageCircle size={14} className="text-emerald-700" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 font-medium">
                  <Calendar size={14} className="text-amber-800" />
                  <span>Last Order: {customer.lastActive}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="pt-3 border-t border-amber-900/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-amber-950 uppercase tracking-wider">Orders</p>
                  <p className="font-black text-gray-900 text-base">{customer.totalOrders}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-amber-950 uppercase tracking-wider">Total Spent</p>
                  <p className="font-black text-[#c00000] text-base">₹{customer.totalSpent.toLocaleString()}</p>
                </div>
              </div>
              
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedCustomer(customer); }}
                className="w-full mt-4 py-2.5 bg-[#4A0E0E] text-white group-hover:bg-red-950 rounded-xl text-xs font-black transition-colors shadow-md flex items-center justify-center gap-1.5"
              >
                View Customer Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 15-Item Pagination Controls Bar */}
      <div className="p-4 bg-[#FAF7F2] rounded-3xl border border-amber-900/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="text-xs font-bold text-gray-700">
          Showing <span className="font-black text-[#4A0E0E]">{filteredCustomers.length > 0 ? startIndex + 1 : 0}</span> to <span className="font-black text-[#4A0E0E]">{Math.min(startIndex + itemsPerPage, filteredCustomers.length)}</span> of <span className="font-black text-[#4A0E0E]">{filteredCustomers.length}</span> customers
        </div>

        <div className="flex items-center gap-1">
          {/* First Page << */}
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="p-2 rounded-xl text-xs font-black bg-white border border-amber-900/15 text-gray-700 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center"
            title="First Page"
          >
            <ChevronsLeft size={16} strokeWidth={2.5} />
          </button>

          {/* Previous Page < */}
          <button
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl text-xs font-black bg-white border border-amber-900/15 text-gray-700 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center"
            title="Previous Page"
          >
            <ChevronLeft size={16} strokeWidth={2.5} />
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-8 h-8 rounded-xl text-xs font-black transition-all border shadow-sm ${
                currentPage === page
                  ? 'bg-[#4A0E0E] text-white border-[#4A0E0E]'
                  : 'bg-white text-gray-800 border-amber-900/15 hover:bg-amber-100'
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next Page > */}
          <button
            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl text-xs font-black bg-white border border-amber-900/15 text-gray-700 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center"
            title="Next Page"
          >
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>

          {/* Last Page >> */}
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl text-xs font-black bg-white border border-amber-900/15 text-gray-700 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center"
            title="Last Page"
          >
            <ChevronsRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* CUSTOMER PROFILE MODAL POPUP (Opens on same page!) */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-amber-900/30 relative space-y-6 animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-amber-200/80 hover:bg-amber-300 text-[#4A0E0E] flex items-center justify-center font-black transition-colors"
            >
              <X size={20} />
            </button>

            {/* Profile Header */}
            <div className="flex items-center gap-4 border-b border-amber-900/15 pb-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#4A0E0E] to-amber-700 flex items-center justify-center text-white font-black text-3xl shadow-md">
                {selectedCustomer.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-serif font-black text-gray-900">{selectedCustomer.name}</h2>
                  <span className="text-xs font-black text-[#4A0E0E] bg-[#FFD700] px-2.5 py-0.5 rounded-full border border-amber-400">
                    S.No #{selectedCustomer.sno}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-gray-600">{selectedCustomer.id}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-xs font-black text-purple-900 bg-purple-100 px-2 py-0.5 rounded-full">
                    {selectedCustomer.status} Customer
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs font-bold">
              <div className="p-3 bg-white rounded-2xl border border-amber-900/10 flex items-center gap-2.5">
                <Phone size={16} className="text-emerald-700 shrink-0" />
                <div className="truncate">
                  <p className="text-[10px] text-gray-500 font-bold">Phone Number</p>
                  <p className="text-gray-900 font-black truncate">{selectedCustomer.phone}</p>
                </div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-amber-900/10 flex items-center gap-2.5">
                <MapPin size={16} className="text-rose-700 shrink-0" />
                <div className="truncate">
                  <p className="text-[10px] text-gray-500 font-bold">Location</p>
                  <p className="text-gray-900 font-black truncate">{selectedCustomer.location}</p>
                </div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-amber-900/10 flex items-center gap-2.5">
                <ShoppingBag size={16} className="text-[#4A0E0E] shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-500 font-bold">Total Orders</p>
                  <p className="text-gray-900 font-black">{selectedCustomer.totalOrders} Orders</p>
                </div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-amber-900/10 flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-500 font-bold">Total Spent</p>
                  <p className="text-[#c00000] font-black">₹{selectedCustomer.totalSpent.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Recent Purchase History */}
            <div className="space-y-2">
              <p className="text-xs font-black uppercase text-amber-950 tracking-wider">Recent Orders History:</p>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {selectedCustomer.recentPurchases.map((purchase) => (
                  <div key={purchase.orderId} className="bg-white p-3 rounded-2xl border border-amber-900/10 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-black text-gray-900">{purchase.orderId}</span>
                      <span className="text-[10px] text-gray-500 ml-2">{purchase.date}</span>
                      <p className="text-[11px] text-gray-600 font-medium line-clamp-1 mt-0.5">{purchase.items}</p>
                    </div>
                    <span className="font-black text-[#c00000] shrink-0">₹{purchase.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Row */}
            <div className="pt-2 flex gap-3">
              <a 
                href={`https://wa.me/91${selectedCustomer.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedCustomer.name)},%20thank%20you%20for%20shopping%20with%20Karuppa%20Crackers!`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-[#25D366] hover:bg-[#1ebd53] text-white rounded-2xl font-black text-xs shadow-md flex items-center justify-center gap-2 text-center"
              >
                <Send size={16} /> Send WhatsApp Message
              </a>

              <button 
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-2xl font-black text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
