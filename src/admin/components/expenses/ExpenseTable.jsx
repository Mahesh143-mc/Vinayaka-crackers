import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Filter, ChevronDown, Check, FolderPlus, ArrowUp, ArrowDown, ArrowUpDown, 
  Edit3, Trash2, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Calendar 
} from 'lucide-react';
import DateRangeFilterDropdown from '../common/DateRangeFilterDropdown';

const ExpenseTable = ({ 
  expenses, 
  categories, 
  selectedCategory, 
  setSelectedCategory, 
  dateFilter = 'all',
  setDateFilter,
  customStartDate = '',
  setCustomStartDate,
  customEndDate = '',
  setCustomEndDate,
  searchQuery, 
  setSearchQuery, 
  sortField, 
  sortOrder, 
  handleSort, 
  currentPage, 
  setCurrentPage, 
  itemsPerPage, 
  onEditExpense, 
  onDeleteExpense, 
  onOpenManageCategories 
}) => {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Filter & Sort Logic
  const filteredExpenses = expenses
    .filter(item => {
      const title = item.title || '';
      const category = item.category || '';
      const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'amount') {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      if (sortField === 'date') {
        const timeA = new Date(aVal || 0).getTime();
        const timeB = new Date(bVal || 0).getTime();
        return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
      }

      if (typeof aVal === 'string') {
        return sortOrder === 'asc' 
          ? aVal.localeCompare(String(bVal || '')) 
          : String(bVal || '').localeCompare(aVal);
      }

      return 0;
    });

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExpenses = filteredExpenses.slice(startIndex, startIndex + itemsPerPage);

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
    <div className="space-y-6">
      {/* Filter & Search Bar */}
      <div className="bg-[#EFEAE1] p-4 rounded-3xl border border-amber-900/10 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-800" size={19} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search expense title or category..."
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-amber-900/10 rounded-2xl focus:outline-none text-sm font-bold text-gray-800"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Date Filter Dropdown */}
          {setDateFilter && (
            <DateRangeFilterDropdown
              selectedFilter={dateFilter}
              onFilterChange={(val) => {
                setDateFilter(val);
                setCurrentPage(1);
              }}
              customStartDate={customStartDate}
              customEndDate={customEndDate}
              onCustomDatesChange={(start, end) => {
                setCustomStartDate(start);
                setCustomEndDate(end);
              }}
              className="w-full sm:w-auto"
            />
          )}

          {/* Category Dropdown Filter */}
          <div ref={dropdownRef} className="relative w-full sm:w-64">
            <button
              type="button"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="w-full pl-4 pr-10 py-3 bg-white border-2 border-amber-900/20 hover:border-[#4A0E0E] rounded-2xl font-black text-gray-900 text-xs sm:text-sm shadow-sm transition-all flex items-center justify-between gap-2.5 cursor-pointer"
            >
              <span className="flex items-center gap-2 truncate">
                <Filter size={15} className="text-[#4A0E0E] shrink-0" />
                <span className="truncate">{selectedCategory === 'All' ? `All Categories (${categories.length - 1})` : selectedCategory}</span>
              </span>
              <ChevronDown size={17} className={`text-[#4A0E0E] transition-transform shrink-0 stroke-[2.5] ${showCategoryDropdown ? 'rotate-180' : ''}`} />
            </button>

          {showCategoryDropdown && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white border-2 border-amber-900/20 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 space-y-1">
              <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between text-[#4A0E0E] font-black text-xs uppercase tracking-wider">
                <span>Filter Category</span>
                <Filter size={14} className="text-[#4A0E0E]" />
              </div>
              <div className="max-h-64 overflow-y-auto space-y-1 pt-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                      setShowCategoryDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-black transition-all flex items-center justify-between cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#4A0E0E] text-[#FFD700] shadow-md'
                        : 'text-gray-900 hover:bg-amber-100/70'
                    }`}
                  >
                    <span>{cat === 'All' ? 'All Categories' : cat}</span>
                    {selectedCategory === cat && <Check size={18} strokeWidth={3} className="text-[#FFD700] shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
          </div>
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
                {renderSortHeader('Date', 'date')}
                {renderSortHeader('Amount (₹)', 'amount', 'right')}
                <th className="py-4 px-6 text-center text-xs font-black">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-900/10">
              {paginatedExpenses.map((exp, idx) => (
                <tr key={exp.id} className={`hover:bg-amber-100/70 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF7F2]'}`}>
                  <td className="py-4 px-6 font-black text-[#4A0E0E]">{exp.id}</td>
                  <td className="py-4 px-6">
                    <p className="font-black text-gray-900 text-sm">{exp.title}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-amber-200 text-[#4A0E0E] font-black px-3 py-1 rounded-full text-[10px] uppercase border border-amber-300">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600 font-bold">{exp.date}</td>
                  <td className="py-4 px-6 text-right font-black text-[#c00000] text-sm sm:text-base">
                    ₹{exp.amount.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEditExpense(exp)}
                        className="p-1.5 bg-blue-100 hover:bg-blue-600 text-blue-900 hover:text-white rounded-xl transition-all shadow-sm cursor-pointer"
                        title="Edit Expense"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => onDeleteExpense(exp)}
                        className="p-1.5 bg-rose-100 hover:bg-rose-600 text-rose-900 hover:text-white rounded-xl transition-all shadow-sm cursor-pointer"
                        title="Delete Expense"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500 font-bold">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-3xl">🧾</span>
                      <p className="text-sm">No expenses found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
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
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-xl text-xs font-black bg-white border border-amber-900/15 text-gray-700 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center cursor-pointer"
              title="First Page"
            >
              <ChevronsLeft size={16} strokeWidth={2.5} />
            </button>

            {/* Previous Page < */}
            <button
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl text-xs font-black bg-white border border-amber-900/15 text-gray-700 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-xl text-xs font-black transition-all border shadow-sm cursor-pointer ${
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
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl text-xs font-black bg-white border border-amber-900/15 text-gray-700 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center cursor-pointer"
              title="Next Page"
            >
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>

            {/* Last Page >> */}
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl text-xs font-black bg-white border border-amber-900/15 text-gray-700 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center cursor-pointer"
              title="Last Page"
            >
              <ChevronsRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTable;
