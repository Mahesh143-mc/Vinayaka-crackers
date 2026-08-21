import { useState, useEffect } from 'react';
import { 
  Store, 
  Percent, 
  Save, 
  Check, 
  Calculator, 
  Sparkles, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  FileText,
  Smartphone,
  UploadCloud,
  Image as ImageIcon,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { useToast } from '../../context/ToastContext';
import { uploadToCloudinary } from '../../services/cloudinaryService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminSettings = () => {
  const { storeSettings, updateStoreSettings, isLoading } = useStoreSettings();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('company');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    companyName: 'Karuppa Crackers',
    tagline: 'Direct from Sivakasi • Premium Fireworks Manufacturer',
    logo: 'https://res.cloudinary.com/vf0fqhwo/image/upload/v1786363324/logo_q7lezq.jpg',
    companyLogo: 'https://res.cloudinary.com/vf0fqhwo/image/upload/v1786363324/logo_q7lezq.jpg',
    phone: '8825419454',
    whatsapp: '8825419454',
    email: 'chimeratechweb@gmail.com',
    gstNumber: '33AAAAA0000A1Z5',
    address: '124/B, Sivakasi Main Road, Near Bus Stand',
    city: 'Sivakasi',
    state: 'Tamil Nadu',
    pincode: '626123',
    country: 'India',
    gstPercentage: 18,
    festiveDiscount: 80
  });

  // Live Calculator State
  const [sampleSellingPrice, setSampleSellingPrice] = useState(100);
  const [sampleDiscountPercent, setSampleDiscountPercent] = useState(80);

  useEffect(() => {
    if (storeSettings) {
      setFormData(prev => ({
        ...prev,
        ...storeSettings,
        logo: storeSettings.logo || storeSettings.companyLogo || prev.logo,
        companyLogo: storeSettings.logo || storeSettings.companyLogo || prev.companyLogo
      }));
      if (storeSettings.festiveDiscount !== undefined) {
        setSampleDiscountPercent(storeSettings.festiveDiscount);
      }
    }
  }, [storeSettings]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingLogo(true);
      try {
        const url = await uploadToCloudinary(file, 'Karuppan Crackers/logo');
        handleChange('logo', url);
        handleChange('companyLogo', url);
        showToast('Logo uploaded successfully! Click "Save All Settings" to apply globally.', 'success');
      } catch (err) {
        console.error("Logo upload error:", err);
        showToast('Failed to upload logo image', 'error');
      } finally {
        setIsUploadingLogo(false);
      }
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await updateStoreSettings({
        ...formData,
        logo: formData.logo,
        companyLogo: formData.logo,
        gstPercentage: Number(formData.gstPercentage) || 0,
        festiveDiscount: Number(formData.festiveDiscount) || 0
      });
      showToast('Store settings & logo saved successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error saving settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Math Calculations for MRP Calculator Tool
  const sp = Math.max(0, parseFloat(sampleSellingPrice) || 0);
  const discPct = Math.min(99.9, Math.max(0, parseFloat(sampleDiscountPercent) || 0));
  const customerPayPct = 100 - discPct;

  const perPercentValue = customerPayPct > 0 ? sp / customerPayPct : 0;
  const calculatedOriginalMRP = perPercentValue * 100;
  const calculatedDiscountSavings = perPercentValue * discPct;

  if (isLoading) {
    return <LoadingSpinner message="Loading store configurations from database..." />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#4A0E0E] via-[#701515] to-[#4A0E0E] p-7 rounded-3xl shadow-lg text-white">
        <div>
          <h1 className="text-3xl font-serif font-black tracking-wide text-white flex items-center gap-2">
            <Store className="text-amber-400" /> Store & Company Settings
          </h1>
          <p className="text-amber-200/90 text-sm mt-1 font-medium">
            Manage company brand identity, logo, GST information, and pricing discount rules.
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving || isUploadingLogo}
          className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-[#4A0E0E] font-black text-sm shadow-md transition-all transform hover:scale-105 flex items-center gap-2 cursor-pointer disabled:opacity-60"
        >
          <Save size={18} />
          {isSaving ? 'Saving to Database...' : 'Save All Settings'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Navigation Pills */}
        <div className="space-y-2">
          <button 
            type="button"
            onClick={() => setActiveTab('company')}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-black text-sm transition-all border cursor-pointer ${
              activeTab === 'company' 
                ? 'bg-[#4A0E0E] text-[#FFD700] border-[#4A0E0E] shadow-md' 
                : 'bg-[#FAF7F2] text-gray-800 border-amber-900/10 hover:bg-[#EFEAE1]'
            }`}
          >
            <Building2 size={19} /> Company Profile & Logo
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('tax')}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-black text-sm transition-all border cursor-pointer ${
              activeTab === 'tax' 
                ? 'bg-[#4A0E0E] text-[#FFD700] border-[#4A0E0E] shadow-md' 
                : 'bg-[#FAF7F2] text-gray-800 border-amber-900/10 hover:bg-[#EFEAE1]'
            }`}
          >
            <Percent size={19} /> GST Tax & MRP Calculator
          </button>
        </div>

        {/* Right Tab Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* TAB 1: COMPANY & STORE PROFILE + LOGO */}
          {activeTab === 'company' && (
            <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-900/10 space-y-6">
              <div className="border-b border-amber-900/10 pb-4">
                <h2 className="text-xl font-serif font-black text-gray-900 flex items-center gap-2">
                  <Building2 className="text-[#4A0E0E]" /> Company Profile & Brand Logo
                </h2>
                <p className="text-xs font-bold text-gray-500 mt-1">
                  This brand logo and business details dynamically update across the website header, footer, contact page, and official PDF documents.
                </p>
              </div>

              {/* Company Logo Section */}
              <div className="p-5 bg-white rounded-2xl border-2 border-amber-900/15 shadow-sm space-y-4">
                <label className="block text-xs font-black text-[#4A0E0E] uppercase tracking-wider">
                  Company Official Brand Logo
                </label>
                
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Logo Preview */}
                  <div className="relative group shrink-0">
                    <img 
                      src={formData.logo || formData.companyLogo || "https://res.cloudinary.com/vf0fqhwo/image/upload/v1786363324/logo_q7lezq.jpg"} 
                      alt="Company Logo Preview" 
                      className="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded-2xl border-2 border-amber-300 bg-[#FFF8E7] p-2 shadow-md"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-bold pointer-events-none">
                      Brand Logo
                    </div>
                  </div>

                  {/* Logo Actions */}
                  <div className="flex-1 space-y-3 w-full">
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4A0E0E] hover:bg-[#3B0B0B] text-[#FFD700] font-black text-xs rounded-xl shadow cursor-pointer transition-transform hover:scale-105">
                        <UploadCloud size={16} />
                        <span>{isUploadingLogo ? 'Uploading to Cloud...' : 'Upload New Logo Image'}</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleLogoUpload} 
                          disabled={isUploadingLogo}
                          className="hidden" 
                        />
                      </label>

                      {isUploadingLogo && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                          <Loader2 size={15} className="animate-spin text-[#4A0E0E]" />
                          <span>Uploading...</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 mb-1">
                        Or enter direct Image URL:
                      </label>
                      <input 
                        type="url" 
                        value={formData.logo || ''}
                        onChange={(e) => {
                          handleChange('logo', e.target.value);
                          handleChange('companyLogo', e.target.value);
                        }}
                        placeholder="https://example.com/logo.png"
                        className="w-full px-3.5 py-2 bg-gray-50 border border-amber-900/20 rounded-xl text-xs font-mono text-gray-800 focus:outline-none focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-[#4A0E0E] uppercase mb-2">Company / Store Name</label>
                  <input 
                    type="text" 
                    value={formData.companyName}
                    onChange={(e) => {
                      handleChange('companyName', e.target.value);
                      handleChange('storeName', e.target.value);
                    }}
                    placeholder="e.g. Karuppa Crackers"
                    className="w-full px-4 py-3 bg-white border-2 border-amber-900/20 rounded-2xl focus:outline-none focus:border-[#4A0E0E] font-black text-gray-900 text-sm shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-[#4A0E0E] uppercase mb-2">GST Identification Number (GSTIN)</label>
                  <input 
                    type="text" 
                    value={formData.gstNumber}
                    onChange={(e) => handleChange('gstNumber', e.target.value.toUpperCase())}
                    placeholder="e.g. 33AAAAA0000A1Z5"
                    className="w-full px-4 py-3 bg-white border-2 border-amber-900/20 rounded-2xl focus:outline-none focus:border-[#4A0E0E] font-black text-gray-900 text-sm shadow-sm uppercase tracking-wider"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#4A0E0E] uppercase mb-2">Tagline / Slogan</label>
                <input 
                  type="text" 
                  value={formData.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  placeholder="e.g. Direct from Sivakasi • Premium Fireworks Manufacturer"
                  className="w-full px-4 py-3 bg-white border-2 border-amber-900/20 rounded-2xl focus:outline-none focus:border-[#4A0E0E] font-bold text-gray-800 text-sm shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-[#4A0E0E] uppercase mb-2">Support Email</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => {
                      handleChange('email', e.target.value);
                      handleChange('supportEmail', e.target.value);
                    }}
                    className="w-full px-4 py-3 bg-white border-2 border-amber-900/20 rounded-2xl focus:outline-none focus:border-[#4A0E0E] font-bold text-gray-900 text-sm shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#4A0E0E] uppercase mb-2">Primary Phone Number</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => {
                      handleChange('phone', e.target.value);
                      handleChange('supportPhone', e.target.value);
                    }}
                    className="w-full px-4 py-3 bg-white border-2 border-amber-900/20 rounded-2xl focus:outline-none focus:border-[#4A0E0E] font-black text-gray-900 text-sm shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#4A0E0E] uppercase mb-2">WhatsApp Hotline</label>
                  <input 
                    type="text" 
                    value={formData.whatsapp}
                    onChange={(e) => handleChange('whatsapp', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-amber-900/20 rounded-2xl focus:outline-none focus:border-[#4A0E0E] font-black text-gray-900 text-sm shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#4A0E0E] uppercase mb-2">Factory & Showroom Physical Address</label>
                <textarea 
                  rows="2"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-amber-900/20 rounded-2xl focus:outline-none focus:border-[#4A0E0E] font-bold text-gray-800 text-sm resize-none shadow-sm"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-[#4A0E0E] uppercase mb-2">City</label>
                  <input 
                    type="text" 
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-amber-900/20 rounded-2xl focus:outline-none focus:border-[#4A0E0E] font-bold text-gray-800 text-sm shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#4A0E0E] uppercase mb-2">State</label>
                  <input 
                    type="text" 
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-amber-900/20 rounded-2xl focus:outline-none focus:border-[#4A0E0E] font-bold text-gray-800 text-sm shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#4A0E0E] uppercase mb-2">Pincode</label>
                  <input 
                    type="text" 
                    value={formData.pincode}
                    onChange={(e) => handleChange('pincode', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-amber-900/20 rounded-2xl focus:outline-none focus:border-[#4A0E0E] font-bold text-gray-800 text-sm shadow-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TAX & MRP CALCULATOR */}
          {activeTab === 'tax' && (
            <div className="space-y-6">
              {/* Configurations Card */}
              <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-900/10 space-y-5">
                <h2 className="text-xl font-serif font-black text-gray-900 border-b border-amber-900/10 pb-4 flex items-center justify-between">
                  <span>GST Tax & Default Discount Percentage</span>
                  <Percent className="text-[#c00000]" size={22} />
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-black text-[#4A0E0E] uppercase mb-2">
                      Default GST Percentage (%)
                    </label>
                    <input 
                      type="number" 
                      value={formData.gstPercentage}
                      onChange={(e) => handleChange('gstPercentage', e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-amber-900/15 rounded-2xl focus:outline-none focus:border-[#4A0E0E] font-black text-gray-900 text-sm shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#4A0E0E] uppercase mb-2">
                      Default Festive Discount Percentage (%)
                    </label>
                    <input 
                      type="number" 
                      value={formData.festiveDiscount}
                      onChange={(e) => {
                        handleChange('festiveDiscount', e.target.value);
                        setSampleDiscountPercent(e.target.value);
                      }}
                      className="w-full px-4 py-3 bg-white border-2 border-amber-900/15 rounded-2xl focus:outline-none focus:border-[#4A0E0E] font-black text-gray-900 text-sm shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Calculator */}
              <div className="bg-gradient-to-br from-[#4A0E0E] via-[#5C1212] to-[#3B0B0B] rounded-3xl p-6 sm:p-8 text-white shadow-xl border-2 border-amber-400/40 space-y-6">
                <div className="flex items-center justify-between border-b border-amber-400/30 pb-4">
                  <div>
                    <h3 className="text-xl font-serif font-black text-[#FFD700] flex items-center gap-2">
                      <Calculator size={24} /> MRP & Discount Calculator
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-amber-300 uppercase tracking-wider mb-2">
                      Product Selling Price (Net Amount ₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-950 font-black text-sm">₹</span>
                      <input 
                        type="number" 
                        value={sampleSellingPrice}
                        onChange={(e) => setSampleSellingPrice(e.target.value)}
                        placeholder="e.g. 100"
                        className="w-full pl-9 pr-4 py-3 bg-white border-2 border-amber-300 rounded-2xl text-gray-900 font-black text-sm focus:outline-none shadow-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-amber-300 uppercase tracking-wider mb-2">
                      Discount Percentage (%)
                    </label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={sampleDiscountPercent}
                        onChange={(e) => setSampleDiscountPercent(e.target.value)}
                        placeholder="e.g. 80"
                        className="w-full px-4 py-3 bg-white border-2 border-amber-300 rounded-2xl text-gray-900 font-black text-sm focus:outline-none shadow-md"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-950 font-black text-sm">%</span>
                    </div>
                  </div>
                </div>

                {/* Calculation Output Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {/* Card 1: Customer Paying % */}
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-amber-300/30 space-y-1">
                    <p className="text-[11px] font-black text-amber-200 uppercase tracking-wider">Customer Pays ({customerPayPct}%)</p>
                    <p className="text-2xl font-black text-white">₹{sp.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-amber-200/80 font-mono">1% = ₹{perPercentValue.toFixed(2)}</p>
                  </div>

                  {/* Card 2: Discount Savings Amount */}
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-amber-300/30 space-y-1">
                    <p className="text-[11px] font-black text-amber-300 uppercase tracking-wider">Discount Savings ({discPct}%)</p>
                    <p className="text-2xl font-black text-[#FFD700]">₹{Math.round(calculatedDiscountSavings).toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-amber-200/80 font-mono">Customer Saved {discPct}%</p>
                  </div>

                  {/* Card 3: 100% Original MRP */}
                  <div className="bg-[#FFD700] text-[#4A0E0E] rounded-2xl p-4 border-2 border-amber-300 shadow-lg space-y-1">
                    <p className="text-[11px] font-black uppercase tracking-wider opacity-90">Original Catalog Price (100% MRP)</p>
                    <p className="text-3xl font-serif font-black text-[#4A0E0E]">₹{Math.round(calculatedOriginalMRP).toLocaleString('en-IN')}</p>
                    <p className="text-[10px] font-extrabold text-[#4A0E0E]/80">Calculated Original Amount</p>
                  </div>
                </div>

                {/* Step-by-Step Breakdown */}
                <div className="bg-black/30 rounded-2xl p-4 border border-amber-400/20 text-xs font-mono space-y-1.5">
                  <p className="font-bold text-amber-300 font-sans uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Sparkles size={14} /> Calculation Breakdown Formula:
                  </p>
                  <p className="text-amber-100/90">• Selling Price ({customerPayPct}% of MRP) = ₹{sp}</p>
                  <p className="text-amber-100/90">• 1% Value = ₹{sp} ÷ {customerPayPct}% = ₹{perPercentValue.toFixed(2)}</p>
                  <p className="text-amber-100/90">• {discPct}% Discount Savings = {discPct} × ₹{perPercentValue.toFixed(2)} = ₹{Math.round(calculatedDiscountSavings)}</p>
                  <p className="text-[#FFD700] font-black font-sans text-xs mt-1">• 100% Original MRP = 100 × ₹{perPercentValue.toFixed(2)} = ₹{Math.round(calculatedOriginalMRP)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
