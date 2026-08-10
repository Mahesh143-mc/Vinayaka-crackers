import { useState } from 'react';
import { ArrowLeft, Phone, Printer, Send, Truck, CheckCircle2, Clock, MapPin, User, Calendar, PackageCheck, Check, AlertCircle, X } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const AdminOrderDetails = () => {
  const { id } = useParams();
  const orderId = id || '#ORD-092';

  const [order, setOrder] = useState({
    id: orderId,
    customer: 'Rahul Sharma',
    phone: '+91 9876543210',
    email: 'rahul.sharma@gmail.com',
    date: 'Oct 15, 2023 - 10:30 AM',
    status: 'Pending',
    paymentMethod: 'UPI / Online Payment',
    paymentStatus: 'Paid',
    address: '123 Main Street, Near Temple Arch, Sivakasi, Tamil Nadu - 626123',
    items: [
      { id: 'PRD-01', name: '120 Shots Multi-color Sky Fireworks', category: 'Fancy', price: 1200, qty: 2 },
      { id: 'PRD-02', name: 'Giant Sparklers (50pcs Box)', category: 'Sparklers', price: 350, qty: 10 },
      { id: 'PRD-03', name: 'Lakshmi Bomb Deluxe Loud Sound', category: 'Bombs', price: 150, qty: 5 },
      { id: 'PRD-05', name: 'Flower Pots Mega Fountains', category: 'Fountains', price: 650, qty: 10 },
    ]
  });

  // Action Confirmation Modal State
  const [confirmConfig, setConfirmConfig] = useState(null);
  // Success Toast Message State
  const [successToast, setSuccessToast] = useState('');

  const updateStatus = (newStatus) => {
    setOrder(prev => ({ ...prev, status: newStatus }));
    triggerSuccess(`Order ${order.id} status updated to "${newStatus}"!`);
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

  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = Math.round(subtotal * 0.05);
  const gst = Math.round((subtotal - discount) * 0.18);
  const deliveryFee = 150;
  const grandTotal = subtotal - discount + gst + deliveryFee;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 relative">
      {/* Success Notification Toast */}
      {successToast && (
        <div className="fixed top-24 right-8 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500 font-black text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={18} /> {successToast}
        </div>
      )}

      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link 
          to="/admin/orders"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#FAF7F2] border border-amber-900/20 rounded-2xl text-xs font-black text-[#4A0E0E] hover:bg-[#EFEAE1] transition-all shadow-sm"
        >
          <ArrowLeft size={16} /> Back to Orders List
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-[#4A0E0E] bg-[#FFD700]/30 px-3.5 py-1.5 rounded-full border border-amber-400/40">
            Order Reference: {order.id}
          </span>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#4A0E0E] via-[#701515] to-[#4A0E0E] p-7 rounded-3xl shadow-lg text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-serif font-black text-white">Order {order.id}</h1>
            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black border ${
              order.status === 'Pending' ? 'bg-amber-100 text-amber-900 border-amber-300' :
              order.status === 'Accepted' ? 'bg-blue-100 text-blue-900 border-blue-300' :
              order.status === 'Shipped' ? 'bg-purple-100 text-purple-900 border-purple-300' :
              'bg-emerald-100 text-emerald-900 border-emerald-300'
            }`}>
              {order.status === 'Pending' && <Clock size={13} />}
              {order.status === 'Accepted' && <CheckCircle2 size={13} />}
              {order.status === 'Shipped' && <Truck size={13} />}
              {order.status === 'Delivered' && <PackageCheck size={13} />}
              {order.status}
            </span>
          </div>
          <p className="text-amber-200/90 text-xs font-bold mt-1">Placed on {order.date} • {order.paymentMethod}</p>
        </div>

        {/* Action Controls with Confirmation Prompt */}
        <div className="flex flex-wrap items-center gap-2">
          {order.status === 'Pending' && (
            <button 
              onClick={() => promptAction(
                'Accept Order Confirmation', 
                `Are you sure you want to accept order ${order.id}? This will notify customer Rahul Sharma.`,
                'Yes, Accept Order',
                () => updateStatus('Accepted')
              )}
              className="px-5 py-2.5 bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-[#4A0E0E] font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-1.5 transform hover:scale-105"
            >
              <Check size={16} /> Accept Order
            </button>
          )}

          {order.status === 'Accepted' && (
            <button 
              onClick={() => promptAction(
                'Mark Shipped Confirmation', 
                `Are you sure you want to mark order ${order.id} as shipped from Sivakasi warehouse?`,
                'Yes, Mark Shipped',
                () => updateStatus('Shipped')
              )}
              className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-1.5 transform hover:scale-105"
            >
              <Truck size={16} /> Mark Shipped
            </button>
          )}

          {order.status === 'Shipped' && (
            <button 
              onClick={() => promptAction(
                'Mark Delivered Confirmation', 
                `Confirm that order ${order.id} has been safely delivered to customer?`,
                'Yes, Mark Delivered',
                () => updateStatus('Delivered')
              )}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-1.5 transform hover:scale-105"
            >
              <PackageCheck size={16} /> Mark Delivered
            </button>
          )}

          <button 
            onClick={() => promptAction(
              'Print Invoice Confirmation', 
              `Generate and print official tax invoice for order ${order.id}?`,
              'Yes, Print Invoice',
              () => triggerSuccess('Printing official tax receipt invoice...')
            )}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold text-xs backdrop-blur-md transition-all flex items-center gap-1.5"
          >
            <Printer size={15} /> Print Invoice
          </button>

          <button 
            onClick={() => promptAction(
              'WhatsApp Notification Confirmation', 
              `Send live order update message directly to WhatsApp number ${order.phone}?`,
              'Yes, Send WhatsApp',
              () => triggerSuccess(`WhatsApp alert message sent to ${order.phone}!`)
            )}
            className="px-4 py-2.5 bg-[#25D366] hover:bg-[#1ebd53] text-white rounded-2xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Send size={15} /> WhatsApp Alert
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Product Items & Price Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ordered Products Table */}
          <div className="bg-[#FAF7F2] rounded-3xl shadow-sm border border-amber-900/20 overflow-hidden">
            <div className="p-5 bg-[#EFEAE1] border-b border-amber-900/15">
              <h2 className="text-base font-serif font-black text-[#4A0E0E]">Ordered Products ({order.items.length} Items)</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-[#4A0E0E] to-[#2B0808] text-[#FFD700] text-xs font-black uppercase tracking-widest border-b border-red-950">
                    <th className="px-6 py-5">Product Details</th>
                    <th className="px-6 py-5 text-center">Unit Price</th>
                    <th className="px-6 py-5 text-center">Qty</th>
                    <th className="px-6 py-5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-900/10 text-sm">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-[#FAF7F2]' : 'bg-[#F2ECE1]'}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-200 border border-amber-300 flex items-center justify-center text-lg shrink-0">
                            🎆
                          </div>
                          <div>
                            <p className="font-black text-gray-900 text-sm">{item.name}</p>
                            <span className="text-[10px] font-bold text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded">{item.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-gray-700">₹{item.price}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-amber-200/70 border border-amber-300 rounded-xl font-black text-xs text-[#4A0E0E]">
                          {item.qty}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-[#4A0E0E]">
                        ₹{(item.price * item.qty).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Price Calculation Card */}
          <div className="bg-[#FAF7F2] rounded-3xl p-6 shadow-sm border border-amber-900/20 space-y-3">
            <h3 className="text-sm font-serif font-black text-[#4A0E0E] uppercase tracking-wider border-b border-amber-900/15 pb-2">
              Payment Breakdown
            </h3>

            <div className="space-y-2 text-xs font-bold text-gray-700">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="text-gray-900 font-black">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-800">
                <span>Festive Coupon Discount (5%)</span>
                <span>-₹{discount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax (18%)</span>
                <span className="text-gray-900 font-black">₹{gst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Safe Transport & Delivery Fee</span>
                <span className="text-gray-900 font-black">₹{deliveryFee}</span>
              </div>
              <div className="pt-3 border-t border-amber-900/15 flex justify-between items-center text-base">
                <span className="font-black text-gray-900">Total Paid</span>
                <span className="font-black text-2xl text-[#c00000]">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Delivery Info */}
        <div className="space-y-6">
          {/* Customer Profile Card */}
          <div className="bg-[#FAF7F2] rounded-3xl p-6 shadow-sm border border-amber-900/20 space-y-4">
            <h3 className="text-sm font-serif font-black text-[#4A0E0E] uppercase tracking-wider border-b border-amber-900/15 pb-2 flex items-center gap-2">
              <User size={16} className="text-[#c00000]" /> Customer Details
            </h3>

            <div className="space-y-3 text-xs font-bold text-gray-800">
              <div>
                <p className="text-[10px] uppercase text-amber-950 font-black">Customer Name</p>
                <p className="text-sm font-black text-gray-900 mt-0.5">{order.customer}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase text-amber-950 font-black">Contact Phone / WhatsApp</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Phone size={14} className="text-emerald-700" />
                  <span className="text-sm font-black text-gray-900">{order.phone}</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase text-amber-950 font-black">Email Address</p>
                <p className="text-xs font-bold text-gray-700 mt-0.5">{order.email}</p>
              </div>
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="bg-[#FAF7F2] rounded-3xl p-6 shadow-sm border border-amber-900/20 space-y-4">
            <h3 className="text-sm font-serif font-black text-[#4A0E0E] uppercase tracking-wider border-b border-amber-900/15 pb-2 flex items-center gap-2">
              <MapPin size={16} className="text-[#c00000]" /> Delivery Address
            </h3>

            <div className="p-3.5 bg-white rounded-2xl border-2 border-amber-900/15 text-xs font-bold text-gray-800 leading-relaxed shadow-sm">
              {order.address}
            </div>
          </div>

          {/* Order Progress Tracker */}
          <div className="bg-[#FAF7F2] rounded-3xl p-6 shadow-sm border border-amber-900/20 space-y-4">
            <h3 className="text-sm font-serif font-black text-[#4A0E0E] uppercase tracking-wider border-b border-amber-900/15 pb-2 flex items-center gap-2">
              <Calendar size={16} className="text-[#c00000]" /> Fulfillment Progress
            </h3>

            <div className="space-y-3 relative pl-4 border-l-2 border-amber-900/20 text-xs font-bold">
              <div className="relative">
                <span className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-emerald-100"></span>
                <p className="text-gray-900 font-black">Order Placed</p>
                <p className="text-[10px] text-gray-500 font-medium">Oct 15, 2023 - 10:30 AM</p>
              </div>
              <div className="relative">
                <span className={`absolute -left-[21px] top-0.5 w-3 h-3 rounded-full ${order.status !== 'Pending' ? 'bg-emerald-600 ring-4 ring-emerald-100' : 'bg-gray-300'}`}></span>
                <p className={order.status !== 'Pending' ? 'text-gray-900 font-black' : 'text-gray-400 font-normal'}>Order Accepted</p>
              </div>
              <div className="relative">
                <span className={`absolute -left-[21px] top-0.5 w-3 h-3 rounded-full ${order.status === 'Shipped' || order.status === 'Delivered' ? 'bg-emerald-600 ring-4 ring-emerald-100' : 'bg-gray-300'}`}></span>
                <p className={order.status === 'Shipped' || order.status === 'Delivered' ? 'text-gray-900 font-black' : 'text-gray-400 font-normal'}>Shipped from Sivakasi</p>
              </div>
              <div className="relative">
                <span className={`absolute -left-[21px] top-0.5 w-3 h-3 rounded-full ${order.status === 'Delivered' ? 'bg-emerald-600 ring-4 ring-emerald-100' : 'bg-gray-300'}`}></span>
                <p className={order.status === 'Delivered' ? 'text-gray-900 font-black' : 'text-gray-400 font-normal'}>Delivered to Customer</p>
              </div>
            </div>
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

export default AdminOrderDetails;
