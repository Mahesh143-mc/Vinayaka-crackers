import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MessageCircle, Calendar, Users, Send, X, ShoppingBag, Phone, MapPin, Award, CheckCircle2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus, UserPlus } from 'lucide-react';
import { subscribeCustomers, subscribeOrders, saveCustomerToFirestore } from '../../services/firebaseService';

const AdminCustomers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    location: 'Sivakasi, Tamil Nadu',
    status: 'Regular'
  });

  const triggerSuccess = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const [firestoreCusts, setFirestoreCusts] = useState([]);
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    const unsubCust = subscribeCustomers((custs) => setFirestoreCusts(custs || []));
    const unsubOrd = subscribeOrders((ords) => setAllOrders(ords || []));
    return () => {
      unsubCust();
      unsubOrd();
    };
  }, []);

  useEffect(() => {
    const customerMap = new Map();

    firestoreCusts.forEach((c, idx) => {
      const key = String(c.phone || c.id).replace(/[^\d]/g, '') || c.id;
      customerMap.set(key, {
        ...c,
        id: String(c.id || key),
        name: c.name || c.customerName || 'Valued Customer',
        phone: c.phone || 'N/A',
        email: c.email || 'N/A',
        status: c.status || 'Regular',
        totalOrders: 0,
        totalSpent: 0,
        lastActive: c.lastActive || (c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : 'Recently')
      });
    });

    allOrders.forEach((o) => {
      const phoneClean = String(o.phone || '').replace(/[^\d]/g, '');
      const key = phoneClean || o.id;
      const orderAmount = typeof o.grandTotal === 'number' ? o.grandTotal : (typeof o.totalAmount === 'number' ? o.totalAmount : (parseFloat(String(o.amount || 0).replace(/[^\d.]/g, '')) || 0));

      if (customerMap.has(key)) {
        const existing = customerMap.get(key);
        existing.totalOrders += 1;
        existing.totalSpent += orderAmount;
      } else {
        customerMap.set(key, {
          id: key,
          name: o.customerName || o.customer || 'Valued Customer',
          phone: o.phone || 'N/A',
          email: o.email || 'N/A',
          status: orderAmount > 10000 ? 'VIP' : 'Regular',
          totalOrders: 1,
          totalSpent: orderAmount,
          lastActive: o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : 'Recently'
        });
      }
    });

    const combinedList = Array.from(customerMap.values()).map((c, idx) => ({
      ...c,
      sno: idx + 1
    }));

    setCustomers(combinedList);
  }, [firestoreCusts, allOrders]);

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.phone) return;

    const customerId = `CUST-${Math.floor(Math.random() * 900 + 100)}`;
    const payload = {
      id: customerId,
      sno: customers.length + 1,
      name: newCustomer.name,
      phone: newCustomer.phone,
      email: newCustomer.email || `${newCustomer.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      location: newCustomer.location || 'Sivakasi, Tamil Nadu',
      totalOrders: 0,
      totalSpent: 0,
      lastActive: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: newCustomer.status || 'New',
      recentPurchases: []
    };

    setCustomers([payload, ...customers]);
    try {
      await saveCustomerToFirestore(payload);
    } catch (err) {
      console.error("Error saving customer to Firestore:", err);
    }

    setShowAddModal(false);
    setNewCustomer({ name: '', phone: '', email: '', location: 'Sivakasi, Tamil Nadu', status: 'Regular' });
    triggerSuccess(`🎉 Customer "${payload.name}" created and saved to Firestore!`);
  };

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
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-6 right-6 z-[1000005] bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white font-black text-xs sm:text-sm px-5 py-3.5 rounded-2xl shadow-2xl border-2 border-amber-300 flex items-center gap-3 animate-in slide-in-from-top-5 duration-300">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} className="text-[#FFD700]" />
          </div>
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#4A0E0E] via-[#701515] to-[#4A0E0E] p-7 rounded-3xl shadow-lg text-white">
        <div>
          <h1 className="text-3xl font-serif font-black tracking-wide text-white flex items-center gap-2">
            <Users className="text-[#FFD700]" /> Customer CRM & Broadcasts
          </h1>
          <p className="text-amber-200/90 text-sm mt-1 font-medium">Manage buyer profiles, track festival spending, and launch WhatsApp offers.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-[#4A0E0E] px-5 py-2.5 rounded-2xl font-black text-xs shadow-md flex items-center gap-2 transform hover:scale-105 transition-all"
          >
            <UserPlus size={18} strokeWidth={2.5} /> Add New Customer
          </button>

          <a 
            href={`https://wa.me/?text=Hello!%20Check%20out%20special%20festive%20firecracker%20offers%20at%20Karuppa%20Crackers!`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#1ebd53] text-white px-5 py-2.5 rounded-2xl font-bold shadow-md flex items-center gap-2 text-xs"
          >
            <Send size={16} /> Send WhatsApp Broadcast
          </a>
        </div>
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
            onClick={() => navigate(`/admin/customers/${customer.id}`)}
            className="bg-[#FAF7F2] hover:bg-[#F3ECE0] rounded-3xl p-6 shadow-sm border-2 border-amber-900/15 hover:border-[#4A0E0E] flex flex-col justify-between transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-md group relative overflow-hidden"
          >
            <div>
              {/* Header: S.No Tag & Avatar */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4A0E0E] to-amber-700 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                    {(customer.name || 'C').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-base group-hover:text-[#4A0E0E] transition-colors">{customer.name || 'Valued Customer'}</h3>
                    <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      customer.status === 'VIP' ? 'bg-purple-100 text-purple-900 border border-purple-300' :
                      customer.status === 'Wholesale' ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                      customer.status === 'New' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                      'bg-gray-200 text-gray-800 border border-gray-300'
                    }`}>
                      {customer.status || 'Regular'}
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
                  <p className="font-black text-gray-900 text-base">{customer.totalOrders || 0}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-amber-950 uppercase tracking-wider">Total Spent</p>
                  <p className="font-black text-[#c00000] text-base">₹{(customer.totalSpent || 0).toLocaleString('en-IN')}</p>
                </div>
              </div>
              
              <button 
                onClick={(e) => { e.stopPropagation(); navigate(`/admin/customers/${customer.id}`); }}
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

      {/* Add New Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateCustomer} className="bg-[#FAF7F2] rounded-3xl max-w-lg w-full p-7 shadow-2xl border border-amber-900/30 space-y-5 animate-in fade-in zoom-in duration-200 relative">
            <button 
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-amber-200/80 hover:bg-amber-300 text-[#4A0E0E] flex items-center justify-center font-black"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 border-b border-amber-900/15 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4A0E0E] to-amber-700 flex items-center justify-center text-white font-black text-xl shadow-md">
                <UserPlus size={22} />
              </div>
              <div>
                <h3 className="text-xl font-serif font-black text-gray-900">Add New Customer Profile</h3>
                <p className="text-xs font-bold text-gray-500">Register new customer in Firebase CRM</p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Customer Full Name *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Senthil Kumar"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="w-full p-3 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Phone Number *</label>
                  <input 
                    type="text"
                    required
                    placeholder="+91 9876543210"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    className="w-full p-3 bg-white border-2 border-amber-900/20 rounded-2xl text-xs font-black text-gray-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Customer Type</label>
                  <select 
                    value={newCustomer.status}
                    onChange={(e) => setNewCustomer({ ...newCustomer, status: e.target.value })}
                    className="w-full p-3 bg-white border-2 border-amber-900/20 rounded-2xl text-xs font-black text-gray-900 focus:outline-none cursor-pointer"
                  >
                    <option value="New">New</option>
                    <option value="Regular">Regular</option>
                    <option value="VIP">VIP</option>
                    <option value="Wholesale">Wholesale</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Email Address</label>
                <input 
                  type="email"
                  placeholder="e.g. senthil@gmail.com"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="w-full p-3 bg-white border-2 border-amber-900/20 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Location / City</label>
                <input 
                  type="text"
                  placeholder="e.g. Sivakasi, Tamil Nadu"
                  value={newCustomer.location}
                  onChange={(e) => setNewCustomer({ ...newCustomer, location: e.target.value })}
                  className="w-full p-3 bg-white border-2 border-amber-900/20 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-amber-900/15">
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                className="py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-2xl text-xs font-black"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="py-3 bg-[#4A0E0E] hover:bg-red-950 text-white rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-2"
              >
                <UserPlus size={16} /> Save Customer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
