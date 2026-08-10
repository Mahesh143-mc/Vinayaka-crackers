import { useState } from 'react';
import { Globe, Image as ImageIcon, Megaphone, Store, ShieldAlert, Plus, Trash2, Edit3, Check, Save, CheckCircle2, AlertCircle, Eye } from 'lucide-react';

const AdminWebsiteCMS = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [showSaveSuccessModal, setShowSaveSuccessModal] = useState(false);

  // Tab 1: Hero Banners State
  const [banners, setBanners] = useState([
    { id: 'BNR-01', title: 'Diwali Sparkle Mega Sale', subtitle: 'Flat 10% OFF on all Wholesale & Retail Firecrackers!', buttonText: 'Explore Catalog', link: '/products', active: true, image: '🎆' },
    { id: 'BNR-02', name: '100% Green Crackers Sivakasi Direct', subtitle: 'Direct factory rate with doorstep delivery across Tamil Nadu.', buttonText: 'Order Now', link: '/products', active: true, image: '✨' },
    { id: 'BNR-03', name: 'Diwali Family Gift Boxes', subtitle: 'Specially curated festive combo boxes for whole families.', buttonText: 'View Gift Boxes', link: '/categories', active: false, image: '🪔' },
  ]);

  // Tab 2: Announcement Ticker & Offers
  const [announcementText, setAnnouncementText] = useState('🔥 Diwali Festive Special Offer: Flat 10% OFF + Free Sivakasi Delivery on Orders above ₹3,000!');
  const [isTickerActive, setIsTickerActive] = useState(true);
  const [discountPercent, setDiscountPercent] = useState(10);
  const [minOrderForDiscount, setMinOrderForDiscount] = useState(3000);

  // Tab 3: Store Information & Legal Contact
  const [storeName, setStoreName] = useState('Karuppan Crackers');
  const [supportPhone, setSupportPhone] = useState('8825419454');
  const [whatsappNumber, setWhatsappNumber] = useState('8825419454');
  const [supportEmail, setSupportEmail] = useState('chimeratechweb@gmail.com');
  const [storeAddress, setStoreAddress] = useState('124/B, Main Road, Sivakasi - 626123, Tamil Nadu, India');
  const [gstinNumber, setGstinNumber] = useState('33AAAAA0000A1Z5');

  // Tab 4: Store Notice & Maintenance
  const [acceptingOrders, setAcceptingOrders] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const toggleBannerStatus = (id) => {
    setBanners(banners.map(b => b.id === id ? { ...b, active: !b.active } : b));
  };

  const handleSaveCMS = (e) => {
    if (e) e.preventDefault();
    setShowSaveSuccessModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#4A0E0E] via-[#701515] to-[#4A0E0E] p-7 rounded-3xl shadow-lg text-white">
        <div>
          <h1 className="text-3xl font-serif font-black tracking-wide text-white flex items-center gap-2">
            <Globe className="text-[#FFD700]" /> Website CMS & Banner Management
          </h1>
          <p className="text-amber-200/90 text-sm mt-1 font-medium">Control homepage banners, announcement ticker, store contact info, and website notices.</p>
        </div>

        <button 
          onClick={() => handleSaveCMS()}
          className="bg-[#FFD700] hover:bg-amber-400 text-[#4A0E0E] px-5 py-3 rounded-2xl font-black text-xs shadow-md flex items-center gap-2 transition-all transform hover:scale-105"
        >
          <Save size={18} strokeWidth={2.5} /> Save All Website Changes
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-[#EFEAE1] p-2 rounded-3xl border border-amber-900/10 shadow-sm flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('hero')}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            activeTab === 'hero' 
              ? 'bg-[#4A0E0E] text-white shadow-md' 
              : 'text-gray-700 hover:bg-white/60'
          }`}
        >
          <ImageIcon size={16} /> Hero Banners & Slider
        </button>

        <button
          onClick={() => setActiveTab('ticker')}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            activeTab === 'ticker' 
              ? 'bg-[#4A0E0E] text-white shadow-md' 
              : 'text-gray-700 hover:bg-white/60'
          }`}
        >
          <Megaphone size={16} /> Announcement Ticker & Offers
        </button>

        <button
          onClick={() => setActiveTab('store')}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            activeTab === 'store' 
              ? 'bg-[#4A0E0E] text-white shadow-md' 
              : 'text-gray-700 hover:bg-white/60'
          }`}
        >
          <Store size={16} /> Store Information & Legal
        </button>

        <button
          onClick={() => setActiveTab('notice')}
          className={`flex-1 min-w-[140px] py-3 px-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            activeTab === 'notice' 
              ? 'bg-[#4A0E0E] text-white shadow-md' 
              : 'text-gray-700 hover:bg-white/60'
          }`}
        >
          <ShieldAlert size={16} /> Order Acceptance & Notices
        </button>
      </div>

      {/* TAB 1: HERO BANNERS & SLIDER */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-serif font-black text-gray-900">Homepage Banners ({banners.length})</h3>
            <button 
              onClick={() => alert('Banner Uploader Feature Triggered!')}
              className="bg-[#4A0E0E] text-white px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={16} /> Add New Banner
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {banners.map((banner) => (
              <div 
                key={banner.id} 
                className={`bg-[#FAF7F2] rounded-3xl p-5 border-2 transition-all shadow-sm flex flex-col justify-between space-y-4 ${
                  banner.active ? 'border-[#4A0E0E] bg-white' : 'border-amber-900/15 opacity-70'
                }`}
              >
                <div className="space-y-3">
                  <div className="w-full h-32 bg-gradient-to-br from-amber-100 to-orange-200 rounded-2xl flex items-center justify-center text-5xl shadow-inner border border-amber-300">
                    {banner.image}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-950 bg-amber-200 px-2 py-0.5 rounded">
                      {banner.id}
                    </span>
                    <button 
                      onClick={() => toggleBannerStatus(banner.id)}
                      className={`text-xs font-black px-3 py-1 rounded-full border transition-all ${
                        banner.active ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-gray-200 text-gray-700 border-gray-300'
                      }`}
                    >
                      {banner.active ? '✓ Active' : 'Hidden'}
                    </button>
                  </div>

                  <h4 className="font-serif font-black text-gray-900 text-base">{banner.title || banner.name}</h4>
                  <p className="text-xs font-medium text-gray-600 line-clamp-2">{banner.subtitle}</p>
                </div>

                <div className="pt-3 border-t border-amber-900/10 flex items-center justify-between">
                  <span className="text-xs font-black text-[#c00000]">CTA: {banner.buttonText}</span>
                  <div className="flex items-center gap-1">
                    <button className="p-2 text-gray-700 hover:bg-amber-100 rounded-xl" title="Preview"><Eye size={16}/></button>
                    <button className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl" title="Delete"><Trash2 size={16}/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ANNOUNCEMENT TICKER & OFFERS */}
      {activeTab === 'ticker' && (
        <form onSubmit={handleSaveCMS} className="bg-[#FAF7F2] p-7 rounded-3xl border-2 border-amber-900/15 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-serif font-black text-gray-900">Homepage Announcement Ticker & Offers</h3>
            <p className="text-xs font-bold text-gray-500 mt-1">This text marquee scrolls at the very top of your customer-facing website.</p>
          </div>

          <div className="space-y-4 text-xs font-bold">
            <div className="flex items-center justify-between bg-amber-100/60 p-4 rounded-2xl border border-amber-900/15">
              <div>
                <p className="text-sm font-black text-gray-900">Enable Announcement Ticker Bar</p>
                <p className="text-[11px] text-gray-600 font-medium">Show promo banner to website visitors</p>
              </div>
              <input 
                type="checkbox" 
                checked={isTickerActive}
                onChange={(e) => setIsTickerActive(e.target.checked)}
                className="w-6 h-6 accent-[#4A0E0E] cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-[#4A0E0E] uppercase tracking-wider mb-2">Ticker Announcement Message Text</label>
              <textarea 
                rows={3}
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full p-4 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none focus:border-[#4A0E0E]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Festive Discount Percentage (%)</label>
                <input 
                  type="number"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  className="w-full p-3.5 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Min Order Amount for Discount (₹)</label>
                <input 
                  type="number"
                  value={minOrderForDiscount}
                  onChange={(e) => setMinOrderForDiscount(e.target.value)}
                  className="w-full p-3.5 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button 
              type="submit"
              className="px-6 py-3 bg-[#4A0E0E] hover:bg-red-950 text-white rounded-2xl font-black text-xs shadow-md flex items-center gap-2"
            >
              <Save size={16} /> Save Announcement Settings
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: STORE INFORMATION & LEGAL CONTACT */}
      {activeTab === 'store' && (
        <form onSubmit={handleSaveCMS} className="bg-[#FAF7F2] p-7 rounded-3xl border-2 border-amber-900/15 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-serif font-black text-gray-900">Store Identity & Public Contact Information</h3>
            <p className="text-xs font-bold text-gray-500 mt-1">This details appear on tax invoice bills, website footer, and contact page.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-bold">
            <div>
              <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Official Brand Store Name</label>
              <input 
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full p-3.5 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Official GSTIN Registration Number</label>
              <input 
                type="text"
                value={gstinNumber}
                onChange={(e) => setGstinNumber(e.target.value)}
                className="w-full p-3.5 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Support Phone Number</label>
              <input 
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full p-3.5 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Support WhatsApp Number</label>
              <input 
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full p-3.5 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Support Email Address</label>
              <input 
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full p-3.5 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[#4A0E0E] uppercase tracking-wider mb-1.5">Factory / Shop Physical Address</label>
              <textarea 
                rows={2}
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                className="w-full p-3.5 bg-white border-2 border-amber-900/20 rounded-2xl text-sm font-black text-gray-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button 
              type="submit"
              className="px-6 py-3 bg-[#4A0E0E] hover:bg-red-950 text-white rounded-2xl font-black text-xs shadow-md flex items-center gap-2"
            >
              <Save size={16} /> Save Store Details
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: STORE NOTICE & MAINTENANCE MODE */}
      {activeTab === 'notice' && (
        <form onSubmit={handleSaveCMS} className="bg-[#FAF7F2] p-7 rounded-3xl border-2 border-amber-900/15 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-serif font-black text-gray-900">Order Acceptance & Maintenance Mode</h3>
            <p className="text-xs font-bold text-gray-500 mt-1">Control online order placement status and emergency store notices.</p>
          </div>

          <div className="space-y-4 text-xs font-bold">
            <div className="flex items-center justify-between bg-white p-5 rounded-3xl border-2 border-amber-900/15 shadow-sm">
              <div>
                <p className="text-base font-black text-gray-900">Accepting Online Orders</p>
                <p className="text-xs text-emerald-800 font-bold mt-0.5">Allow customers to add items to cart and complete checkout</p>
              </div>
              <input 
                type="checkbox" 
                checked={acceptingOrders}
                onChange={(e) => setAcceptingOrders(e.target.checked)}
                className="w-7 h-7 accent-[#4A0E0E] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between bg-white p-5 rounded-3xl border-2 border-amber-900/15 shadow-sm">
              <div>
                <p className="text-base font-black text-rose-900">Enable Maintenance Mode Notice</p>
                <p className="text-xs text-gray-600 font-bold mt-0.5">Show temporary "Store Under Maintenance" popup to website visitors</p>
              </div>
              <input 
                type="checkbox" 
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="w-7 h-7 accent-rose-700 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button 
              type="submit"
              className="px-6 py-3 bg-[#4A0E0E] hover:bg-red-950 text-white rounded-2xl font-black text-xs shadow-md flex items-center gap-2"
            >
              <Save size={16} /> Update Store Status
            </button>
          </div>
        </form>
      )}

      {/* Save Success Confirmation Modal */}
      {showSaveSuccessModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-md w-full p-7 shadow-2xl border border-amber-900/30 text-center space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-900/20">
              <CheckCircle2 size={36} strokeWidth={2.5} />
            </div>

            <div>
              <h3 className="text-xl font-serif font-black text-gray-900">Website Content Updated!</h3>
              <p className="text-xs font-bold text-gray-600 mt-1">All CMS settings, banners, and announcement updates are live on your fireworks website.</p>
            </div>

            <button 
              onClick={() => setShowSaveSuccessModal(false)}
              className="w-full py-3 bg-[#4A0E0E] hover:bg-red-950 text-white rounded-2xl font-black text-xs shadow-md"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWebsiteCMS;
