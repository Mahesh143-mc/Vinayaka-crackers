import { useState, useEffect } from 'react';
import { 
  IndianRupee, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  PackageOpen,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { subscribeOrders, subscribeProducts, subscribeCustomers } from '../../services/firebaseService';

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
  <div className="bg-[#FAF7F2] p-6 rounded-3xl shadow-sm border border-amber-900/10 hover:border-amber-500 transition-all group">
    <div className="flex items-center justify-between">
      <div className={`p-3 rounded-2xl ${color} shadow-sm group-hover:scale-110 transition-transform`}>
        <Icon size={24} className="text-white" />
      </div>
      <span className="flex items-center text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
        {trend} <ArrowUpRight size={14} />
      </span>
    </div>
    <div className="mt-4">
      <p className="text-xs font-black uppercase text-amber-950 tracking-wider">{title}</p>
      <h3 className="text-3xl font-black text-gray-900 mt-1">{value}</h3>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customersCount, setCustomersCount] = useState(0);

  useEffect(() => {
    const unsubOrders = subscribeOrders((data) => {
      if (data) setOrders(data);
    });

    const unsubProducts = subscribeProducts((data) => {
      if (data) setProducts(data);
    });

    const unsubCustomers = subscribeCustomers((data) => {
      if (data) setCustomersCount(data.length);
    });

    return () => {
      unsubOrders();
      unsubProducts();
      unsubCustomers();
    };
  }, []);

  // Compute Live Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.grandTotal || o.amount || 0), 0);
  const totalOrdersCount = orders.length;
  const lowStockList = products.filter(p => Number(p.stock || 0) <= 15).slice(0, 5);
  const recentOrdersList = orders.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#4A0E0E] via-[#701515] to-[#4A0E0E] rounded-3xl p-8 shadow-lg text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between">
        <div className="relative z-10 mb-6 md:mb-0 text-center md:text-left">
          <h1 className="text-white text-3xl md:text-4xl font-serif font-black mb-2 flex items-center justify-center md:justify-start gap-3">
            Welcome back, Admin! <Sparkles className="text-[#FFD700]" />
          </h1>
          <p className="text-amber-200/90 font-medium text-base">Here's a real-time overview of your Sivakasi store live on Firebase.</p>
        </div>
        <div className="relative z-10">
          <button className="bg-gradient-to-r from-[#FFD700] to-amber-500 text-[#4A0E0E] px-6 py-3 rounded-2xl font-black text-sm shadow-md hover:scale-105 transition-all">
            Export Daily Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`₹${totalRevenue.toLocaleString()}`} 
          icon={IndianRupee} 
          trend="+14.2%" 
          color="bg-[#4A0E0E]"
        />
        <StatCard 
          title="Total Orders" 
          value={totalOrdersCount} 
          icon={ShoppingCart} 
          trend="+8.1%" 
          color="bg-amber-600"
        />
        <StatCard 
          title="Active Customers" 
          value={customersCount} 
          icon={Users} 
          trend="+5.4%" 
          color="bg-emerald-700"
        />
        <StatCard 
          title="Growth Rate" 
          value="24.8%" 
          icon={TrendingUp} 
          trend="+2.3%" 
          color="bg-purple-700"
        />
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-[#FAF7F2] rounded-3xl shadow-sm border border-amber-900/10 overflow-hidden">
          <div className="p-6 border-b border-amber-900/10 bg-[#EFEAE1] flex items-center justify-between">
            <div>
              <h3 className="text-lg font-serif font-black text-gray-900">Live Recent Orders (Firestore)</h3>
              <p className="text-xs text-amber-950 font-bold mt-0.5">Real-time orders synced directly from backend database.</p>
            </div>
            <button className="text-xs font-black text-[#4A0E0E] hover:underline">View All</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#4A0E0E] text-[#FFD700] text-xs font-black uppercase tracking-widest border-b border-red-950">
                  <th className="px-6 py-5">Order ID</th>
                  <th className="px-6 py-5">Customer</th>
                  <th className="px-6 py-5">Amount</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-900/10 text-sm">
                {recentOrdersList.length > 0 ? recentOrdersList.map((order, idx) => (
                  <tr key={order.id || idx} className={idx % 2 === 0 ? 'bg-[#FAF7F2]' : 'bg-[#F2ECE1]'}>
                    <td className="px-6 py-4.5 font-black text-gray-900">{order.id || order.orderId}</td>
                    <td className="px-6 py-4 font-bold text-gray-800">{order.customer || 'Walk-in Customer'}</td>
                    <td className="px-6 py-4 font-black text-[#4A0E0E]">₹{Number(order.grandTotal || order.amount || 0).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-black border ${
                        order.status === 'Delivered' || order.status === 'Completed' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
                        order.status === 'Pending' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                        'bg-blue-100 text-blue-900 border-blue-300'
                      }`}>
                        {order.status || 'Delivered'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-500">{order.date || 'Today'}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-xs font-bold text-gray-500">
                      No recent orders in Firestore yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-[#FAF7F2] rounded-3xl p-6 shadow-sm border border-amber-900/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-amber-900/10">
              <div className="p-3 bg-amber-100 text-amber-900 rounded-2xl">
                <PackageOpen size={22} />
              </div>
              <div>
                <h3 className="text-lg font-serif font-black text-gray-900">Low Stock Alerts (Live)</h3>
                <p className="text-xs text-amber-950 font-bold">Products needing restock soon.</p>
              </div>
            </div>

            <div className="space-y-4">
              {lowStockList.length > 0 ? lowStockList.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-amber-900/10">
                  <div>
                    <h4 className="text-sm font-black text-gray-900">{item.name}</h4>
                    <span className="text-[10px] font-bold text-amber-900 uppercase">{item.category}</span>
                  </div>
                  <span className="text-xs font-black text-rose-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-300">
                    {item.stock} left
                  </span>
                </div>
              )) : (
                <p className="text-xs font-bold text-emerald-800 text-center py-4">All products have healthy stock levels!</p>
              )}
            </div>
          </div>

          <button className="w-full mt-6 py-3 bg-[#4A0E0E] text-white font-bold rounded-2xl text-xs hover:bg-red-950 shadow-sm transition-colors">
            Manage Full Inventory
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
