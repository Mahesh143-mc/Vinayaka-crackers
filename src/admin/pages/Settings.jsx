import { useState } from 'react';
import { Store, Percent, Bell, Save, Check } from 'lucide-react';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#4A0E0E] via-[#701515] to-[#4A0E0E] p-7 rounded-3xl shadow-lg text-white">
        <div>
          <h1 className="text-3xl font-serif font-black tracking-wide text-white flex items-center gap-2">
            <Store className="text-amber-400" /> Store Configurations
          </h1>
          <p className="text-amber-200/90 text-sm mt-1 font-medium">Update your business info, tax percentages, and store preferences.</p>
        </div>
        <button 
          onClick={handleSave}
          className={`px-6 py-2.5 rounded-2xl font-bold transition-all flex items-center gap-2 ${
            isSaved ? 'bg-emerald-700 text-white' : 'bg-gradient-to-r from-[#FFD700] to-amber-500 text-[#4A0E0E] font-black hover:scale-105 shadow-md'
          }`}
        >
          {isSaved ? <Check size={20} /> : <Save size={20} />}
          {isSaved ? 'Settings Saved!' : 'Save Configurations'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Pills */}
        <div className="space-y-2">
          <button 
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-sm transition-all border ${
              activeTab === 'general' 
                ? 'bg-[#4A0E0E] text-white border-[#4A0E0E] shadow-sm' 
                : 'bg-[#FAF7F2] text-gray-800 border-amber-900/10 hover:bg-[#EFEAE1]'
            }`}
          >
            <Store size={19} /> Store Profile & Address
          </button>
          <button 
            onClick={() => setActiveTab('tax')}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-sm transition-all border ${
              activeTab === 'tax' 
                ? 'bg-[#4A0E0E] text-white border-[#4A0E0E] shadow-sm' 
                : 'bg-[#FAF7F2] text-gray-800 border-amber-900/10 hover:bg-[#EFEAE1]'
            }`}
          >
            <Percent size={19} /> GST Tax & Billing Rules
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-sm transition-all border ${
              activeTab === 'notifications' 
                ? 'bg-[#4A0E0E] text-white border-[#4A0E0E] shadow-sm' 
                : 'bg-[#FAF7F2] text-gray-800 border-amber-900/10 hover:bg-[#EFEAE1]'
            }`}
          >
            <Bell size={19} /> Order Alerts & WhatsApp SMS
          </button>
        </div>

        {/* Right Tab Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'general' && (
            <div className="bg-[#FAF7F2] rounded-3xl p-8 shadow-sm border border-amber-900/10 space-y-5">
              <h2 className="text-xl font-serif font-black text-gray-900 border-b border-amber-900/10 pb-4">General Store Profile</h2>
              <div>
                <label className="block text-xs font-black text-amber-950 uppercase mb-2">Store Display Name</label>
                <input 
                  type="text" 
                  defaultValue="Karuppan Crackers"
                  className="w-full px-4 py-3 bg-white border border-amber-900/10 rounded-2xl focus:outline-none font-bold text-gray-800 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-amber-950 uppercase mb-2">Support Email</label>
                  <input 
                    type="email" 
                    defaultValue="chimeratechweb@gmail.com"
                    className="w-full px-4 py-3 bg-white border border-amber-900/10 rounded-2xl focus:outline-none font-bold text-gray-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-amber-950 uppercase mb-2">Support Phone / WhatsApp</label>
                  <input 
                    type="text" 
                    defaultValue="8825419454"
                    className="w-full px-4 py-3 bg-white border border-amber-900/10 rounded-2xl focus:outline-none font-bold text-gray-800 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-amber-950 uppercase mb-2">Physical Showroom Address</label>
                <textarea 
                  rows="3"
                  defaultValue="Sivakasi, Tamil Nadu, India"
                  className="w-full px-4 py-3 bg-white border border-amber-900/10 rounded-2xl focus:outline-none font-bold text-gray-800 text-sm resize-none"
                ></textarea>
              </div>
            </div>
          )}

          {activeTab === 'tax' && (
            <div className="bg-[#FAF7F2] rounded-3xl p-8 shadow-sm border border-amber-900/10 space-y-5">
              <h2 className="text-xl font-serif font-black text-gray-900 border-b border-amber-900/10 pb-4">GST Tax Configurations</h2>
              <div>
                <label className="block text-xs font-black text-amber-950 uppercase mb-2">Default GST Percentage (%)</label>
                <input 
                  type="number" 
                  defaultValue="18"
                  className="w-full px-4 py-3 bg-white border border-amber-900/10 rounded-2xl focus:outline-none font-bold text-gray-800 text-sm"
                />
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-[#FAF7F2] rounded-3xl p-8 shadow-sm border border-amber-900/10 space-y-4">
              <h2 className="text-xl font-serif font-black text-gray-900 border-b border-amber-900/10 pb-4">Alert Preferences</h2>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 bg-white rounded-2xl border border-amber-900/10">
                  <span className="font-bold text-sm text-gray-800">Send WhatsApp confirmation on new order placement</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#4A0E0E]" />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
