import { useState, useEffect } from 'react';
import { Search, Eye, Phone, CheckCircle, Clock, Truck, PackageCheck, Check, ChevronDown, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

const AdminOrders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlStatus = searchParams.get('status');

  const [orders, setOrders] = useState([
    { id: 'ORD-092', customer: 'Rahul Sharma', phone: '+91 9876543210', amount: 14500, date: 'Oct 15, 2023', status: 'Pending', address: '123 Main St, Sivakasi, TN', items: [{ name: '120 Shots Multi-color', qty: 2, price: 1200 }] },
    { id: 'ORD-091', customer: 'Priya Patel', phone: '+91 9123456789', amount: 8200, date: 'Oct 15, 2023', status: 'Accepted', address: '45 Gandhi Nagar, Madurai, TN', items: [{ name: 'Giant Sparklers (50pcs)', qty: 10, price: 350 }] },
    { id: 'ORD-090', customer: 'Vikram Singh', phone: '+91 9988776655', amount: 22000, date: 'Oct 14, 2023', status: 'Shipped', address: '88 Circular Rd, Chennai, TN', items: [{ name: '120 Shots Multi-color', qty: 15, price: 1200 }] },
    { id: 'ORD-089', customer: 'Arun Kumar', phone: '+91 9876512345', amount: 5400, date: 'Oct 13, 2023', status: 'Delivered', address: '12 Temple Street, Kovilpatti, TN', items: [{ name: 'Sky Lanterns Pack', qty: 10, price: 400 }] },
    { id: 'ORD-088', customer: 'Kavitha Nathan', phone: '+91 9443322110', amount: 12600, date: 'Oct 13, 2023', status: 'Pending', address: '66 West Car St, Sivakasi, TN', items: [{ name: 'Flower Pots Mega', qty: 8, price: 650 }] },
    { id: 'ORD-087', customer: 'Senthil Raj', phone: '+91 9789012345', amount: 9800, date: 'Oct 12, 2023', status: 'Accepted', address: '99 Main Bazaar, Tirunelveli, TN', items: [{ name: '7 Color Sky Rockets', qty: 12, price: 850 }] },
    { id: 'ORD-086', customer: 'Meena Sundaram', phone: '+91 9655443322', amount: 18500, date: 'Oct 12, 2023', status: 'Shipped', address: '23 Anna Salai, Trichy, TN', items: [{ name: 'Chakra Ground Spinner', qty: 25, price: 280 }] },
    { id: 'ORD-085', customer: 'Ganesh Ram', phone: '+91 9543210987', amount: 3400, date: 'Oct 11, 2023', status: 'Delivered', address: '5 Cross St, Salem, TN', items: [{ name: 'Electric Sparklers Gold', qty: 8, price: 450 }] },
    { id: 'ORD-084', customer: 'Anitha Ramesh', phone: '+91 9412345678', amount: 15800, date: 'Oct 11, 2023', status: 'Pending', address: '78 High Rd, Coimbatore, TN', items: [{ name: 'Peacock Fountain Large', qty: 14, price: 520 }] },
    { id: 'ORD-083', customer: 'Karthik Subramanian', phone: '+91 9321098765', amount: 27500, date: 'Oct 10, 2023', status: 'Accepted', address: '14 GST Rd, Chennai, TN', items: [{ name: '240 Shots Night Display', qty: 10, price: 2400 }] },
    { id: 'ORD-082', customer: 'Deepak Varma', phone: '+91 9210987654', amount: 6900, date: 'Oct 10, 2023', status: 'Shipped', address: '30 North St, Erode, TN', items: [{ name: 'Color Smoke Grenade', qty: 15, price: 320 }] },
    { id: 'ORD-081', customer: 'Sita Lakshmi', phone: '+91 9109876543', amount: 4800, date: 'Oct 09, 2023', status: 'Delivered', address: '50 South Car St, Dindigul, TN', items: [{ name: 'Gold Twinkling Stars', qty: 20, price: 180 }] },
    { id: 'ORD-080', customer: 'Vijay Anand', phone: '+91 9098765432', amount: 19200, date: 'Oct 09, 2023', status: 'Pending', address: '88 Bypass Rd, Virudhunagar, TN', items: [{ name: 'Hydro Bomb High Sound', qty: 30, price: 300 }] },
    { id: 'ORD-079', customer: 'Pooja Hegde', phone: '+91 8987654321', amount: 11400, date: 'Oct 08, 2023', status: 'Accepted', address: '12 Beach Rd, Kanyakumari, TN', items: [{ name: 'Tri-Color Fountain Pot', qty: 18, price: 420 }] },
    { id: 'ORD-078', customer: 'Manoj Pillai', phone: '+91 8876543210', amount: 8600, date: 'Oct 08, 2023', status: 'Shipped', address: '44 Station Rd, Thanjavur, TN', items: [{ name: 'Whistling Sky Rockets', qty: 12, price: 650 }] },
    { id: 'ORD-077', customer: 'Swati Krishnan', phone: '+91 8765432109', amount: 5200, date: 'Oct 07, 2023', status: 'Delivered', address: '77 College Rd, Vellore, TN', items: [{ name: 'Red & Green Ground Wheel', qty: 20, price: 210 }] },
    { id: 'ORD-076', customer: 'Balaji Natarajan', phone: '+91 8654321098', amount: 35000, date: 'Oct 07, 2023', status: 'Pending', address: '100 Industrial Estate, Sivakasi, TN', items: [{ name: 'Diwali Deluxe Combo Pack', qty: 10, price: 3500 }] },
    { id: 'ORD-075', customer: 'Divya Bharathi', phone: '+91 8543210987', amount: 7300, date: 'Oct 06, 2023', status: 'Accepted', address: '19 Market St, Karur, TN', items: [{ name: 'Silver Flash Sparklers', qty: 25, price: 260 }] },
    { id: 'ORD-074', customer: 'Harish Chandra', phone: '+91 8432109876', amount: 22000, date: 'Oct 06, 2023', status: 'Shipped', address: '33 Trunk Rd, Hosur, TN', items: [{ name: 'Garland 1000 Crackers', qty: 20, price: 1100 }] },
    { id: 'ORD-073', customer: 'Lakshmi Narayan', phone: '+91 8321098765', amount: 9500, date: 'Oct 05, 2023', status: 'Delivered', address: '61 Cross Rd, Nagapattinam, TN', items: [{ name: '30 Shots Peacock Sky', qty: 10, price: 950 }] },
    { id: 'ORD-072', customer: 'Ramesh Babu', phone: '+91 8210987654', amount: 15600, date: 'Oct 05, 2023', status: 'Pending', address: '85 Old Bus Stand, Pudukkottai, TN', items: [{ name: 'Multi-Color Musical Fountain', qty: 20, price: 780 }] },
    { id: 'ORD-071', customer: 'Nandhini Devi', phone: '+91 8109876543', amount: 4350, date: 'Oct 04, 2023', status: 'Accepted', address: '22 School St, Ramanathapuram, TN', items: [{ name: 'Crackling Sparklers (10pcs)', qty: 15, price: 290 }] },
    { id: 'ORD-070', customer: 'Srikant Acharya', phone: '+91 8098765432', amount: 14400, date: 'Oct 04, 2023', status: 'Shipped', address: '9 North Street, Cuddalore, TN', items: [{ name: 'Mega Sky Thunder Bomb', qty: 30, price: 480 }] },
    { id: 'ORD-069', customer: 'Janaki Raman', phone: '+91 7987654321', amount: 8900, date: 'Oct 03, 2023', status: 'Delivered', address: '4 Park Rd, Ooty, TN', items: [{ name: 'Kids Safe Crackers Box', qty: 10, price: 890 }] },
    { id: 'ORD-068', customer: 'Gokul Kannan', phone: '+91 7876543210', amount: 16200, date: 'Oct 03, 2023', status: 'Pending', address: '17 Lake View, Kodaikanal, TN', items: [{ name: '120 Shots Multi-color', qty: 13, price: 1200 }] },
  ]);

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

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
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
                    <p className="text-sm font-black text-[#4A0E0E]">₹{order.amount.toLocaleString()}</p>
                    <p className="text-xs font-bold text-gray-500">{order.items.reduce((acc, item) => acc + item.qty, 0)} Items</p>
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
