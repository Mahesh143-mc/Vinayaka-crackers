import React from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

const OrderConfirmModal = ({
  showConfirmModal,
  setShowConfirmModal,
  customerName,
  cart,
  grandTotal,
  handleFinalConfirmSave,
  isProcessingOrder,
  editingOrder
}) => {
  if (!showConfirmModal) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-amber-900/30 text-center relative space-y-5 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-[#4A0E0E] shadow-lg">
          {isProcessingOrder ? (
            <Loader2 size={36} className="animate-spin text-[#4A0E0E]" />
          ) : (
            <CheckCircle2 size={36} strokeWidth={2.5} />
          )}
        </div>

        <div>
          <h3 className="text-xl sm:text-2xl font-serif font-black text-gray-900">
            {editingOrder ? `Confirm Update for #${editingOrder.id}?` : 'Confirm & Complete POS Sale?'}
          </h3>
          <p className="text-xs font-bold text-amber-800 mt-1">
            {editingOrder ? 'Save modified item list back to online customer order:' : 'Review bill summary before saving to database:'}
          </p>
        </div>

        {/* Bill Summary Card */}
        <div className="bg-[#EFEAE1] p-4 rounded-2xl border border-amber-900/15 text-left text-xs font-bold space-y-2">
          <div className="flex justify-between border-b border-amber-900/10 pb-1.5">
            <span className="text-gray-600 uppercase text-[10px] font-black">Customer Name:</span>
            <span className="text-gray-900 font-black">{customerName || 'Walk-in Customer'}</span>
          </div>
          <div className="flex justify-between border-b border-amber-900/10 pb-1.5">
            <span className="text-gray-600 uppercase text-[10px] font-black">Total Items:</span>
            <span className="text-gray-900 font-black">{cart.reduce((sum, item) => sum + (item.qty || item.quantity || 1), 0)} Items</span>
          </div>
          <div className="flex justify-between border-b border-amber-900/10 pb-1.5">
            <span className="text-gray-600 uppercase text-[10px] font-black">Order Type:</span>
            <span className="text-emerald-800 font-black">{editingOrder ? 'Online Customer Order' : 'Cash on Counter'}</span>
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
            disabled={isProcessingOrder}
            onClick={() => setShowConfirmModal(false)}
            className="flex-1 py-3 bg-white hover:bg-gray-100 disabled:opacity-50 border border-gray-300 text-gray-700 font-bold text-xs rounded-2xl transition-all shadow-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isProcessingOrder}
            onClick={handleFinalConfirmSave}
            className="flex-1 py-3 bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-400 hover:to-amber-600 disabled:opacity-75 text-[#4A0E0E] font-black text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isProcessingOrder ? (
              <>
                <Loader2 size={16} className="animate-spin text-[#4A0E0E]" />
                <span>{editingOrder ? 'Updating Order...' : 'Saving POS Sale...'}</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={16} strokeWidth={2.5} /> {editingOrder ? 'Save Order Updates' : 'Yes, Save & Complete'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmModal;
