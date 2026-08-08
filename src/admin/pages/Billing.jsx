import { useState } from 'react';
import { Search, Plus, Minus, Printer, Trash2, Send, LayoutGrid, List, ShoppingCart } from 'lucide-react';

const AdminBilling = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const catalog = [
    { id: 'PRD-01', name: '120 Shots Multi-color', category: 'Fancy', price: 1200, stock: 45 },
    { id: 'PRD-02', name: 'Giant Sparklers (50pcs)', category: 'Sparklers', price: 350, stock: 120 },
    { id: 'PRD-03', name: 'Lakshmi Bomb Deluxe', category: 'Bombs', price: 150, stock: 8 },
    { id: 'PRD-04', name: 'Flower Pots Mega', category: 'Fountains', price: 650, stock: 25 },
    { id: 'PRD-05', name: 'Sky Lanterns Pack', category: 'Novelty', price: 400, stock: 15 },
    { id: 'PRD-06', name: '7 Color Rockets (10pcs)', category: 'Fancy', price: 850, stock: 30 },
  ];

  const categories = ['All', 'Sparklers', 'Bombs', 'Fancy', 'Fountains', 'Novelty'];

  const [cart, setCart] = useState([
    { id: 'PRD-01', name: '120 Shots Multi-color', price: 1200, qty: 2 },
    { id: 'PRD-02', name: 'Giant Sparklers (50pcs)', price: 350, qty: 1 }
  ]);

  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('');

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { id: product.id, name: product.name, price: product.price, qty: 1 }]);
    }
  };

  const updateQty = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = Math.round(subtotal * 0.1);
  const gst = Math.round((subtotal - discount) * 0.18);
  const grandTotal = subtotal - discount + gst;

  const filteredCatalog = catalog.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col lg:flex-row gap-6 overflow-hidden max-w-[1600px] mx-auto pb-2">
      {/* Left Column: Product Catalog */}
      <div className="flex-1 bg-[#FAF7F2] rounded-3xl shadow-sm border border-amber-900/10 flex flex-col overflow-hidden">
        {/* Header bar */}
        <div className="p-5 bg-gradient-to-r from-[#4A0E0E] to-[#2B0808] border-b border-red-950 text-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-serif font-black flex items-center gap-2 text-white">
                <ShoppingCart className="text-amber-400" /> Point of Sale (POS)
              </h2>
              <p className="text-amber-200/90 text-xs font-medium mt-0.5">Select items to instantly populate the receipt bill.</p>
            </div>

            {/* Grid / List View Toggle Switch */}
            <div className="flex items-center gap-1 bg-black/30 p-1 rounded-2xl border border-white/10 shrink-0">
              <button 
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'grid' ? 'bg-white text-[#4A0E0E] shadow-sm' : 'text-amber-200 hover:text-white'
                }`}
              >
                <LayoutGrid size={15} /> Grid
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'list' ? 'bg-white text-[#4A0E0E] shadow-sm' : 'text-amber-200 hover:text-white'
                }`}
              >
                <List size={15} /> List
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-800" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type product name to quick-add..." 
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-amber-900/10 rounded-2xl focus:outline-none text-sm font-bold text-gray-800"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedCategory === cat 
                    ? 'bg-[#FFD700] text-[#4A0E0E]' 
                    : 'bg-white/10 text-amber-100 hover:bg-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Body */}
        <div className="p-5 overflow-y-auto flex-1 bg-[#EFEAE1]/60">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCatalog.map((product) => (
                <div 
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-[#FAF7F2] p-4 rounded-2xl border border-amber-900/10 hover:border-amber-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="w-full h-20 bg-gradient-to-br from-amber-100 to-orange-200 rounded-xl mb-2.5 flex items-center justify-center text-2xl">
                      🎆
                    </div>
                    <span className="text-[10px] font-extrabold text-amber-950 bg-amber-200/80 px-2 py-0.5 rounded-md">{product.category}</span>
                    <p className="text-sm font-black text-gray-900 mt-1 line-clamp-1">{product.name}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-amber-900/10">
                    <p className="text-[#4A0E0E] font-black text-base">₹{product.price}</p>
                    <button className="p-1.5 bg-[#4A0E0E] text-white rounded-xl hover:bg-red-950">
                      <Plus size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#FAF7F2] rounded-2xl border border-amber-900/10 overflow-hidden divide-y divide-amber-900/10">
              {filteredCatalog.map((product) => (
                <div 
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="p-3.5 flex items-center justify-between hover:bg-amber-100/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-200 flex items-center justify-center text-base">🎆</div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{product.name}</p>
                      <span className="text-xs text-amber-900 font-medium">{product.category} • Stock: {product.stock}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-black text-[#4A0E0E] text-base">₹{product.price}</span>
                    <button className="px-3 py-1.5 bg-[#4A0E0E] text-white rounded-xl text-xs font-bold flex items-center gap-1">
                      <Plus size={14} /> Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: POS Cart Receipt */}
      <div className="w-full lg:w-96 bg-[#FAF7F2] rounded-3xl shadow-sm border border-amber-900/10 flex flex-col overflow-hidden shrink-0">
        <div className="p-5 bg-gradient-to-r from-[#4A0E0E] to-[#2B0808] text-white border-b border-red-950">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-serif font-black flex items-center gap-2 text-white">
              🧾 Bill Receipt ({cart.length})
            </h3>
            {cart.length > 0 && (
              <button onClick={() => setCart([])} className="text-xs font-bold text-amber-300 hover:underline">Clear</button>
            )}
          </div>

          <div className="space-y-2">
            <input 
              type="text" 
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer Name" 
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs font-bold text-white placeholder-amber-200/60 focus:outline-none"
            />
            <input 
              type="text" 
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Phone / WhatsApp Number" 
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs font-bold text-white placeholder-amber-200/60 focus:outline-none"
            />
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#EFEAE1]/50">
          {cart.map((item) => (
            <div key={item.id} className="bg-[#FAF7F2] p-3 rounded-2xl border border-amber-900/10 flex items-center justify-between shadow-sm">
              <div className="flex-1 mr-2">
                <p className="text-xs font-black text-gray-900 line-clamp-1">{item.name}</p>
                <p className="text-xs font-bold text-[#4A0E0E] mt-0.5">₹{item.price} x {item.qty}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-amber-900/10 rounded-xl overflow-hidden bg-white">
                  <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-gray-200 text-gray-600"><Minus size={12}/></button>
                  <span className="px-2 text-xs font-black text-gray-800">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-gray-200 text-gray-600"><Plus size={12}/></button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-rose-600 p-1">
                  <Trash2 size={15}/>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Totals Footer */}
        <div className="p-5 border-t border-amber-900/10 bg-[#EFEAE1] space-y-3">
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-700 font-medium">
              <span>Subtotal</span>
              <span className="font-bold text-gray-900">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-emerald-800 font-medium">
              <span>Discount (10%)</span>
              <span className="font-bold">-₹{discount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-700 font-medium">
              <span>GST (18%)</span>
              <span className="font-bold text-gray-900">₹{gst.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-amber-900/10 flex justify-between items-center">
              <span className="text-base font-black text-gray-900">Net Payable</span>
              <span className="text-2xl font-black text-[#4A0E0E]">₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button className="py-2.5 bg-white border border-amber-900/20 rounded-xl text-xs font-extrabold text-gray-800 flex items-center justify-center gap-1.5">
              <Printer size={15} /> Print
            </button>
            <button className="py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5">
              <Send size={15} /> WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBilling;
