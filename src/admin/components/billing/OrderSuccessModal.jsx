import React from 'react';
import { CheckCircle2, Printer, Download, Send, ArrowRight } from 'lucide-react';

const OrderSuccessModal = ({
  completedOrder,
  handleTriggerPrint,
  handleDownloadInvoice,
  handleStartNewOrder
}) => {
  if (!completedOrder) return null;

  return (
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
          <p className="text-[10px] font-black uppercase text-amber-950 tracking-wider">Share, Print, or Download Invoice Bill:</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleTriggerPrint}
              className="w-full py-3 bg-[#4A0E0E] hover:bg-red-950 text-white rounded-xl font-black text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all"
            >
              <Printer size={15} /> Print Receipt
            </button>

            <button
              type="button"
              onClick={handleDownloadInvoice}
              className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-black text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all"
            >
              <Download size={15} /> Download PDF
            </button>

            <a
              href={`https://wa.me/91${completedOrder.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(completedOrder.customer)},%20your%20Karuppa%20Crackers%20order%20%23${completedOrder.orderId}%20bill%20for%20Rs.${completedOrder.grandTotal}%20has%20been%20confirmed!`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#25D366] hover:bg-[#1ebd53] text-white rounded-xl font-black text-xs shadow-md flex items-center justify-center gap-1.5 text-center transition-all"
            >
              <Send size={15} /> Share WhatsApp
            </a>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleStartNewOrder}
            className="w-full py-3 sm:py-3.5 bg-[#4A0E0E] hover:bg-red-950 text-white font-black text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            Start New Customer Order <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessModal;
