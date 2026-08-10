import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Plus, Minus, Printer, Trash2, Send, LayoutGrid, List, ShoppingCart, Check, RefreshCw, CheckCircle2, ArrowRight, Filter, ChevronDown, Columns, X, Receipt } from 'lucide-react';

const AdminBilling = () => {
  const context = useOutletContext();
  const isDesktopSidebarExpanded = context?.isDesktopSidebarExpanded ?? true;

  const [viewMode, setViewMode] = useState('grid');
  const [gridCols, setGridCols] = useState(3); // 2, 3, or 4 cards per row
  const [showColMenu, setShowColMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Floating Bottom Cart Receipt Drawer Modal (Works on Mobile & Desktop!)
  const [showCartDrawer, setShowCartDrawer] = useState(false);

  const catalog = [
    { id: 'PRD-01', name: '120 Shots Multi-color', category: 'Fancy', price: 1200, stock: 45, icon: '🎆' },
    { id: 'PRD-02', name: 'Giant Sparklers (50pcs)', category: 'Sparklers', price: 350, stock: 120, icon: '✨' },
    { id: 'PRD-03', name: 'Lakshmi Bomb Deluxe', category: 'Bombs', price: 150, stock: 8, icon: '💥' },
    { id: 'PRD-04', name: 'Flower Pots Mega', category: 'Fountains', price: 650, stock: 25, icon: '🪔' },
    { id: 'PRD-05', name: 'Sky Lanterns Pack', category: 'Novelty', price: 400, stock: 15, icon: '🚀' },
    { id: 'PRD-06', name: '7 Color Rockets (10pcs)', category: 'Fancy', price: 850, stock: 30, icon: '⭐' },
    { id: 'PRD-07', name: 'Chakra Ground Spinner', category: 'Fountains', price: 280, stock: 60, icon: '🌀' },
    { id: 'PRD-08', name: 'Electric Sparklers Gold', category: 'Sparklers', price: 450, stock: 90, icon: '⚡' },
  ];

  const categories = ['All', 'Sparklers', 'Bombs', 'Fancy', 'Fountains', 'Novelty'];

  const [cart, setCart] = useState([
    { id: 'PRD-01', name: '120 Shots Multi-color', price: 1200, qty: 2 },
    { id: 'PRD-02', name: 'Giant Sparklers (50pcs)', price: 350, qty: 1 }
  ]);

  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('8825419454');

  const [completedOrder, setCompletedOrder] = useState(null);

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
    }).filter(item => item.qty > 0));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleResetBill = () => {
    setCart([]);
    setCustomerName('Walk-in Customer');
    setCustomerPhone('');
  };

  const handleConfirmOrder = () => {
    if (cart.length === 0) return;
    const orderData = {
      orderId: `POS-${Math.floor(Math.random() * 900 + 100)}`,
      customer: customerName || 'Walk-in Customer',
      phone: customerPhone || '9943852902',
      items: [...cart],
      subtotal,
      discount,
      gst,
      grandTotal,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setShowCartDrawer(false);
    setCompletedOrder(orderData);
  };

  const handleStartNewOrder = () => {
    setCompletedOrder(null);
    handleResetBill();
  };

  const getItemQtyInCart = (productId) => {
    const item = cart.find(i => i.id === productId);
    return item ? item.qty : 0;
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
    <div className="-mx-4 -mt-4 sm:mx-0 sm:mt-0 flex flex-col items-start max-w-[1650px] mx-auto pb-28 relative">
      {/* Full-Width Product Catalog Workspace */}
      <div className="w-full bg-[#FAF7F2] rounded-none sm:rounded-3xl shadow-sm border-x-0 sm:border border-amber-900/20 overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#4A0E0E] via-[#5C1212] to-[#3B0B0B] border-b-2 border-amber-400/40 text-white space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between gap-3">
            {/* POS Title (Desktop Only) */}
            <h2 className="hidden md:flex text-2xl font-serif font-black items-center gap-2 text-white">
              <ShoppingCart className="text-[#FFD700]" size={24} /> Point of Sale (POS)
            </h2>

            {/* Toolbar Controls */}
            <div className="flex items-center justify-between md:justify-end gap-2.5 w-full md:w-auto">
              {/* Category Filter Selector */}
              <div className="relative flex-1 md:flex-initial">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full md:w-auto pl-8 pr-8 py-2 bg-black/40 border border-white/20 rounded-2xl text-xs font-black text-amber-200 focus:outline-none appearance-none cursor-pointer hover:bg-black/60 transition-all shadow-sm"
                >
                  <option value="All" className="bg-[#4A0E0E] text-white">All Categories</option>
                  {categories.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat} className="bg-[#4A0E0E] text-white">{cat}</option>
                  ))}
                </select>
                <Filter size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#FFD700] pointer-events-none stroke-[2.5]" />
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-amber-200 pointer-events-none stroke-[2.5]" />
              </div>

              {/* Dynamic Columns per Row Icon Selector */}
              {viewMode === 'grid' && (
                <div className="relative">
                  <button 
                    onClick={() => setShowColMenu(!showColMenu)}
                    className="px-3.5 py-2 bg-black/40 border border-white/20 rounded-2xl text-xs font-black text-amber-200 hover:bg-black/60 transition-all flex items-center gap-1.5 shadow-sm shrink-0"
                    title="Change Cards Per Row"
                  >
                    <Columns size={14} className="text-[#FFD700] stroke-[2.5]" />
                    <span>{gridCols}x Per Row</span>
                    <ChevronDown size={12} className={`transition-transform stroke-[2.5] ${showColMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Columns Selection Dropdown */}
                  {showColMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-[#3B0B0B] border-2 border-amber-400/40 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                      <p className="text-[10px] font-black uppercase text-amber-300 px-3 py-1 border-b border-amber-900/60 flex items-center justify-between">
                        <span>Cards Per Row</span>
                        <Columns size={12} />
                      </p>
                      <div className="space-y-1 pt-1">
                        {[1, 2, 3, 4, 5, 6].map(cols => (
                          <button
                            key={cols}
                            onClick={() => { setGridCols(cols); setShowColMenu(false); }}
                            className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-between ${
                              gridCols === cols ? 'bg-[#FFD700] text-[#4A0E0E] shadow-md' : 'text-amber-100 hover:bg-white/10'
                            }`}
                          >
                            <span>{cols} Card{cols > 1 ? 's' : ''} Per Row</span>
                            {gridCols === cols && <Check size={15} strokeWidth={3} />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Grid / List View Toggle Switch */}
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-2xl border border-white/20 shrink-0">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                    viewMode === 'grid' ? 'bg-[#FFD700] text-[#4A0E0E] shadow-sm' : 'text-amber-200 hover:text-white'
                  }`}
                >
                  <LayoutGrid size={13} /> Grid
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                    viewMode === 'list' ? 'bg-[#FFD700] text-[#4A0E0E] shadow-sm' : 'text-amber-200 hover:text-white'
                  }`}
                >
                  <List size={13} /> List
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-800" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search product name or SKU code to quick-add..." 
              className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-white border-2 border-amber-900/20 rounded-2xl focus:outline-none focus:border-[#4A0E0E] text-xs sm:text-sm font-black text-gray-900 shadow-sm"
            />
          </div>
        </div>

        {/* Catalog Body: Dynamic Grid Columns */}
        <div className="p-3.5 sm:p-6 bg-[#EFEAE1]/60">
          {viewMode === 'grid' ? (
            <div className={`grid gap-4 sm:gap-6 ${
              gridCols === 1 ? 'grid-cols-1' :
              gridCols === 2 ? 'grid-cols-1 sm:grid-cols-2' :
              gridCols === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
              gridCols === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :
              gridCols === 5 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' :
              'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6'
            }`}>
              {filteredCatalog.map((product) => {
                const qtyInCart = getItemQtyInCart(product.id);
                const isInCart = qtyInCart > 0;

                return (
                  <div 
                    key={product.id}
                    className={`bg-[#FAF7F2] p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-2 transition-all shadow-sm relative flex flex-col justify-between space-y-3 sm:space-y-4 group ${
                      isInCart 
                        ? 'border-[#4A0E0E] ring-2 ring-[#FFD700]/50 shadow-md bg-white' 
                        : 'border-amber-900/20 hover:border-amber-500 hover:shadow-md'
                    }`}
                  >
                    {/* Live Cart Quantity Badge */}
                    {isInCart && (
                      <div className="absolute top-3 right-3 z-10 bg-[#FFD700] text-[#4A0E0E] border border-amber-500 font-black text-xs px-3 py-0.5 rounded-full shadow-md flex items-center gap-1">
                        <Check size={13} strokeWidth={3} /> {qtyInCart} in Cart
                      </div>
                    )}

                    {/* Image & Product Title */}
                    <div onClick={() => addToCart(product)} className="cursor-pointer space-y-2 sm:space-y-3">
                      <div className="w-full h-28 sm:h-36 bg-gradient-to-br from-amber-100 via-orange-100 to-amber-200 rounded-xl sm:rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-inner border border-amber-300/40 group-hover:scale-105 transition-transform">
                        {product.icon}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-xs font-black text-[#4A0E0E] bg-amber-200/80 px-2 py-0.5 rounded border border-amber-300">
                          {product.category}
                        </span>
                        <span className="text-[10px] sm:text-xs font-bold text-gray-500">Stock: {product.stock} units</span>
                      </div>

                      <h3 className="text-sm sm:text-base font-serif font-black text-gray-900 line-clamp-1">
                        {product.name}
                      </h3>
                    </div>

                    {/* Unit Price Row */}
                    <div className="flex items-center justify-between pt-2 border-t border-amber-900/15">
                      <span className="text-[10px] sm:text-xs font-black uppercase text-amber-950">Unit Price</span>
                      <span className="text-lg sm:text-xl font-black text-[#c00000]">₹{product.price}</span>
                    </div>

                    {/* Full-Width Button Row */}
                    <div className="pt-1">
                      {isInCart ? (
                        <div className="w-full flex items-center justify-between bg-[#4A0E0E] text-white rounded-xl sm:rounded-2xl p-1 shadow-md">
                          <button 
                            onClick={(e) => { e.stopPropagation(); updateQty(product.id, -1); }}
                            className="px-4 py-2 hover:bg-red-950 text-white rounded-xl transition-colors"
                            title="Reduce quantity"
                          >
                            <Minus size={16} strokeWidth={3} />
                          </button>
                          <span className="text-base sm:text-lg font-black text-[#FFD700] tracking-wider px-2">
                            {qtyInCart}
                          </span>
                          <button 
                            onClick={(e) => { e.stopPropagation(); updateQty(product.id, 1); }}
                            className="px-4 py-2 hover:bg-red-950 text-white rounded-xl transition-colors"
                            title="Increase quantity"
                          >
                            <Plus size={16} strokeWidth={3} />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => addToCart(product)}
                          className="w-full py-3 bg-[#4A0E0E] hover:bg-red-950 text-white font-black text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                        >
                          <Plus size={16} strokeWidth={2.5} /> Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List Mode */
            <div className="bg-[#FAF7F2] rounded-2xl border border-amber-900/20 overflow-hidden divide-y divide-amber-900/10">
              {filteredCatalog.map((product) => {
                const qtyInCart = getItemQtyInCart(product.id);
                const isInCart = qtyInCart > 0;

                return (
                  <div 
                    key={product.id}
                    className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-amber-100/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-200 border border-amber-300 flex items-center justify-center text-xl sm:text-2xl shrink-0">
                        {product.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-black text-gray-900">{product.name}</h4>
                          {isInCart && (
                            <span className="bg-[#FFD700] text-[#4A0E0E] font-black text-[10px] px-2 py-0.5 rounded-full border border-amber-400">
                              {qtyInCart} in Cart
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] sm:text-xs text-amber-950 font-bold">{product.category} • Stock: {product.stock} units</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0">
                      <span className="font-black text-[#4A0E0E] text-sm sm:text-base">₹{product.price}</span>
                      
                      {isInCart ? (
                        <div className="flex items-center bg-[#4A0E0E] text-white rounded-xl overflow-hidden shadow-sm">
                          <button onClick={() => updateQty(product.id, -1)} className="p-1.5 hover:bg-red-950"><Minus size={13}/></button>
                          <span className="px-2.5 text-xs font-black text-[#FFD700]">{qtyInCart}</span>
                          <button onClick={() => updateQty(product.id, 1)} className="p-1.5 hover:bg-red-950"><Plus size={13}/></button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => addToCart(product)}
                          className="px-3.5 py-1.5 bg-[#4A0E0E] text-white rounded-xl text-xs font-black flex items-center gap-1 shadow-sm"
                        >
                          <Plus size={13} /> Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* UNIVERSAL STICKY FLOATING BILL BAR (Works on BOTH Mobile & Desktop Screens with Sidebar Animation!) */}
      {cart.length > 0 && (
        <div className={`fixed bottom-0 right-0 z-40 bg-[#3B0B0B] border-t-4 border-[#FFD700] px-4 sm:px-8 py-3.5 shadow-2xl flex items-center justify-between text-white transition-all duration-300 left-0 ${
          isDesktopSidebarExpanded ? 'lg:left-72' : 'lg:left-20'
        }`}>
          {/* Cart Live Counter */}
          <div onClick={() => setShowCartDrawer(true)} className="cursor-pointer flex items-center gap-3">
            <div className="bg-[#FFD700] text-[#4A0E0E] font-black text-xs sm:text-sm px-3.5 py-1 rounded-full shadow-md flex items-center gap-1.5">
              <ShoppingCart size={16} /> {cart.length} Items
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-bold text-amber-200/80 hidden sm:inline">Net Payable:</span>
                <span className="font-black text-lg sm:text-2xl text-[#FFD700]">₹{grandTotal.toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-amber-200 font-bold hidden sm:block">Click to expand itemized receipt bill ↗</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={handleResetBill}
              className="px-3 sm:px-4 py-2.5 bg-white/10 hover:bg-white/20 text-amber-200 rounded-xl text-xs font-black border border-white/20 flex items-center gap-1 transition-all"
            >
              <RefreshCw size={14} /> <span className="hidden sm:inline">Reset</span>
            </button>

            <button 
              onClick={() => setShowCartDrawer(true)}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-black border border-white/30 flex items-center gap-1.5 transition-all"
            >
              <Receipt size={16} /> Receipt Bill
            </button>

            <button 
              onClick={handleConfirmOrder}
              className="px-5 py-2.5 bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-[#4A0E0E] font-black text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-2 transform hover:scale-105 transition-all"
            >
              <CheckCircle2 size={18} strokeWidth={2.5} /> Confirm Order
            </button>
          </div>
        </div>
      )}

      {/* ITEMIZIED BILL RECEIPT DRAWER MODAL (Mobile & Desktop) */}
      {showCartDrawer && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center sm:justify-end p-0 sm:p-4 animate-in fade-in">
          <div className="bg-[#FAF7F2] rounded-t-3xl sm:rounded-3xl border-2 border-amber-900/30 w-full sm:max-w-md max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom sm:slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-4 bg-gradient-to-r from-[#4A0E0E] to-[#2B0808] text-white flex items-center justify-between border-b border-red-950">
              <h3 className="text-base font-serif font-black flex items-center gap-2 text-white">
                🧾 Bill Receipt ({cart.length} Items)
              </h3>
              <button 
                onClick={() => setShowCartDrawer(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Customer Inputs */}
            <div className="p-4 bg-[#3B0B0B] space-y-2 border-b border-amber-900/40">
              <input 
                type="text" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer Name" 
                className="w-full px-3.5 py-2 bg-white/10 border border-white/20 rounded-xl text-xs font-bold text-white placeholder-amber-200/60 focus:outline-none"
              />
              <input 
                type="text" 
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Phone / WhatsApp Number" 
                className="w-full px-3.5 py-2 bg-white/10 border border-white/20 rounded-xl text-xs font-bold text-white placeholder-amber-200/60 focus:outline-none"
              />
            </div>

            {/* Cart Items Scroll List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#EFEAE1]/50">
              {cart.map((item) => (
                <div key={item.id} className="bg-white p-3.5 rounded-2xl border-2 border-amber-900/20 flex items-center justify-between shadow-sm">
                  <div className="flex-1 mr-3">
                    <p className="text-xs sm:text-sm font-black text-gray-900 line-clamp-1">{item.name}</p>
                    <p className="text-xs font-black text-[#c00000] mt-0.5">₹{item.price} × {item.qty} = ₹{(item.price * item.qty).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-amber-900/20 rounded-xl overflow-hidden bg-amber-50/60">
                      <button onClick={() => updateQty(item.id, -1)} className="px-2 py-1 text-gray-800 hover:bg-amber-200"><Minus size={13}/></button>
                      <span className="px-2.5 text-xs font-black text-[#4A0E0E]">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="px-2 py-1 text-gray-800 hover:bg-amber-200"><Plus size={13}/></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-rose-600 hover:text-rose-800 p-1">
                      <Trash2 size={15}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Receipt Totals & Action Buttons */}
            <div className="p-5 bg-[#EFEAE1] border-t border-amber-900/20 space-y-3">
              <div className="space-y-1.5 text-xs font-bold">
                <div className="flex justify-between text-gray-700"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-emerald-800"><span>Festive Discount (10%)</span><span>-₹{discount.toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-700"><span>GST (18%)</span><span>₹{gst.toLocaleString()}</span></div>
                <div className="pt-2 border-t border-amber-900/15 flex justify-between items-center text-base">
                  <span className="font-black text-gray-900">Net Payable</span>
                  <span className="font-black text-2xl text-[#c00000]">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <button 
                  onClick={handleResetBill}
                  className="col-span-1 py-3 bg-[#4A0E0E] text-[#FFD700] rounded-2xl text-xs font-black"
                >
                  Reset
                </button>
                <button 
                  onClick={handleConfirmOrder}
                  className="col-span-2 py-3 bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-[#4A0E0E] rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 size={16} strokeWidth={2.5} /> Confirm & Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Confirmation Dialog Modal */}
      {completedOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-amber-900/30 text-center relative space-y-4 sm:space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-xl shadow-emerald-900/20">
              <CheckCircle2 size={40} strokeWidth={2.5} />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-serif font-black text-gray-900">Order #{completedOrder.orderId} Confirmed!</h3>
              <p className="text-xs font-bold text-gray-600 mt-1">
                Billed for <span className="text-gray-900 font-black">{completedOrder.customer}</span> ({completedOrder.items.length} items) • Total: <span className="text-[#c00000] font-black text-sm">₹{completedOrder.grandTotal.toLocaleString()}</span>
              </p>
            </div>

            {/* Actions */}
            <div className="p-3.5 sm:p-4 bg-amber-100/60 rounded-2xl border border-amber-900/15 space-y-2 text-left text-xs font-bold text-gray-800">
              <p className="text-[10px] font-black uppercase text-amber-950 tracking-wider">Share or Print Invoice Bill:</p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button 
                  onClick={() => alert(`Printing Tax Receipt Invoice for Order #${completedOrder.orderId}...`)}
                  className="py-2.5 sm:py-3 bg-[#4A0E0E] hover:bg-red-950 text-white rounded-xl font-black text-xs shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Printer size={15} /> Print Receipt
                </button>

                <a 
                  href={`https://wa.me/91${completedOrder.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(completedOrder.customer)},%20your%20Karuppan%20Crackers%20order%20%23${completedOrder.orderId}%20bill%20for%20Rs.${completedOrder.grandTotal}%20has%20been%20confirmed!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 bg-[#25D366] hover:bg-[#1ebd53] text-white rounded-xl font-black text-xs shadow-md flex items-center justify-center gap-1.5 text-center"
                >
                  <Send size={15} /> Share WhatsApp
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={handleStartNewOrder}
                className="w-full py-3 sm:py-3.5 bg-[#4A0E0E] hover:bg-red-950 text-white font-black text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Start New Customer Order <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBilling;
