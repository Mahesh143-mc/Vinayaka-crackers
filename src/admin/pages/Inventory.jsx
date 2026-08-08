import { useState } from 'react';
import { PackageOpen, AlertTriangle, ArrowRightLeft, Search, Save, Check } from 'lucide-react';

const AdminInventory = () => {
  const [inventoryData, setInventoryData] = useState([
    { id: 'PRD-01', name: '120 Shots Multi-color', category: 'Fancy', currentStock: 45, reorderLevel: 20, lastRestocked: '2023-10-15' },
    { id: 'PRD-02', name: 'Giant Sparklers (50pcs)', category: 'Sparklers', currentStock: 120, reorderLevel: 50, lastRestocked: '2023-10-10' },
    { id: 'PRD-03', name: 'Lakshmi Bomb Deluxe', category: 'Bombs', currentStock: 8, reorderLevel: 50, lastRestocked: '2023-09-28' },
    { id: 'PRD-04', name: 'Sky Lanterns Pack', category: 'Novelty', currentStock: 0, reorderLevel: 30, lastRestocked: '2023-09-15' },
    { id: 'PRD-05', name: 'Flower Pots Mega', category: 'Fountains', currentStock: 25, reorderLevel: 25, lastRestocked: '2023-10-01' },
  ]);

  const [savedId, setSavedId] = useState(null);

  const handleStockChange = (id, newStock) => {
    setInventoryData(inventoryData.map(item => item.id === id ? { ...item, currentStock: parseInt(newStock) || 0 } : item));
  };

  const handleSave = (id) => {
    setSavedId(id);
    setTimeout(() => setSavedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#4A0E0E] via-[#701515] to-[#4A0E0E] p-7 rounded-3xl shadow-lg text-white">
        <div>
          <h1 className="text-3xl font-serif font-black tracking-wide text-white flex items-center gap-2">
            <PackageOpen className="text-amber-400" /> Inventory & Stock Controls
          </h1>
          <p className="text-amber-200/90 text-sm mt-1 font-medium">Real-time stock monitoring, low stock alerts, and inline quick-reordering.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white/10 hover:bg-white/20 text-amber-300 border border-amber-400/30 px-5 py-2.5 rounded-2xl font-bold text-sm backdrop-blur-md transition-all flex items-center gap-2">
            <ArrowRightLeft size={18} /> Stock Transfer
          </button>
          <button className="bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-[#4A0E0E] px-6 py-2.5 rounded-2xl font-black text-sm shadow-md transition-all flex items-center gap-2">
            <AlertTriangle size={18} /> Bulk Purchase Order
          </button>
        </div>
      </div>

      {/* Stock Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FAF7F2] rounded-3xl p-6 shadow-sm border border-emerald-300 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-md">
            <PackageOpen size={26} />
          </div>
          <div>
            <p className="text-emerald-950 text-xs font-black uppercase tracking-wider">Total Stock Units</p>
            <p className="text-3xl font-black text-emerald-900 mt-1">4,250</p>
          </div>
        </div>
        <div className="bg-[#FAF7F2] rounded-3xl p-6 shadow-sm border border-amber-300 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-md">
            <AlertTriangle size={26} />
          </div>
          <div>
            <p className="text-amber-950 text-xs font-black uppercase tracking-wider">Low Stock Warnings</p>
            <p className="text-3xl font-black text-amber-900 mt-1">18 Items</p>
          </div>
        </div>
        <div className="bg-[#FAF7F2] rounded-3xl p-6 shadow-sm border border-rose-300 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-700 text-white flex items-center justify-center font-bold shadow-md">
            <PackageOpen size={26} />
          </div>
          <div>
            <p className="text-rose-950 text-xs font-black uppercase tracking-wider">Out of Stock</p>
            <p className="text-3xl font-black text-rose-900 mt-1">4 Items</p>
          </div>
        </div>
      </div>

      {/* Table with Tinted Background & Header */}
      <div className="bg-[#FAF7F2] rounded-3xl shadow-sm border border-amber-900/10 overflow-hidden">
        <div className="p-4 bg-[#EFEAE1] border-b border-amber-900/10 flex justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-800" size={18} />
            <input 
              type="text" 
              placeholder="Search inventory items..." 
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-amber-900/10 rounded-2xl focus:outline-none text-sm font-bold text-gray-800"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-[#4A0E0E] to-[#2B0808] border-b border-red-950 text-white">
                <th className="px-6 py-6 text-xs font-black text-[#FFD700] uppercase tracking-widest">Product Info</th>
                <th className="px-6 py-6 text-xs font-black text-[#FFD700] uppercase tracking-widest text-center">Current Stock</th>
                <th className="px-6 py-6 text-xs font-black text-[#FFD700] uppercase tracking-widest text-center">Reorder Level</th>
                <th className="px-6 py-6 text-xs font-black text-[#FFD700] uppercase tracking-widest">Status</th>
                <th className="px-6 py-6 text-xs font-black text-[#FFD700] uppercase tracking-widest text-right">Quick Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-900/10">
              {inventoryData.map((item, idx) => (
                <tr key={item.id} className={idx % 2 === 0 ? 'bg-[#FAF7F2]' : 'bg-[#F2ECE1]'}>
                  <td className="px-6 py-5">
                    <p className="text-sm font-black text-gray-900">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded-md">{item.id}</span>
                      <span className="text-[10px] text-gray-500 font-medium">Restocked: {item.lastRestocked}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xl font-black ${
                      item.currentStock === 0 ? 'text-rose-700' :
                      item.currentStock <= item.reorderLevel ? 'text-amber-700' :
                      'text-emerald-800'
                    }`}>
                      {item.currentStock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-gray-700">
                    {item.reorderLevel} units
                  </td>
                  <td className="px-6 py-4">
                    {item.currentStock === 0 ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-900 border border-rose-300">OUT OF STOCK</span>
                    ) : item.currentStock <= item.reorderLevel ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-950 border border-amber-300">LOW STOCK</span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-950 border border-emerald-300">IN STOCK</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <input 
                        type="number" 
                        value={item.currentStock}
                        onChange={(e) => handleStockChange(item.id, e.target.value)}
                        className="w-20 px-3 py-1.5 border border-amber-900/20 rounded-xl text-sm text-center font-bold text-gray-800 bg-white"
                      />
                      <button 
                        onClick={() => handleSave(item.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                          savedId === item.id 
                            ? 'bg-emerald-700 text-white' 
                            : 'bg-[#4A0E0E] hover:bg-red-950 text-white shadow-sm'
                        }`}
                      >
                        {savedId === item.id ? <Check size={14} /> : <Save size={14} />} Save
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminInventory;
