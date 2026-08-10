import { useState } from 'react';
import { Plus, Search, Trash2, Edit3, DollarSign, Truck, ShoppingBag, Users, Calendar, Filter, CheckCircle2, AlertCircle, X, ShieldAlert } from 'lucide-react';

const AdminExpenses = () => {
  const [expenses, setExpenses] = useState([
    { id: 'EXP-101', title: 'Factory Bulk Crackers Purchase (Sivakasi)', category: 'Firecracker Stock', amount: 145000, date: '2023-10-05', vendor: 'Sri Lakshmi Pyro Factory', paymentMode: 'Bank Transfer' },
    { id: 'EXP-102', title: 'Lorry Freight & Transport Charges', category: 'Transport & Freight', amount: 18500, date: '2023-10-08', vendor: 'VRL Logistics', paymentMode: 'UPI' },
    { id: 'EXP-103', title: 'Shop Helper Wages & Food Allowance', category: 'Staff Wages', amount: 12000, date: '2023-10-12', vendor: 'Diwali Shop Staff', paymentMode: 'Cash' },
    { id: 'EXP-104', title: 'Cardboard Box Packaging & Tags', category: 'Packaging Materials', amount: 9800, date: '2023-10-14', vendor: 'Sivakasi Packaging Printers', paymentMode: 'UPI' },
    { id: 'EXP-105', title: 'Commercial Shop Electricity & Generators', category: 'Utilities', amount: 9500, date: '2023-10-15', vendor: 'TNEB Commercial', paymentMode: 'Bank Transfer' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // New Expense Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Firecracker Stock');
  const [newAmount, setNewAmount] = useState('');
  const [newVendor, setNewVendor] = useState('');
  const [newPaymentMode, setNewPaymentMode] = useState('UPI');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);

  // Delete Confirmation State
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const categories = ['All', 'Firecracker Stock', 'Transport & Freight', 'Staff Wages', 'Packaging Materials', 'Utilities', 'Shop Rent'];

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newTitle || !newAmount) return;

    const newEntry = {
      id: `EXP-${Math.floor(Math.random() * 900 + 100)}`,
      title: newTitle,
      category: newCategory,
      amount: parseFloat(newAmount),
      date: newDate,
      vendor: newVendor || 'General Vendor',
      paymentMode: newPaymentMode
    };

    setExpenses([newEntry, ...expenses]);
    setShowAddModal(false);
    setNewTitle('');
    setNewAmount('');
    setNewVendor('');
  };

  const confirmDeleteExpense = () => {
    if (expenseToDelete) {
      setExpenses(expenses.filter(e => e.id !== expenseToDelete.id));
      setExpenseToDelete(null);
    }
  };

  // Financial Metrics
  const grossSalesRevenue = 485200;
  const totalExpenseSum = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfitMargin = grossSalesRevenue - totalExpenseSum;
  const profitPercentage = ((netProfitMargin / grossSalesRevenue) * 100).toFixed(1);

  const filteredExpenses = expenses.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#4A0E0E] via-[#701515] to-[#4A0E0E] p-7 rounded-3xl shadow-lg text-white">
        <div>
          <h1 className="text-3xl font-serif font-black tracking-wide text-white flex items-center gap-2">
            <DollarSign className="text-[#FFD700]" /> Store Expense Tracker & Profit Margin
          </h1>
          <p className="text-amber-200/90 text-sm mt-1 font-medium">Record store expenditures manually to compute exact realized profit margins.</p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#FFD700] hover:bg-amber-400 text-[#4A0E0E] px-5 py-3 rounded-2xl font-black text-xs shadow-md flex items-center gap-2 transition-all transform hover:scale-105"
        >
          <Plus size={18} strokeWidth={3} /> Record New Expense
        </button>
      </div>

      {/* Financial Net Profit Margin Summary Widget */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Gross Sales */}
        <div className="bg-[#FAF7F2] p-6 rounded-3xl border-2 border-amber-900/15 shadow-sm space-y-2">
          <span className="text-xs font-black text-amber-950 uppercase tracking-wider">Gross Sales Revenue</span>
          <p className="text-3xl font-black text-gray-900">₹{grossSalesRevenue.toLocaleString()}</p>
          <p className="text-[11px] font-bold text-gray-500">Total billings collected</p>
        </div>

        {/* Total Expenses Logged */}
        <div className="bg-[#FAF7F2] p-6 rounded-3xl border-2 border-rose-900/20 shadow-sm space-y-2">
          <span className="text-xs font-black text-rose-950 uppercase tracking-wider">Total Expenses Logged ({expenses.length})</span>
          <p className="text-3xl font-black text-rose-700">₹{totalExpenseSum.toLocaleString()}</p>
          <p className="text-[11px] font-bold text-gray-500">Stock purchases & shop overheads</p>
        </div>

        {/* Real Net Profit */}
        <div className="bg-gradient-to-br from-[#4A0E0E] to-[#250606] p-6 rounded-3xl border-2 border-[#FFD700]/40 shadow-md text-white space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-amber-300 uppercase tracking-wider">Realized Net Profit</span>
            <span className="bg-[#FFD700] text-[#4A0E0E] font-black text-[10px] px-2.5 py-0.5 rounded-full">
              {profitPercentage}% Margin
            </span>
          </div>
          <p className="text-3xl font-black text-[#FFD700]">₹{netProfitMargin.toLocaleString()}</p>
          <p className="text-[11px] font-bold text-amber-200/80">Revenue minus total recorded expenses</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#EFEAE1] p-4 rounded-3xl border border-amber-900/10 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-800" size={19} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search expense title or vendor name..." 
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-amber-900/10 rounded-2xl focus:outline-none text-sm font-bold text-gray-800"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat 
                  ? 'bg-[#4A0E0E] text-white font-black shadow-sm' 
                  : 'bg-white text-gray-700 hover:bg-amber-100 border border-amber-900/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Itemized Expenses Table */}
      <div className="bg-[#FAF7F2] rounded-3xl border-2 border-amber-900/15 overflow-hidden shadow-sm">
        <div className="p-6 bg-gradient-to-r from-[#4A0E0E] to-[#250606] text-white flex items-center justify-between">
          <div>
            <h3 className="text-xl font-serif font-black">📋 Itemized Expense Log</h3>
            <p className="text-amber-200/90 text-xs font-medium mt-0.5">Showing {filteredExpenses.length} expense entries</p>
          </div>
          <span className="bg-[#FFD700] text-[#4A0E0E] text-xs font-black px-3 py-1 rounded-full">
            Total: ₹{filteredExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bold text-gray-800">
            <thead className="bg-[#4A0E0E] text-[#FFD700] uppercase text-[10px] font-black border-b border-red-950">
              <tr>
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Expense Title & Description</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Vendor / Receiver</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6 text-right">Amount (₹)</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-900/10">
              {filteredExpenses.map((exp, idx) => (
                <tr key={exp.id} className={`hover:bg-amber-100/60 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF7F2]'}`}>
                  <td className="py-4 px-6 font-black text-gray-900">{exp.id}</td>
                  <td className="py-4 px-6">
                    <p className="font-black text-gray-900 text-sm">{exp.title}</p>
                    <span className="text-[10px] text-gray-500 font-bold">Paid via {exp.paymentMode}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-amber-200/80 text-[#4A0E0E] px-2.5 py-0.5 rounded-full border border-amber-300 font-black">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-gray-700">{exp.vendor}</td>
                  <td className="py-4 px-6 font-bold text-gray-600">{exp.date}</td>
                  <td className="py-4 px-6 text-right font-black text-rose-700 text-base">₹{exp.amount.toLocaleString()}</td>
                  <td className="py-4 px-6 text-center">
                    <button 
                      onClick={() => setExpenseToDelete(exp)}
                      className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Delete expense"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record New Expense Modal Form */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddExpense} className="bg-[#FAF7F2] rounded-3xl max-w-lg w-full p-7 shadow-2xl border border-amber-900/30 space-y-5 animate-in fade-in zoom-in duration-200 relative">
            <button 
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-amber-200/80 hover:bg-amber-300 text-[#4A0E0E] flex items-center justify-center font-black"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 border-b border-amber-900/15 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4A0E0E] to-amber-700 flex items-center justify-center text-white font-black text-xl shadow-md">
                <Plus size={24} />
              </div>
              <div>
                <h3 className="text-xl font-serif font-black text-gray-900">Record Store Expense</h3>
                <p className="text-xs font-bold text-gray-500">Enter expense details to update Net Profit calculations</p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Expense Title *</label>
                <input 
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Lorry Freight Charges / Sivakasi Stock Purchase"
                  className="w-full p-3 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none focus:border-[#4A0E0E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Category *</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-3 bg-white border-2 border-amber-900/20 rounded-2xl text-xs font-black text-gray-900 focus:outline-none"
                  >
                    {categories.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Amount (₹) *</label>
                  <input 
                    type="number"
                    required
                    min="1"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="e.g. 15000"
                    className="w-full p-3 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none focus:border-[#4A0E0E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Vendor / Payee Name</label>
                  <input 
                    type="text"
                    value={newVendor}
                    onChange={(e) => setNewVendor(e.target.value)}
                    placeholder="General Vendor"
                    className="w-full p-3 bg-white border-2 border-amber-900/20 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Payment Mode</label>
                  <select 
                    value={newPaymentMode}
                    onChange={(e) => setNewPaymentMode(e.target.value)}
                    className="w-full p-3 bg-white border-2 border-amber-900/20 rounded-2xl text-xs font-black text-gray-900 focus:outline-none"
                  >
                    <option value="UPI">UPI / GPay</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-amber-900/15">
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                className="py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-2xl text-xs font-black"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="py-3 bg-[#4A0E0E] hover:bg-red-950 text-white rounded-2xl text-xs font-black shadow-md"
              >
                Save Expense Record
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Expense Confirmation Modal */}
      {expenseToDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-md w-full p-7 shadow-2xl border border-amber-900/30 text-center space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shadow-md">
              <ShieldAlert size={36} />
            </div>

            <div>
              <h3 className="text-xl font-serif font-black text-gray-900">Delete Expense Entry?</h3>
              <p className="text-xs font-bold text-gray-600 mt-1">
                Are you sure you want to delete <span className="text-gray-900 font-black">"{expenseToDelete.title}"</span> (₹{expenseToDelete.amount.toLocaleString()})?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                onClick={() => setExpenseToDelete(null)}
                className="py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-2xl text-xs font-black"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteExpense}
                className="py-3 bg-rose-700 hover:bg-rose-800 text-white rounded-2xl text-xs font-black shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExpenses;
