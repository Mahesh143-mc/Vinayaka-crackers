import React from 'react';
import { ShoppingCart, RefreshCw, Receipt, CheckCircle2 } from 'lucide-react';

const StickyCartBar = ({
  cart,
  grandTotal,
  openCartDrawer,
  handleResetBill,
  isFullscreenPos,
  isDesktopSidebarExpanded,
  editingOrder
}) => {
  if (!cart || cart.length === 0) return null;

  return (
    <div className={`no-print fixed bottom-0 right-0 px-3 sm:px-8 py-2.5 sm:py-3.5 shadow-2xl flex items-center justify-between text-white transition-all duration-300 bg-[#3B0B0B] border-t-4 border-[#FFD700] ${isFullscreenPos
      ? 'left-0 z-[1000000]'
      : `left-0 z-40 ${isDesktopSidebarExpanded ? 'lg:left-72' : 'lg:left-20'}`
      }`}>
      {/* Cart Live Counter */}
      <div onClick={openCartDrawer} className="cursor-pointer flex items-center gap-1.5 sm:gap-3 shrink-0">
        <div className="bg-[#FFD700] text-[#4A0E0E] font-black text-xs px-2.5 sm:px-3.5 py-1 rounded-full shadow-md flex items-center gap-1">
          <ShoppingCart size={14} /> {cart.length} <span className="hidden sm:inline">Items</span>
        </div>
        <div>
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className="text-[10px] sm:text-xs font-bold text-amber-200/80 hidden sm:inline">Net Payable:</span>
            <span className="font-black text-base sm:text-2xl text-[#FFD700]">₹{grandTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        <button
          type="button"
          onClick={handleResetBill}
          className="p-2 sm:px-4 sm:py-2.5 bg-white/10 hover:bg-white/20 text-amber-200 rounded-xl text-xs font-black border border-white/20 flex items-center justify-center transition-all"
          title="Reset Bill"
        >
          <RefreshCw size={14} /> <span className="hidden sm:inline">Reset</span>
        </button>

        <button
          type="button"
          onClick={openCartDrawer}
          className="px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-[#4A0E0E] font-black text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
        >
          <CheckCircle2 size={16} strokeWidth={2.5} />
          <span>{editingOrder ? `Update #${editingOrder.id}` : 'Confirm Order'}</span>
        </button>
      </div>
    </div>
  );
};

export default StickyCartBar;
