import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Receipt, X, ShoppingCart, Minus, Plus, Trash2, CheckCircle2, Loader2 } from 'lucide-react';

const CartReceiptDrawer = ({
  showCartDrawer,
  closeCartDrawer,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  showCustomerDropdown,
  setShowCustomerDropdown,
  customerDropdownRef,
  existingCustomers,
  cart,
  updateQty,
  removeFromCart,
  subtotal,
  discount,
  gst,
  grandTotal,
  handleResetBill,
  handleConfirmOrder,
  isConfirming,
  isProcessingOrder,
  editingOrder,
  triggerSuccess
}) => {
  return (
    <AnimatePresence>
      {showCartDrawer && (
        <div className="fixed inset-0 z-[1000000] flex justify-end overflow-hidden">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCartDrawer}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Full-Height Right Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative w-full sm:w-[450px] h-full bg-[#FAF7F2] border-l-2 border-amber-900/30 shadow-2xl flex flex-col z-10"
          >
            {/* Drawer Top Header Bar */}
            <div className="p-5 bg-gradient-to-r from-[#4A0E0E] via-[#5c1212] to-[#2B0808] text-white flex items-center justify-between border-b border-red-950 shrink-0 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-[#FFD700]">
                  <Receipt size={20} />
                </div>
                <div>
                  <h3 className="text-base font-serif font-black text-[#FFD700] leading-tight">
                    Bill Receipt <span className="text-white">({cart.reduce((s, i) => s + i.qty, 0)} Items)</span>
                  </h3>
                  <p className="text-[10px] text-amber-200/80 font-bold uppercase tracking-wider">Point of Sale (POS) Order</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeCartDrawer}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Customer Inputs */}
            <div className="p-4 bg-[#EFEAE1] border-b border-amber-900/15 shrink-0 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-900">Customer Details</span>
                <span className="text-[10px] font-bold text-gray-500">Auto-lookup by Phone or Name</span>
              </div>

              <div className="space-y-2.5 relative" ref={customerDropdownRef}>
                <div>
                  <label className="block text-[10px] font-black text-[#4A0E0E] uppercase mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      setShowCustomerDropdown(true);
                    }}
                    onFocus={() => setShowCustomerDropdown(true)}
                    placeholder="Enter customer name..."
                    className="w-full px-3.5 py-2.5 bg-white border border-amber-900/20 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#4A0E0E] shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-[#4A0E0E] uppercase mb-1">Phone / WhatsApp Number</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => {
                      setCustomerPhone(e.target.value);
                      setShowCustomerDropdown(true);
                    }}
                    onFocus={() => setShowCustomerDropdown(true)}
                    placeholder="e.g. +91 9876543210"
                    className="w-full px-3.5 py-2.5 bg-white border border-amber-900/20 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#4A0E0E] shadow-xs"
                  />
                </div>
                
                {/* Autocomplete Dropdown */}
                {showCustomerDropdown && (() => {
                  const p = (customerPhone || '').trim().replace(/[^0-9]/g, '');
                  if (!p || p.length < 2) return null;
                  const matches = existingCustomers.filter(c => (c.phone || '').replace(/[^0-9]/g, '').includes(p));
                  if (matches.length === 0) return null;
                  return (
                    <div className="absolute top-full left-0 right-0 bg-white border border-amber-500/30 shadow-xl rounded-xl p-2 z-50 max-h-48 overflow-y-auto">
                      {matches.map(cust => (
                        <div key={cust.phone} onClick={() => { setCustomerName(cust.name); setCustomerPhone(cust.phone); setShowCustomerDropdown(false); triggerSuccess(`✓ Auto-filled: ${cust.name}`); }} className="p-2 hover:bg-amber-50 rounded-lg cursor-pointer text-xs font-bold text-gray-800">
                          {cust.name} - <span className="text-[#c00000]">{cust.phone}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Cart Items Scroll List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF7F2]">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                  <div className="w-16 h-16 rounded-full bg-amber-100/60 border border-amber-300 flex items-center justify-center text-[#4A0E0E] mb-3">
                    <ShoppingCart size={28} />
                  </div>
                  <p className="text-sm font-black text-gray-800">No Items Added Yet</p>
                  <p className="text-xs font-medium text-gray-500 mt-1">Select products from the catalog to build customer bill.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="bg-white p-3.5 rounded-2xl border border-amber-900/15 flex items-center justify-between shadow-sm hover:border-amber-900/30 transition-all">
                    <div className="flex-1 mr-3 min-w-0">
                      <p className="text-xs sm:text-sm font-black text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs font-black text-[#c00000] mt-0.5">
                        ₹{item.price.toLocaleString('en-IN')} × {item.qty} = <span className="text-amber-950 font-black">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center border-2 border-amber-900/25 rounded-2xl overflow-hidden bg-[#FAF7F2] shadow-sm">
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, -1)}
                          className="px-3.5 py-2 text-gray-900 hover:bg-amber-200/70 transition-colors flex items-center justify-center"
                          title="Reduce quantity"
                        >
                          <Minus size={16} strokeWidth={2.5} />
                        </button>
                        <span className="px-3 text-sm sm:text-base font-black text-[#4A0E0E] tracking-wider">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, 1)}
                          className="px-3.5 py-2 text-gray-900 hover:bg-amber-200/70 transition-colors flex items-center justify-center"
                          title="Increase quantity"
                        >
                          <Plus size={16} strokeWidth={2.5} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Receipt Totals & Action Buttons Footer */}
            <div className="p-5 bg-[#EFEAE1] border-t-2 border-amber-900/20 space-y-3 shrink-0 shadow-lg">
              <div className="space-y-1.5 text-xs font-bold">
                <div className="flex justify-between text-gray-700"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-emerald-800"><span>Festive Discount (10%)</span><span>-₹{discount.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-gray-700"><span>GST (18%)</span><span>₹{gst.toLocaleString('en-IN')}</span></div>
                <div className="pt-2 border-t border-amber-900/15 flex justify-between items-center text-base">
                  <span className="font-black text-gray-900">Net Payable</span>
                  <span className="font-black text-2xl text-[#c00000]">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleResetBill}
                  className="col-span-1 py-3 bg-[#4A0E0E] hover:bg-[#601212] text-[#FFD700] rounded-2xl text-xs font-black transition-colors"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleConfirmOrder}
                  disabled={cart.length === 0 || isConfirming || isProcessingOrder}
                  className="col-span-2 py-3 bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-400 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-[#4A0E0E] rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-1.5 transition-all transform hover:scale-[1.02] cursor-pointer"
                >
                  {isConfirming || isProcessingOrder ? (
                    <>
                      <Loader2 size={16} className="animate-spin text-[#4A0E0E]" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} strokeWidth={2.5} /> {editingOrder ? `Confirm Update #${editingOrder.id}` : 'Confirm & Complete'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartReceiptDrawer;
