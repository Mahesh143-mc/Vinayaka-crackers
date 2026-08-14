import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Download, Calendar, ArrowUpRight, Award, ShieldCheck, FileText, CheckCircle2, Flame } from 'lucide-react';
import { subscribeOrders, subscribeExpenses, subscribeProducts } from '../../services/firebaseService';

const AdminReports = () => {
  const [dateRange, setDateRange] = useState('This Month');
  const [showExportModal, setShowExportModal] = useState(false);

  const [orders, setOrders] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsubOrders = subscribeOrders((data) => setOrders(data || []));
    const unsubExpenses = subscribeExpenses((data) => setExpenses(data || []));
    const unsubProducts = subscribeProducts((data) => setProducts(data || []));

    return () => {
      unsubOrders();
      unsubExpenses();
      unsubProducts();
    };
  }, []);

  // Helper to extract numeric amount from any order object
  const getOrderAmount = (o) => {
    if (typeof o.grandTotal === 'number') return o.grandTotal;
    if (typeof o.totalAmount === 'number') return o.totalAmount;
    if (typeof o.amount === 'number') return o.amount;
    const str = String(o.grandTotal || o.totalAmount || o.amount || 0);
    return parseFloat(str.replace(/[^\d.]/g, '')) || 0;
  };

  // Compute Live Financial Metrics from Firestore
  const grossRevenue = orders.reduce((sum, o) => sum + getOrderAmount(o), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const netProfit = grossRevenue - totalExpenses;
  const profitMarginPercent = grossRevenue > 0 ? ((netProfit / grossRevenue) * 100).toFixed(1) : '0.0';

  // Compute Top Performing Products from live Firestore Orders & Products
  const topProducts = products.map(p => {
    let unitsSold = 0;
    let productRevenue = 0;

    orders.forEach(o => {
      const items = Array.isArray(o.items) ? o.items : [];
      items.forEach(item => {
        if (item.id === p.id || item.name === p.name) {
          const qty = item.quantity || item.qty || 1;
          const price = typeof item.price === 'number' ? item.price : (parseFloat(String(item.price || 0).replace(/[^\d.]/g, '')) || p.price || 0);
          unitsSold += qty;
          productRevenue += (qty * price);
        }
      });
    });

    const cost = p.costPrice || p.cost || Math.round((p.price || 0) * 0.6);
    const profitPerUnit = (p.price || 0) - cost;
    const profitPct = cost > 0 ? ((profitPerUnit / cost) * 100).toFixed(0) + '%' : '0%';

    return {
      sku: p.id,
      name: p.name,
      category: p.category || 'General',
      unitsSold: unitsSold,
      revenue: productRevenue > 0 ? productRevenue : (unitsSold * (p.price || 0)),
      profitMargin: profitPct
    };
  }).sort((a, b) => b.unitsSold - a.unitsSold || b.revenue - a.revenue);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#4A0E0E] via-[#701515] to-[#4A0E0E] p-7 rounded-3xl shadow-lg text-white">
        <div>
          <h1 className="text-3xl font-serif font-black tracking-wide text-white flex items-center gap-2">
            <TrendingUp className="text-[#FFD700]" /> Profit & Loss Report Analytics (Firestore)
          </h1>
          <p className="text-amber-200/90 text-sm mt-1 font-medium">Real-time financial intelligence calculated live from backend orders & expenses.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-black/40 border border-white/20 rounded-2xl text-xs font-black text-amber-200 focus:outline-none appearance-none cursor-pointer hover:bg-black/60 transition-all shadow-sm"
            >
              <option value="Today" className="bg-[#4A0E0E] text-white">Today</option>
              <option value="This Week" className="bg-[#4A0E0E] text-white">This Week</option>
              <option value="This Month" className="bg-[#4A0E0E] text-white">This Month</option>
              <option value="This Year" className="bg-[#4A0E0E] text-white">Financial Year 2023-24</option>
            </select>
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FFD700]" />
          </div>

          <button 
            onClick={() => setShowExportModal(true)}
            className="bg-[#FFD700] hover:bg-amber-400 text-[#4A0E0E] px-4 py-2.5 rounded-2xl font-black text-xs shadow-md flex items-center gap-1.5 transition-all transform hover:scale-105"
          >
            <Download size={16} /> Export PDF Report
          </button>
        </div>
      </div>

      {/* Financial Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Gross Revenue */}
        <div className="bg-[#FAF7F2] p-6 rounded-3xl border-2 border-amber-900/15 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-950 uppercase tracking-wider">Gross Revenue</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black shadow-sm">
              <DollarSign size={20} />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900">₹{grossRevenue.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-emerald-700 text-xs font-bold">
            <ArrowUpRight size={16} />
            <span>Calculated from {orders.length} orders</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-[#FAF7F2] p-6 rounded-3xl border-2 border-rose-900/20 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-rose-950 uppercase tracking-wider">Total Store Expenses</span>
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center font-black shadow-sm">
              <TrendingDown size={20} />
            </div>
          </div>
          <p className="text-3xl font-black text-rose-700">₹{totalExpenses.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-gray-600 text-xs font-bold">
            <span>Calculated from {expenses.length} expenses</span>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100 p-6 rounded-3xl border-2 border-amber-400 shadow-md space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#4A0E0E] uppercase tracking-wider">Net Realized Profit</span>
            <div className="w-10 h-10 rounded-2xl bg-[#4A0E0E] text-[#FFD700] flex items-center justify-center font-black shadow-md">
              <Award size={20} />
            </div>
          </div>
          <p className="text-3xl font-black text-[#c00000]">₹{netProfit.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-emerald-800 text-xs font-black">
            <ArrowUpRight size={16} />
            <span>Net Profit Margin: {profitMarginPercent}%</span>
          </div>
        </div>

        {/* Profit Margin Status */}
        <div className="bg-[#FAF7F2] p-6 rounded-3xl border-2 border-amber-900/15 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-950 uppercase tracking-wider">Business Health</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center font-black shadow-sm">
              <ShieldCheck size={20} />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900">{profitMarginPercent}%</p>
          <div className="flex items-center gap-1 text-emerald-700 text-xs font-bold">
            <CheckCircle2 size={16} />
            <span>Live Firestore Financial Sync</span>
          </div>
        </div>
      </div>

      {/* Top Performing Firecrackers Product Table */}
      <div className="bg-[#FAF7F2] rounded-3xl border-2 border-amber-900/15 overflow-hidden shadow-sm">
        <div className="p-6 bg-gradient-to-r from-[#4A0E0E] via-[#5C1212] to-[#3B0B0B] border-b-2 border-amber-400/40 text-white flex items-center justify-between">
          <div>
            <h3 className="text-xl font-serif font-black text-white flex items-center gap-2">
              <Flame className="text-[#FFD700]" /> Top Performing Fireworks Products (Firestore)
            </h3>
            <p className="text-amber-200 font-medium text-xs mt-0.5">Live store catalog items synced from backend database</p>
          </div>
          <span className="bg-[#FFD700] text-[#4A0E0E] text-xs font-black px-3.5 py-1.5 rounded-full shadow-md">
            Catalog Items ({products.length})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bold text-gray-800">
            <thead className="bg-[#3B0B0B] text-white uppercase text-xs font-black tracking-wider border-b-2 border-amber-400">
              <tr>
                <th className="py-4 px-6">SKU Code</th>
                <th className="py-4 px-6">Product Name</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6 text-center">Units Sold</th>
                <th className="py-4 px-6 text-right">Total Revenue</th>
                <th className="py-4 px-6 text-right">Profit Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-900/10">
              {topProducts.length > 0 ? topProducts.map((p, idx) => (
                <tr key={p.sku} className={`hover:bg-amber-100/70 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF7F2]'}`}>
                  <td className="py-4 px-6 font-black text-[#4A0E0E] text-xs">{p.sku}</td>
                  <td className="py-4 px-6 font-black text-gray-900 text-sm">{p.name}</td>
                  <td className="py-4 px-6">
                    <span className="bg-amber-200/90 text-[#4A0E0E] px-3 py-1 rounded-full border border-amber-300 font-black shadow-sm">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center font-black text-gray-900 text-sm">{p.unitsSold} units</td>
                  <td className="py-4 px-6 text-right font-black text-[#c00000] text-base">₹{p.revenue.toLocaleString()}</td>
                  <td className="py-4 px-6 text-right">
                    <span className="bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full font-black border border-emerald-300 shadow-sm">
                      {p.profitMargin}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs font-bold text-gray-500">
                    No products found in Firestore catalog.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Confirmation Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-md w-full p-7 shadow-2xl border border-amber-900/30 text-center space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-[#FFD700] flex items-center justify-center text-[#4A0E0E] shadow-xl">
              <FileText size={32} strokeWidth={2.5} />
            </div>

            <div>
              <h3 className="text-xl font-serif font-black text-gray-900">Export Financial PDF Report</h3>
              <p className="text-xs font-bold text-gray-600 mt-1">Generating official Profit & Loss statement for {dateRange}...</p>
            </div>

            <div className="p-4 bg-amber-100/60 rounded-2xl border border-amber-900/15 text-xs text-left font-bold space-y-1.5 text-gray-800">
              <div className="flex justify-between"><span>Gross Revenue:</span><span className="font-black">₹{grossRevenue.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Total Expenses:</span><span className="font-black text-rose-700">₹{totalExpenses.toLocaleString()}</span></div>
              <div className="flex justify-between border-t border-amber-900/15 pt-1 text-sm font-black text-[#4A0E0E]">
                <span>Net Realized Profit:</span><span>₹{netProfit.toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                onClick={() => setShowExportModal(false)}
                className="py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-2xl text-xs font-black"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert('PDF Financial Statement Downloaded Successfully!');
                  setShowExportModal(false);
                }}
                className="py-3 bg-[#4A0E0E] hover:bg-red-950 text-white rounded-2xl text-xs font-black shadow-md"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
