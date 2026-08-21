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

  const [activeTab, setActiveTab] = useState('company'); // 'company' | 'logo' | 'tax'
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // Form State for Company Profile Details
  const [formData, setFormData] = useState({
    companyName: 'Karuppa Crackers',
    tagline: 'Direct from Sivakasi • Premium Fireworks Manufacturer',
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

  // Separate Logo State
  const [logoData, setLogoData] = useState({
    logo: 'https://res.cloudinary.com/vf0fqhwo/image/upload/v1786363324/logo_q7lezq.jpg',
    companyLogo: 'https://res.cloudinary.com/vf0fqhwo/image/upload/v1786363324/logo_q7lezq.jpg'
  });

  // Live Calculator State
  const [sampleSellingPrice, setSampleSellingPrice] = useState(100);
  const [sampleDiscountPercent, setSampleDiscountPercent] = useState(80);

  useEffect(() => {
    if (storeSettings) {
      setFormData({
        companyName: storeSettings.companyName || storeSettings.storeName || 'Karuppa Crackers',
        tagline: storeSettings.tagline || 'Direct from Sivakasi • Premium Fireworks Manufacturer',
        phone: storeSettings.phone || storeSettings.supportPhone || '8825419454',
        whatsapp: storeSettings.whatsapp || storeSettings.phone || '8825419454',
        email: storeSettings.email || storeSettings.supportEmail || 'chimeratechweb@gmail.com',
        gstNumber: storeSettings.gstNumber || '33AAAAA0000A1Z5',
        address: storeSettings.address || '124/B, Sivakasi Main Road, Near Bus Stand',
        city: storeSettings.city || 'Sivakasi',
        state: storeSettings.state || 'Tamil Nadu',
        pincode: storeSettings.pincode || '626123',
        country: storeSettings.country || 'India',
        gstPercentage: storeSettings.gstPercentage !== undefined ? storeSettings.gstPercentage : 18,
        festiveDiscount: storeSettings.festiveDiscount !== undefined ? storeSettings.festiveDiscount : 80
      });

      const currentLogo = storeSettings.logo || storeSettings.companyLogo || 'https://res.cloudinary.com/vf0fqhwo/image/upload/v1786363324/logo_q7lezq.jpg';
      setLogoData({
        logo: currentLogo,
        companyLogo: currentLogo
      });

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
        setLogoData({ logo: url, companyLogo: url });
        showToast('Logo uploaded! Click "Save Brand Logo" to apply.', 'success');
      } catch (err) {
        console.error("Logo upload error:", err);
        showToast('Failed to upload logo image', 'error');
      } finally {
        setIsUploadingLogo(false);
      }
    }
  };

  // Dedicated Save for Company Profile (Does NOT touch Logo)
  const handleSaveCompanyProfile = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await updateStoreSettings({
        ...formData,
        storeName: formData.companyName,
        supportPhone: formData.phone,
        supportEmail: formData.email,
        gstPercentage: Number(formData.gstPercentage) || 0,
        festiveDiscount: Number(formData.festiveDiscount) || 0
      });
      showToast('🎉 Company information saved successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error saving company profile.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Dedicated Save for Brand Logo (Does NOT touch Text Content)
  const handleSaveLogoOnly = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await updateStoreSettings({
        logo: logoData.logo,
        companyLogo: logoData.logo
      });
      showToast('🎉 Brand logo updated and saved successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error saving brand logo.', 'error');
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

        {activeTab === 'company' && (
          <button 
            onClick={handleSaveCompanyProfile}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-[#4A0E0E] font-black text-sm shadow-md transition-all transform hover:scale-105 flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <Save size={18} />
            {isSaving ? 'Saving...' : 'Save Company Details'}
          </button>
        )}

        {activeTab === 'logo' && (
          <button 
            onClick={handleSaveLogoOnly}
            disabled={isSaving || isUploadingLogo}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-[#4A0E0E] font-black text-sm shadow-md transition-all transform hover:scale-105 flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <Save size={18} />
            {isSaving ? 'Saving...' : 'Save Brand Logo'}
          </button>
        )}

        {activeTab === 'tax' && (
          <button 
            onClick={handleSaveCompanyProfile}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-[#4A0E0E] font-black text-sm shadow-md transition-all transform hover:scale-105 flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <Save size={18} />
            {isSaving ? 'Saving...' : 'Save Tax Rules'}
          </button>
        )}
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
            <Building2 size={19} /> Company Profile & Info
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('logo')}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-black text-sm transition-all border cursor-pointer ${
              activeTab === 'logo' 
                ? 'bg-[#4A0E0E] text-[#FFD700] border-[#4A0E0E] shadow-md' 
                : 'bg-[#FAF7F2] text-gray-800 border-amber-900/10 hover:bg-[#EFEAE1]'
            }`}
          >
            <ImageIcon size={19} /> Company Brand Logo
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
          
          {/* TAB 1: COMPANY & STORE PROFILE */}
          {activeTab === 'company' && (
            <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-900/10 space-y-6">
              <div className="border-b border-amber-900/10 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-serif font-black text-gray-900 flex items-center gap-2">
                    <Building2 className="text-[#4A0E0E]" /> Company Profile & Contact Info
                  </h2>
                  <p className="text-xs font-bold text-gray-500 mt-1">
                    Store information used dynamically across website header, footer, contact page, and PDF invoices.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-[#4A0E0E] uppercase mb-2">Company / Store Name</label>
                  <input 
                    type="text" 
                    value={formData.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
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
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-amber-900/20 rounded-2xl focus:outline-none focus:border-[#4A0E0E] font-bold text-gray-900 text-sm shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#4A0E0E] uppercase mb-2">Primary Phone Number</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
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

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveCompanyProfile}
                  disabled={isSaving}
                  className="px-6 py-3 rounded-2xl bg-[#4A0E0E] text-[#FFD700] hover:bg-[#380808] font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Save size={16} />
                  {isSaving ? 'Saving...' : 'Save Company Details'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: COMPANY BRAND LOGO (SEPARATE TAB) */}
          {activeTab === 'logo' && (
            <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-900/10 space-y-6">
              <div className="border-b border-amber-900/10 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-serif font-black text-gray-900 flex items-center gap-2">
                    <ImageIcon className="text-[#4A0E0E]" /> Company Official Brand Logo
                  </h2>
                  <p className="text-xs font-bold text-gray-500 mt-1">
                    Upload your high-resolution brand logo. It dynamically renders on the customer header, footer, admin sidebar, and PDF receipts.
                  </p>
                </div>
              </div>

              {/* Company Logo Section */}
              <div className="p-6 bg-white rounded-2xl border-2 border-amber-900/15 shadow-sm space-y-5">
                <label className="block text-xs font-black text-[#4A0E0E] uppercase tracking-wider">
                  Current Brand Logo Preview
                </label>
                
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  {/* Logo Preview */}
                  <div className="relative group shrink-0">
                    <img 
                      src={logoData.logo || "https://res.cloudinary.com/vf0fqhwo/image/upload/v1786363324/logo_q7lezq.jpg"} 
                      alt="Company Logo Preview" 
                      className="w-32 h-32 object-contain rounded-2xl border-2 border-amber-300 bg-[#FFF8E7] p-3 shadow-md"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold pointer-events-none">
                      Brand Logo
                    </div>
                  </div>

                  {/* Logo Actions */}
                  <div className="flex-1 space-y-4 w-full">
                    <div>
                      <label className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A0E0E] hover:bg-[#3B0B0B] text-[#FFD700] font-black text-xs rounded-xl shadow cursor-pointer transition-transform hover:scale-105">
                        <UploadCloud size={18} />
                        <span>{isUploadingLogo ? 'Uploading to Cloud...' : 'Upload New Logo Image (PNG / JPG / SVG)'}</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleLogoUpload} 
                          disabled={isUploadingLogo}
                          className="hidden" 
                        />
                      </label>

                      {isUploadingLogo && (
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-800 mt-2">
                          <Loader2 size={16} className="animate-spin text-[#4A0E0E]" />
                          <span>Uploading image directly to Cloudinary...</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">
                        Or enter direct Image URL:
                      </label>
                      <input 
                        type="url" 
                        value={logoData.logo || ''}
                        onChange={(e) => setLogoData({ logo: e.target.value, companyLogo: e.target.value })}
                        placeholder="https://res.cloudinary.com/.../logo.png"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-amber-900/20 rounded-xl text-xs font-mono text-gray-800 focus:outline-none focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveLogoOnly}
                  disabled={isSaving || isUploadingLogo}
                  className="px-6 py-3 rounded-2xl bg-[#4A0E0E] text-[#FFD700] hover:bg-[#380808] font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Save size={16} />
                  {isSaving ? 'Saving Logo...' : 'Save Brand Logo'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: TAX & MRP CALCULATOR */}
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
                    <div className="relative">
                      <input 
                        type="number" 
                        min="0"
                        max="100"
                        value={formData.gstPercentage}
                        onChange={(e) => handleChange('gstPercentage', e.target.value)}
                        className="w-full pl-4 pr-10 py-3 bg-white border-2 border-amber-900/20 rounded-2xl font-black text-gray-900 text-sm focus:outline-none focus:border-[#4A0E0E] shadow-sm"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1.5 font-bold">Standard Indian fireworks GST rate is 18%.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#4A0E0E] uppercase mb-2">
                      Store Festive Discount (%)
                    </label>
                    <div className="relative">
                      <input 
                        type="number" 
                        min="0"
                        max="99"
                        value={formData.festiveDiscount}
                        onChange={(e) => {
                          handleChange('festiveDiscount', e.target.value);
                          setSampleDiscountPercent(e.target.value);
                        }}
                        className="w-full pl-4 pr-10 py-3 bg-white border-2 border-amber-900/20 rounded-2xl font-black text-gray-900 text-sm focus:outline-none focus:border-[#4A0E0E] shadow-sm"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1.5 font-bold">Applied to calculate original strike-through MRP prices across the catalog.</p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveCompanyProfile}
                    disabled={isSaving}
                    className="px-6 py-3 rounded-2xl bg-[#4A0E0E] text-[#FFD700] hover:bg-[#380808] font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <Save size={16} />
                    {isSaving ? 'Saving...' : 'Save Tax Rules'}
                  </button>
                </div>
              </div>

              {/* Live Interactive Reverse MRP Formula Demonstrator */}
              <div className="bg-gradient-to-br from-[#FFF8E7] to-[#FAF7F2] rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-md space-y-6">
                <div className="flex items-center gap-3 border-b border-amber-200 pb-4">
                  <div className="p-3 bg-[#4A0E0E] text-[#FFD700] rounded-2xl shadow-sm">
                    <Calculator size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-black text-gray-900">
                      Live MRP Reverse Calculator
                    </h3>
                    <p className="text-xs font-bold text-amber-900/80">
                      Formula: Original MRP = Selling Price ÷ (1 - Discount%)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-[#4A0E0E] uppercase mb-1">
                        Sample Customer Selling Price (₹)
                      </label>
                      <input 
                        type="number" 
                        value={sampleSellingPrice}
                        onChange={(e) => setSampleSellingPrice(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-amber-900/20 rounded-2xl font-black text-gray-900 text-base focus:outline-none focus:border-[#4A0E0E] shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-[#4A0E0E] uppercase mb-1">
                        Applied Festive Discount (%)
                      </label>
                      <input 
                        type="number" 
                        value={sampleDiscountPercent}
                        onChange={(e) => setSampleDiscountPercent(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-amber-900/20 rounded-2xl font-black text-gray-900 text-base focus:outline-none focus:border-[#4A0E0E] shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm flex flex-col justify-center space-y-3">
                    <span className="text-xs font-black text-gray-500 uppercase tracking-wide">
                      Computed Display Result:
                    </span>
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-gray-400 line-through">
                        Original MRP: ₹{calculatedOriginalMRP.toFixed(2)}
                      </div>
                      <div className="text-2xl font-black text-[#4A0E0E] flex items-center gap-2">
                        <span>Net Offer Price: ₹{sp.toFixed(2)}</span>
                        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300 font-extrabold">
                          {discPct}% OFF
                        </span>
                      </div>
                      <div className="text-xs font-black text-emerald-700 pt-1">
                        🎉 Customer Saves: ₹{calculatedDiscountSavings.toFixed(2)}
                      </div>
                    </div>
                  </div>
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
