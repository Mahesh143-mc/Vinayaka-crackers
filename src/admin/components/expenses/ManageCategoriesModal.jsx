import React, { useState } from 'react';
import { Tag, Plus, X, Trash2, ShieldAlert, AlertCircle, Loader2 } from 'lucide-react';
import { saveExpenseCategoryToFirestore, deleteExpenseCategoryFromFirestore } from '../../../services/firebaseService';

const ManageCategoriesModal = ({ 
  isOpen, 
  onClose, 
  customCategories, 
  expenses, 
  triggerSuccess 
}) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState('');

  // Category Deletion Dialog States
  const [categoryToDelete, setCategoryToDelete] = useState(null); // { id, name }
  const [categoryBlockedModal, setCategoryBlockedModal] = useState(null); // { name, count, totalAmount }

  if (!isOpen) return null;

  const allCategoryNames = customCategories.map(c => c.name || c.id);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setCategoryError('');
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;

    if (allCategoryNames.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      setCategoryError(`Category "${trimmed}" already exists!`);
      return;
    }

    setIsSavingCategory(true);
    try {
      await saveExpenseCategoryToFirestore(trimmed);
      setNewCategoryName('');
      triggerSuccess(`Expense category "${trimmed}" added successfully!`);
    } catch (err) {
      console.error("Error adding category:", err);
      setCategoryError("Failed to add category. Please try again.");
    } finally {
      setIsSavingCategory(false);
    }
  };

  const requestDeleteCategory = (catId, catName) => {
    const linkedExpenses = expenses.filter(e => e.category === catName);
    if (linkedExpenses.length > 0) {
      const totalAmount = linkedExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
      setCategoryBlockedModal({
        name: catName,
        count: linkedExpenses.length,
        totalAmount: totalAmount
      });
      return;
    }
    setCategoryToDelete({ id: catId, name: catName });
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteExpenseCategoryFromFirestore(categoryToDelete.id);
      triggerSuccess(`Category "${categoryToDelete.name}" deleted successfully!`);
      setCategoryToDelete(null);
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
        <div className="bg-[#FAF7F2] rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-amber-900/30 space-y-5 animate-in fade-in zoom-in duration-200 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-amber-200/80 hover:bg-amber-300 text-[#4A0E0E] flex items-center justify-center font-black cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3 border-b border-amber-900/15 pb-4">
            <div className="w-11 h-11 rounded-2xl bg-[#4A0E0E] text-[#FFD700] flex items-center justify-center font-black shadow-md shrink-0">
              <Tag size={20} />
            </div>
            <div>
              <h3 className="text-lg font-serif font-black text-gray-900">Manage Expense Categories</h3>
              <p className="text-xs font-bold text-gray-500">Add custom categories for expense grouping</p>
            </div>
          </div>

          {/* Quick Add Form */}
          <form onSubmit={handleAddCategory} className="space-y-2">
            <label className="block text-xs font-black text-[#4A0E0E] uppercase tracking-wider">
              Create New Category
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={newCategoryName}
                onChange={(e) => {
                  setNewCategoryName(e.target.value);
                  if (categoryError) setCategoryError('');
                }}
                placeholder="e.g. Electricity & Power, Marketing..."
                className="flex-1 p-3 bg-white border-2 border-amber-900/20 rounded-2xl text-xs font-black text-gray-900 focus:outline-none focus:border-[#4A0E0E]"
              />
              <button
                type="submit"
                disabled={isSavingCategory || !newCategoryName.trim()}
                className="bg-[#4A0E0E] hover:bg-red-950 disabled:opacity-50 text-[#FFD700] px-4 py-3 rounded-2xl font-black text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                {isSavingCategory ? <Loader2 size={15} className="animate-spin" /> : <Plus size={16} strokeWidth={3} />}
                <span>Add</span>
              </button>
            </div>

            {categoryError && (
              <p className="text-rose-700 font-bold text-[11px] flex items-center gap-1 animate-in fade-in">
                <AlertCircle size={13} /> {categoryError}
              </p>
            )}
          </form>

          {/* Categories List */}
          <div className="space-y-2 pt-2 border-t border-amber-900/10">
            <div className="flex items-center justify-between text-xs font-black text-gray-600 uppercase tracking-wider">
              <span>Active Categories ({customCategories.length})</span>
              <span className="text-[10px] text-amber-800">Synced with Firestore</span>
            </div>

            <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
              {customCategories.length === 0 ? (
                <div className="py-8 text-center text-gray-500 font-bold text-xs space-y-1 bg-amber-50/50 rounded-2xl border border-dashed border-amber-300/80">
                  <p className="text-2xl">🏷️</p>
                  <p className="text-gray-800 font-black">No categories added yet</p>
                  <p className="text-[11px] text-gray-500">Type a name above and click "+ Add" to create your first category.</p>
                </div>
              ) : (
                customCategories.map((c) => {
                  const catName = c.name || c.id;
                  const expenseCount = expenses.filter(e => e.category === catName).length;
                  const hasExpenses = expenseCount > 0;

                  return (
                    <div
                      key={c.id}
                      className="p-2.5 bg-white border border-amber-900/15 rounded-2xl flex items-center justify-between gap-2 shadow-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-2 h-2 rounded-full bg-[#4A0E0E] shrink-0"></span>
                        <span className="text-xs font-black text-gray-900 truncate">{catName}</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 border ${
                          hasExpenses 
                            ? 'bg-amber-100 text-amber-950 border-amber-300' 
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>
                          {expenseCount} {expenseCount === 1 ? 'entry' : 'entries'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => requestDeleteCategory(c.id, catName)}
                        className={`p-1.5 rounded-xl transition-colors shrink-0 cursor-pointer ${
                          hasExpenses
                            ? 'text-amber-800 hover:bg-amber-100'
                            : 'text-rose-600 hover:bg-rose-100'
                        }`}
                        title={hasExpenses ? "Has active expenses (Protected)" : "Delete Category"}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-amber-900/15">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-black text-xs rounded-2xl transition-all cursor-pointer"
            >
              Close Manager
            </button>
          </div>
        </div>
      </div>

      {/* Delete Category Confirmation Dialog (In-App Modal) */}
      {categoryToDelete && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-md w-full p-7 shadow-2xl border border-amber-900/30 text-center space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shadow-md">
              <ShieldAlert size={34} />
            </div>

            <div>
              <h3 className="text-xl font-serif font-black text-gray-900">Delete Category?</h3>
              <p className="text-xs font-bold text-gray-600 mt-2 leading-relaxed">
                Are you sure you want to remove the category <span className="text-gray-900 font-black">"{categoryToDelete.name}"</span>?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-amber-900/15">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-2xl text-xs font-black transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteCategory}
                className="py-3 bg-rose-700 hover:bg-rose-800 text-white rounded-2xl text-xs font-black shadow-md transition-all cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Protected Warning Dialog (When Category Has Linked Expenses) */}
      {categoryBlockedModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-md w-full p-7 shadow-2xl border border-amber-900/30 text-center space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-900 flex items-center justify-center shadow-md border border-amber-300">
              <AlertCircle size={36} className="text-[#4A0E0E]" />
            </div>

            <div>
              <h3 className="text-xl font-serif font-black text-gray-900">Cannot Delete Category</h3>
              <div className="text-xs font-bold text-gray-700 mt-2 leading-relaxed bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-left space-y-1.5">
                <p>
                  Category <span className="font-black text-[#4A0E0E]">"{categoryBlockedModal.name}"</span> has <span className="font-black text-[#c00000]">{categoryBlockedModal.count} recorded expense entries</span> totalling <span className="font-black text-[#c00000]">₹{categoryBlockedModal.totalAmount.toLocaleString()}</span>.
                </p>
                <p className="text-[11px] text-gray-500 font-normal">
                  To prevent data inconsistency and financial discrepancies, categories with recorded expenses cannot be deleted. Please reassign or delete the associated expense entries first.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCategoryBlockedModal(null)}
                className="w-full py-3 bg-[#4A0E0E] hover:bg-red-950 text-[#FFD700] rounded-2xl text-xs font-black shadow-md transition-all cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageCategoriesModal;
