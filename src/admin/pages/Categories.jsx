import { useState } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, Tag, Search, FolderPlus, Check, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AdminCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([
    { id: 1, name: 'Sparklers', description: 'Electric and color sparklers for kids and family.', count: 12, icon: '✨' },
    { id: 2, name: 'Bombs', description: 'Sound crackers and thunder bombs.', count: 8, icon: '💥' },
    { id: 3, name: 'Fancy Sky Shots', description: 'Multi-shot aerial repeaters and display fireworks.', count: 15, icon: '🎆' },
    { id: 4, name: 'Fountains & Pots', description: 'Flower pots, peacock fountains, and ground spinners.', count: 10, icon: '🪔' },
    { id: 5, name: 'Novelty & Rockets', description: 'Whistling rockets and novelty sky lanterns.', count: 6, icon: '🚀' },
  ]);

  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('✨');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [lastCreatedCat, setLastCreatedCat] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setCategories([
      ...categories,
      {
        id: Date.now(),
        name: newCatName,
        description: newCatDesc || 'General fireworks category.',
        count: 0,
        icon: newCatIcon || '✨'
      }
    ]);
    setLastCreatedCat(newCatName);
    setShowConfirmModal(true);
    setNewCatName('');
    setNewCatDesc('');
  };

  const handleDelete = (id) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const handleStartEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditDesc(cat.description);
  };

  const handleSaveEdit = (id) => {
    setCategories(categories.map(c => c.id === id ? { ...c, name: editName, description: editDesc } : c));
    setEditingId(null);
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between">
        <Link 
          to="/admin/products"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#FAF7F2] border border-amber-900/20 rounded-2xl text-xs font-black text-[#4A0E0E] hover:bg-[#EFEAE1] transition-all shadow-sm"
        >
          <ArrowLeft size={16} /> Back to Products Catalog
        </Link>

        <span className="text-xs font-black text-[#4A0E0E] bg-[#FFD700]/30 px-3.5 py-1.5 rounded-full border border-amber-400/40">
          Dedicated Categories Control Hub
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#4A0E0E] via-[#701515] to-[#4A0E0E] p-7 rounded-3xl shadow-lg text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-white flex items-center gap-2">
            <Tag className="text-[#FFD700]" /> Manage Product Categories
          </h1>
          <p className="text-amber-200/90 text-sm mt-1 font-medium">Create, edit, and organize product categories to streamline your store navigation.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/20 text-center">
            <p className="text-[10px] font-black uppercase text-amber-200">Total Categories</p>
            <p className="text-xl font-black text-white">{categories.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Create New Category Form */}
        <div className="space-y-6">
          <div className="bg-[#FAF7F2] rounded-3xl p-6 shadow-sm border border-amber-900/20 space-y-4">
            <h2 className="text-lg font-serif font-black text-[#4A0E0E] border-b border-amber-900/15 pb-3 flex items-center gap-2">
              <FolderPlus className="text-[#c00000]" size={20} /> Add New Category
            </h2>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-[#4A0E0E] uppercase tracking-wider mb-1.5">Category Name *</label>
                <input 
                  type="text" 
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  required
                  placeholder="e.g. Ground Spinners"
                  className="w-full px-4 py-3 bg-white border-2 border-amber-900/20 rounded-2xl focus:outline-none focus:border-[#4A0E0E] focus:ring-2 focus:ring-[#FFD700]/50 text-sm font-black text-gray-900 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#4A0E0E] uppercase tracking-wider mb-1.5">Category Emoji / Icon</label>
                <div className="flex gap-2">
                  {['✨', '💥', '🎆', '🪔', '🚀', '⭐', '⚡'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewCatIcon(emoji)}
                      className={`w-9 h-9 rounded-xl font-bold text-lg flex items-center justify-center transition-all ${
                        newCatIcon === emoji ? 'bg-[#4A0E0E] text-white shadow-sm' : 'bg-white border-2 border-amber-900/15 hover:bg-amber-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#4A0E0E] uppercase tracking-wider mb-1.5">Description</label>
                <textarea 
                  rows="3"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Short category details..."
                  className="w-full px-4 py-3 bg-white border-2 border-amber-900/20 rounded-2xl focus:outline-none focus:border-[#4A0E0E] focus:ring-2 focus:ring-[#FFD700]/50 text-sm font-black text-gray-900 resize-none shadow-sm"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 bg-[#4A0E0E] hover:bg-red-950 text-white rounded-2xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Plus size={16} /> Save Category
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Category List Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search Filter */}
          <div className="bg-[#EFEAE1] p-4 rounded-3xl border border-amber-900/20 shadow-sm flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-800" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search category by name or keyword..." 
                className="w-full pl-11 pr-4 py-3 bg-white border-2 border-amber-900/20 rounded-2xl focus:outline-none text-sm font-black text-gray-900 shadow-sm"
              />
            </div>
          </div>

          {/* Categories Grid */}
          <div className="space-y-4">
            {filteredCategories.map((cat) => (
              <div 
                key={cat.id}
                className="bg-[#FAF7F2] p-5 rounded-3xl shadow-sm border border-amber-900/20 hover:border-amber-500 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {editingId === cat.id ? (
                  <div className="flex-1 space-y-3">
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="px-3 py-2 border-2 border-amber-900/30 rounded-xl text-sm font-black text-gray-900 bg-white"
                    />
                    <textarea 
                      rows="2"
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      className="w-full p-2 border-2 border-amber-900/30 rounded-xl text-xs font-black text-gray-900 bg-white resize-none"
                    ></textarea>
                    <button 
                      onClick={() => handleSaveEdit(cat.id)}
                      className="px-4 py-1.5 bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1"
                    >
                      <Check size={14} /> Save Category
                    </button>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-2xl shrink-0">
                      {cat.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-gray-900">{cat.name}</h3>
                        <span className="text-[10px] font-black text-[#4A0E0E] bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-300">
                          {cat.count} Products
                        </span>
                      </div>
                      <p className="text-xs font-bold text-gray-600 mt-1">{cat.description}</p>
                    </div>
                  </div>
                )}

                {editingId !== cat.id && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => handleStartEdit(cat)}
                      className="px-3.5 py-2 bg-blue-100 hover:bg-blue-600 text-blue-900 hover:text-white border border-blue-200 rounded-xl text-xs font-black transition-all flex items-center gap-1"
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(cat.id)}
                      className="px-3.5 py-2 bg-rose-100 hover:bg-rose-600 text-rose-900 hover:text-white border border-rose-200 rounded-xl text-xs font-black transition-all flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Category Success Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-md w-full p-8 shadow-2xl border border-amber-900/30 text-center relative space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-xl shadow-emerald-900/20">
              <CheckCircle2 size={44} strokeWidth={2.5} />
            </div>

            <div>
              <h3 className="text-2xl font-serif font-black text-gray-900">Category Saved!</h3>
              <p className="text-xs font-bold text-gray-600 mt-2">
                "{lastCreatedCat || 'Category'}" has been created and added to your store options.
              </p>
            </div>

            <div className="pt-4 border-t border-amber-900/15 grid grid-cols-2 gap-3">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-black text-xs rounded-2xl transition-all"
              >
                Add Another
              </button>
              <button 
                onClick={() => navigate('/admin/products')}
                className="py-3 bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-[#4A0E0E] font-black text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-1"
              >
                Return to Products <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
