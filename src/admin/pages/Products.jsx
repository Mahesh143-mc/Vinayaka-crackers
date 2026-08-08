import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, FolderPlus, Tag, Check, X } from 'lucide-react';

const AdminProducts = () => {
  const [categories, setCategories] = useState([
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

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Handlers
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setCategories([...categories, { id: Date.now(), name: newCategoryName, count: 0 }]);
    setNewCategoryName('');
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const handleSaveCategory = (id) => {
    setCategories(categories.map(c => c.id === id ? { ...c, name: editCategoryName } : c));
    setEditingCategory(null);
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#4A0E0E] via-[#701515] to-[#4A0E0E] p-7 rounded-3xl shadow-lg text-white">
        <div>
          <h1 className="text-3xl font-serif font-black tracking-wide text-white">Products Catalog</h1>
          <p className="text-amber-200/90 text-sm mt-1 font-medium">Manage your fireworks inventory items, pricing, and category filters.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setShowCategoryModal(true)}
            className="bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-400/30 px-5 py-2.5 rounded-2xl font-bold text-sm backdrop-blur-md transition-all flex items-center gap-2"
          >
            <FolderPlus size={18} />
            Categories ({categories.length})
          </button>
          <button className="bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-[#4A0E0E] px-6 py-2.5 rounded-2xl font-black text-sm shadow-md transition-all transform hover:scale-105 flex items-center gap-2">
            <Plus size={20} strokeWidth={2.5} />
            Add Product
          </button>
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
      <div className="bg-[#EFEAE1] p-4 rounded-3xl border border-amber-900/10 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-800" size={19} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name or ID..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-amber-900/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4A0E0E]/30 text-sm font-bold text-gray-800"
          />
        </div>
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-auto px-4 py-3 bg-white border border-amber-900/10 rounded-2xl font-bold text-amber-950 text-sm focus:outline-none"
        >
          <option value="All">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Table with Tinted Background & Colored Header */}
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
                      <button className="px-3 py-1.5 bg-blue-100 hover:bg-blue-600 text-blue-900 hover:text-white border border-blue-200 rounded-xl transition-all font-bold text-xs flex items-center gap-1">
                        <Edit2 size={13} /> Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
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

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-amber-900/20 relative">
            <div className="flex items-center justify-between pb-4 border-b border-amber-900/10">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <Tag className="text-[#c00000]" /> Manage Categories
              </h3>
              <button onClick={() => setShowCategoryModal(false)} className="p-2 text-gray-400 hover:text-gray-700 bg-white rounded-full">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="my-5 flex gap-2">
              <input 
                type="text" 
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New category name..."
                className="flex-1 px-4 py-2.5 bg-white border border-amber-900/10 rounded-xl text-sm font-bold"
              />
              <button type="submit" className="bg-[#4A0E0E] text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-red-950 flex items-center gap-1">
                <Plus size={16} /> Add
              </button>
            </form>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-amber-900/10">
                  {editingCategory === cat.id ? (
                    <div className="flex items-center gap-2 flex-1 mr-2">
                      <input 
                        type="text" 
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                        className="w-full px-3 py-1 border rounded-lg text-sm font-bold"
                      />
                      <button onClick={() => handleSaveCategory(cat.id)} className="p-1 text-green-600">
                        <Check size={16} />
                      </button>
                    </div>
                  ) : (
                    <span className="font-bold text-sm text-gray-800">{cat.name} ({cat.count} items)</span>
                  )}

                  <div className="flex items-center gap-1">
                    {editingCategory !== cat.id && (
                      <button onClick={() => { setEditingCategory(cat.id); setEditCategoryName(cat.name); }} className="p-1.5 text-blue-600">
                        <Edit2 size={15} />
                      </button>
                    )}
                    <button onClick={() => handleDeleteCategory(cat.id)} className="p-1.5 text-red-600">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-amber-900/10 text-right">
              <button onClick={() => setShowCategoryModal(false)} className="px-5 py-2 bg-gray-200 text-gray-800 rounded-xl font-bold text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
