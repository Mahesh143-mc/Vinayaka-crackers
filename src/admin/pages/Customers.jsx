import { useState } from 'react';
import { Search, MessageCircle, Calendar, Users, Send, X, ShoppingBag, Phone, MapPin, Award, CheckCircle2 } from 'lucide-react';

const AdminCustomers = () => {
  const [customers] = useState([
    { 
      id: 'CUST-001', 
      sno: 1,
      name: 'Rahul Sharma', 
      phone: '+91 9876543210', 
      email: 'rahul.sharma@gmail.com',
      location: 'Sivakasi, Tamil Nadu',
      totalOrders: 5, 
      totalSpent: 45500, 
      lastActive: 'Oct 15, 2023', 
      status: 'VIP',
      recentPurchases: [
        { orderId: 'ORD-9842', date: 'Oct 15, 2023', items: '120 Shots Multi-color, Giant Sparklers', total: 12500 },
        { orderId: 'ORD-9102', date: 'Sep 28, 2023', items: 'Lakshmi Bomb Deluxe (50pcs)', total: 18000 },
      ]
    },
    { 
      id: 'CUST-002', 
      sno: 2,
      name: 'Priya Patel', 
      phone: '+91 9123456789', 
      email: 'priya.patel@gmail.com',
      location: 'Madurai, Tamil Nadu',
      totalOrders: 1, 
      totalSpent: 8200, 
      lastActive: 'Oct 15, 2023', 
      status: 'New',
      recentPurchases: [
        { orderId: 'ORD-8761', date: 'Oct 15, 2023', items: 'Flower Pots Mega, Sky Lanterns Pack', total: 8200 }
      ]
    },
    { 
      id: 'CUST-003', 
      sno: 3,
      name: 'Vikram Singh', 
      phone: '+91 9988776655', 
      email: 'vikram.singh@gmail.com',
      location: 'Chennai, Tamil Nadu',
      totalOrders: 12, 
      totalSpent: 122000, 
      lastActive: 'Oct 14, 2023', 
      status: 'Wholesale',
      recentPurchases: [
        { orderId: 'ORD-9901', date: 'Oct 14, 2023', items: '7 Color Rockets (100pcs Bulk)', total: 45000 },
        { orderId: 'ORD-9540', date: 'Sep 12, 2023', items: 'Chakra Ground Spinner (Bulk)', total: 77000 }
      ]
    },
    { 
      id: 'CUST-004', 
      sno: 4,
      name: 'Arun Kumar', 
      phone: '+91 9876512345', 
      email: 'arun.kumar@gmail.com',
      location: 'Coimbatore, Tamil Nadu',
      totalOrders: 2, 
      totalSpent: 15400, 
      lastActive: 'Sep 10, 2023', 
      status: 'Regular',
      recentPurchases: [
        { orderId: 'ORD-7612', date: 'Sep 10, 2023', items: 'Electric Sparklers Gold (20pcs)', total: 9000 }
      ]
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery)
  );

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
          href={`https://wa.me/?text=Hello!%20Check%20out%20special%20festive%20firecracker%20offers%20at%20Karuppan%20Crackers!`}
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {filteredCustomers.map((customer) => (
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
                href={`https://wa.me/91${selectedCustomer.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedCustomer.name)},%20thank%20you%20for%20shopping%20with%20Karuppan%20Crackers!`}
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
