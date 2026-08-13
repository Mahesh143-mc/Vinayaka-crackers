import { useState, useEffect } from 'react';
import { PackageOpen, AlertTriangle, ArrowRightLeft, Search, Save, Check, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown, ChevronDown, Plus, X, CheckCircle2 } from 'lucide-react';

const AdminInventory = () => {
  const [inventoryData, setInventoryData] = useState([
    { id: 'PRD-01', name: '120 Shots Multi-color', category: 'Fancy', currentStock: 45, reorderLevel: 20, lastRestocked: '2023-10-15' },
    { id: 'PRD-02', name: 'Giant Sparklers (50pcs)', category: 'Sparklers', currentStock: 120, reorderLevel: 50, lastRestocked: '2023-10-10' },
    { id: 'PRD-03', name: 'Lakshmi Bomb Deluxe', category: 'Bombs', currentStock: 8, reorderLevel: 50, lastRestocked: '2023-09-28' },
    { id: 'PRD-04', name: 'Sky Lanterns Pack', category: 'Novelty', currentStock: 0, reorderLevel: 30, lastRestocked: '2023-09-15' },
    { id: 'PRD-05', name: 'Flower Pots Mega', category: 'Fountains', currentStock: 25, reorderLevel: 25, lastRestocked: '2023-10-01' },
    { id: 'PRD-06', name: '7 Color Sky Rockets', category: 'Fancy', currentStock: 60, reorderLevel: 25, lastRestocked: '2023-10-12' },
    { id: 'PRD-07', name: 'Chakra Ground Spinner', category: 'Fountains', currentStock: 95, reorderLevel: 40, lastRestocked: '2023-10-14' },
    { id: 'PRD-08', name: 'Electric Sparklers Gold', category: 'Sparklers', currentStock: 110, reorderLevel: 45, lastRestocked: '2023-10-16' },
    { id: 'PRD-09', name: 'Atom Bomb Super Loud', category: 'Bombs', currentStock: 18, reorderLevel: 30, lastRestocked: '2023-10-02' },
    { id: 'PRD-10', name: 'Peacock Fountain Large', category: 'Fountains', currentStock: 25, reorderLevel: 20, lastRestocked: '2023-10-08' },
    { id: 'PRD-11', name: '240 Shots Night Display', category: 'Fancy', currentStock: 12, reorderLevel: 15, lastRestocked: '2023-10-05' },
    { id: 'PRD-12', name: 'Color Smoke Grenade', category: 'Novelty', currentStock: 50, reorderLevel: 20, lastRestocked: '2023-10-11' },
    { id: 'PRD-13', name: 'Gold Twinkling Stars', category: 'Sparklers', currentStock: 140, reorderLevel: 60, lastRestocked: '2023-10-17' },
    { id: 'PRD-14', name: 'Hydro Bomb High Sound', category: 'Bombs', currentStock: 5, reorderLevel: 25, lastRestocked: '2023-09-25' },
    { id: 'PRD-15', name: 'Tri-Color Fountain Pot', category: 'Fountains', currentStock: 35, reorderLevel: 20, lastRestocked: '2023-10-13' },
    { id: 'PRD-16', name: 'Whistling Sky Rockets', category: 'Fancy', currentStock: 40, reorderLevel: 20, lastRestocked: '2023-10-09' },
    { id: 'PRD-17', name: 'Red & Green Ground Wheel', category: 'Fountains', currentStock: 85, reorderLevel: 30, lastRestocked: '2023-10-14' },
    { id: 'PRD-18', name: 'Diwali Deluxe Combo Pack', category: 'Novelty', currentStock: 20, reorderLevel: 10, lastRestocked: '2023-10-07' },
    { id: 'PRD-19', name: 'Silver Flash Sparklers', category: 'Sparklers', currentStock: 90, reorderLevel: 40, lastRestocked: '2023-10-15' },
    { id: 'PRD-20', name: 'Garland 1000 Crackers', category: 'Bombs', currentStock: 15, reorderLevel: 20, lastRestocked: '2023-10-03' },
    { id: 'PRD-21', name: '30 Shots Peacock Sky', category: 'Fancy', currentStock: 28, reorderLevel: 15, lastRestocked: '2023-10-10' },
    { id: 'PRD-22', name: 'Multi-Color Musical Fountain', category: 'Fountains', currentStock: 22, reorderLevel: 15, lastRestocked: '2023-10-06' },
    { id: 'PRD-23', name: 'Crackling Sparklers (10pcs)', category: 'Sparklers', currentStock: 75, reorderLevel: 30, lastRestocked: '2023-10-12' },
    { id: 'PRD-24', name: 'Mega Sky Thunder Bomb', category: 'Bombs', currentStock: 14, reorderLevel: 20, lastRestocked: '2023-10-04' },
    { id: 'PRD-25', name: 'Kids Safe Crackers Box', category: 'Novelty', currentStock: 65, reorderLevel: 25, lastRestocked: '2023-10-16' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal & Toast States
  const [stockModalItem, setStockModalItem] = useState(null);
  const [newStockVal, setNewStockVal] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const openStockModal = (item) => {
    setStockModalItem(item);
    setNewStockVal(item.currentStock.toString());
  };

  const handleSaveModalStock = () => {
    if (!stockModalItem) return;
    const parsedStock = parseInt(newStockVal, 10);
    const validStock = isNaN(parsedStock) ? 0 : Math.max(0, parsedStock);
    
    setInventoryData(inventoryData.map(item => 
      item.id === stockModalItem.id 
        ? { ...item, currentStock: validStock, lastRestocked: new Date().toISOString().split('T')[0] } 
        : item
    ));
    
    const updatedName = stockModalItem.name;
    setStockModalItem(null);
    setSuccessToast(`Stock count updated to ${validStock} units for "${updatedName}"!`);
    setTimeout(() => setSuccessToast(''), 3500);
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
            <p className="text-3xl font-black text-emerald-900 mt-1">4,250</p>
          </div>
        </div>
        <div className="bg-[#FAF7F2] rounded-3xl p-6 shadow-sm border border-amber-300 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-md">
            <AlertTriangle size={26} />
          </div>
          <div>
            <p className="text-amber-950 text-xs font-black uppercase tracking-wider">Low Stock Warnings</p>
            <p className="text-3xl font-black text-amber-900 mt-1">18 Items</p>
          </div>
        </div>
        <div className="bg-[#FAF7F2] rounded-3xl p-6 shadow-sm border border-rose-300 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-700 text-white flex items-center justify-center font-bold shadow-md">
            <PackageOpen size={26} />
          </div>
          <div>
            <p className="text-rose-950 text-xs font-black uppercase tracking-wider">Out of Stock</p>
            <p className="text-3xl font-black text-rose-900 mt-1">4 Items</p>
          </div>
        </div>
      </div>

      {/* Table with Tinted Background & Header */}
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
          <div className="relative w-full sm:w-auto">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto pl-4 pr-10 py-2.5 bg-white border border-amber-900/10 rounded-2xl font-black text-gray-900 text-sm focus:outline-none focus:border-[#4A0E0E] cursor-pointer appearance-none shadow-sm"
            >
              <option value="All">All Categories ({inventoryData.length})</option>
              <option value="Sparklers">Sparklers</option>
              <option value="Bombs">Bombs</option>
              <option value="Fancy">Fancy Sky Shots</option>
              <option value="Fountains">Fountains & Pots</option>
              <option value="Novelty">Novelty & Rockets</option>
            </select>
            <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4A0E0E] pointer-events-none stroke-[2.5]" />
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

      {/* Success Toast Notification */}
      {successToast && (
        <div className="fixed top-24 right-8 z-50 bg-[#4A0E0E] text-[#FFD700] px-5 py-3 rounded-2xl shadow-2xl border border-amber-400 font-black text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={18} className="text-emerald-400" /> {successToast}
        </div>
      )}

      {/* Stock Update Modal Dialog */}
      {stockModalItem && (
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
                <PackageOpen size={14} /> Stock Adjustment Dialog
              </div>
              <h3 className="text-xl font-serif font-black text-gray-900">{stockModalItem.name}</h3>
              <p className="text-xs font-bold text-amber-800 mt-0.5">Product ID: {stockModalItem.id} • Category: {stockModalItem.category}</p>
            </div>

            {/* Current Stock Banner */}
            <div className="bg-[#EFEAE1] p-4 rounded-2xl border border-amber-900/10 flex justify-between items-center">
              <div>
                <p className="text-[11px] font-black uppercase text-gray-500">Current Stock</p>
                <p className="text-2xl font-black text-[#4A0E0E]">{stockModalItem.currentStock} units</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-black uppercase text-gray-500">Reorder Level</p>
                <p className="text-sm font-bold text-gray-700">{stockModalItem.reorderLevel} units</p>
              </div>
            </div>

            {/* New Stock Input */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-gray-800 uppercase tracking-wider">
                Enter New Total Stock Count
              </label>
              <input
                type="number"
                value={newStockVal}
                onChange={(e) => setNewStockVal(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-amber-900/20 rounded-2xl font-black text-xl text-[#4A0E0E] text-center focus:outline-none focus:border-[#4A0E0E] shadow-sm"
                placeholder="e.g. 50"
                autoFocus
              />

              {/* Quick Add Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewStockVal((parseInt(newStockVal || '0', 10) + 10).toString())}
                  className="flex-1 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl font-black text-xs border border-amber-300/80 transition-all shadow-sm"
                >
                  +10 Units
                </button>
                <button
                  type="button"
                  onClick={() => setNewStockVal((parseInt(newStockVal || '0', 10) + 25).toString())}
                  className="flex-1 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl font-black text-xs border border-amber-300/80 transition-all shadow-sm"
                >
                  +25 Units
                </button>
                <button
                  type="button"
                  onClick={() => setNewStockVal((parseInt(newStockVal || '0', 10) + 50).toString())}
                  className="flex-1 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl font-black text-xs border border-amber-300/80 transition-all shadow-sm"
                >
                  +50 Units
                </button>
              </div>
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
                <Check size={16} strokeWidth={3} /> Save Stock Count
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;
