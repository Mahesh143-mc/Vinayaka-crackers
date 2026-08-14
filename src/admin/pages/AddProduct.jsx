import { useState } from 'react';
import { ArrowLeft, Save, UploadCloud, Tag, IndianRupee, Package, Sparkles, CheckCircle2, Image as ImageIcon, ArrowRight, ChevronDown, Check, Loader2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { saveProductToFirestore } from '../../services/firebaseService';
import { uploadToCloudinary } from '../../services/cloudinaryService';

const AdminAddProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: isEditMode ? '120 Shots Multi-color' : '',
    code: isEditMode ? 'PRD-01' : `PRD-0${Math.floor(Math.random() * 90 + 10)}`,
    category: isEditMode ? 'Fancy' : 'Sparklers',
    price: isEditMode ? 1200 : '',
    costPrice: isEditMode ? 750 : '',
    discount: isEditMode ? 10 : 0,
    stock: isEditMode ? 45 : '',
    reorderLevel: isEditMode ? 20 : 10,
    description: isEditMode ? 'High sky multi-color aerial shots with loud sound crackers.' : '',
    shotsCount: isEditMode ? '120 Shots' : '',
    safetyRating: 'Green Crackers Approved',
    status: 'Active',
    showInFrontend: true,
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorToast, setErrorToast] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      setProductImage(file);
      const url = await uploadToCloudinary(file, 'Karuppan Crackers/admin');
      setImagePreview(url);
      setIsUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenConfirmModal = (e) => {
    if (e) e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock) {
      setErrorToast('Please fill in Product Name, Retail Price, and Stock Quantity!');
      setTimeout(() => setErrorToast(''), 4000);
      return;
    }
    setShowConfirmModal(true);
  };

  const handleFinalSaveAndRedirect = async () => {
    setIsSaving(true);
    const retailPriceNum = Number(formData.price || 0);
    const costPriceNum = Number(formData.costPrice || 0);
    const profitPerUnit = retailPriceNum - costPriceNum;
    const profitMargin = costPriceNum > 0 ? Number(((profitPerUnit / costPriceNum) * 100).toFixed(1)) : 0;

    const productPayload = {
      id: formData.code || `PRD-0${Math.floor(Math.random() * 90 + 10)}`,
      name: formData.name || 'Sample Product',
      category: formData.category || 'General',
      price: retailPriceNum,
      costPrice: costPriceNum,
      profitPerUnit: profitPerUnit,
      profitMarginPercent: profitMargin,
      stock: Number(formData.stock || 0),
      status: Number(formData.stock || 0) <= 0 ? 'Out of Stock' : Number(formData.stock || 0) <= 10 ? 'Low Stock' : 'Active',
      showInFrontend: Boolean(formData.showInFrontend),
      description: formData.description || '',
      shotsCount: formData.shotsCount || '',
      img: imagePreview || "https://res.cloudinary.com/vf0fqhwo/image/upload/v1785323861/Sample_Crackers_rfzenl.jpg"
    };

    try {
      await saveProductToFirestore(productPayload);
      setIsSaving(false);
      setShowConfirmModal(false);
      navigate('/admin/products');
    } catch (err) {
      console.error("Firestore Save Error:", err);
      setIsSaving(false);
      setErrorToast(`Backend Save Error: ${err.message || 'Firebase request blocked or rules missing'}`);
      setTimeout(() => setErrorToast(''), 6000);
    }
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
          onClick={handleOpenConfirmModal}
          className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-[#4A0E0E] font-black text-sm rounded-2xl shadow-md transition-all transform hover:scale-105 flex items-center gap-2"
        >
          <Save size={18} /> {isEditMode ? 'Update Product' : 'Save Product'}
        </button>
      </div>

      {/* Toast Notification */}
      {errorToast && (
        <div className="fixed top-6 right-6 z-[1000005] bg-rose-800 text-white font-black text-xs sm:text-sm px-5 py-3.5 rounded-2xl shadow-2xl border-2 border-amber-300 flex items-center gap-3 animate-in slide-in-from-top-5 duration-300">
          <span>{errorToast}</span>
        </div>
      )}

      <form onSubmit={handleOpenConfirmModal} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                <label className="block text-xs font-black text-[#4A0E0E] uppercase tracking-wider mb-2">Cost Price (₹) *</label>
                <input 
                  type="number" 
                  name="costPrice"
                  value={formData.costPrice}
                  onChange={handleChange}
                  placeholder="750"
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

            {/* Live Profit Margin Calculator Indicator */}
            {Number(formData.price) > 0 && Number(formData.costPrice) > 0 && (
              <div className="p-4 bg-emerald-100/70 border border-emerald-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-bold text-emerald-950 shadow-sm animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span>Estimated Net Profit per Unit:</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-emerald-900 text-base">
                    +₹{(Number(formData.price) - Number(formData.costPrice)).toLocaleString('en-IN')}
                  </span>
                  <span className="ml-2 px-2.5 py-0.5 bg-emerald-700 text-white font-black text-[11px] rounded-full">
                    {(((Number(formData.price) - Number(formData.costPrice)) / Number(formData.costPrice)) * 100).toFixed(1)}% Profit Margin
                  </span>
                </div>
              </div>
            )}

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

            <label className="block border-2 border-dashed border-amber-900/30 rounded-3xl p-6 text-center bg-white hover:bg-amber-50/50 transition-colors cursor-pointer space-y-3 relative overflow-hidden">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="hidden" 
              />
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 text-[#4A0E0E] flex items-center justify-center font-bold">
                {isUploading ? <Loader2 size={28} className="animate-spin text-amber-700" /> : <UploadCloud size={28} />}
              </div>
              <div>
                <p className="text-xs font-black text-gray-900">
                  {isUploading ? 'Uploading to Cloudinary (Karuppan Crackers/admin)...' : 'Click to select & upload product image'}
                </p>
                <p className="text-[10px] text-gray-500 font-bold mt-1">PNG, JPG, or WEBP (Saved to Cloudinary)</p>
              </div>
            </label>

            {/* Cloudinary Image Preview */}
            {imagePreview && (
              <div className="p-3 bg-white rounded-2xl border-2 border-emerald-400 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <img src={imagePreview} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-amber-900/20" />
                  <div>
                    <p className="text-xs font-black text-gray-900">{productImage?.name || 'Cloudinary Image'}</p>
                    <p className="text-[10px] text-emerald-700 font-extrabold flex items-center gap-1">
                      <Check size={12} /> Live Cloudinary URL Ready
                    </p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => { setImagePreview(''); setProductImage(null); }}
                  className="text-xs font-black text-rose-600 hover:underline px-2"
                >
                  Remove
                </button>
              </div>
            )}
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

            <div className="pt-2 space-y-2">
              <div 
                onClick={() => setFormData(prev => ({ ...prev, showInFrontend: !prev.showInFrontend }))}
                className="flex items-center justify-between p-3.5 bg-white rounded-2xl border-2 border-amber-900/15 cursor-pointer shadow-sm hover:border-[#4A0E0E] transition-all"
              >
                <div>
                  <span className="font-black text-xs text-[#4A0E0E] block">Show in Frontend Website</span>
                  <span className="text-[10px] font-bold text-gray-500">
                    {formData.showInFrontend ? 'Product is ON (Visible in customer shop)' : 'Product is OFF (Hidden from customer shop)'}
                  </span>
                </div>
                <div className={`w-10 h-6 rounded-full p-0.5 transition-colors relative flex items-center shrink-0 ${
                  formData.showInFrontend ? 'bg-emerald-600' : 'bg-gray-400'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                    formData.showInFrontend ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </div>
              </div>

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

      {/* Save Product Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-md w-full p-7 shadow-2xl border border-amber-900/30 text-center relative space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-[#4A0E0E] to-amber-700 flex items-center justify-center text-[#FFD700] shadow-xl">
              <Sparkles size={32} strokeWidth={2.5} />
            </div>

            <div>
              <h3 className="text-xl font-serif font-black text-gray-900">Confirm Save & Publish Product?</h3>
              <p className="text-xs font-bold text-gray-600 mt-1">Review product details before saving to backend catalog:</p>
            </div>

            <div className="p-4 bg-amber-100/60 rounded-2xl border border-amber-900/15 text-xs text-left font-bold space-y-2 text-gray-800">
              <div className="flex justify-between"><span>Product Name:</span><span className="font-black text-[#4A0E0E]">{formData.name}</span></div>
              <div className="flex justify-between"><span>Category:</span><span className="font-black">{formData.category}</span></div>
              <div className="flex justify-between"><span>Retail Price:</span><span className="font-black text-[#c00000]">₹{formData.price}</span></div>
              <div className="flex justify-between border-t border-amber-900/15 pt-1.5"><span>Initial Stock:</span><span className="font-black text-emerald-800">{formData.stock} units</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSaving}
                className="py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-2xl text-xs font-black"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleFinalSaveAndRedirect}
                disabled={isSaving}
                className="py-3 bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-[#4A0E0E] rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-1.5"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-[#4A0E0E]" /> Saving...
                  </>
                ) : (
                  <>
                    Yes, Save & Publish <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAddProduct;
