import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Plus, Minus, Printer, Trash2, Send, LayoutGrid, List, ShoppingCart, Check, RefreshCw, CheckCircle2, ArrowRight, Filter, ChevronDown, Columns, X, Receipt, Maximize2, Minimize2, Download } from 'lucide-react';
import { saveOrderToFirestore, subscribeProducts } from '../../services/firebaseService';

const AdminBilling = () => {
  const context = useOutletContext();
  const isDesktopSidebarExpanded = context?.isDesktopSidebarExpanded ?? true;

  const [viewMode, setViewMode] = useState('grid');
  const [gridCols, setGridCols] = useState(3); // 2, 3, or 4 cards per row
  const [showColMenu, setShowColMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreenPos, setIsFullscreenPos] = useState(false);

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const triggerSuccess = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeProducts((firestoreProducts) => {
      if (firestoreProducts) {
        setCatalog(firestoreProducts);
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleFrontendVisibility = (id) => {
    setCatalog(catalog.map(item => item.id === id ? { ...item, showInFrontend: !item.showInFrontend } : item));
  };

  const categories = ['All', 'Sparklers', 'Bombs', 'Fancy', 'Fountains', 'Novelty'];

  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('');

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

  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleResetBill = () => {
    setCart([]);
    setCustomerName('Walk-in Customer');
    setCustomerPhone('');
  };

  const handleConfirmOrder = () => {
    if (cart.length === 0 || isProcessingOrder) return;
    setShowConfirmModal(true);
  };

  const handleFinalConfirmSave = async () => {
    setIsProcessingOrder(true);
    setShowConfirmModal(false);
    const newOrderId = `POS-${Math.floor(Math.random() * 900 + 100)}`;
    const nowIso = new Date().toISOString();

    const orderData = {
      id: newOrderId,
      orderId: newOrderId,
      customer: customerName || 'Walk-in Customer',
      phone: customerPhone || '9943852902',
      items: [...cart],
      subtotal,
      discount,
      gst,
      grandTotal,
      status: 'Delivered',
      paymentStatus: 'PAID',
      paymentMode: 'Cash on Counter',
      createdAt: nowIso,
      updatedAt: nowIso,
      date: new Date().toLocaleDateString('en-IN')
    };

    try {
      await saveOrderToFirestore(orderData);
    } catch (err) {
      console.error("Error saving POS order to Firestore:", err);
    }

    triggerSuccess(`🎉 Order #${newOrderId} Saved & Confirmed Successfully!`);
    setShowCartDrawer(false);
    setCompletedOrder(orderData);
    setIsProcessingOrder(false);
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

  const handleTriggerPrint = () => {
    setShowInvoiceModal(true);
    triggerSuccess('Opening browser print dialog...');
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleDownloadInvoice = () => {
    const invId = completedOrder ? completedOrder.orderId : 'POS-547';
    const invCust = completedOrder ? completedOrder.customer : (customerName || 'Walk-in Customer');
    const invPhone = completedOrder ? completedOrder.phone : (customerPhone || '+91 9876543210');
    const invItems = completedOrder ? completedOrder.items : (cart.length > 0 ? cart : catalog.slice(0, 2));
    const invSubtotal = completedOrder ? completedOrder.subtotal : subtotal;
    const invDiscount = completedOrder ? completedOrder.discount : discount;
    const invGst = completedOrder ? completedOrder.gst : gst;
    const invTotal = completedOrder ? completedOrder.grandTotal : grandTotal;

    triggerSuccess(`Downloading Tax Invoice for Order #${invId}...`);

    const invoiceHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Karuppa Crackers POS Tax Invoice - #${invId}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 30px; color: #111; line-height: 1.5; background: #fff; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #4A0E0E; padding-bottom: 15px; margin-bottom: 20px; }
    .company-title { color: #4A0E0E; font-size: 24px; font-weight: bold; margin: 0; }
    .tagline { color: #701515; font-size: 12px; font-weight: bold; margin: 2px 0 6px 0; }
    .meta-text { font-size: 11px; color: #555; margin: 0; }
    .badge { background: #4A0E0E; color: #FFD700; padding: 5px 12px; font-weight: bold; border-radius: 4px; display: inline-block; font-size: 11px; text-transform: uppercase; }
    .grid { display: flex; gap: 20px; border-bottom: 2px solid #4A0E0E; padding-bottom: 15px; margin-bottom: 20px; }
    .card { flex: 1; background: #FAF7F2; padding: 12px 15px; border-radius: 8px; border: 1px solid #e2d7c5; font-size: 12px; }
    .card h4 { margin: 0 0 6px 0; color: #4A0E0E; text-transform: uppercase; font-size: 11px; border-bottom: 1px solid #d4c5b0; padding-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; border: 1px solid #333; }
    th { background: #4A0E0E; color: #fff; padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; }
    td { padding: 9px 10px; border-bottom: 1px solid #ddd; border-right: 1px solid #eee; }
    .totals-wrap { display: flex; justify-content: space-between; border-bottom: 2px solid #4A0E0E; padding-bottom: 15px; margin-bottom: 20px; }
    .totals { width: 320px; font-size: 12px; }
    .total-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #eee; }
    .grand-total { font-size: 16px; font-weight: bold; color: #c00000; background: #FAF7F2; padding: 8px; border-radius: 6px; border-top: 2px solid #4A0E0E; margin-top: 6px; }
    .footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 30px; font-size: 11px; color: #444; }
    .sign-box { text-align: center; border-top: 2px solid #4A0E0E; width: 200px; padding-top: 6px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="company-title">KARUPPA CRACKERS</h1>
      <p class="tagline">Sivakasi Premium Fireworks & Fancy Sky Shots Direct Manufacturer</p>
      <p class="meta-text">
        123 Main Road, Industrial Estate, Sivakasi, Tamil Nadu - 626123<br/>
        Phone: +91 98765 43210 | Email: sales@karuppacrackers.com<br/>
        <strong>GSTIN: 33AAACK1234F1Z9</strong> | Explosives License: E/SC/TN/22/10082
      </p>
    </div>
    <div style="text-align: right;">
      <div class="badge">OFFICIAL POS RECEIPT INVOICE</div>
      <p style="margin: 8px 0 2px 0; font-weight: bold; font-size: 13px;">Order No: #${invId}</p>
      <p style="margin: 0; font-size: 12px;">Date: ${new Date().toLocaleDateString()}</p>
      <p style="margin: 4px 0 0 0; font-size: 12px; font-weight: bold; color: #065f46;">STATUS: PAID (COUNTER POS)</p>
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <h4>Customer Details (Billed To)</h4>
      <strong style="font-size: 14px; color: #000;">${invCust}</strong><br/>
      Phone: ${invPhone}<br/>
      Mode: Over the Counter Sale
    </div>
    <div class="card">
      <h4>Store Dispatch Location</h4>
      <strong>Karuppa Crackers Retail Outlet, Sivakasi Hub</strong>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 30px; text-align: center;">#</th>
        <th>Product Description</th>
        <th style="text-align: center;">Category</th>
        <th style="text-align: right;">Unit Price</th>
        <th style="text-align: center;">Qty</th>
        <th style="text-align: right;">Total (₹)</th>
      </tr>
    </thead>
    <tbody>
      ${invItems.map((item, idx) => `
        <tr>
          <td style="text-align: center;">${idx + 1}</td>
          <td><strong>${item.name}</strong><br/><small style="color: #666;">Code: ${item.id}</small></td>
          <td style="text-align: center;">${item.category}</td>
          <td style="text-align: right;">₹${item.price.toLocaleString()}</td>
          <td style="text-align: center;"><strong>${item.qty}</strong></td>
          <td style="text-align: right;"><strong>₹${(item.price * item.qty).toLocaleString()}</strong></td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals-wrap">
    <div style="flex: 1; font-size: 11px; color: #555; padding-right: 20px;">
      <div style="background: #faf5eb; padding: 10px; border-radius: 6px; border: 1px solid #e2d7c5; margin-bottom: 10px;">
        <strong>Payment Information:</strong><br/>
        Mode: Cash / UPI Counter Payment<br/>
        Cashier: Mahesh Admin
      </div>
      <div style="background: #fff8e6; padding: 8px; border-radius: 6px; border: 1px solid #ffd591; color: #873800;">
        <strong>Safety Instructions:</strong> Burst crackers strictly outdoors under adult supervision.
      </div>
    </div>
    <div class="totals">
      <div class="total-row"><span>Items Subtotal:</span> <strong>₹${invSubtotal.toLocaleString()}</strong></div>
      <div class="total-row" style="color: #047857;"><span>Special Discount:</span> <span>-₹${invDiscount.toLocaleString()}</span></div>
      <div class="total-row"><span>CGST (9%):</span> <span>₹${(invGst / 2).toLocaleString()}</span></div>
      <div class="total-row"><span>SGST (9%):</span> <span>₹${(invGst / 2).toLocaleString()}</span></div>
      <div class="total-row grand-total"><span>NET BILL PAID:</span> <span>₹${invTotal.toLocaleString()}</span></div>
    </div>
  </div>

  <div class="footer">
    <div>
      <strong>Terms & Conditions:</strong>
      <ol style="margin: 4px 0 0 0; padding-left: 16px; font-size: 10px;">
        <li>Goods once sold will not be returned or exchanged.</li>
        <li>All disputes subject to Sivakasi Jurisdiction only.</li>
        <li>Computer generated official tax invoice receipt.</li>
      </ol>
    </div>
    <div class="sign-box">
      <strong style="color: #4A0E0E; font-size: 12px;">For KARUPPA CRACKERS</strong><br/><br/><br/>
      <small style="text-transform: uppercase;">Authorized Signatory</small>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([invoiceHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `POS_Tax_Invoice_${invId}_KaruppaCrackers.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredCatalog = catalog.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const toggleFullscreen = () => {
    if (!isFullscreenPos) {
      setIsFullscreenPos(true);
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      setIsFullscreenPos(false);
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <div className={`flex flex-col items-start max-w-[1650px] mx-auto pb-28 relative ${
      isFullscreenPos 
        ? 'fixed inset-0 z-[999999] bg-[#F4F1EA] p-3 sm:p-6 overflow-y-auto w-full h-full max-w-none rounded-none' 
        : '-mx-4 -mt-4 sm:mx-0 sm:mt-0'
    }`}>
      {/* Animated Top Toast Notification Banner */}
      {successToast && (
        <div className="fixed top-6 right-6 z-[1000005] bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white font-black text-xs sm:text-sm px-5 py-3.5 rounded-2xl shadow-2xl border-2 border-amber-300 flex items-center gap-3 animate-in slide-in-from-top-5 duration-300">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} className="text-[#FFD700]" />
          </div>
          <span>{successToast}</span>
        </div>
      )}

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
            <div className="flex items-center justify-between md:justify-end gap-2.5 w-full md:w-auto flex-wrap sm:flex-nowrap">
              {/* Category Filter Selector */}
              <div className="relative flex-1 md:flex-initial">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full md:w-auto pl-9 pr-9 py-2.5 bg-black/40 border border-white/20 rounded-2xl text-sm font-black text-amber-200 focus:outline-none appearance-none cursor-pointer hover:bg-black/60 transition-all shadow-sm"
                >
                  <option value="All" className="bg-[#4A0E0E] text-white">All Categories</option>
                  {categories.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat} className="bg-[#4A0E0E] text-white">{cat}</option>
                  ))}
                </select>
                <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FFD700] pointer-events-none stroke-[2.5]" />
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-200 pointer-events-none stroke-[2.5]" />
              </div>

              {/* Dynamic Columns per Row Icon Selector */}
              {viewMode === 'grid' && (
                <div className="relative">
                  <button 
                    onClick={() => setShowColMenu(!showColMenu)}
                    className="px-4 py-2.5 bg-black/40 border border-white/20 rounded-2xl text-sm font-black text-amber-200 hover:bg-black/60 transition-all flex items-center gap-2 shadow-sm shrink-0"
                    title="Change Cards Per Row"
                  >
                    <Columns size={16} className="text-[#FFD700] stroke-[2.5]" />
                    <span>{gridCols}x Per Row</span>
                    <ChevronDown size={14} className={`transition-transform stroke-[2.5] ${showColMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Columns Selection Dropdown */}
                  {showColMenu && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-[#3B0B0B] border-2 border-amber-400/40 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                      <p className="text-xs font-black uppercase text-amber-300 px-3 py-1.5 border-b border-amber-900/60 flex items-center justify-between">
                        <span>Cards Per Row</span>
                        <Columns size={14} />
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
                  className={`px-3.5 py-1.5 rounded-xl text-sm font-black transition-all flex items-center gap-1.5 ${
                    viewMode === 'grid' ? 'bg-[#FFD700] text-[#4A0E0E] shadow-sm' : 'text-amber-200 hover:text-white'
                  }`}
                >
                  <LayoutGrid size={15} /> Grid
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`px-3.5 py-1.5 rounded-xl text-sm font-black transition-all flex items-center gap-1.5 ${
                    viewMode === 'list' ? 'bg-[#FFD700] text-[#4A0E0E] shadow-sm' : 'text-amber-200 hover:text-white'
                  }`}
                >
                  <List size={15} /> List
                </button>
              </div>

              {/* Full Screen POS Toggle Button */}
              <button 
                type="button"
                onClick={toggleFullscreen}
                className={`px-4 py-2.5 rounded-2xl text-sm font-black transition-all flex items-center gap-2 shadow-sm shrink-0 border ${
                  isFullscreenPos 
                    ? 'bg-[#FFD700] text-[#4A0E0E] border-amber-300 shadow-md transform scale-105 font-black' 
                    : 'bg-black/40 border-white/20 text-amber-200 hover:text-white hover:bg-black/60'
                }`}
                title={isFullscreenPos ? "Exit Full Screen POS" : "Full Screen POS Mode (Hide Sidebar & Topbar)"}
              >
                {isFullscreenPos ? (
                  <>
                    <Minimize2 size={16} className="stroke-[2.5]" />
                    <span>Exit Full Screen</span>
                  </>
                ) : (
                  <>
                    <Maximize2 size={16} className="text-[#FFD700] stroke-[2.5]" />
                    <span>Full Screen POS</span>
                  </>
                )}
              </button>
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

                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 border-t sm:border-t-0 pt-2 sm:pt-0">
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

      {/* UNIVERSAL STICKY FLOATING BILL BAR */}
      {cart.length > 0 && (
        <div className={`fixed bottom-0 right-0 px-4 sm:px-8 py-3.5 shadow-2xl flex items-center justify-between text-white transition-all duration-300 bg-[#3B0B0B] border-t-4 border-[#FFD700] ${
          isFullscreenPos 
            ? 'left-0 z-[1000000]' 
            : `left-0 z-40 ${isDesktopSidebarExpanded ? 'lg:left-72' : 'lg:left-20'}`
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

      {/* Step 1: Pre-Save Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-amber-900/30 text-center relative space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-[#4A0E0E] shadow-lg">
              <CheckCircle2 size={36} strokeWidth={2.5} />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-serif font-black text-gray-900">Confirm & Complete POS Sale?</h3>
              <p className="text-xs font-bold text-amber-800 mt-1">Review bill summary before saving to database:</p>
            </div>

            {/* Bill Summary Card */}
            <div className="bg-[#EFEAE1] p-4 rounded-2xl border border-amber-900/15 text-left text-xs font-bold space-y-2">
              <div className="flex justify-between border-b border-amber-900/10 pb-1.5">
                <span className="text-gray-600 uppercase text-[10px] font-black">Customer Name:</span>
                <span className="text-gray-900 font-black">{customerName || 'Walk-in Customer'}</span>
              </div>
              <div className="flex justify-between border-b border-amber-900/10 pb-1.5">
                <span className="text-gray-600 uppercase text-[10px] font-black">Total Items:</span>
                <span className="text-gray-900 font-black">{cart.reduce((sum, item) => sum + item.qty, 0)} Items</span>
              </div>
              <div className="flex justify-between border-b border-amber-900/10 pb-1.5">
                <span className="text-gray-600 uppercase text-[10px] font-black">Payment Mode:</span>
                <span className="text-emerald-800 font-black">Cash on Counter</span>
              </div>
              <div className="flex justify-between items-center pt-1 text-sm">
                <span className="text-gray-900 font-black">Net Payable:</span>
                <span className="text-[#c00000] font-black text-xl">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 font-bold text-xs rounded-2xl transition-all shadow-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFinalConfirmSave}
                className="flex-1 py-3 bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-[#4A0E0E] font-black text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 size={16} strokeWidth={2.5} /> Yes, Save & Complete
              </button>
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
                  onClick={handleTriggerPrint}
                  className="py-2.5 sm:py-3 bg-[#4A0E0E] hover:bg-red-950 text-white rounded-xl font-black text-xs shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Printer size={15} /> Print Receipt
                </button>

                <a 
                  href={`https://wa.me/91${completedOrder.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(completedOrder.customer)},%20your%20Karuppa%20Crackers%20order%20%23${completedOrder.orderId}%20bill%20for%20Rs.${completedOrder.grandTotal}%20has%20been%20confirmed!`}
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

      {/* Official Tax Invoice Modal & Print View for POS */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000001] flex items-center justify-center p-4 sm:p-6 overflow-y-auto no-print">
          <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-gray-300 relative overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Top Header Controls */}
            <div className="p-4 bg-gradient-to-r from-[#4A0E0E] to-[#2B0808] text-white flex justify-between items-center shrink-0 border-b-2 border-amber-400">
              <div className="flex items-center gap-2">
                <Printer className="text-[#FFD700]" size={20} />
                <h3 className="font-serif font-black text-lg text-white">
                  Official POS Tax Invoice — #{completedOrder ? completedOrder.orderId : 'POS-547'}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDownloadInvoice}
                  className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-1.5 transform hover:scale-105"
                >
                  <Download size={15} /> Download Invoice
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerSuccess('Opening browser print dialog...');
                    setTimeout(() => window.print(), 200);
                  }}
                  className="px-5 py-2 bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-[#4A0E0E] font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 transform hover:scale-105"
                >
                  <Printer size={16} strokeWidth={2.5} /> Print Invoice Now
                </button>
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="p-2 text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all"
                  title="Close Invoice Preview"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Scrollable Printable Invoice Content */}
            <div className="p-8 overflow-y-auto flex-1 bg-white text-gray-900 printable-invoice-document">
              {/* Document Header */}
              <div className="flex justify-between items-start border-b-2 border-gray-900 pb-6 mb-6">
                <div className="flex items-center gap-4">
                  <img 
                    src="https://res.cloudinary.com/vf0fqhwo/image/upload/v1786363324/logo_q7lezq.jpg" 
                    alt="Karuppa Crackers" 
                    className="w-16 h-16 rounded-xl border border-gray-300 object-contain shrink-0" 
                  />
                  <div>
                    <h1 className="text-2xl font-serif font-black text-[#4A0E0E] uppercase tracking-wide">KARUPPA CRACKERS</h1>
                    <p className="text-xs font-bold text-amber-900">Sivakasi Premium Fireworks & Fancy Sky Shots Direct Manufacturer</p>
                    <p className="text-[11px] text-gray-600 mt-1 leading-tight">
                      123 Main Road, Industrial Estate, Sivakasi, Tamil Nadu - 626123<br />
                      Phone: +91 98765 43210 | Email: sales@karuppacrackers.com | Web: www.karuppacrackers.com
                    </p>
                    <p className="text-[10px] font-bold text-gray-800 mt-1">
                      GSTIN: <span className="font-black">33AAACK1234F1Z9</span> | Explosives License: <span className="font-black">E/SC/TN/22/10082</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-4 py-1.5 bg-[#4A0E0E] text-[#FFD700] font-black text-xs uppercase tracking-widest rounded-md mb-2">
                    OFFICIAL POS TAX INVOICE
                  </span>
                  <p className="text-xs font-bold text-gray-800">Order No: <span className="font-black text-gray-900">#{completedOrder ? completedOrder.orderId : 'POS-547'}</span></p>
                  <p className="text-xs text-gray-600">Date: <span className="font-bold text-gray-800">{new Date().toLocaleDateString()}</span></p>
                  <p className="text-xs text-gray-600">Payment Status: <span className="font-black text-emerald-800 uppercase">PAID (COUNTER POS)</span></p>
                </div>
              </div>

              {/* Billed To & Store Grid */}
              <div className="grid grid-cols-2 gap-6 border-b-2 border-gray-900 pb-6 mb-6 text-xs">
                <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-900/15">
                  <h3 className="font-black uppercase text-[#4A0E0E] text-xs border-b border-amber-900/20 pb-1 mb-2">CUSTOMER DETAILS (BILLED TO)</h3>
                  <p className="font-black text-sm text-gray-900">{completedOrder ? completedOrder.customer : (customerName || 'Walk-in Customer')}</p>
                  <p className="text-gray-700 font-bold mt-1">Phone: {completedOrder ? completedOrder.phone : (customerPhone || '+91 9876543210')}</p>
                  <p className="text-gray-700 font-medium">Billing Mode: Over the Counter POS Sale</p>
                </div>

                <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-900/15">
                  <h3 className="font-black uppercase text-[#4A0E0E] text-xs border-b border-amber-900/20 pb-1 mb-2">STORE DISPATCH LOCATION</h3>
                  <p className="text-gray-900 font-bold leading-relaxed">Karuppa Crackers Main Retail Store & Warehouse Hub, Sivakasi</p>
                </div>
              </div>

              {/* Itemized Table */}
              <table className="w-full text-left text-xs border-collapse border border-gray-900 mb-6">
                <thead>
                  <tr className="bg-[#4A0E0E] text-white font-black uppercase tracking-wider text-[11px]">
                    <th className="p-3 border border-gray-900 w-12 text-center">S.No</th>
                    <th className="p-3 border border-gray-900">Product Item Description</th>
                    <th className="p-3 border border-gray-900 text-center">Category</th>
                    <th className="p-3 border border-gray-900 text-right">Unit Price</th>
                    <th className="p-3 border border-gray-900 text-center">Qty</th>
                    <th className="p-3 border border-gray-900 text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {(completedOrder ? completedOrder.items : (cart.length > 0 ? cart : catalog.slice(0, 2))).map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-amber-50/20'}>
                      <td className="p-3 border border-gray-300 text-center font-bold">{idx + 1}</td>
                      <td className="p-3 border border-gray-300">
                        <p className="font-black text-gray-900">{item.name}</p>
                        <p className="text-[10px] text-gray-500 font-bold">Code: {item.id}</p>
                      </td>
                      <td className="p-3 border border-gray-300 text-center font-bold text-gray-700">{item.category}</td>
                      <td className="p-3 border border-gray-300 text-right font-bold">₹{item.price.toLocaleString()}</td>
                      <td className="p-3 border border-gray-300 text-center font-black">{item.qty}</td>
                      <td className="p-3 border border-gray-300 text-right font-black">₹{(item.price * item.qty).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Calculation & Summary Grid */}
              <div className="flex justify-between items-start gap-6 border-b-2 border-gray-900 pb-6 mb-6">
                <div className="flex-1 space-y-3 text-xs">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-300 space-y-1">
                    <p className="font-black text-gray-900 uppercase text-[10px]">Payment Information</p>
                    <p className="text-gray-700">Payment Mode: <span className="font-bold">Cash / UPI Counter Payment</span></p>
                    <p className="text-gray-700">Counter Cashier: <span className="font-bold">Mahesh Admin</span></p>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-gray-700 font-medium">
                    <p className="font-black text-gray-900 mb-0.5">Safety Instructions:</p>
                    Burst crackers strictly outdoors under adult supervision. Keep water nearby.
                  </div>
                </div>

                <div className="w-80 space-y-1.5 text-xs font-bold text-gray-800">
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span>Items Subtotal:</span>
                    <span className="font-black text-gray-900">₹{(completedOrder ? completedOrder.subtotal : subtotal).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200 text-emerald-700">
                    <span>Special Discount:</span>
                    <span>-₹{(completedOrder ? completedOrder.discount : discount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span>CGST (9%):</span>
                    <span>₹{((completedOrder ? completedOrder.gst : gst) / 2).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span>SGST (9%):</span>
                    <span>₹{((completedOrder ? completedOrder.gst : gst) / 2).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t-2 border-gray-900 text-base font-black text-gray-900 bg-amber-100/70 px-3 rounded-lg mt-2">
                    <span>NET BILL PAID:</span>
                    <span className="text-[#c00000]">₹{(completedOrder ? completedOrder.grandTotal : grandTotal).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Terms & Authorized Signatory Footer */}
              <div className="flex justify-between items-end text-[11px] text-gray-700 pt-2">
                <div>
                  <p className="font-black text-gray-900 uppercase">Terms & Conditions:</p>
                  <ol className="list-decimal list-inside space-y-0.5 mt-1 text-[10px] text-gray-600">
                    <li>Goods once sold will not be returned or exchanged.</li>
                    <li>All disputes subject to Sivakasi Jurisdiction only.</li>
                    <li>This is a computer-generated tax invoice receipt.</li>
                  </ol>
                </div>

                <div className="text-center w-56 border-t-2 border-gray-900 pt-2 mt-8">
                  <p className="font-serif font-black text-[#4A0E0E] text-xs">For KARUPPA CRACKERS</p>
                  <div className="h-10"></div>
                  <p className="font-bold text-[10px] uppercase text-gray-600">Authorized Signatory</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED PRINTABLE TAX INVOICE FOR POS (Visible ONLY in browser print dialog) */}
      <div className="hidden print:block print-area bg-white text-gray-900 p-8 font-sans w-full leading-normal">
        {/* Document Header */}
        <div className="flex justify-between items-start border-b-2 border-gray-900 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <img 
              src="https://res.cloudinary.com/vf0fqhwo/image/upload/v1786363324/logo_q7lezq.jpg" 
              alt="Karuppa Crackers" 
              className="w-16 h-16 rounded-xl border border-gray-300 object-contain shrink-0" 
            />
            <div>
              <h1 className="text-2xl font-serif font-black text-[#4A0E0E] uppercase tracking-wide">KARUPPA CRACKERS</h1>
              <p className="text-xs font-bold text-amber-900">Sivakasi Premium Fireworks & Fancy Sky Shots Direct Manufacturer</p>
              <p className="text-[11px] text-gray-600 mt-1 leading-tight">
                123 Main Road, Industrial Estate, Sivakasi, Tamil Nadu - 626123<br />
                Phone: +91 98765 43210 | Email: sales@karuppacrackers.com | Web: www.karuppacrackers.com
              </p>
              <p className="text-[10px] font-bold text-gray-800 mt-1">
                GSTIN: <span className="font-black">33AAACK1234F1Z9</span> | Explosives License: <span className="font-black">E/SC/TN/22/10082</span>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block px-4 py-1.5 bg-[#4A0E0E] text-[#FFD700] font-black text-xs uppercase tracking-widest rounded-md mb-2">
              OFFICIAL POS TAX INVOICE
            </span>
            <p className="text-xs font-bold text-gray-800">Order No: <span className="font-black text-gray-900">#{completedOrder ? completedOrder.orderId : 'POS-547'}</span></p>
            <p className="text-xs text-gray-600">Date: <span className="font-bold text-gray-800">{new Date().toLocaleDateString()}</span></p>
            <p className="text-xs text-gray-600">Payment Status: <span className="font-black text-emerald-800 uppercase">PAID (COUNTER POS)</span></p>
          </div>
        </div>

        {/* Billed To & Store Grid */}
        <div className="grid grid-cols-2 gap-6 border-b-2 border-gray-900 pb-6 mb-6 text-xs">
          <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-900/15">
            <h3 className="font-black uppercase text-[#4A0E0E] text-xs border-b border-amber-900/20 pb-1 mb-2">CUSTOMER DETAILS (BILLED TO)</h3>
            <p className="font-black text-sm text-gray-900">{completedOrder ? completedOrder.customer : (customerName || 'Walk-in Customer')}</p>
            <p className="text-gray-700 font-bold mt-1">Phone: {completedOrder ? completedOrder.phone : (customerPhone || '+91 9876543210')}</p>
            <p className="text-gray-700 font-medium">Billing Mode: Over the Counter POS Sale</p>
          </div>

          <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-900/15">
            <h3 className="font-black uppercase text-[#4A0E0E] text-xs border-b border-amber-900/20 pb-1 mb-2">STORE DISPATCH LOCATION</h3>
            <p className="text-gray-900 font-bold leading-relaxed">Karuppa Crackers Main Retail Store & Warehouse Hub, Sivakasi</p>
          </div>
        </div>

        {/* Itemized Table */}
        <table className="w-full text-left text-xs border-collapse border border-gray-900 mb-6">
          <thead>
            <tr className="bg-[#4A0E0E] text-white font-black uppercase tracking-wider text-[11px]">
              <th className="p-3 border border-gray-900 w-12 text-center">S.No</th>
              <th className="p-3 border border-gray-900">Product Item Description</th>
              <th className="p-3 border border-gray-900 text-center">Category</th>
              <th className="p-3 border border-gray-900 text-right">Unit Price</th>
              <th className="p-3 border border-gray-900 text-center">Qty</th>
              <th className="p-3 border border-gray-900 text-right">Total (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {(completedOrder ? completedOrder.items : (cart.length > 0 ? cart : catalog.slice(0, 2))).map((item, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-amber-50/20'}>
                <td className="p-3 border border-gray-300 text-center font-bold">{idx + 1}</td>
                <td className="p-3 border border-gray-300">
                  <p className="font-black text-gray-900">{item.name}</p>
                  <p className="text-[10px] text-gray-500 font-bold">Code: {item.id}</p>
                </td>
                <td className="p-3 border border-gray-300 text-center font-bold text-gray-700">{item.category}</td>
                <td className="p-3 border border-gray-300 text-right font-bold">₹{item.price.toLocaleString()}</td>
                <td className="p-3 border border-gray-300 text-center font-black">{item.qty}</td>
                <td className="p-3 border border-gray-300 text-right font-black">₹{(item.price * item.qty).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Calculation & Summary Grid */}
        <div className="flex justify-between items-start gap-6 border-b-2 border-gray-900 pb-6 mb-6">
          <div className="flex-1 space-y-3 text-xs">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-300 space-y-1">
              <p className="font-black text-gray-900 uppercase text-[10px]">Payment Information</p>
              <p className="text-gray-700">Payment Mode: <span className="font-bold">Cash / UPI Counter Payment</span></p>
              <p className="text-gray-700">Counter Cashier: <span className="font-bold">Mahesh Admin</span></p>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-gray-700 font-medium">
              <p className="font-black text-gray-900 mb-0.5">Safety Instructions:</p>
              Burst crackers strictly outdoors under adult supervision. Keep water nearby.
            </div>
          </div>

          <div className="w-80 space-y-1.5 text-xs font-bold text-gray-800">
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span>Items Subtotal:</span>
              <span className="font-black text-gray-900">₹{(completedOrder ? completedOrder.subtotal : subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200 text-emerald-700">
              <span>Special Discount:</span>
              <span>-₹{(completedOrder ? completedOrder.discount : discount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span>CGST (9%):</span>
              <span>₹{((completedOrder ? completedOrder.gst : gst) / 2).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200">
              <span>SGST (9%):</span>
              <span>₹{((completedOrder ? completedOrder.gst : gst) / 2).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-t-2 border-gray-900 text-base font-black text-gray-900 bg-amber-100/70 px-3 rounded-lg mt-2">
              <span>NET BILL PAID:</span>
              <span className="text-[#c00000]">₹{(completedOrder ? completedOrder.grandTotal : grandTotal).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Terms & Authorized Signatory Footer */}
        <div className="flex justify-between items-end text-[11px] text-gray-700 pt-2">
          <div>
            <p className="font-black text-gray-900 uppercase">Terms & Conditions:</p>
            <ol className="list-decimal list-inside space-y-0.5 mt-1 text-[10px] text-gray-600">
              <li>Goods once sold will not be returned or exchanged.</li>
              <li>All disputes subject to Sivakasi Jurisdiction only.</li>
              <li>This is a computer-generated tax invoice receipt.</li>
            </ol>
          </div>

          <div className="text-center w-56 border-t-2 border-gray-900 pt-2 mt-8">
            <p className="font-serif font-black text-[#4A0E0E] text-xs">For KARUPPA CRACKERS</p>
            <div className="h-10"></div>
            <p className="font-bold text-[10px] uppercase text-gray-600">Authorized Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBilling;
