import { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Download, Calendar, Filter, ArrowUpRight, ArrowDownRight, Award, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

const AdminReports = () => {
  const [dateRange, setDateRange] = useState('This Month');
  const [showExportModal, setShowExportModal] = useState(false);

  // Financial Metrics
  const grossRevenue = 485200;
  const totalExpenses = 194800;
  const netProfit = grossRevenue - totalExpenses;
  const profitMarginPercent = ((netProfit / grossRevenue) * 100).toFixed(1);

  // Top Selling Products
  const topProducts = [
    { sku: 'PRD-01', name: '120 Shots Multi-color', category: 'Fancy', unitsSold: 145, revenue: 174000, profitMargin: '62%' },
    { sku: 'PRD-02', name: 'Giant Sparklers (50pcs)', category: 'Sparklers', unitsSold: 320, revenue: 112000, profitMargin: '58%' },
    { sku: 'PRD-04', name: 'Flower Pots Mega', category: 'Fountains', unitsSold: 110, revenue: 71500, profitMargin: '54%' },
    { sku: 'PRD-03', name: 'Lakshmi Bomb Deluxe', category: 'Bombs', unitsSold: 280, revenue: 42000, profitMargin: '48%' },
    { sku: 'PRD-06', name: '7 Color Rockets (10pcs)', category: 'Fancy', unitsSold: 95, revenue: 80750, profitMargin: '60%' },
  ];

  // Category Sales Split
  const categorySplit = [
    { category: 'Fancy Sky Shots', percent: 42, amount: 203784, color: 'bg-amber-500' },
    { category: 'Sparklers & Lights', percent: 26, amount: 126152, color: 'bg-[#4A0E0E]' },
    { category: 'Fountains & Pots', percent: 16, amount: 77632, color: 'bg-emerald-600' },
    { category: 'Sound Crackers & Bombs', percent: 11, amount: 53372, color: 'bg-rose-600' },
    { category: 'Novelty & Gift Packs', percent: 5, amount: 24260, color: 'bg-indigo-600' },
  ];

  // Payment Mode Split
  const paymentModes = [
    { mode: 'UPI / GooglePay / PhonePe', percent: '58%', amount: '₹281,416', icon: '📱' },
    { mode: 'Cash on POS Billing', percent: '28%', amount: '₹135,856', icon: '💵' },
    { mode: 'Credit / Debit Cards', percent: '10%', amount: '₹48,520', icon: '💳' },
    { mode: 'Direct Bank Transfer', percent: '4%', amount: '₹19,408', icon: '🏦' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#4A0E0E] via-[#701515] to-[#4A0E0E] p-7 rounded-3xl shadow-lg text-white">
        <div>
          <h1 className="text-3xl font-serif font-black tracking-wide text-white flex items-center gap-2">
            <TrendingUp className="text-[#FFD700]" /> Profit & Loss Report Analytics
          </h1>
          <p className="text-amber-200/90 text-sm mt-1 font-medium">Detailed financial intelligence, profit margins, sales split, and expense analysis.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Selector */}
          <div className="relative">
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-black/40 border border-white/20 rounded-2xl text-xs font-black text-amber-200 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="Today" className="bg-[#4A0E0E] text-white">Today</option>
              <option value="This Week" className="bg-[#4A0E0E] text-white">This Week</option>
              <option value="This Month" className="bg-[#4A0E0E] text-white">This Month (Diwali Peak)</option>
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
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
              <DollarSign size={20} />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900">₹{grossRevenue.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-emerald-700 text-xs font-bold">
            <ArrowUpRight size={16} />
            <span>+24.5% vs last month</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-[#FAF7F2] p-6 rounded-3xl border-2 border-amber-900/15 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-950 uppercase tracking-wider">Total Store Expenses</span>
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center font-black">
              <TrendingDown size={20} />
            </div>
          </div>
          <p className="text-3xl font-black text-rose-700">₹{totalExpenses.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-gray-600 text-xs font-bold">
            <span>Stock Freight & Admin Ops</span>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-gradient-to-br from-[#4A0E0E] to-[#250606] p-6 rounded-3xl border-2 border-[#FFD700]/30 shadow-md text-white space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-300 uppercase tracking-wider">Net Realized Profit</span>
            <div className="w-10 h-10 rounded-2xl bg-[#FFD700] text-[#4A0E0E] flex items-center justify-center font-black">
              <Award size={20} />
            </div>
          </div>
          <p className="text-3xl font-black text-[#FFD700]">₹{netProfit.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
            <ArrowUpRight size={16} />
            <span>Net Profit Margin: {profitMarginPercent}%</span>
          </div>
        </div>

        {/* Profit Margin Status */}
        <div className="bg-[#FAF7F2] p-6 rounded-3xl border-2 border-amber-900/15 shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-950 uppercase tracking-wider">Business Health</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center font-black">
              <ShieldCheck size={20} />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900">{profitMarginPercent}%</p>
          <div className="flex items-center gap-1 text-emerald-700 text-xs font-bold">
            <CheckCircle2 size={16} />
            <span>High Profit Performance</span>
          </div>
        </div>
      </div>

      {/* Category Sales Breakdown & Payment Split Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Share Progress */}
        <div className="lg:col-span-2 bg-[#FAF7F2] p-7 rounded-3xl border-2 border-amber-900/15 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-amber-900/10 pb-4">
            <h3 className="text-lg font-serif font-black text-gray-900 flex items-center gap-2">
              <PieChart className="text-[#4A0E0E]" /> Sales Breakdown by Product Category
            </h3>
            <span className="text-xs font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-full">Diwali 2023</span>
          </div>

          <div className="space-y-4">
            {categorySplit.map((cat) => (
              <div key={cat.category} className="space-y-1.5">
                <div className="flex justify-between text-xs font-black text-gray-900">
                  <span>{cat.category}</span>
                  <span className="text-[#4A0E0E]">₹{cat.amount.toLocaleString()} ({cat.percent}%)</span>
                </div>
                <div className="w-full h-3 bg-amber-200/50 rounded-full overflow-hidden p-0.5 border border-amber-900/10">
                  <div className={`h-full ${cat.color} rounded-full transition-all duration-500`} style={{ width: `${cat.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods Split */}
        <div className="bg-[#FAF7F2] p-7 rounded-3xl border-2 border-amber-900/15 shadow-sm space-y-6">
          <div className="border-b border-amber-900/10 pb-4">
            <h3 className="text-lg font-serif font-black text-gray-900">Payment Modes Split</h3>
            <p className="text-xs text-gray-600 font-bold mt-0.5">Revenue collection methods</p>
          </div>

          <div className="space-y-3.5">
            {paymentModes.map((pm) => (
              <div key={pm.mode} className="bg-white p-3.5 rounded-2xl border border-amber-900/10 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{pm.icon}</span>
                  <div>
                    <p className="text-xs font-black text-gray-900">{pm.mode}</p>
                    <p className="text-[10px] font-bold text-gray-500">{pm.percent} of total collection</p>
                  </div>
                </div>
                <span className="font-black text-xs text-[#4A0E0E]">{pm.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Firecrackers Product Table */}
      <div className="bg-[#FAF7F2] rounded-3xl border-2 border-amber-900/15 overflow-hidden shadow-sm">
        <div className="p-6 bg-gradient-to-r from-[#4A0E0E] to-[#250606] text-white flex items-center justify-between">
          <div>
            <h3 className="text-xl font-serif font-black">🔥 Top Performing Fireworks Products</h3>
            <p className="text-amber-200/90 text-xs font-medium mt-0.5">Highest grossing items ranked by profit contribution</p>
          </div>
          <span className="bg-[#FFD700] text-[#4A0E0E] text-xs font-black px-3 py-1 rounded-full">Top 5 Bestsellers</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bold text-gray-800">
            <thead className="bg-[#4A0E0E] text-[#FFD700] uppercase text-[10px] font-black border-b border-red-950">
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
              {topProducts.map((p, idx) => (
                <tr key={p.sku} className={`hover:bg-amber-100/60 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF7F2]'}`}>
                  <td className="py-4 px-6 font-black text-gray-900">{p.sku}</td>
                  <td className="py-4 px-6 font-black text-gray-900 text-sm">{p.name}</td>
                  <td className="py-4 px-6">
                    <span className="bg-amber-200 text-[#4A0E0E] px-2.5 py-0.5 rounded-full border border-amber-300 font-black">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center font-black text-gray-900 text-sm">{p.unitsSold} units</td>
                  <td className="py-4 px-6 text-right font-black text-[#c00000] text-sm">₹{p.revenue.toLocaleString()}</td>
                  <td className="py-4 px-6 text-right">
                    <span className="bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full font-black border border-emerald-300">
                      {p.profitMargin}
                    </span>
                  </td>
                </tr>
              ))}
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
              <div className="flex justify-between"><span>Gross Revenue:</span><span className="font-black">₹485,200</span></div>
              <div className="flex justify-between"><span>Total Expenses:</span><span className="font-black text-rose-700">₹194,800</span></div>
              <div className="flex justify-between border-t border-amber-900/15 pt-1 text-sm font-black text-[#4A0E0E]">
                <span>Net Realized Profit:</span><span>₹290,400</span>
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
