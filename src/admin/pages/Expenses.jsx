import { useState, useEffect } from 'react';
import { Plus, DollarSign, Tag, ShieldAlert } from 'lucide-react';
import { 
  subscribeExpenses, 
  deleteExpenseFromFirestore, 
  subscribeOrders,
  subscribeExpenseCategories
} from '../../services/firebaseService';
import { useToast } from '../../context/ToastContext';
import { isWithinDateRange } from '../../utils/dateFilterUtil';
import LoadingSpinner from '../../components/common/LoadingSpinner';

import ExpenseStatsWidget from '../components/expenses/ExpenseStatsWidget';
import ExpenseTable from '../components/expenses/ExpenseTable';
import RecordExpenseModal from '../components/expenses/RecordExpenseModal';
import EditExpenseModal from '../components/expenses/EditExpenseModal';
import ManageCategoriesModal from '../components/expenses/ManageCategoriesModal';

const AdminExpenses = () => {
  const { showToast } = useToast();
  // Real-time Firestore State Collections
  const [expenses, setExpenses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customCategories, setCustomCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Date Filter State
  const [dateFilter, setDateFilter] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  useEffect(() => {
    const unsubExpenses = subscribeExpenses((firestoreExpenses) => {
      setExpenses(firestoreExpenses || []);
      setIsLoading(false);
    });

    const unsubOrders = subscribeOrders((firestoreOrders) => {
      setOrders(firestoreOrders || []);
    });

    const unsubCategories = subscribeExpenseCategories((cats) => {
      setCustomCategories(cats || []);
    });

    return () => {
      unsubExpenses();
      unsubOrders();
      unsubCategories();
    };
  }, []);

  // Filter & Search & Pagination States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
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

  // Scroll to top on page change
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

  // Modal Visibility States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showManageCategoriesModal, setShowManageCategoriesModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const triggerSuccess = (msg) => {
    showToast(msg, 'success');
  };

  // Category Names
  const allCategoryNames = customCategories.map(c => c.name || c.id);
  const categories = ['All', ...allCategoryNames];

  // Dynamic Date-filtered orders & expenses for Metrics & Table
  const filteredOrders = orders.filter(o => isWithinDateRange(o.createdAt || o.date, dateFilter, customStartDate, customEndDate));
  const dateFilteredExpenses = expenses.filter(e => isWithinDateRange(e.date || e.createdAt, dateFilter, customStartDate, customEndDate));

  // Financial Net Profit Calculations
  const grossSalesRevenue = filteredOrders.reduce((sum, o) => {
    if (typeof o.grandTotal === 'number') return sum + o.grandTotal;
    if (typeof o.totalAmount === 'number') return sum + o.totalAmount;
    if (typeof o.amount === 'number') return sum + o.amount;
    const str = String(o.grandTotal || o.totalAmount || o.amount || 0);
    return sum + (parseFloat(str.replace(/[^\d.]/g, '')) || 0);
  }, 0);

  const totalExpenseSum = dateFilteredExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const netProfitMargin = grossSalesRevenue - totalExpenseSum;
  const profitPercentage = grossSalesRevenue > 0 ? ((netProfitMargin / grossSalesRevenue) * 100).toFixed(1) : 0;

  const confirmDeleteExpense = async () => {
    if (expenseToDelete) {
      setExpenses(expenses.filter(e => e.id !== expenseToDelete.id));
      await deleteExpenseFromFirestore(expenseToDelete.id);
      showToast(`Expense #${expenseToDelete.id} removed from Firestore!`, 'success');
      setExpenseToDelete(null);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#4A0E0E] via-[#701515] to-[#4A0E0E] p-7 rounded-3xl shadow-lg text-white">
          <div>
            <h1 className="text-3xl font-serif font-black tracking-wide text-white flex items-center gap-2">
              <DollarSign className="text-[#FFD700]" /> Store Expense Tracker & Profit Margin
            </h1>
            <p className="text-amber-200/90 text-sm mt-1 font-medium">Record store expenditures manually to compute exact realized profit margins.</p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Manage Categories Header Button */}
            <button
              type="button"
              onClick={() => setShowManageCategoriesModal(true)}
              className="bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-400/30 px-4 py-3 rounded-2xl font-bold text-xs backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Tag size={16} /> Manage Categories
            </button>

            {/* Record New Expense Button */}
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="bg-[#FFD700] hover:bg-amber-400 text-[#4A0E0E] px-5 py-3 rounded-2xl font-black text-xs shadow-md flex items-center gap-2 transition-all transform hover:scale-105 cursor-pointer"
            >
              <Plus size={18} strokeWidth={3} /> Record New Expense
            </button>
          </div>
        </div>

        {/* Financial KPI Metrics Widget Component */}
        <ExpenseStatsWidget
          grossSalesRevenue={grossSalesRevenue}
          totalExpenseSum={totalExpenseSum}
          netProfitMargin={netProfitMargin}
          profitPercentage={profitPercentage}
          expenseCount={dateFilteredExpenses.length}
        />

        {/* Itemized Table Component / Loading State */}
        {isLoading ? (
          <LoadingSpinner message="Fetching expense records from database..." />
        ) : (
          <ExpenseTable
            expenses={dateFilteredExpenses}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            customStartDate={customStartDate}
            setCustomStartDate={setCustomStartDate}
            customEndDate={customEndDate}
            setCustomEndDate={setCustomEndDate}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortField={sortField}
            sortOrder={sortOrder}
            handleSort={handleSort}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            onEditExpense={(exp) => setEditingExpense(exp)}
            onDeleteExpense={(exp) => setExpenseToDelete(exp)}
            onOpenManageCategories={() => setShowManageCategoriesModal(true)}
          />
        )}
      </div>

      {/* Record New Expense Modal Component */}
      <RecordExpenseModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        expenses={expenses}
        allCategoryNames={allCategoryNames}
        onOpenManageCategories={() => setShowManageCategoriesModal(true)}
        triggerSuccess={triggerSuccess}
      />

      {/* Edit Expense Modal Component */}
      <EditExpenseModal
        editingExpense={editingExpense}
        setEditingExpense={setEditingExpense}
        allCategoryNames={allCategoryNames}
        onOpenManageCategories={() => setShowManageCategoriesModal(true)}
        triggerSuccess={triggerSuccess}
      />

      {/* Manage Expense Categories Modal Component */}
      <ManageCategoriesModal
        isOpen={showManageCategoriesModal}
        onClose={() => setShowManageCategoriesModal(false)}
        customCategories={customCategories}
        expenses={expenses}
        triggerSuccess={triggerSuccess}
      />

      {/* Delete Expense Confirmation Dialog */}
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
                className="py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-2xl text-xs font-black cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteExpense}
                className="py-3 bg-rose-700 hover:bg-rose-800 text-white rounded-2xl text-xs font-black shadow-md cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminExpenses;
