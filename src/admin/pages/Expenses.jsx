import { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit3, DollarSign, Truck, ShoppingBag, Users, Calendar, Filter, CheckCircle2, AlertCircle, X, ShieldAlert, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown, ChevronDown } from 'lucide-react';
import { subscribeExpenses, saveExpenseToFirestore, deleteExpenseFromFirestore, subscribeOrders } from '../../services/firebaseService';

const AdminExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsubExpenses = subscribeExpenses((firestoreExpenses) => {
      setExpenses(firestoreExpenses || []);
    });

    const unsubOrders = subscribeOrders((firestoreOrders) => {
      setOrders(firestoreOrders || []);
    });

    return () => {
      unsubExpenses();
      unsubOrders();
    };
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // 15 items per page pagination state
  const itemsPerPage = 15;
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting state
  const [sortField, setSortField] = useState('date');
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

  // Edit Expense State
  const [editingExpense, setEditingExpense] = useState(null);
  const [successToast, setSuccessToast] = useState('');

  const triggerSuccess = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const categories = ['All', 'Firecracker Stock', 'Transport & Freight', 'Staff Wages', 'Packaging Materials', 'Utilities', 'Shop Rent'];

  const handleSaveEditExpense = async (e) => {
    e.preventDefault();
    if (!editingExpense || !editingExpense.title || !editingExpense.amount) return;

    const payload = {
      ...editingExpense,
      amount: Number(editingExpense.amount)
    };

    setExpenses(prev => prev.map(item => item.id === editingExpense.id ? payload : item));
    await saveExpenseToFirestore(payload);

    triggerSuccess(`Expense #${editingExpense.id} updated in Firestore successfully!`);
    setEditingExpense(null);
  };

  const handleAddExpense = async (e) => {
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
    await saveExpenseToFirestore(newEntry);

    setShowAddModal(false);
    setNewTitle('');
    setNewAmount('');
    setNewVendor('');
    triggerSuccess(`New expense "${newEntry.title}" added to Firestore!`);
  };

  const confirmDeleteExpense = async () => {
    if (expenseToDelete) {
      setExpenses(expenses.filter(e => e.id !== expenseToDelete.id));
      await deleteExpenseFromFirestore(expenseToDelete.id);
      triggerSuccess(`Expense #${expenseToDelete.id} deleted from Firestore!`);
      setExpenseToDelete(null);
    }
  };

  // Financial Metrics
  const grossSalesRevenue = orders.reduce((sum, o) => sum + Number(o.grandTotal || o.amount || 0), 0);
  const totalExpenseSum = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const netProfitMargin = grossSalesRevenue - totalExpenseSum;
  const profitPercentage = grossSalesRevenue > 0 ? ((netProfitMargin / grossSalesRevenue) * 100).toFixed(1) : '0.0';

  const filteredExpenses = expenses.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (typeof aVal === 'string') {
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const totalPages = Math.ceil(sortedExpenses.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExpenses = sortedExpenses.slice(startIndex, startIndex + itemsPerPage);

  const renderSortHeader = (label, field, align = 'left') => {
    const isActive = sortField === field;
    return (
      <th 
        onClick={() => handleSort(field)} 
        className={`py-4 px-6 font-black uppercase text-xs cursor-pointer select-none group transition-colors hover:bg-[#2B0808] ${align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'}`}
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

        {/* Real Net Profit (Warm Gold Card) */}
        <div className="bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100 p-6 rounded-3xl border-2 border-amber-400 shadow-md space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-black text-[#4A0E0E] uppercase tracking-wider">Realized Net Profit</span>
            <span className="bg-[#4A0E0E] text-[#FFD700] font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-sm">
              {profitPercentage}% Margin
            </span>
          </div>
          <p className="text-3xl font-black text-[#c00000]">₹{netProfitMargin.toLocaleString()}</p>
          <p className="text-[11px] font-bold text-amber-950/80">Revenue minus total recorded expenses</p>
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

        {/* Category Dropdown Filter */}
        <div className="relative w-full sm:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-9 py-2.5 bg-white border border-amber-900/10 rounded-2xl text-xs sm:text-sm font-black text-gray-800 focus:outline-none appearance-none cursor-pointer hover:bg-amber-50 transition-all shadow-sm"
          >
            <option value="All">All Categories</option>
            {categories.filter(c => c !== 'All').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-900 pointer-events-none stroke-[2.5]" />
          <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-900 pointer-events-none stroke-[2.5]" />
        </div>
      </div>

      {/* Itemized Expenses Table */}
      <div key={currentPage} className="bg-[#FAF7F2] rounded-3xl border-2 border-amber-900/15 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-3 duration-300">
        <div className="p-6 bg-gradient-to-r from-[#4A0E0E] via-[#5C1212] to-[#3B0B0B] border-b-2 border-amber-400/40 text-white flex items-center justify-between">
          <div>
            <h3 className="text-xl font-serif font-black text-white">📋 Itemized Expense Log</h3>
            <p className="text-amber-200 font-medium text-xs mt-0.5">Showing {filteredExpenses.length} expense entries</p>
          </div>
          <span className="bg-[#FFD700] text-[#4A0E0E] text-xs font-black px-3.5 py-1.5 rounded-full shadow-md">
            Total: ₹{filteredExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bold text-gray-800">
            <thead className="bg-[#3B0B0B] text-white uppercase text-xs font-black tracking-wider border-b-2 border-amber-400">
              <tr>
                {renderSortHeader('ID', 'id')}
                {renderSortHeader('Expense Title & Description', 'title')}
                {renderSortHeader('Category', 'category')}
                {renderSortHeader('Vendor / Receiver', 'vendor')}
                {renderSortHeader('Date', 'date')}
                {renderSortHeader('Amount (₹)', 'amount', 'right')}
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-900/10">
              {paginatedExpenses.map((exp, idx) => (
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
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setEditingExpense(exp)}
                        className="p-2 text-amber-800 hover:text-amber-950 hover:bg-amber-100 rounded-xl transition-colors"
                        title="Edit expense details"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => setExpenseToDelete(exp)}
                        className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Delete expense"
                      >
                        <Trash2 size={16} />
                      </button>
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
            Showing <span className="font-black text-[#4A0E0E]">{filteredExpenses.length > 0 ? startIndex + 1 : 0}</span> to <span className="font-black text-[#4A0E0E]">{Math.min(startIndex + itemsPerPage, filteredExpenses.length)}</span> of <span className="font-black text-[#4A0E0E]">{filteredExpenses.length}</span> items
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

      {/* Toast Notification Banner */}
      {successToast && (
        <div className="fixed top-6 right-6 z-[1000005] bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white font-black text-xs sm:text-sm px-5 py-3.5 rounded-2xl shadow-2xl border-2 border-amber-300 flex items-center gap-3 animate-in slide-in-from-top-5 duration-300">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} className="text-[#FFD700]" />
          </div>
          <span>{successToast}</span>
        </div>
      )}

      {/* Edit Expense Modal Form */}
      {editingExpense && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveEditExpense} className="bg-[#FAF7F2] rounded-3xl max-w-lg w-full p-7 shadow-2xl border border-amber-900/30 space-y-5 animate-in fade-in zoom-in duration-200 relative">
            <button
              type="button"
              onClick={() => setEditingExpense(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-amber-200/80 hover:bg-amber-300 text-[#4A0E0E] flex items-center justify-center font-black"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 border-b border-amber-900/15 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4A0E0E] to-amber-700 flex items-center justify-center text-white font-black text-xl shadow-md">
                <Edit3 size={22} />
              </div>
              <div>
                <h3 className="text-xl font-serif font-black text-gray-900">Edit Expense Entry #{editingExpense.id}</h3>
                <p className="text-xs font-bold text-gray-500">Update store expenditure title, category, vendor or amount</p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Expense Title *</label>
                <input
                  type="text"
                  required
                  value={editingExpense.title}
                  onChange={(e) => setEditingExpense({ ...editingExpense, title: e.target.value })}
                  className="w-full p-3 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none focus:border-[#4A0E0E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Category *</label>
                  <select
                    value={editingExpense.category}
                    onChange={(e) => setEditingExpense({ ...editingExpense, category: e.target.value })}
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
                    value={editingExpense.amount}
                    onChange={(e) => setEditingExpense({ ...editingExpense, amount: e.target.value })}
                    className="w-full p-3 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none focus:border-[#4A0E0E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Vendor / Payee Name</label>
                  <input
                    type="text"
                    value={editingExpense.vendor}
                    onChange={(e) => setEditingExpense({ ...editingExpense, vendor: e.target.value })}
                    className="w-full p-3 bg-white border-2 border-amber-900/20 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Payment Mode</label>
                  <select
                    value={editingExpense.paymentMode}
                    onChange={(e) => setEditingExpense({ ...editingExpense, paymentMode: e.target.value })}
                    className="w-full p-3 bg-white border-2 border-amber-900/20 rounded-2xl text-xs font-black text-gray-900 focus:outline-none"
                  >
                    <option value="UPI">UPI / GPay</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Expense Date</label>
                <input
                  type="date"
                  value={editingExpense.date}
                  onChange={(e) => setEditingExpense({ ...editingExpense, date: e.target.value })}
                  className="w-full p-3 bg-white border-2 border-amber-900/20 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-amber-900/15">
              <button
                type="button"
                onClick={() => setEditingExpense(null)}
                className="py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-2xl text-xs font-black"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-3 bg-[#4A0E0E] hover:bg-red-950 text-white rounded-2xl text-xs font-black shadow-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminExpenses;
