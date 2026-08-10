import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, FolderPlus, Tag, ChevronDown, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminProducts = () => {
  const [categories] = useState([
    { id: 1, name: 'Sparklers', count: 12 },
    { id: 2, name: 'Bombs', count: 8 },
    { id: 3, name: 'Fancy', count: 15 },
    { id: 4, name: 'Fountains', count: 10 },
  ]);

  const [products, setProducts] = useState([
    { id: 'PRD-01', name: '120 Shots Multi-color', category: 'Fancy', price: 1200, stock: 45, status: 'Active' },
    { id: 'PRD-02', name: 'Giant Sparklers (50pcs)', category: 'Sparklers', price: 350, stock: 120, status: 'Active' },
    { id: 'PRD-03', name: 'Lakshmi Bomb Deluxe', category: 'Bombs', price: 150, stock: 8, status: 'Low Stock' },
    { id: 'PRD-04', name: 'Sky Lanterns Pack', category: 'Novelty', price: 400, stock: 0, status: 'Out of Stock' },
    { id: 'PRD-05', name: 'Flower Pots Mega', category: 'Fountains', price: 650, stock: 30, status: 'Active' },
  ]);

  const [confirmConfig, setConfirmConfig] = useState(null);
  const [successToast, setSuccessToast] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleDeleteProduct = (id, name) => {
    setConfirmConfig({
      title: 'Delete Product Confirmation',
      message: `Are you sure you want to delete "${name}" (${id}) from your store catalog? This action cannot be undone.`,
      confirmText: 'Yes, Delete Product',
      onConfirm: () => {
        setProducts(products.filter(p => p.id !== id));
        setConfirmConfig(null);
        setSuccessToast(`Product "${name}" deleted successfully.`);
        setTimeout(() => setSuccessToast(''), 3000);
      }
    });
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

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

      {/* Categories Toolbar */}
      <div className="bg-[#EFEAE1] p-4 rounded-3xl border border-amber-900/10 shadow-sm flex items-center gap-3 overflow-x-auto">
        <span className="text-xs font-black uppercase text-amber-950 tracking-wider flex items-center gap-1.5 shrink-0 pl-2">
          <Tag size={15} className="text-[#c00000]" /> Filter:
        </span>
        <button 
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 ${
            selectedCategory === 'All' 
              ? 'bg-[#4A0E0E] text-white shadow-sm' 
              : 'bg-white/80 text-amber-950 hover:bg-white border border-amber-900/10'
          }`}
        >
          All Items ({products.length})
        </button>
        {categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 ${
              selectedCategory === cat.name 
                ? 'bg-[#4A0E0E] text-white shadow-sm' 
                : 'bg-white/80 text-amber-950 hover:bg-white border border-amber-900/10'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Search Controls */}
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
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4A0E0E] pointer-events-none stroke-[2.5]" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#FAF7F2] rounded-3xl shadow-sm border border-amber-900/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-[#4A0E0E] to-[#2B0808] border-b border-red-950 text-white">
                <th className="px-6 py-6 text-xs font-black text-[#FFD700] uppercase tracking-widest">Product Info</th>
                <th className="px-6 py-6 text-xs font-black text-[#FFD700] uppercase tracking-widest">Category</th>
                <th className="px-6 py-6 text-xs font-black text-[#FFD700] uppercase tracking-widest">Price</th>
                <th className="px-6 py-6 text-xs font-black text-[#FFD700] uppercase tracking-widest">Stock</th>
                <th className="px-6 py-6 text-xs font-black text-[#FFD700] uppercase tracking-widest">Status</th>
                <th className="px-6 py-6 text-xs font-black text-[#FFD700] uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-900/10">
              {filteredProducts.map((product, idx) => (
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
                    <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-black border ${
                      product.status === 'Active' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
                      product.status === 'Low Stock' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                      'bg-rose-100 text-rose-900 border-rose-300'
                    }`}>
                      {product.status}
                    </span>
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
