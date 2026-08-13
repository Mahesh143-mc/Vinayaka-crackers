import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, FolderPlus, Tag, ChevronDown, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown, Box } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminProducts = () => {
  const [categories] = useState([
    { id: 1, name: 'Sparklers', count: 12 },
    { id: 2, name: 'Bombs', count: 8 },
    { id: 3, name: 'Fancy', count: 15 },
    { id: 4, name: 'Fountains', count: 10 },
  ]);

  const [products, setProducts] = useState([
    { id: 'PRD-01', name: '120 Shots Multi-color', category: 'Fancy', price: 1200, stock: 45, status: 'Active', showInFrontend: true },
    { id: 'PRD-02', name: 'Giant Sparklers (50pcs)', category: 'Sparklers', price: 350, stock: 120, status: 'Active', showInFrontend: true },
    { id: 'PRD-03', name: 'Lakshmi Bomb Deluxe', category: 'Bombs', price: 150, stock: 8, status: 'Low Stock', showInFrontend: true },
    { id: 'PRD-04', name: 'Sky Lanterns Pack', category: 'Novelty', price: 400, stock: 0, status: 'Out of Stock', showInFrontend: false },
    { id: 'PRD-05', name: 'Flower Pots Mega', category: 'Fountains', price: 650, stock: 30, status: 'Active', showInFrontend: true },
    { id: 'PRD-06', name: '7 Color Sky Rockets', category: 'Fancy', price: 850, stock: 60, status: 'Active', showInFrontend: true },
    { id: 'PRD-07', name: 'Chakra Ground Spinner', category: 'Fountains', price: 280, stock: 95, status: 'Active', showInFrontend: true },
    { id: 'PRD-08', name: 'Electric Sparklers Gold', category: 'Sparklers', price: 450, stock: 110, status: 'Active', showInFrontend: true },
    { id: 'PRD-09', name: 'Atom Bomb Super Loud', category: 'Bombs', price: 220, stock: 18, status: 'Active', showInFrontend: true },
    { id: 'PRD-10', name: 'Peacock Fountain Large', category: 'Fountains', price: 520, stock: 25, status: 'Active', showInFrontend: true },
    { id: 'PRD-11', name: '240 Shots Night Display', category: 'Fancy', price: 2400, stock: 12, status: 'Active', showInFrontend: true },
    { id: 'PRD-12', name: 'Color Smoke Grenade', category: 'Novelty', price: 320, stock: 50, status: 'Active', showInFrontend: true },
    { id: 'PRD-13', name: 'Gold Twinkling Stars', category: 'Sparklers', price: 180, stock: 140, status: 'Active', showInFrontend: true },
    { id: 'PRD-14', name: 'Hydro Bomb High Sound', category: 'Bombs', price: 300, stock: 5, status: 'Low Stock', showInFrontend: true },
    { id: 'PRD-15', name: 'Tri-Color Fountain Pot', category: 'Fountains', price: 420, stock: 35, status: 'Active', showInFrontend: true },
    { id: 'PRD-16', name: 'Whistling Sky Rockets', category: 'Fancy', price: 650, stock: 40, status: 'Active', showInFrontend: true },
    { id: 'PRD-17', name: 'Red & Green Ground Wheel', category: 'Fountains', price: 210, stock: 85, status: 'Active', showInFrontend: true },
    { id: 'PRD-18', name: 'Diwali Deluxe Combo Pack', category: 'Novelty', price: 3500, stock: 20, status: 'Active', showInFrontend: true },
    { id: 'PRD-19', name: 'Silver Flash Sparklers', category: 'Sparklers', price: 260, stock: 90, status: 'Active', showInFrontend: true },
    { id: 'PRD-20', name: 'Garland 1000 Crackers', category: 'Bombs', price: 1100, stock: 15, status: 'Active', showInFrontend: true },
    { id: 'PRD-21', name: '30 Shots Peacock Sky', category: 'Fancy', price: 950, stock: 28, status: 'Active', showInFrontend: true },
    { id: 'PRD-22', name: 'Multi-Color Musical Fountain', category: 'Fountains', price: 780, stock: 22, status: 'Active', showInFrontend: true },
    { id: 'PRD-23', name: 'Crackling Sparklers (10pcs)', category: 'Sparklers', price: 290, stock: 75, status: 'Active', showInFrontend: true },
    { id: 'PRD-24', name: 'Mega Sky Thunder Bomb', category: 'Bombs', price: 480, stock: 14, status: 'Active', showInFrontend: true },
    { id: 'PRD-25', name: 'Kids Safe Crackers Box', category: 'Novelty', price: 890, stock: 65, status: 'Active', showInFrontend: true },
  ]);

  const toggleFrontendVisibility = (id) => {
    setProducts(products.map(p => p.id === id ? { ...p, showInFrontend: !p.showInFrontend } : p));
  };

  const [confirmConfig, setConfirmConfig] = useState(null);
  const [successToast, setSuccessToast] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

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

  const handleDeleteProduct = (id, name) => {
    setConfirmConfig({
      title: 'Delete Product Confirmation',
      message: `Are you sure you want to delete "${name}" (${id}) from your store catalog? This action cannot be undone.`,
      confirmText: 'Yes, Delete Product',
      onConfirm: () => {
        setProducts(products.filter(p => p.id !== id));
        setConfirmConfig(null);
        setSuccessToast(`Product "${name}" deleted successfully!`);
        setTimeout(() => setSuccessToast(''), 3000);
      }
    });
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (typeof aVal === 'string') {
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    if (typeof aVal === 'boolean') {
      return sortOrder === 'asc' ? (aVal === bVal ? 0 : aVal ? -1 : 1) : (aVal === bVal ? 0 : aVal ? 1 : -1);
    }
    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  const renderSortHeader = (label, field, alignCenter = false) => {
    const isActive = sortField === field;
    return (
      <th
        onClick={() => handleSort(field)}
        className={`px-6 py-5 text-xs font-black uppercase tracking-widest cursor-pointer select-none group transition-colors hover:bg-[#380A0A] ${alignCenter ? 'text-center' : 'text-left'}`}
        title={`Sort by ${label} (${isActive && sortOrder === 'asc' ? 'Descending' : 'Ascending'})`}
      >
        <div className={`inline-flex items-center gap-1.5 ${alignCenter ? 'justify-center' : 'justify-start'}`}>
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
    <div className="max-w-7xl mx-auto space-y-8 pb-10 relative">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-24 right-8 z-50 bg-rose-700 text-white px-5 py-3 rounded-2xl shadow-2xl border border-rose-500 font-black text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={18} /> {successToast}
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#4A0E0E] via-[#701515] to-[#4A0E0E] p-7 rounded-3xl shadow-lg text-white">
        <div>
          <h1 className="text-3xl font-serif font-black tracking-wide text-white">Products Catalog</h1>
          <p className="text-amber-200/90 text-sm mt-1 font-medium">Manage your fireworks inventory items, pricing, and category filters.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/categories"
            className="bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-400/30 px-5 py-2.5 rounded-2xl font-bold text-sm backdrop-blur-md transition-all flex items-center gap-2"
          >
            <FolderPlus size={18} />
            Categories ({categories.length})
          </Link>

          <Link
            to="/admin/products/add"
            className="bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-[#4A0E0E] px-6 py-2.5 rounded-2xl font-black text-sm shadow-md transition-all transform hover:scale-105 flex items-center gap-2"
          >
            <Plus size={20} strokeWidth={2.5} />
            Add Product
          </Link>
        </div>
      </div>

      {/* Summary KPI Metric Cards (3 Cards Layout matching Inventory style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Products Catalog */}
        <div className="bg-[#FAF7F2] rounded-3xl p-6 shadow-sm border border-amber-900/20 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#4A0E0E] to-[#701515] text-[#FFD700] flex items-center justify-center font-bold shadow-md shrink-0">
            <Box size={26} />
          </div>
          <div>
            <p className="text-[#4A0E0E] text-xs font-black uppercase tracking-wider">Total Products</p>
            <p className="text-3xl font-black text-[#4A0E0E] mt-1">{products.length} Items</p>
          </div>
        </div>

        {/* Card 2: Total Categories */}
        <div className="bg-[#FAF7F2] rounded-3xl p-6 shadow-sm border border-amber-400 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center font-bold shadow-md shrink-0">
            <Tag size={26} />
          </div>
          <div>
            <p className="text-amber-950 text-xs font-black uppercase tracking-wider">Product Categories</p>
            <p className="text-3xl font-black text-amber-900 mt-1">{categories.length} Categories</p>
          </div>
        </div>

        {/* Card 3: Active in Website */}
        <div className="bg-[#FAF7F2] rounded-3xl p-6 shadow-sm border border-emerald-300 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-md shrink-0">
            <CheckCircle2 size={26} />
          </div>
          <div>
            <p className="text-emerald-950 text-xs font-black uppercase tracking-wider">Active on Website</p>
            <p className="text-3xl font-black text-emerald-900 mt-1">
              {products.filter(p => p.showInFrontend).length} Active
            </p>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="bg-[#EFEAE1] p-4 rounded-3xl border border-amber-900/20 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-800" size={19} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name or ID..."
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-amber-900/20 rounded-2xl focus:outline-none focus:border-[#4A0E0E] text-sm font-black text-gray-900 shadow-sm placeholder:text-gray-400 placeholder:font-normal"
          />
        </div>
        <div className="relative w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-auto pl-5 pr-11 py-3 bg-white border-2 border-amber-900/20 rounded-2xl font-black text-gray-900 text-sm focus:outline-none focus:border-[#4A0E0E] shadow-sm appearance-none cursor-pointer hover:border-[#4A0E0E] transition-all"
          >
            <option value="All">All Categories ({products.length})</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4A0E0E] pointer-events-none stroke-[2.5]" />
        </div>
      </div>

      {/* Table */}
      <div key={currentPage} className="bg-[#FAF7F2] rounded-3xl shadow-sm border border-amber-900/10 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-[#4A0E0E] to-[#2B0808] border-b border-red-950 text-white">
                {renderSortHeader('Product Info', 'name')}
                {renderSortHeader('Category', 'category')}
                {renderSortHeader('Price', 'price')}
                {renderSortHeader('Stock', 'stock')}
                {renderSortHeader('Status', 'status')}
                {renderSortHeader('Show in Frontend', 'showInFrontend', true)}
                <th className="px-6 py-6 text-xs font-black text-[#FFD700] uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-900/10">
              {paginatedProducts.map((product, idx) => (
                <tr key={product.id} className={idx % 2 === 0 ? 'bg-[#FAF7F2]' : 'bg-[#F2ECE1]'}>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-100 to-orange-200 border border-amber-300 flex items-center justify-center text-lg shrink-0">
                        🎆
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900">{product.name}</p>
                        <p className="text-xs font-bold text-amber-800">{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-amber-200/60 border border-amber-300/80 rounded-xl text-xs font-black text-amber-950">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-gray-900">₹{product.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-black ${product.stock < 10 ? 'text-red-700' : 'text-gray-900'}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-black border ${product.status === 'Active' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
                        product.status === 'Low Stock' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                          'bg-rose-100 text-rose-900 border-rose-300'
                      }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {/* Modern ON/OFF Sliding Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => toggleFrontendVisibility(product.id)}
                      className={`relative inline-flex items-center h-8 w-20 rounded-full p-1 transition-colors duration-300 ease-in-out cursor-pointer select-none border shadow-inner ${product.showInFrontend
                          ? 'bg-emerald-600 border-emerald-700'
                          : 'bg-gray-300 border-gray-400'
                        }`}
                      title="Click to toggle frontend visibility"
                    >
                      <span className={`text-[10px] font-black uppercase tracking-wider absolute transition-all duration-300 ${product.showInFrontend ? 'left-2.5 text-white' : 'right-2.5 text-gray-700'
                        }`}>
                        {product.showInFrontend ? 'ON' : 'OFF'}
                      </span>
                      <span
                        className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out flex items-center justify-center ${product.showInFrontend ? 'translate-x-[44px]' : 'translate-x-0'
                          }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${product.showInFrontend ? 'bg-emerald-600' : 'bg-gray-400'}`}></span>
                      </span>
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        className="px-3 py-1.5 bg-blue-100 hover:bg-blue-600 text-blue-900 hover:text-white border border-blue-200 rounded-xl transition-all font-bold text-xs flex items-center gap-1"
                      >
                        <Edit2 size={13} /> Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        className="px-3 py-1.5 bg-rose-100 hover:bg-rose-600 text-rose-900 hover:text-white border border-rose-200 rounded-xl transition-all font-bold text-xs flex items-center gap-1"
                      >
                        <Trash2 size={13} /> Delete
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
            Showing <span className="font-black text-[#4A0E0E]">{filteredProducts.length > 0 ? startIndex + 1 : 0}</span> to <span className="font-black text-[#4A0E0E]">{Math.min(startIndex + itemsPerPage, filteredProducts.length)}</span> of <span className="font-black text-[#4A0E0E]">{filteredProducts.length}</span> items
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
                className={`w-8 h-8 rounded-xl text-xs font-black transition-all border shadow-sm ${currentPage === page
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

      {/* Confirmation Action Modal */}
      {confirmConfig && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-md w-full p-7 shadow-2xl border border-amber-900/30 text-center relative space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 text-rose-700 flex items-center justify-center border-2 border-rose-300 shadow-md">
              <AlertCircle size={36} />
            </div>

            <div>
              <h3 className="text-xl font-serif font-black text-gray-900">{confirmConfig.title}</h3>
              <p className="text-xs font-bold text-gray-600 mt-2 leading-relaxed">
                {confirmConfig.message}
              </p>
            </div>

            <div className="pt-4 border-t border-amber-900/15 grid grid-cols-2 gap-3">
              <button
                onClick={() => setConfirmConfig(null)}
                className="py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-black text-xs rounded-2xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmConfig.onConfirm}
                className="py-3 bg-rose-700 hover:bg-rose-800 text-white font-black text-xs rounded-2xl shadow-md transition-all"
              >
                {confirmConfig.confirmText || 'Yes, Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
