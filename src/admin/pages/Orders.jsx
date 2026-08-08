import { useState } from 'react';
import { Search, Filter, Eye, Phone, CheckCircle, Clock, Truck, XCircle, ShoppingBag, Edit3, X, Check, PackageCheck } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([
    { 
      id: '#ORD-092', 
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
      id: '#ORD-091', 
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
      id: '#ORD-090', 
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
      id: '#ORD-089', 
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

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editStatus, setEditStatus] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    }
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
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
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
            className="w-full pl-11 pr-4 py-3 bg-white border border-amber-900/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4A0E0E]/30 text-sm font-bold text-gray-800"
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-auto px-4 py-3 bg-white border border-amber-900/10 rounded-2xl font-bold text-amber-950 text-sm focus:outline-none"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      {/* Table with Tinted Background & Header */}
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
                <th className="px-6 py-6 text-xs font-black text-[#FFD700] uppercase tracking-widest text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-900/10">
              {filteredOrders.map((order, idx) => (
                <tr key={order.id} className={idx % 2 === 0 ? 'bg-[#FAF7F2]' : 'bg-[#F2ECE1]'}>
                  <td className="px-6 py-5">
                    <p className="text-sm font-black text-gray-900">{order.id}</p>
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
                          onClick={() => updateOrderStatus(order.id, 'Accepted')}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-sm flex items-center gap-1"
                        >
                          <Check size={14} /> Accept Order
                        </button>
                      )}
                      {order.status === 'Accepted' && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'Shipped')}
                          className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold text-xs shadow-sm flex items-center gap-1"
                        >
                          <Truck size={14} /> Mark Shipped
                        </button>
                      )}
                      {order.status === 'Shipped' && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'Delivered')}
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
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 bg-amber-200/60 hover:bg-[#4A0E0E] text-amber-950 hover:text-white border border-amber-300 rounded-xl font-bold text-xs transition-all flex items-center gap-1"
                      >
                        <Eye size={14} /> View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-xl w-full p-7 shadow-2xl border border-amber-900/20 relative">
            <div className="flex items-center justify-between pb-4 border-b border-amber-900/10">
              <div>
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="text-[#c00000]" /> Order Summary ({selectedOrder.id})
                </h3>
                <p className="text-xs font-bold text-amber-900 mt-0.5">Placed by {selectedOrder.customer} on {selectedOrder.date}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 text-gray-400 hover:text-gray-700 bg-white rounded-full">
                <X size={18} />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-amber-900/10 text-sm font-medium text-gray-700">
                <p className="font-bold text-amber-950">Delivery Address:</p>
                <p className="text-xs text-gray-600 mt-0.5">{selectedOrder.address}</p>
                <p className="text-xs text-[#c00000] font-bold mt-1">Contact: {selectedOrder.phone}</p>
              </div>

              <h4 className="font-black text-sm text-gray-900 uppercase tracking-wider">Ordered Products:</h4>
              <div className="divide-y divide-amber-900/10 max-h-52 overflow-y-auto border border-amber-900/10 rounded-2xl bg-white">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{item.name}</p>
                      <p className="text-xs font-bold text-gray-400">₹{item.price} per unit</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-[#4A0E0E]">₹{(item.qty * item.price).toLocaleString()}</p>
                      <span className="text-xs font-extrabold bg-amber-100 text-amber-950 px-2 py-0.5 rounded-lg">Qty: {item.qty}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-amber-900/10 flex items-center justify-between">
                <span className="font-black text-base text-gray-900">Total Order Amount:</span>
                <span className="font-black text-2xl text-[#c00000]">₹{selectedOrder.amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-amber-900/10 flex justify-end">
              <button onClick={() => setSelectedOrder(null)} className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold text-sm">
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
