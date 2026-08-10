import { useState } from 'react';
import { Search, Eye, Phone, CheckCircle, Clock, Truck, PackageCheck, Check, ChevronDown, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminOrders = () => {
  const [orders, setOrders] = useState([
    { 
      id: 'ORD-092', 
      customer: 'Rahul Sharma', 
      phone: '+91 9876543210', 
      amount: 14500, 
      date: 'Oct 15, 2023', 
      status: 'Pending',
      address: '123 Main St, Sivakasi, TN',
      items: [
        { name: '120 Shots Multi-color', qty: 2, price: 1200 },
        { name: 'Giant Sparklers (50pcs)', qty: 10, price: 350 },
        { name: 'Lakshmi Bomb Deluxe', qty: 5, price: 150 },
        { name: 'Flower Pots Mega', qty: 10, price: 650 },
      ]
    },
    { 
      id: 'ORD-091', 
      customer: 'Priya Patel', 
      phone: '+91 9123456789', 
      amount: 8200, 
      date: 'Oct 15, 2023', 
      status: 'Accepted',
      address: '45 Gandhi Nagar, Madurai, TN',
      items: [
        { name: 'Giant Sparklers (50pcs)', qty: 10, price: 350 },
        { name: 'Sky Lanterns Pack', qty: 5, price: 400 },
        { name: 'Lakshmi Bomb Deluxe', qty: 18, price: 150 }
      ]
    },
    { 
      id: 'ORD-090', 
      customer: 'Vikram Singh', 
      phone: '+91 9988776655', 
      amount: 22000, 
      date: 'Oct 14, 2023', 
      status: 'Shipped',
      address: '88 Circular Rd, Chennai, TN',
      items: [
        { name: '120 Shots Multi-color', qty: 15, price: 1200 },
        { name: 'Flower Pots Mega', qty: 6, price: 650 }
      ]
    },
    { 
      id: 'ORD-089', 
      customer: 'Arun Kumar', 
      phone: '+91 9876512345', 
      amount: 5400, 
      date: 'Oct 13, 2023', 
      status: 'Delivered',
      address: '12 Temple Street, Kovilpatti, TN',
      items: [
        { name: 'Sky Lanterns Pack', qty: 10, price: 400 },
        { name: 'Lakshmi Bomb Deluxe', qty: 9, price: 150 }
      ]
    },
  ]);

  const [confirmConfig, setConfirmConfig] = useState(null);
  const [successToast, setSuccessToast] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

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
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto pl-5 pr-11 py-3 bg-white border-2 border-amber-900/20 rounded-2xl font-black text-gray-900 text-sm focus:outline-none focus:border-[#4A0E0E] shadow-sm appearance-none cursor-pointer hover:border-[#4A0E0E] transition-all"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
          <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4A0E0E] pointer-events-none stroke-[2.5]" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#FAF7F2] rounded-3xl shadow-sm border border-amber-900/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-[#4A0E0E] to-[#2B0808] border-b border-red-950 text-white">
                <th className="px-6 py-6 text-xs font-black text-[#FFD700] uppercase tracking-widest">Order ID & Date</th>
                <th className="px-6 py-6 text-xs font-black text-[#FFD700] uppercase tracking-widest">Customer Info</th>
                <th className="px-6 py-6 text-xs font-black text-[#FFD700] uppercase tracking-widest">Amount</th>
                <th className="px-6 py-6 text-xs font-black text-[#FFD700] uppercase tracking-widest">Status</th>
                <th className="px-6 py-6 text-xs font-black text-[#FFD700] uppercase tracking-widest text-center">Status Action</th>
                <th className="px-6 py-6 text-xs font-black text-[#FFD700] uppercase tracking-widest text-right">Details Page</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-900/10">
              {filteredOrders.map((order, idx) => (
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
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {order.status === 'Pending' && (
                        <button 
                          onClick={() => promptAction(
                            'Accept Order?', 
                            `Confirm acceptance of order #${order.id} for ${order.customer}?`,
                            'Yes, Accept',
                            () => updateOrderStatus(order.id, 'Accepted')
                          )}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-sm flex items-center gap-1"
                        >
                          <Check size={14} /> Accept Order
                        </button>
                      )}
                      {order.status === 'Accepted' && (
                        <button 
                          onClick={() => promptAction(
                            'Mark Shipped?', 
                            `Confirm dispatch of order #${order.id}?`,
                            'Yes, Ship Order',
                            () => updateOrderStatus(order.id, 'Shipped')
                          )}
                          className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold text-xs shadow-sm flex items-center gap-1"
                        >
                          <Truck size={14} /> Mark Shipped
                        </button>
                      )}
                      {order.status === 'Shipped' && (
                        <button 
                          onClick={() => promptAction(
                            'Mark Delivered?', 
                            `Confirm delivery of order #${order.id}?`,
                            'Yes, Deliver',
                            () => updateOrderStatus(order.id, 'Delivered')
                          )}
                          className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold text-xs shadow-sm flex items-center gap-1"
                        >
                          <PackageCheck size={14} /> Mark Delivered
                        </button>
                      )}
                      {order.status === 'Delivered' && (
                        <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                          <CheckCircle size={14} /> Fulfilled
                        </span>
                      )}
                    </div>
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
