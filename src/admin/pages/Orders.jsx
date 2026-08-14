import { useState, useEffect } from 'react';
import { Search, Eye, Phone, CheckCircle, Clock, Truck, PackageCheck, Check, ChevronDown, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { subscribeOrders, updateOrderStatusInFirestore, deleteOrderFromFirestore } from '../../services/firebaseService';

const AdminOrders = () => {
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
            dateStr = rawDate.toDate().toLocaleDateString('en-IN');
          } else if (typeof rawDate === 'object' && rawDate?.seconds) {
            dateStr = new Date(rawDate.seconds * 1000).toLocaleDateString('en-IN');
          } else {
            const parsed = new Date(rawDate);
            dateStr = !isNaN(parsed.getTime()) ? parsed.toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');
          }
        } else {
          dateStr = new Date().toLocaleDateString('en-IN');
        }

        const isOfflineOrder = String(o.id).includes('POS') || o.paymentMode === 'Cash on Counter' || o.customer === 'Walk-in Customer' || o.orderType === 'Offline';

        return {
          ...o,
          id: String(o.id || `ORD-${Math.floor(Math.random() * 9000 + 1000)}`),
          customer: o.customerName || o.customer || 'Valued Customer',
          phone: o.phone || 'N/A',
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
  const [successToast, setSuccessToast] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

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

  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    await updateOrderStatusInFirestore(orderId, newStatus);
    triggerSuccess(`Order #${orderId} status changed to ${newStatus}!`);
  };

  const triggerSuccess = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const promptAction = (title, message, confirmText, actionFn) => {
    setConfirmConfig({
      title,
      message,
      confirmText,
      onConfirm: () => {
        actionFn();
        setConfirmConfig(null);
      }
    });
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.customer.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'All') {
      matchesStatus = true;
    } else if (statusFilter === 'Delivered' || statusFilter === 'Complete' || statusFilter === 'Completed') {
      matchesStatus = o.status === 'Delivered';
    } else if (statusFilter === 'Pending') {
      matchesStatus = o.status === 'Pending';
    } else if (statusFilter === 'Processing') {
      matchesStatus = o.status === 'Accepted' || o.status === 'Shipped' || o.status === 'Processing';
    } else if (statusFilter === 'Offline') {
      matchesStatus = Boolean(o.isOffline);
    } else {
      matchesStatus = o.status === statusFilter;
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
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10 relative">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-24 right-8 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500 font-black text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={18} /> {successToast}
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#4A0E0E] via-[#701515] to-[#4A0E0E] p-7 rounded-3xl shadow-lg text-white">
        <div>
          <h1 className="text-3xl font-serif font-black tracking-wide text-white">Order Management</h1>
          <p className="text-amber-200/90 text-sm mt-1 font-medium">Review customer orders, accept orders, change delivery statuses, and view items bought.</p>
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
        <div className="relative w-full md:w-auto">
          <select 
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setSearchParams({ status: e.target.value });
            }}
            className="w-full md:w-auto pl-5 pr-11 py-3 bg-white border-2 border-amber-900/20 rounded-2xl font-black text-gray-900 text-sm focus:outline-none focus:border-[#4A0E0E] shadow-sm appearance-none cursor-pointer hover:border-[#4A0E0E] transition-all"
          >
            <option value="All">All Orders ({orders.length})</option>
            <option value="Delivered">Complete Orders ({orders.filter(o => o.status === 'Delivered').length})</option>
            <option value="Pending">Pending Orders ({orders.filter(o => o.status === 'Pending').length})</option>
            <option value="Processing">Processing Orders ({orders.filter(o => o.status === 'Accepted' || o.status === 'Shipped').length})</option>
            <option value="Offline">Offline Orders / Counter POS ({orders.filter(o => o.isOffline).length})</option>
          </select>
          <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4A0E0E] pointer-events-none stroke-[2.5]" />
        </div>
      </div>

      {/* Table */}
      <div key={currentPage} className="bg-[#FAF7F2] rounded-3xl shadow-sm border border-amber-900/10 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#3B0B0B] text-white uppercase text-xs font-black tracking-wider border-b-2 border-amber-400">
              <tr>
                {renderSortHeader('Order ID & Date', 'id')}
                {renderSortHeader('Customer Info', 'customer')}
                {renderSortHeader('Amount', 'amount')}
                {renderSortHeader('Status', 'status')}
                <th className="px-6 py-4 text-right">Details Page</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-900/10">
              {paginatedOrders.map((order, idx) => (
                <tr key={order.id} className={idx % 2 === 0 ? 'bg-[#FAF7F2]' : 'bg-[#F2ECE1]'}>
                  <td className="px-6 py-5">
                    <p className="text-sm font-black text-gray-900">#{order.id}</p>
                    <p className="text-xs font-bold text-amber-800 mt-0.5">{order.date}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-gray-900">{order.customer}</p>
                    <div className="flex items-center gap-1 text-xs font-bold text-gray-600 mt-0.5">
                      <Phone size={12} className="text-[#c00000]" /> {order.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-[#4A0E0E]">₹{(order.amount || 0).toLocaleString('en-IN')}</p>
                    <p className="text-xs font-bold text-gray-500">{order.itemsCount || (Array.isArray(order.items) ? order.items.reduce((acc, item) => acc + (item.quantity || item.qty || 1), 0) : 0)} Items</p>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        to={`/admin/orders/${order.id}`}
                        className="px-3 py-1.5 bg-amber-200/60 hover:bg-[#4A0E0E] text-amber-950 hover:text-white border border-amber-300 rounded-xl font-bold text-xs transition-all flex items-center gap-1"
                      >
                        <Eye size={14} /> View Order Page
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 15-Item Pagination Controls Bar */}
        <div className="p-4 bg-[#FAF7F2] border-t border-amber-900/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-bold text-gray-700">
            Showing <span className="font-black text-[#4A0E0E]">{filteredOrders.length > 0 ? startIndex + 1 : 0}</span> to <span className="font-black text-[#4A0E0E]">{Math.min(startIndex + itemsPerPage, filteredOrders.length)}</span> of <span className="font-black text-[#4A0E0E]">{filteredOrders.length}</span> items
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
      </div>

      {/* Confirmation Action Modal */}
      {confirmConfig && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-md w-full p-7 shadow-2xl border border-amber-900/30 text-center relative space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 text-[#4A0E0E] flex items-center justify-center border-2 border-amber-300 shadow-md">
              <AlertCircle size={36} />
            </div>

            <div>
              <h3 className="text-xl font-serif font-black text-gray-900">{confirmConfig.title}</h3>
              <p className="text-xs font-bold text-gray-600 mt-2 leading-relaxed">
                {confirmConfig.message}
              </p>
            </div>

            <div className="pt-4 border-t border-amber-900/15 grid grid-cols-2 gap-3">
              <button 
                onClick={() => setConfirmConfig(null)}
                className="py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-black text-xs rounded-2xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={confirmConfig.onConfirm}
                className="py-3 bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-[#4A0E0E] font-black text-xs rounded-2xl shadow-md transition-all"
              >
                {confirmConfig.confirmText || 'Yes, Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
