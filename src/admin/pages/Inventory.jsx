import { useState, useEffect, useRef } from 'react';
import { PackageOpen, AlertTriangle, ArrowRightLeft, Search, Save, Check, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown, ChevronDown, Plus, X, CheckCircle2, Filter } from 'lucide-react';
import { subscribeProducts, updateProductStockInFirestore, subscribeCategories } from '../../services/firebaseService';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminInventory = () => {
  const { showToast } = useToast();
  const [inventoryData, setInventoryData] = useState([]);
  const [inventoryCategories, setInventoryCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubProducts = subscribeProducts((products) => {
      if (products) {
        const mapped = products.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category || 'General',
          currentStock: Number(p.stock || 0),
          reorderLevel: Number(p.reorderLevel || 20),
          lastRestocked: p.lastRestocked || new Date().toISOString().split('T')[0]
        }));
        setInventoryData(mapped);
        setIsLoading(false);
      }
    });

    const unsubCategories = subscribeCategories((cats) => {
      setInventoryCategories(cats || []);
    });

    return () => {
      unsubProducts();
      unsubCategories();
    };
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
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
  
  // Modal States
  const [stockModalItem, setStockModalItem] = useState(null);
  const [addedStockVal, setAddedStockVal] = useState('');

  const openStockModal = (item) => {
    setStockModalItem(item);
    setAddedStockVal('');
  };

  const handleSaveModalStock = async () => {
    if (!stockModalItem) return;
    const current = Number(stockModalItem.currentStock || 0);
    const added = Math.max(0, parseInt(addedStockVal || '0', 10));
    const validStock = current + added;
    
    setInventoryData(inventoryData.map(item => 
      item.id === stockModalItem.id 
        ? { ...item, currentStock: validStock, lastRestocked: new Date().toISOString().split('T')[0] } 
        : item
    ));

    try {
      await updateProductStockInFirestore(stockModalItem.id, validStock);
      showToast(`Stock for "${stockModalItem.name}" updated to ${validStock} units!`, 'success');
      setStockModalItem(null);
    } catch (err) {
      console.error("Error updating stock in Firestore:", err);
      showToast('Failed to update stock in database', 'error');
    }
  };

  // 15 items per page pagination state
  const itemsPerPage = 15;
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting state
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

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

  const handleStockChange = (id, newStock) => {
    setInventoryData(inventoryData.map(item => item.id === id ? { ...item, currentStock: parseInt(newStock) || 0 } : item));
  };

  const handleSave = (id) => {
    setSavedId(id);
    setTimeout(() => setSavedId(null), 2000);
  };

  const filteredInventory = inventoryData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedInventory = [...filteredInventory].sort((a, b) => {
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

  const totalPages = Math.ceil(sortedInventory.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInventory = sortedInventory.slice(startIndex, startIndex + itemsPerPage);

  const renderSortHeader = (label, field, align = 'left') => {
    const isActive = sortField === field;
    return (
      <th 
        onClick={() => handleSort(field)} 
        className={`px-6 py-6 text-xs font-black uppercase tracking-widest cursor-pointer select-none group transition-colors hover:bg-[#380A0A] ${align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'}`}
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

  const totalStockUnits = inventoryData.reduce((sum, item) => sum + Number(item.currentStock || 0), 0);
  const lowStockWarningsCount = inventoryData.filter(item => Number(item.currentStock || 0) > 0 && Number(item.currentStock || 0) <= Number(item.reorderLevel || 20)).length;
  const outOfStockCount = inventoryData.filter(item => Number(item.currentStock || 0) === 0).length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#4A0E0E] via-[#701515] to-[#4A0E0E] p-7 rounded-3xl shadow-lg text-white">
        <div>
          <h1 className="text-3xl font-serif font-black tracking-wide text-white flex items-center gap-2">
            <PackageOpen className="text-amber-400" /> Inventory & Stock Controls
          </h1>
          <p className="text-amber-200/90 text-sm mt-1 font-medium">Real-time stock monitoring, low stock alerts, and inline quick-reordering.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-400/30 px-5 py-2.5 rounded-2xl font-bold text-sm backdrop-blur-md transition-all flex items-center gap-2">
            <ArrowRightLeft size={18} /> Stock Transfer
          </button>
          <button className="bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-[#4A0E0E] px-6 py-2.5 rounded-2xl font-black text-sm shadow-md transition-all flex items-center gap-2">
            <AlertTriangle size={18} /> Bulk Purchase Order
          </button>
        </div>
      </div>

      {/* Stock Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FAF7F2] rounded-3xl p-6 shadow-sm border border-emerald-300 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-md">
            <PackageOpen size={26} />
          </div>
          <div>
            <p className="text-emerald-950 text-xs font-black uppercase tracking-wider">Total Stock Units</p>
            <p className="text-3xl font-black text-emerald-900 mt-1">{totalStockUnits.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-[#FAF7F2] rounded-3xl p-6 shadow-sm border border-amber-300 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-md">
            <AlertTriangle size={26} />
          </div>
          <div>
            <p className="text-amber-950 text-xs font-black uppercase tracking-wider">Low Stock Warnings</p>
            <p className="text-3xl font-black text-amber-900 mt-1">{lowStockWarningsCount} Items</p>
          </div>
        </div>
        <div className="bg-[#FAF7F2] rounded-3xl p-6 shadow-sm border border-rose-300 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-700 text-white flex items-center justify-center font-bold shadow-md">
            <X size={26} />
          </div>
          <div>
            <p className="text-rose-950 text-xs font-black uppercase tracking-wider">Out of Stock</p>
            <p className="text-3xl font-black text-rose-900 mt-1">{outOfStockCount} Items</p>
          </div>
        </div>
      </div>

      {/* Table / Loading State */}
      {isLoading ? (
        <LoadingSpinner message="Fetching inventory levels from database..." />
      ) : (
        <div key={currentPage} className="bg-[#FAF7F2] rounded-3xl shadow-sm border border-amber-900/10 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-300">
        <div className="p-4 bg-[#EFEAE1] border-b border-amber-900/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-800" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search inventory items..." 
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-amber-900/10 rounded-2xl focus:outline-none text-sm font-bold text-gray-800"
            />
          </div>

          {/* Category Filter Dropdown */}
          <div ref={dropdownRef} className="relative w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="w-full sm:w-auto pl-4 pr-10 py-2.5 bg-white border border-amber-900/10 hover:border-[#4A0E0E] rounded-2xl font-black text-gray-900 text-sm shadow-sm transition-all flex items-center justify-between gap-3 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Filter size={15} className="text-[#4A0E0E]" />
                {selectedCategory === 'All' ? `All Categories (${inventoryCategories.length})` : selectedCategory}
              </span>
              <ChevronDown size={17} className={`text-[#4A0E0E] transition-transform stroke-[2.5] ${showCategoryDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showCategoryDropdown && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border-2 border-amber-900/20 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 space-y-1">
                <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between text-[#4A0E0E] font-black text-xs uppercase tracking-wider">
                  <span>Select Category</span>
                  <Filter size={14} className="text-[#4A0E0E]" />
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1 pt-1">
                  <button
                    type="button"
                    onClick={() => { setSelectedCategory('All'); setShowCategoryDropdown(false); }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-between ${
                      selectedCategory === 'All'
                        ? 'bg-[#4A0E0E] text-[#FFD700] shadow-md'
                        : 'text-gray-800 hover:bg-amber-100/60'
                    }`}
                  >
                    <span>All Categories ({inventoryCategories.length})</span>
                    {selectedCategory === 'All' && <Check size={16} strokeWidth={3} />}
                  </button>
                  {inventoryCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => { setSelectedCategory(cat.name); setShowCategoryDropdown(false); }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-between ${
                        selectedCategory === cat.name
                          ? 'bg-[#4A0E0E] text-[#FFD700] shadow-md'
                          : 'text-gray-800 hover:bg-amber-100/60'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {selectedCategory === cat.name && <Check size={16} strokeWidth={3} />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-[#4A0E0E] to-[#2B0808] border-b border-red-950 text-white">
                {renderSortHeader('Product Info', 'name')}
                {renderSortHeader('Current Stock', 'currentStock', 'center')}
                {renderSortHeader('Reorder Level', 'reorderLevel', 'center')}
                {renderSortHeader('Category', 'category')}
                <th className="px-6 py-6 text-xs font-black text-[#FFD700] uppercase tracking-widest text-right">Quick Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-900/10">
              {paginatedInventory.map((item, idx) => (
                <tr key={item.id} className={idx % 2 === 0 ? 'bg-[#FAF7F2]' : 'bg-[#F2ECE1]'}>
                  <td className="px-6 py-5">
                    <p className="text-sm font-black text-gray-900">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded-md">{item.id}</span>
                      <span className="text-[10px] text-gray-500 font-medium">Restocked: {item.lastRestocked}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xl font-black ${
                      item.currentStock === 0 ? 'text-rose-700' :
                      item.currentStock <= item.reorderLevel ? 'text-amber-700' :
                      'text-emerald-800'
                    }`}>
                      {item.currentStock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-gray-700">
                    {item.reorderLevel} units
                  </td>
                  <td className="px-6 py-4">
                    {item.currentStock === 0 ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-900 border border-rose-300">OUT OF STOCK</span>
                    ) : item.currentStock <= item.reorderLevel ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-950 border border-amber-300">LOW STOCK</span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-950 border border-emerald-300">IN STOCK</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => openStockModal(item)}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black transition-all shadow-md inline-flex items-center gap-1.5 transform hover:scale-105 border border-emerald-600"
                      title="Click to open stock count adjustment dialog"
                    >
                      <Plus size={14} strokeWidth={2.5} /> Update Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 15-Item Pagination Controls Bar */}
        <div className="p-4 bg-[#FAF7F2] border-t border-amber-900/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-bold text-gray-700">
            Showing <span className="font-black text-[#4A0E0E]">{filteredInventory.length > 0 ? startIndex + 1 : 0}</span> to <span className="font-black text-[#4A0E0E]">{Math.min(startIndex + itemsPerPage, filteredInventory.length)}</span> of <span className="font-black text-[#4A0E0E]">{filteredInventory.length}</span> items
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
      )}

      {/* Stock Update Modal Dialog */}
      {stockModalItem && (() => {
        const currentStock = Number(stockModalItem.currentStock || 0);
        const addedQty = Math.max(0, parseInt(addedStockVal || '0', 10));
        const finalStock = currentStock + addedQty;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#FAF7F2] border-2 border-amber-900/20 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-200">
              
              {/* Close Button */}
              <button
                onClick={() => setStockModalItem(null)}
                className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 bg-white rounded-full border border-gray-200 shadow-sm transition-all"
                title="Close Dialog"
              >
                <X size={18} />
              </button>

              {/* Header */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 border border-amber-300 rounded-full text-amber-950 text-xs font-black mb-2">
                  <PackageOpen size={14} /> Add Incoming Stock Batch
                </div>
                <h3 className="text-xl font-serif font-black text-gray-900">{stockModalItem.name}</h3>
                <p className="text-xs font-bold text-amber-800 mt-0.5">Product ID: {stockModalItem.id} • Category: {stockModalItem.category}</p>
              </div>

              {/* Current Stock Banner */}
              <div className="bg-[#EFEAE1] p-4 rounded-2xl border border-amber-900/10 flex justify-between items-center">
                <div>
                  <p className="text-[11px] font-black uppercase text-gray-500">Current In-Stock</p>
                  <p className="text-2xl font-black text-[#4A0E0E]">{currentStock} units</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-black uppercase text-gray-500">Reorder Level</p>
                  <p className="text-sm font-bold text-gray-700">{stockModalItem.reorderLevel || 20} units</p>
                </div>
              </div>

              {/* Added Stock Input */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-800 uppercase tracking-wider">
                  ENTER NEW STOCK QUANTITY TO ADD (+)
                </label>
                <input
                  type="number"
                  value={addedStockVal}
                  onChange={(e) => setAddedStockVal(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-amber-900/20 rounded-2xl font-black text-xl text-[#4A0E0E] text-center focus:outline-none focus:border-[#4A0E0E] shadow-sm placeholder:text-xs sm:placeholder:text-sm placeholder:font-semibold placeholder:text-gray-400"
                  placeholder="Enter stock quantity e.g. 50"
                  autoFocus
                />

                {/* Quick Add Buttons */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAddedStockVal((parseInt(addedStockVal || '0', 10) + 10).toString())}
                    className="py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl font-black text-xs border border-amber-300/80 transition-all shadow-sm"
                  >
                    +10 Units
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddedStockVal((parseInt(addedStockVal || '0', 10) + 25).toString())}
                    className="py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl font-black text-xs border border-amber-300/80 transition-all shadow-sm"
                  >
                    +25 Units
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddedStockVal((parseInt(addedStockVal || '0', 10) + 50).toString())}
                    className="py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl font-black text-xs border border-amber-300/80 transition-all shadow-sm"
                  >
                    +50 Units
                  </button>
                </div>
              </div>

              {/* Real-time Math Summary Box */}
              <div className="bg-emerald-50 border border-emerald-300/60 p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold text-emerald-950">
                <span>Updated Total Stock:</span>
                <span className="text-base font-black text-emerald-900">{currentStock} + {addedQty} = <span className="text-lg font-black text-[#4A0E0E] underline">{finalStock} units</span></span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStockModalItem(null)}
                  className="flex-1 py-3 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 font-bold text-xs rounded-2xl transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveModalStock}
                  className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 border border-emerald-600"
                >
                  <Check size={16} strokeWidth={3} /> Save & Add Stock
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default AdminInventory;
