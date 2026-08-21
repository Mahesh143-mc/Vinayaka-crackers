import { useState, useEffect, useRef } from 'react';
import { Search, Eye, Phone, CheckCircle, Clock, Truck, PackageCheck, Check, ChevronDown, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown, Filter, Loader2, History as HistoryIcon, Download } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { subscribeOrders, updateOrderStatusInFirestore, deleteOrderFromFirestore } from '../../services/firebaseService';
import { useToast } from '../../context/ToastContext';

const AdminHistory = () => {
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlStatus = searchParams.get('status');

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeOrders((firestoreOrders) => {
      const normalized = (firestoreOrders || []).map(o => {
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

        return {
          ...o,
          id: String(o.id || o.orderId || `KC-ORD-${Math.floor(Math.random() * 9000 + 1000)}`),
          customer: o.customerName || o.customer || (isOfflineOrder ? 'Counter POS Customer' : 'Website Customer'),
          phone: o.phone || o.whatsapp || 'N/A',
          whatsapp: o.whatsapp || o.phone || '',
          amount: amountNum,
          items: rawItems,
          itemsCount: itemsCount,
          date: dateStr,
          status: o.status || 'Pending',
          isOffline: isOfflineOrder
        };
      });
      setOrders(normalized);
    });
    return () => unsubscribe();
  }, []);

  const [confirmConfig, setConfirmConfig] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(urlStatus || 'All');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowStatusDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (urlStatus) {
      if (urlStatus === 'Complete' || urlStatus === 'Completed' || urlStatus === 'Delivered') {
        setStatusFilter('Delivered');
      } else if (urlStatus === 'Processing') {
        setStatusFilter('Processing');
      } else {
        setStatusFilter(urlStatus);
      }
    } else {
      setStatusFilter('All');
    }
  }, [urlStatus]);

  // 15 items per page pagination state
  const itemsPerPage = 15;
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting state
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  useEffect(() => {
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTop = 0;
      mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    await updateOrderStatusInFirestore(orderId, newStatus);
    triggerSuccess(`Order #${orderId} status changed to ${newStatus}!`);
  };

  const triggerSuccess = (msg) => {
    showToast(msg, 'success');
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const promptAction = (title, message, confirmText, actionFn) => {
    setConfirmConfig({
      title,
      message,
      confirmText,
      onConfirm: async () => {
        setIsProcessing(true);
        try {
          await actionFn();
        } catch (err) {
          console.error("Action error:", err);
        } finally {
          setIsProcessing(false);
          setConfirmConfig(null);
        }
      }
    });
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.customer.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'All') {
      matchesStatus = true;
    } else if (statusFilter === 'Online') {
      matchesStatus = !o.isOffline;
    } else if (statusFilter === 'Offline' || statusFilter === 'Billing' || statusFilter === 'POS') {
      matchesStatus = Boolean(o.isOffline);
    }

    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (typeof aVal === 'string') {
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = sortedOrders.slice(startIndex, startIndex + itemsPerPage);

  const renderSortHeader = (label, field, align = 'left') => {
    const isActive = sortField === field;
    return (
      <th 
        onClick={() => handleSort(field)} 
        className={`px-6 py-4 cursor-pointer select-none group transition-colors hover:bg-[#380A0A] ${align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'}`}
        title={`Sort by ${label} (${isActive && sortOrder === 'asc' ? 'Descending' : 'Ascending'})`}
      >
        <div className={`inline-flex items-center gap-1.5 ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'}`}>
          <span className={isActive ? 'text-[#FFD700]' : 'text-amber-100/90 group-hover:text-[#FFD700]'}>{label}</span>
          {isActive ? (
            sortOrder === 'asc' ? <ArrowUp size={14} className="text-[#FFD700]" /> : <ArrowDown size={14} className="text-[#FFD700]" />
          ) : (
            <ArrowUpDown size={14} className="text-amber-300/40 group-hover:text-amber-300" />
          )}
        </div>
      </th>
    );
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Pending': 
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300"><Clock size={13} /> Pending</span>;
      case 'Accepted': 
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-900 border border-blue-300"><CheckCircle size={13} /> Accepted</span>;
      case 'Shipped': 
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-900 border border-purple-300"><Truck size={13} /> Shipped</span>;
      case 'Delivered': 
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300"><PackageCheck size={13} /> Delivered</span>;
      default: 
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-gray-100 text-gray-800 border border-gray-300">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10 relative">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#4A0E0E] via-[#701515] to-[#4A0E0E] p-7 rounded-3xl shadow-lg text-white">
        <div>
          <h1 className="text-3xl font-serif font-black tracking-wide text-white flex items-center gap-3">
            <HistoryIcon className="text-[#FFD700]" size={30} /> Order & Sales History
          </h1>
          <p className="text-amber-200/90 text-sm mt-1 font-medium">Complete audit log of all historical sales, POS transactions, and customer orders.</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-[#EFEAE1] p-4 rounded-3xl border border-amber-900/10 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-800" size={19} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID or Customer Name..." 
            className="w-full pl-11 pr-4 py-3 bg-white border-2 border-amber-900/20 rounded-2xl focus:outline-none focus:border-[#4A0E0E] text-sm font-black text-gray-900 shadow-sm"
          />
        </div>
        <div ref={dropdownRef} className="relative w-full md:w-auto">
          <button
            type="button"
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            className="w-full md:w-auto pl-5 pr-10 py-3 bg-white border-2 border-amber-900/20 hover:border-[#4A0E0E] rounded-2xl font-black text-gray-900 text-sm shadow-sm transition-all flex items-center justify-between gap-3 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Filter size={16} className="text-[#4A0E0E]" />
              {statusFilter === 'All' && `All Records (${orders.length})`}
              {statusFilter === 'Online' && `Online Orders (${orders.filter(o => !o.isOffline).length})`}
              {statusFilter === 'Offline' && `Counter Billing / POS (${orders.filter(o => o.isOffline).length})`}
            </span>
            <ChevronDown size={18} className={`text-[#4A0E0E] transition-transform stroke-[2.5] ${showStatusDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showStatusDropdown && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white border-2 border-amber-900/20 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 space-y-1">
              <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between text-[#4A0E0E] font-black text-xs uppercase tracking-wider">
                <span>Filter History Log</span>
                <Filter size={14} className="text-[#4A0E0E]" />
              </div>
              <div className="space-y-1 pt-1">
                {[
                  { value: 'All', label: `All Records (${orders.length})` },
                  { value: 'Online', label: `Online Orders (${orders.filter(o => !o.isOffline).length})` },
                  { value: 'Offline', label: `Counter Billing / POS (${orders.filter(o => o.isOffline).length})` }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setStatusFilter(opt.value);
                      setSearchParams({ status: opt.value });
                      setShowStatusDropdown(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-between ${
                      statusFilter === opt.value
                        ? 'bg-[#4A0E0E] text-[#FFD700] shadow-md'
                        : 'text-gray-800 hover:bg-amber-100/60'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {statusFilter === opt.value && <Check size={15} strokeWidth={3} />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Orders History Table */}
      <div className="bg-[#FAF7F2] rounded-3xl border-2 border-amber-900/10 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-[#4A0E0E] to-[#2B0808] border-b border-red-950 text-white font-black text-xs uppercase tracking-widest">
                {renderSortHeader("Order ID & Date", "id", "left")}
                {renderSortHeader("Customer Info", "customer", "left")}
                {renderSortHeader("Amount", "amount", "left")}
                {renderSortHeader("Status", "status", "center")}
                <th className="px-6 py-4 text-center text-amber-200">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-900/10 text-sm font-bold text-gray-800">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-amber-100/40 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-extrabold text-[#4A0E0E]">{order.id}</span>
                      <p className="text-xs text-gray-500 font-medium">{order.date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-extrabold text-gray-900">{order.customer}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1"><Phone size={11}/> {order.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-black text-[#4A0E0E]">₹{order.amount.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-gray-500 font-medium">{order.itemsCount} Items</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link 
                        to={`/admin/orders/${order.id}`}
                        className="px-3.5 py-1.5 bg-amber-100 hover:bg-[#FFD700] text-[#4A0E0E] rounded-xl text-xs font-black border border-amber-300 shadow-sm transition-all inline-flex items-center gap-1.5"
                      >
                        <Eye size={14} /> View Details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-bold">
                    No order history records found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {sortedOrders.length > 0 && (
          <div className="p-4 bg-[#EFEAE1] border-t border-amber-900/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-gray-700">
            <div>
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedOrders.length)} of {sortedOrders.length} records
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(1)}
                className="p-2 bg-white border border-amber-900/20 rounded-xl hover:bg-amber-100 disabled:opacity-40 disabled:hover:bg-white"
                title="First Page"
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="p-2 bg-white border border-amber-900/20 rounded-xl hover:bg-amber-100 disabled:opacity-40 disabled:hover:bg-white"
                title="Previous Page"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-3 py-1 font-black text-[#4A0E0E]">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="p-2 bg-white border border-amber-900/20 rounded-xl hover:bg-amber-100 disabled:opacity-40 disabled:hover:bg-white"
                title="Next Page"
              >
                <ChevronRight size={16} />
              </button>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(totalPages)}
                className="p-2 bg-white border border-amber-900/20 rounded-xl hover:bg-amber-100 disabled:opacity-40 disabled:hover:bg-white"
                title="Last Page"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FAF7F2] max-w-md w-full rounded-3xl border-2 border-amber-900/20 shadow-2xl p-6 space-y-6">
            <div className="flex items-center gap-3 text-[#4A0E0E]">
              <AlertCircle size={28} className="text-amber-600 shrink-0" />
              <h3 className="text-lg font-black">{confirmConfig.title}</h3>
            </div>
            <p className="text-sm font-bold text-gray-700 leading-relaxed">{confirmConfig.message}</p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmConfig(null)}
                className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-xs font-black transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={confirmConfig.onConfirm}
                className="px-5 py-2.5 bg-[#4A0E0E] hover:bg-[#701515] text-[#FFD700] rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-2"
              >
                {isProcessing && <Loader2 className="animate-spin" size={14} />}
                {confirmConfig.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHistory;
