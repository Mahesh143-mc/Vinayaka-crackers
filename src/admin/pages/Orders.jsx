import { useState, useEffect, useRef } from 'react';
import { Search, Eye, Phone, MessageCircle, Clock, Truck, PackageCheck, Check, ChevronDown, AlertCircle, CheckCircle, CheckCircle2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter, Loader2, ShoppingBag, MapPin, FileText, XCircle, Edit3 } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { subscribeOrders, updateOrderStatusInFirestore, deleteOrderFromFirestore } from '../../services/firebaseService';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminOrders = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlStatus = searchParams.get('status');

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(urlStatus || 'All');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [confirmConfig, setConfirmConfig] = useState(null);

  // Pagination state
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Subscribe to real-time orders from Firestore
  useEffect(() => {
    const unsubscribe = subscribeOrders((firestoreOrders) => {
      const normalized = (firestoreOrders || [])
        // STRICTLY FILTER FOR ONLINE WEBSITE ORDERS ONLY
        .filter(o => {
          const rawId = String(o.id || o.orderId || '').toUpperCase();
          const customerStr = String(o.customer || o.customerName || '').toLowerCase();
          const paymentModeStr = String(o.paymentMode || '').toLowerCase();
          const orderTypeStr = String(o.orderType || '').toLowerCase();

          const isOfflineOrder = 
            rawId.includes('POS') || 
            paymentModeStr.includes('counter') || 
            paymentModeStr.includes('cash') || 
            customerStr.includes('walk-in') || 
            orderTypeStr === 'offline' || 
            o.isOffline === true;

          return !isOfflineOrder;
        })
        .map(o => {
          const rawAmount = o.totalAmount !== undefined ? o.totalAmount : (o.grandTotal !== undefined ? o.grandTotal : o.amount);
          const amountNum = typeof rawAmount === 'number' ? rawAmount : parseFloat(String(rawAmount || 0).replace(/[^\d.]/g, '')) || 0;
          const rawItems = Array.isArray(o.items) ? o.items : [];
          const itemsCount = o.itemsCount || (rawItems.length > 0 ? rawItems.reduce((sum, item) => sum + (item.quantity || item.qty || 1), 0) : 0);

          let dateStr = 'Today';
          const rawDate = o.createdAt || o.updatedAt || o.date;
          if (rawDate) {
            if (typeof rawDate?.toDate === 'function') {
              dateStr = rawDate.toDate().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
            } else if (typeof rawDate === 'object' && rawDate?.seconds) {
              dateStr = new Date(rawDate.seconds * 1000).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
            } else {
              const parsed = new Date(rawDate);
              dateStr = !isNaN(parsed.getTime()) ? parsed.toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
            }
          }

          return {
            ...o,
            id: String(o.id || o.orderId || `KC-ORD-${Math.floor(Math.random() * 9000 + 1000)}`),
            customer: o.customerName || o.customer || 'Valued Customer',
            phone: o.phone || o.whatsapp || 'N/A',
            whatsapp: o.whatsapp || o.phone || '',
            address: o.address || 'Address not provided',
            amount: amountNum,
            items: rawItems,
            itemsCount: itemsCount,
            date: dateStr,
            status: o.status || 'Pending',
            isOffline: false
          };
        });

      setOrders(normalized);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (urlStatus) {
      setStatusFilter(urlStatus);
    }
  }, [urlStatus]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      // Optimistic update
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      await updateOrderStatusInFirestore(orderId, newStatus);
      showToast(`Order #${orderId} status changed to "${newStatus}"!`, 'success');
    } catch (err) {
      console.error("Status update error:", err);
      showToast("Failed to update status in database.", "error");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Filter orders by status & search query
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery) ||
      o.address.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'All') return true;
    if (statusFilter === 'Website') return !o.isOffline;
    if (statusFilter === 'Offline') return o.isOffline;
    return o.status === statusFilter;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Pending': 
        return { badge: 'bg-amber-100 text-amber-900 border-amber-300', icon: <Clock size={14} /> };
      case 'Accepted': 
        return { badge: 'bg-blue-100 text-blue-900 border-blue-300', icon: <CheckCircle size={14} /> };
      case 'Processing': 
        return { badge: 'bg-purple-100 text-purple-900 border-purple-300', icon: <Loader2 size={14} className="animate-spin" /> };
      case 'Shipped': 
        return { badge: 'bg-indigo-100 text-indigo-900 border-indigo-300', icon: <Truck size={14} /> };
      case 'Delivered': 
        return { badge: 'bg-emerald-100 text-emerald-900 border-emerald-300', icon: <PackageCheck size={14} /> };
      case 'Cancelled': 
        return { badge: 'bg-rose-100 text-rose-900 border-rose-300', icon: <XCircle size={14} /> };
      default: 
        return { badge: 'bg-gray-100 text-gray-900 border-gray-300', icon: <Clock size={14} /> };
    }
  };

  const getWhatsAppLink = (order) => {
    const cleanPhone = String(order.whatsapp || order.phone).replace(/[^\d]/g, '');
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const msg = `Hello ${order.customer}, your Karuppa Crackers Order #${order.id} status has been updated to "${order.status}". Total: ₹${order.amount.toLocaleString('en-IN')}. Thank you!`;
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 relative">

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#4A0E0E] via-[#5C1212] to-[#3B0B0B] p-6 sm:p-8 rounded-3xl shadow-lg text-white">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-wide text-white flex items-center gap-3">
            <ShoppingBag className="text-[#FFD700]" size={30} /> Website Customer Orders
          </h1>
          <p className="text-amber-200/90 text-xs sm:text-sm mt-1 font-medium">Manage incoming website orders, accept orders, update delivery process status, and contact customers via WhatsApp.</p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { key: 'All', label: 'All Orders', count: orders.length },
          { key: 'Pending', label: 'Pending', count: orders.filter(o => o.status === 'Pending').length, color: 'bg-amber-500' },
          { key: 'Accepted', label: 'Accepted', count: orders.filter(o => o.status === 'Accepted').length, color: 'bg-blue-500' },
          { key: 'Processing', label: 'Processing', count: orders.filter(o => o.status === 'Processing').length, color: 'bg-purple-500' },
          { key: 'Shipped', label: 'Shipped', count: orders.filter(o => o.status === 'Shipped').length, color: 'bg-indigo-500' },
          { key: 'Delivered', label: 'Delivered', count: orders.filter(o => o.status === 'Delivered').length, color: 'bg-emerald-500' },
          { key: 'Cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'Cancelled').length, color: 'bg-rose-500' }
        ].map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => {
              setStatusFilter(tab.key);
              setSearchParams({ status: tab.key });
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all flex items-center gap-2 shrink-0 border-2 cursor-pointer ${
              statusFilter === tab.key
                ? 'bg-[#4A0E0E] text-[#FFD700] border-[#FFD700] shadow-md scale-105'
                : 'bg-white border-amber-900/15 text-gray-800 hover:border-[#4A0E0E]'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
              statusFilter === tab.key ? 'bg-[#FFD700] text-[#4A0E0E]' : 'bg-gray-100 text-gray-800'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="bg-[#EFEAE1] p-4 rounded-3xl border border-amber-900/10 shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-800" size={19} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, Customer Name, Phone, or Delivery Address..." 
            className="w-full pl-11 pr-4 py-3 bg-white border-2 border-amber-900/20 rounded-2xl focus:outline-none focus:border-[#4A0E0E] text-xs sm:text-sm font-black text-gray-900 shadow-sm"
          />
        </div>
      </div>

      {/* Orders Cards List / Loading State */}
      {isLoading ? (
        <LoadingSpinner message="Fetching online orders from database..." />
      ) : (
        <div className="space-y-4">
          {paginatedOrders.length > 0 ? (
          paginatedOrders.map(order => {
            const statusStyle = getStatusStyle(order.status);
            const isUpdatingThis = updatingOrderId === order.id;

            return (
              <div 
                key={order.id}
                className="bg-[#FAF7F2] p-5 sm:p-6 rounded-3xl border-2 border-amber-900/15 shadow-sm hover:shadow-md transition-all space-y-4 relative"
              >
                {/* Card Top Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-900/10 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-[#4A0E0E]">{order.id}</span>
                    <span className="text-xs font-bold text-gray-500">{order.date}</span>
                    {order.isOffline ? (
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[10px] font-black rounded-lg border border-amber-300 uppercase">POS Sales</span>
                    ) : (
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[10px] font-black rounded-lg border border-emerald-300 uppercase">Website Order</span>
                    )}
                  </div>

                  {/* Status Dropdown Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 hidden sm:inline">Change Process:</span>
                    <div className="relative">
                      <select
                        value={order.status}
                        disabled={isUpdatingThis}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`pl-3 pr-8 py-1.5 rounded-xl text-xs font-black border-2 cursor-pointer focus:outline-none transition-all appearance-none ${statusStyle.badge}`}
                      >
                        <option value="Pending">🟡 Pending</option>
                        <option value="Accepted">🔵 Accepted</option>
                        <option value="Processing">🟣 Processing</option>
                        <option value="Shipped">🟪 Shipped</option>
                        <option value="Delivered">🟢 Delivered</option>
                        <option value="Cancelled">🔴 Cancelled</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-current" />
                      {isUpdatingThis && (
                        <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center">
                          <Loader2 size={16} className="animate-spin text-[#4A0E0E]" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Customer Details & Items Summary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold text-gray-800">
                  {/* Column 1: Customer Details */}
                  <div className="space-y-1.5 bg-white p-3.5 rounded-2xl border border-amber-900/10">
                    <p className="text-[10px] font-black text-amber-800 uppercase tracking-wider">Customer Details</p>
                    <p className="text-sm font-black text-gray-900">{order.customer}</p>
                    <p className="flex items-center gap-1.5 text-gray-700">
                      <Phone size={13} className="text-[#4A0E0E]" /> {order.phone}
                    </p>
                    {order.whatsapp && (
                      <a
                        href={getWhatsAppLink(order)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-900 font-extrabold hover:underline"
                      >
                        <MessageCircle size={13} className="text-emerald-600" /> WhatsApp Chat ↗
                      </a>
                    )}
                  </div>

                  {/* Column 2: Delivery Address */}
                  <div className="space-y-1.5 bg-white p-3.5 rounded-2xl border border-amber-900/10">
                    <p className="text-[10px] font-black text-amber-800 uppercase tracking-wider">Delivery Address</p>
                    <p className="flex items-start gap-1.5 text-gray-800 leading-snug">
                      <MapPin size={14} className="text-[#4A0E0E] shrink-0 mt-0.5" />
                      <span>{order.address}</span>
                    </p>
                    {order.notes && (
                      <p className="text-[11px] text-amber-900 italic font-semibold pt-1">
                        Note: "{order.notes}"
                      </p>
                    )}
                  </div>

                  {/* Column 3: Items & Pricing Summary */}
                  <div className="space-y-1.5 bg-white p-3.5 rounded-2xl border border-amber-900/10 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-black text-amber-800 uppercase tracking-wider">Order Items</p>
                      <p className="text-sm font-black text-gray-900 mt-1">{order.itemsCount} Items Bought</p>
                      <div className="text-[11px] text-gray-600 font-medium space-y-0.5 pt-1 max-h-16 overflow-y-auto">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="flex justify-between truncate">
                            <span className="truncate">{item.name || item.title}</span>
                            <span className="font-bold shrink-0">x{item.quantity || item.qty || 1}</span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <p className="text-amber-800 font-bold text-[10px]">+{order.items.length - 3} more items...</p>
                        )}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-gray-100 flex items-baseline justify-between">
                      <span className="text-xs text-gray-600 font-bold">Total Amount:</span>
                      <span className="text-lg font-black text-[#4A0E0E]">₹{order.amount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions Bottom Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    {/* Direct WhatsApp Action Button */}
                    <a
                      href={getWhatsAppLink(order)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageCircle size={15} /> WhatsApp
                    </a>

                    {/* Direct Phone Call Button */}
                    <a
                      href={`tel:${order.phone}`}
                      className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-xs font-black transition-all flex items-center gap-1.5"
                    >
                      <Phone size={14} /> Call
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Edit Order in POS Button (Only for active pending/accepted/processing/shipped orders) */}
                    {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                      <button
                        type="button"
                        onClick={() => navigate('/admin/billing', { state: { editOrder: order } })}
                        className="px-3.5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-[#4A0E0E] rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-1.5 cursor-pointer transform hover:scale-105"
                        title="Edit items, adjust quantities, or add products in POS"
                      >
                        <Edit3 size={15} /> Edit Order in POS
                      </button>
                    )}

                    {/* View Details Link */}
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="px-4 py-2 bg-[#4A0E0E] hover:bg-[#701515] text-[#FFD700] rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileText size={15} /> View Full Order Page ↗
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-[#FAF7F2] p-12 rounded-3xl border-2 border-amber-900/10 text-center space-y-3">
            <ShoppingBag size={40} className="mx-auto text-amber-800/40" />
            <h3 className="text-lg font-black text-gray-800">No Orders Found</h3>
            <p className="text-xs font-bold text-gray-500">There are no orders matching your current filter settings.</p>
          </div>
        )}
        </div>
      )}

      {/* Pagination Controls */}
      {filteredOrders.length > 0 && (
        <div className="p-4 bg-[#EFEAE1] rounded-2xl border border-amber-900/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-gray-700">
          <div>
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              className="p-2 bg-white border border-amber-900/20 rounded-xl hover:bg-amber-100 disabled:opacity-40"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="p-2 bg-white border border-amber-900/20 rounded-xl hover:bg-amber-100 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 py-1 font-black text-[#4A0E0E]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="p-2 bg-white border border-amber-900/20 rounded-xl hover:bg-amber-100 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
              className="p-2 bg-white border border-amber-900/20 rounded-xl hover:bg-amber-100 disabled:opacity-40"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
