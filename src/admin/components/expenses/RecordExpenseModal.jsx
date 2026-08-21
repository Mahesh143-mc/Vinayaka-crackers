import React, { useState } from 'react';
import { Plus, X, ChevronDown } from 'lucide-react';
import { saveExpenseToFirestore } from '../../../services/firebaseService';
import { generateExpenseId } from '../../../utils/idGenerator';

const RecordExpenseModal = ({ 
  isOpen, 
  onClose, 
  expenses = [],
  allCategoryNames, 
  onOpenManageCategories, 
  triggerSuccess 
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAmount || !newCategory) {
      if (!newCategory) {
        setFormError('Please select a category');
      }
      return;
    }

    const expId = generateExpenseId(expenses);
    const newEntry = {
      id: expId,
      title: newTitle.trim(),
      category: newCategory,
      amount: parseFloat(newAmount),
      date: newDate
    };

    try {
      await saveExpenseToFirestore(newEntry);
      triggerSuccess(`New expense "${newEntry.title}" (${newEntry.id}) recorded successfully!`);
      setNewTitle('');
      setNewAmount('');
      setNewCategory('');
      setFormError('');
      onClose();
    } catch (err) {
      console.error("Error saving expense:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <form onSubmit={handleAddExpense} className="bg-[#FAF7F2] rounded-3xl max-w-lg w-full p-7 shadow-2xl border border-amber-900/30 space-y-5 animate-in fade-in zoom-in duration-200 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-amber-200/80 hover:bg-amber-300 text-[#4A0E0E] flex items-center justify-center font-black cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 border-b border-amber-900/15 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4A0E0E] to-amber-700 flex items-center justify-center text-[#FFD700] font-black text-xl shadow-md">
            <Plus size={24} strokeWidth={3} />
          </div>
          <div>
            <h3 className="text-xl font-serif font-black text-gray-900">Record New Store Expense</h3>
            <p className="text-xs font-bold text-gray-500">Log expenditures for stock, payroll, utilities, or rent</p>
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
              placeholder="e.g. Sivakasi Warehouse Stock Load"
              className="w-full p-3 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none focus:border-[#4A0E0E]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[#4A0E0E] uppercase tracking-wider">Category *</label>
                <button
                  type="button"
                  onClick={onOpenManageCategories}
                  className="text-[10px] text-amber-800 hover:text-[#4A0E0E] font-black underline cursor-pointer"
                >
                  + Manage
                </button>
              </div>
              <div className="relative">
                <select
                  required
                  value={newCategory}
                  onChange={(e) => {
                    setNewCategory(e.target.value);
                    if (formError) setFormError('');
                  }}
                  className="w-full pl-3.5 pr-10 py-3 bg-white border-2 border-amber-900/20 hover:border-[#4A0E0E] rounded-2xl text-xs sm:text-sm font-black text-gray-900 focus:outline-none focus:border-[#4A0E0E] appearance-none cursor-pointer shadow-sm transition-all"
                >
                  <option value="" disabled className="text-gray-400 font-normal">
                    Select a category
                  </option>
                  {allCategoryNames.map(cat => (
                    <option key={cat} value={cat} className="font-bold py-1 text-gray-900">{cat}</option>
                  ))}
                </select>
                <ChevronDown size={17} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4A0E0E] pointer-events-none stroke-[2.5]" />
              </div>
              {formError && <p className="text-rose-600 font-bold text-[10px] mt-1">{formError}</p>}
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

          <div>
            <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Expense Date</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full p-3 bg-white border-2 border-amber-900/20 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-amber-900/15">
          <button
            type="button"
            onClick={onClose}
            className="py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-2xl text-xs font-black cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="py-3 bg-[#4A0E0E] hover:bg-red-950 text-white rounded-2xl text-xs font-black shadow-md cursor-pointer"
          >
            Save Expense Record
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecordExpenseModal;
