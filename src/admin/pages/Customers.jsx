import { useState } from 'react';
import { Search, MessageCircle, Calendar, Users, Send } from 'lucide-react';

const AdminCustomers = () => {
  const [customers] = useState([
    { id: 'CUST-001', name: 'Rahul Sharma', phone: '+91 9876543210', totalOrders: 5, totalSpent: 45500, lastActive: 'Oct 15, 2023', status: 'VIP' },
    { id: 'CUST-002', name: 'Priya Patel', phone: '+91 9123456789', totalOrders: 1, totalSpent: 8200, lastActive: 'Oct 15, 2023', status: 'New' },
    { id: 'CUST-003', name: 'Vikram Singh', phone: '+91 9988776655', totalOrders: 12, totalSpent: 122000, lastActive: 'Oct 14, 2023', status: 'Wholesale' },
    { id: 'CUST-004', name: 'Arun Kumar', phone: '+91 9876512345', totalOrders: 2, totalSpent: 15400, lastActive: 'Sep 10, 2023', status: 'Regular' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery)
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#4A0E0E] via-[#701515] to-[#4A0E0E] p-7 rounded-3xl shadow-lg text-white">
        <div>
          <h1 className="text-3xl font-serif font-black tracking-wide text-white flex items-center gap-2">
            <Users className="text-amber-400" /> Customer CRM & Broadcasts
          </h1>
          <p className="text-amber-200/90 text-sm mt-1 font-medium">Manage buyer profiles, track festival spending, and launch WhatsApp offers.</p>
        </div>
        <button className="bg-[#25D366] hover:bg-[#1ebd53] text-white px-5 py-2.5 rounded-2xl font-bold shadow-md flex items-center gap-2">
          <Send size={18} /> Send WhatsApp Broadcast
        </button>
      </div>

      {/* Filter Bar */}
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
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {filteredCustomers.map((customer) => (
          <div 
            key={customer.id} 
            className="bg-[#FAF7F2] rounded-3xl p-6 shadow-sm border border-amber-900/10 flex flex-col justify-between group hover:border-amber-500 transition-all"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4A0E0E] to-amber-600 flex items-center justify-center text-white font-black text-xl shadow-sm">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-base">{customer.name}</h3>
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
              </div>

              <div className="space-y-2.5 my-4 bg-[#EFEAE1]/70 p-3 rounded-2xl border border-amber-900/10 text-xs">
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
                  <p className="font-black text-[#4A0E0E] text-base">₹{customer.totalSpent.toLocaleString()}</p>
                </div>
              </div>
              
              <button className="w-full mt-4 py-2.5 bg-white border border-amber-900/10 group-hover:bg-[#4A0E0E] group-hover:text-white rounded-xl text-xs font-bold text-gray-800 transition-colors shadow-sm">
                View Customer Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCustomers;
