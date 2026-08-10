import { useState } from 'react';
import { ArrowLeft, Save, UploadCloud, Tag, IndianRupee, Package, Sparkles, CheckCircle2, Image as ImageIcon, ArrowRight, ChevronDown } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const AdminAddProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: isEditMode ? '120 Shots Multi-color' : '',
    code: isEditMode ? 'PRD-01' : `PRD-0${Math.floor(Math.random() * 90 + 10)}`,
    category: isEditMode ? 'Fancy' : 'Sparklers',
    price: isEditMode ? 1200 : '',
    wholesalePrice: isEditMode ? 950 : '',
    discount: isEditMode ? 10 : 0,
    stock: isEditMode ? 45 : '',
    reorderLevel: isEditMode ? 20 : 10,
    description: isEditMode ? 'High sky multi-color aerial shots with loud sound crackers.' : '',
    shotsCount: isEditMode ? '120 Shots' : '',
    safetyRating: 'Green Crackers Approved',
    status: 'Active',
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleConfirmRedirect = () => {
    navigate('/admin/products');
  };

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
          {isEditMode ? `Editing Item: ${formData.code}` : 'Creating New Fireworks Product'}
        </span>
      </div>

      {/* Form Header Banner */}
      <div className="bg-gradient-to-r from-[#4A0E0E] via-[#701515] to-[#4A0E0E] p-7 rounded-3xl shadow-lg text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-white flex items-center gap-2">
            <Sparkles className="text-[#FFD700]" /> {isEditMode ? 'Edit Product Details' : 'Add New Product'}
          </h1>
          <p className="text-amber-200/90 text-sm mt-1 font-medium">Fill in the product pricing, stock count, and category information below.</p>
        </div>

        <button 
          type="button"
          onClick={handleSubmit}
          className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-[#4A0E0E] font-black text-sm rounded-2xl shadow-md transition-all transform hover:scale-105 flex items-center gap-2"
        >
          <Save size={18} /> {isEditMode ? 'Update Product' : 'Save Product'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Core Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Basic Info */}
          <div className="bg-[#FAF7F2] rounded-3xl p-7 shadow-sm border border-amber-900/20 space-y-5">
            <h2 className="text-lg font-serif font-black text-[#4A0E0E] border-b border-amber-900/15 pb-3 flex items-center gap-2">
              <Tag className="text-[#c00000]" size={20} /> Basic Product Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-black text-[#4A0E0E] uppercase tracking-wider mb-2">Product Name *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 120 Shots Multi-color Sky Fireworks"
                  className="w-full px-4 py-3.5 bg-white border-2 border-amber-900/20 rounded-2xl focus:outline-none focus:border-[#4A0E0E] focus:ring-2 focus:ring-[#FFD700]/50 text-sm font-black text-gray-900 placeholder:text-gray-400 placeholder:font-normal shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#4A0E0E] uppercase tracking-wider mb-2">Product SKU / Code</label>
                <input 
                  type="text" 
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 bg-amber-100/60 border-2 border-amber-900/20 rounded-2xl text-sm font-black text-[#4A0E0E] shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-[#4A0E0E] uppercase tracking-wider mb-2">Product Category *</label>
                <div className="relative">
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full pl-4 pr-11 py-3.5 bg-white border-2 border-amber-900/20 rounded-2xl focus:outline-none focus:border-[#4A0E0E] font-black text-gray-900 text-sm shadow-sm appearance-none cursor-pointer hover:border-[#4A0E0E] transition-all"
                  >
                    <option value="Sparklers">Sparklers</option>
                    <option value="Bombs">Bombs</option>
                    <option value="Fancy">Fancy Sky Shots</option>
                    <option value="Fountains">Fountains / Pots</option>
                    <option value="Novelty">Novelty & Crackers</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4A0E0E] pointer-events-none stroke-[2.5]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#4A0E0E] uppercase tracking-wider mb-2">Shots / Package Spec</label>
                <input 
                  type="text" 
                  name="shotsCount"
                  value={formData.shotsCount}
                  onChange={handleChange}
                  placeholder="e.g. 120 Shots or 50 Pcs Box"
                  className="w-full px-4 py-3.5 bg-white border-2 border-amber-900/20 rounded-2xl focus:outline-none focus:border-[#4A0E0E] focus:ring-2 focus:ring-[#FFD700]/50 text-sm font-black text-gray-900 placeholder:text-gray-400 placeholder:font-normal shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-[#4A0E0E] uppercase tracking-wider mb-2">Short Description</label>
              <textarea 
                rows="3"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter details about color lights, sound intensity, and aerial height..."
                className="w-full px-4 py-3.5 bg-white border-2 border-amber-900/20 rounded-2xl focus:outline-none focus:border-[#4A0E0E] focus:ring-2 focus:ring-[#FFD700]/50 text-sm font-black text-gray-900 placeholder:text-gray-400 placeholder:font-normal resize-none shadow-sm"
              ></textarea>
            </div>
          </div>

          {/* Section 2: Pricing & Inventory Details */}
          <div className="bg-[#FAF7F2] rounded-3xl p-7 shadow-sm border border-amber-900/20 space-y-5">
            <h2 className="text-lg font-serif font-black text-[#4A0E0E] border-b border-amber-900/15 pb-3 flex items-center gap-2">
              <IndianRupee className="text-[#c00000]" size={20} /> Pricing & Stock Thresholds
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-black text-[#4A0E0E] uppercase tracking-wider mb-2">Retail Price (₹) *</label>
                <input 
                  type="number" 
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="1200"
                  className="w-full px-4 py-3.5 bg-white border-2 border-amber-900/20 rounded-2xl focus:outline-none focus:border-[#4A0E0E] focus:ring-2 focus:ring-[#FFD700]/50 text-sm font-black text-gray-900 placeholder:text-gray-400 placeholder:font-normal shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#4A0E0E] uppercase tracking-wider mb-2">Wholesale Rate (₹)</label>
                <input 
                  type="number" 
                  name="wholesalePrice"
                  value={formData.wholesalePrice}
                  onChange={handleChange}
                  placeholder="950"
                  className="w-full px-4 py-3.5 bg-white border-2 border-amber-900/20 rounded-2xl focus:outline-none focus:border-[#4A0E0E] focus:ring-2 focus:ring-[#FFD700]/50 text-sm font-black text-gray-900 placeholder:text-gray-400 placeholder:font-normal shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#4A0E0E] uppercase tracking-wider mb-2">Festive Discount (%)</label>
                <input 
                  type="number" 
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  placeholder="10"
                  className="w-full px-4 py-3.5 bg-white border-2 border-amber-900/20 rounded-2xl focus:outline-none focus:border-[#4A0E0E] focus:ring-2 focus:ring-[#FFD700]/50 text-sm font-black text-gray-900 placeholder:text-gray-400 placeholder:font-normal shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-[#4A0E0E] uppercase tracking-wider mb-2">Initial Stock Quantity *</label>
                <input 
                  type="number" 
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  placeholder="45"
                  className="w-full px-4 py-3.5 bg-white border-2 border-amber-900/20 rounded-2xl focus:outline-none focus:border-[#4A0E0E] focus:ring-2 focus:ring-[#FFD700]/50 text-sm font-black text-gray-900 placeholder:text-gray-400 placeholder:font-normal shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#4A0E0E] uppercase tracking-wider mb-2">Reorder Level Threshold</label>
                <input 
                  type="number" 
                  name="reorderLevel"
                  value={formData.reorderLevel}
                  onChange={handleChange}
                  placeholder="20"
                  className="w-full px-4 py-3.5 bg-white border-2 border-amber-900/20 rounded-2xl focus:outline-none focus:border-[#4A0E0E] focus:ring-2 focus:ring-[#FFD700]/50 text-sm font-black text-gray-900 placeholder:text-gray-400 placeholder:font-normal shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Media Upload & Status */}
        <div className="space-y-6">
          {/* Product Image Upload */}
          <div className="bg-[#FAF7F2] rounded-3xl p-7 shadow-sm border border-amber-900/20 space-y-4">
            <h2 className="text-lg font-serif font-black text-[#4A0E0E] border-b border-amber-900/15 pb-3 flex items-center gap-2">
              <ImageIcon className="text-[#c00000]" size={20} /> Product Photo Upload
            </h2>

            <div className="border-2 border-dashed border-amber-900/30 rounded-3xl p-6 text-center bg-white hover:bg-amber-50/50 transition-colors cursor-pointer space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 text-[#4A0E0E] flex items-center justify-center font-bold">
                <UploadCloud size={28} />
              </div>
              <div>
                <p className="text-xs font-black text-gray-900">Click or drag product image here</p>
                <p className="text-[10px] text-gray-500 font-bold mt-1">PNG, JPG, or WEBP up to 5MB</p>
              </div>
            </div>

            {/* Mock Image Preview Badge */}
            <div className="p-3 bg-white rounded-2xl border-2 border-amber-900/15 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-100 to-orange-200 flex items-center justify-center text-lg">🎆</div>
                <div>
                  <p className="text-xs font-black text-gray-900">fireworks_sample.jpg</p>
                  <p className="text-[10px] text-emerald-700 font-extrabold">Uploaded (1.2 MB)</p>
                </div>
              </div>
              <button type="button" className="text-xs font-black text-rose-600 hover:underline">Remove</button>
            </div>
          </div>

          {/* Status & Options */}
          <div className="bg-[#FAF7F2] rounded-3xl p-7 shadow-sm border border-amber-900/20 space-y-4">
            <h2 className="text-lg font-serif font-black text-[#4A0E0E] border-b border-amber-900/15 pb-3 flex items-center gap-2">
              <Package className="text-[#c00000]" size={20} /> Status & Visibility
            </h2>

            <div>
              <label className="block text-xs font-black text-[#4A0E0E] uppercase tracking-wider mb-2">Publish Status</label>
              <div className="relative">
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full pl-4 pr-11 py-3.5 bg-white border-2 border-amber-900/20 rounded-2xl font-black text-gray-900 text-sm focus:outline-none focus:border-[#4A0E0E] shadow-sm appearance-none cursor-pointer hover:border-[#4A0E0E] transition-all"
                >
                  <option value="Active">Active (Visible on Website)</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Draft">Draft (Hidden)</option>
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4A0E0E] pointer-events-none stroke-[2.5]" />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center justify-between p-3.5 bg-white rounded-2xl border-2 border-amber-900/15 cursor-pointer shadow-sm">
                <span className="font-black text-xs text-[#4A0E0E]">Green Crackers Certified</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#4A0E0E]" />
              </label>
            </div>
          </div>

          {/* Form Submit Footer buttons */}
          <div className="flex gap-3">
            <button 
              type="button" 
              onClick={() => navigate('/admin/products')}
              className="flex-1 py-3.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-2xl text-xs font-black transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-3.5 bg-[#4A0E0E] hover:bg-red-950 text-white rounded-2xl text-xs font-black shadow-md transition-all"
            >
              {isEditMode ? 'Update Product' : 'Save Product'}
            </button>
          </div>
        </div>
      </form>

      {/* Save Product Success Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-md w-full p-8 shadow-2xl border border-amber-900/30 text-center relative space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-xl shadow-emerald-900/20">
              <CheckCircle2 size={44} strokeWidth={2.5} />
            </div>

            <div>
              <h3 className="text-2xl font-serif font-black text-gray-900">Product Saved Successfully!</h3>
              <p className="text-xs font-bold text-gray-600 mt-2">
                "{formData.name || 'Fireworks Item'}" has been published and added to your store catalog.
              </p>
            </div>

            <div className="pt-4 border-t border-amber-900/15">
              <button 
                onClick={handleConfirmRedirect}
                className="w-full py-3.5 bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-[#4A0E0E] font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Return to Products Catalog <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAddProduct;
