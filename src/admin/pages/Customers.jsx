import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MessageCircle, Calendar, Users, Send, X, ShoppingBag, Phone, MapPin, Award, CheckCircle2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus, UserPlus, ChevronDown, Check, Filter, Loader2 } from 'lucide-react';
import { subscribeCustomers, subscribeOrders, saveCustomerToFirestore } from '../../services/firebaseService';
import { useToast } from '../../context/ToastContext';
import { generateCustomerId } from '../../utils/idGenerator';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminCustomers = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [customers, setCustomers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    location: 'Sivakasi, Tamil Nadu',
    status: 'Regular'
  });
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTypeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const [firestoreCusts, setFirestoreCusts] = useState([]);
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    const unsubCust = subscribeCustomers((custs) => setFirestoreCusts(custs || []));
    const unsubOrd = subscribeOrders((ords) => {
      setAllOrders(ords || []);
      setIsLoading(false);
    });
    return () => {
      unsubCust();
      unsubOrd();
    };
  }, []);

  const parseSafeDate = (val) => {
    if (!val) return 'Recently';
    if (typeof val === 'object' && val.seconds) {
      return new Date(val.seconds * 1000).toLocaleDateString('en-IN');
    }
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-IN');
    }
    return String(val);
  };

  const getOrderAmount = (o) => {
    if (typeof o.grandTotal === 'number') return o.grandTotal;
    if (typeof o.totalAmount === 'number') return o.totalAmount;
    if (typeof o.amount === 'number') return o.amount;
    if (typeof o.total === 'number') return o.total;
    const str = String(o.grandTotal || o.totalAmount || o.amount || o.total || 0);
    return parseFloat(str.replace(/[^\d.]/g, '')) || 0;
  };

  useEffect(() => {
    const customerMap = new Map();

    // 1. Process all real orders from Firestore (both POS and Online Website)
    (allOrders || []).forEach((o) => {
      const rawPhone = String(o.phone || o.whatsapp || o.customerPhone || '').trim();
      const phoneDigits = rawPhone.replace(/[^\d]/g, '');
      const rawName = String(o.customer || o.customerName || '').trim();
      
      // Unique key: phone digits (if valid) or lowercase name
      const key = phoneDigits.length >= 6 ? phoneDigits : (rawName ? rawName.toLowerCase() : null);
      if (!key) return;

      const orderAmt = getOrderAmount(o);
      const isPos = Boolean(o.isOffline);
      const orderDate = parseSafeDate(o.createdAt || o.date);

      if (!customerMap.has(key)) {
        let displayName = rawName || (phoneDigits ? `Customer (${rawPhone})` : 'Store Customer');
        if (displayName === 'Walk-in Customer' && rawPhone && rawPhone !== 'N/A') {
          displayName = `Walk-in (${rawPhone})`;
        }

        customerMap.set(key, {
          id: String(o.id || `CUST-${key.slice(-4)}`),
          name: displayName,
          phone: rawPhone || 'N/A',
          email: String(o.email || o.customerEmail || 'N/A'),
          location: String(o.address || o.shippingAddress || o.location || (isPos ? 'Sivakasi Outlet' : 'Tamil Nadu')),
          status: 'Regular',
          totalOrders: 1,
          totalSpent: orderAmt,
          lastActive: orderDate,
          channels: new Set([isPos ? 'POS Counter' : 'Website Order'])
        });
      } else {
        const existing = customerMap.get(key);
        existing.totalOrders += 1;
        existing.totalSpent += orderAmt;
        if (isPos) existing.channels.add('POS Counter');
        else existing.channels.add('Website Order');

        if (rawName && (existing.name.startsWith('Customer (') || existing.name === 'Store Customer' || existing.name === 'Walk-in Customer')) {
          existing.name = rawName;
        }
        if (rawPhone && existing.phone === 'N/A') {
          existing.phone = rawPhone;
        }
      }
    });

    // 2. Process all registered customers from Firestore 'customers' collection
    (firestoreCusts || []).forEach((c) => {
      const rawPhone = String(c.phone || '').trim();
      const phoneDigits = rawPhone.replace(/[^\d]/g, '');
      const rawName = String(c.name || c.customerName || '').trim();
      const key = phoneDigits.length >= 6 ? phoneDigits : (rawName ? rawName.toLowerCase() : String(c.id || '').trim());
      if (!key) return;

      const regDate = parseSafeDate(c.createdAt || c.lastActive);

      if (!customerMap.has(key)) {
        customerMap.set(key, {
          ...c,
          id: String(c.id || `CUST-${key.slice(-4)}`),
          name: rawName || 'Registered Customer',
          phone: rawPhone || 'N/A',
          email: c.email || 'N/A',
          location: c.location || c.address || 'Sivakasi, Tamil Nadu',
          status: c.status || 'Regular',
          totalOrders: Number(c.totalOrders || 0),
          totalSpent: Number(c.totalSpent || 0),
          lastActive: regDate,
          channels: new Set(['Registered Member'])
        });
      } else {
        const existing = customerMap.get(key);
        existing.id = String(c.id || existing.id);
        if (rawName && rawName !== 'Walk-in Customer') existing.name = rawName;
        if (c.email && c.email !== 'N/A') existing.email = c.email;
        if (c.location) existing.location = c.location;
        if (c.status) existing.status = c.status;
        existing.channels.add('Registered Member');
      }
    });

    // Convert to sorted list by totalSpent (highest spending customers first)
    const cleanList = Array.from(customerMap.values())
      .map((cust, idx) => ({
        ...cust,
        sno: idx + 1,
        channelLabel: Array.from(cust.channels || []).join(' & ') || 'Direct'
      }))
      .sort((a, b) => (Number(b.totalSpent) || 0) - (Number(a.totalSpent) || 0));

    setCustomers(cleanList);
  }, [firestoreCusts, allOrders]);

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.phone) return;

    setIsSaving(true);
    const customerId = generateCustomerId(customers);
    const payload = {
      id: customerId,
      sno: customers.length + 1,
      name: newCustomer.name,
      phone: newCustomer.phone,
      email: newCustomer.email || `${newCustomer.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      location: newCustomer.location || 'Sivakasi, Tamil Nadu',
      totalOrders: 0,
      totalSpent: 0,
      lastActive: new Date().toLocaleDateString('en-IN'),
      status: newCustomer.status || 'New',
      recentPurchases: []
    };

    try {
      await saveCustomerToFirestore(payload);
      setCustomers(prev => [payload, ...prev]);
      showToast(`🎉 Customer "${payload.name}" (${payload.id}) created and saved!`, 'success');
    } catch (err) {
      console.error("Error saving customer to Firestore:", err);
      showToast('Failed to save customer', 'error');
    } finally {
      setIsSaving(false);
      setShowAddModal(false);
      setNewCustomer({ name: '', phone: '', email: '', location: 'Sivakasi, Tamil Nadu', status: 'Regular' });
    }
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
            className="bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-[#4A0E0E] px-5 py-2.5 rounded-2xl font-black text-xs shadow-md flex items-center gap-2 transform hover:scale-105 transition-all cursor-pointer"
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

      {/* Customer Cards Grid / Loading State */}
      {isLoading ? (
        <LoadingSpinner message="Fetching customer records from database..." />
      ) : (
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
      )}

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

                <div ref={dropdownRef} className="relative">
                  <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Customer Type</label>
                  <button
                    type="button"
                    onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                    className="w-full p-3 bg-white border-2 border-amber-900/20 hover:border-[#4A0E0E] rounded-2xl font-black text-gray-900 text-xs shadow-sm transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span>{newCustomer.status || 'Regular'}</span>
                    <ChevronDown size={16} className={`text-[#4A0E0E] transition-transform stroke-[2.5] ${showTypeDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showTypeDropdown && (
                    <div className="absolute left-0 right-0 top-full mt-2 bg-white border-2 border-amber-900/20 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 space-y-1">
                      {['New', 'Regular', 'VIP', 'Wholesale'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            setNewCustomer({ ...newCustomer, status: type });
                            setShowTypeDropdown(false);
                          }}
                          className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-between ${
                            newCustomer.status === type
                              ? 'bg-[#4A0E0E] text-[#FFD700] shadow-md'
                              : 'text-gray-800 hover:bg-amber-100/60'
                          }`}
                        >
                          <span>{type}</span>
                          {newCustomer.status === type && <Check size={15} strokeWidth={3} />}
                        </button>
                      ))}
                    </div>
                  )}
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
                disabled={isSaving}
                className="py-3 bg-[#4A0E0E] hover:bg-red-950 disabled:opacity-60 text-white rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-[#FFD700]" /> Saving Customer...
                  </>
                ) : (
                  <>
                    <UserPlus size={16} /> Save Customer
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
