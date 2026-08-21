import React from 'react';
import { Printer, Download, X } from 'lucide-react';
import { printInvoicePdf } from '../../../utils/generateInvoicePdf';
import { useStoreSettings } from '../../../context/StoreSettingsContext';

const InvoiceModalPreview = ({
  showInvoiceModal,
  setShowInvoiceModal,
  completedOrder,
  customerName,
  customerPhone,
  cart,
  catalog,
  subtotal,
  discount,
  gst,
  grandTotal,
  handleDownloadInvoice,
  triggerSuccess
}) => {
  const { storeSettings } = useStoreSettings();

  if (!showInvoiceModal) return null;

  const companyName = storeSettings?.companyName || 'Karuppa Crackers';
  const tagline = storeSettings?.tagline || 'Sivakasi Premium Fireworks & Fancy Sky Shots Direct Manufacturer';
  const address = storeSettings?.address || '124/B, Sivakasi Main Road, Sivakasi, Tamil Nadu - 626123';
  const phone = storeSettings?.phone || storeSettings?.supportPhone || '8825419454';
  const email = storeSettings?.email || storeSettings?.supportEmail || 'chimeratechweb@gmail.com';
  const gstNumber = storeSettings?.gstNumber || '33AAAAA0000A1Z5';

  const handlePrintClick = () => {
    const currentOrder = completedOrder || {
      orderId: 'POS-547',
      customer: customerName || 'Walk-in Customer',
      phone: customerPhone || '+91 9876543210',
      items: cart.length > 0 ? cart : catalog.slice(0, 2),
      subtotal,
      discount,
      gst,
      grandTotal,
      createdAt: new Date().toISOString()
    };
    if (triggerSuccess) triggerSuccess('Opening print dialog...');
    printInvoicePdf(currentOrder, storeSettings);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000001] flex items-center justify-center p-4 sm:p-6 overflow-y-auto no-print">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-gray-300 relative overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Modal Top Header Controls */}
        <div className="p-4 bg-gradient-to-r from-[#4A0E0E] to-[#2B0808] text-white flex justify-between items-center shrink-0 border-b-2 border-amber-400">
          <div className="flex items-center gap-2">
            <Printer className="text-[#FFD700]" size={20} />
            <h3 className="font-serif font-black text-lg text-white">
              Official Tax Invoice — #{completedOrder ? completedOrder.orderId : 'POS-547'}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleDownloadInvoice ? handleDownloadInvoice(storeSettings) : null}
              className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-1.5 transform hover:scale-105 cursor-pointer"
            >
              <Download size={15} /> Download Invoice
            </button>
            <button
              type="button"
              onClick={handlePrintClick}
              className="px-5 py-2 bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-[#4A0E0E] font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 transform hover:scale-105 cursor-pointer"
            >
              <Printer size={16} strokeWidth={2.5} /> Print Invoice Now
            </button>
            <button
              type="button"
              onClick={() => setShowInvoiceModal(false)}
              className="p-2 text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all cursor-pointer"
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
                alt={companyName}
                className="w-16 h-16 rounded-xl border border-gray-300 object-contain shrink-0"
              />
              <div>
                <h1 className="text-2xl font-serif font-black text-[#4A0E0E] uppercase tracking-wide">{companyName}</h1>
                <p className="text-xs font-bold text-amber-900">{tagline}</p>
                <p className="text-[11px] text-gray-600 mt-1 leading-tight">
                  {address}<br />
                  Phone: +91 {phone} | Email: {email}
                </p>
                <p className="text-[10px] font-bold text-gray-800 mt-1">
                  GSTIN: <span className="font-black font-mono">{gstNumber}</span>
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-4 py-1.5 bg-[#4A0E0E] text-[#FFD700] font-black text-xs uppercase tracking-widest rounded-md mb-2">
                OFFICIAL GST TAX INVOICE
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
              <p className="font-serif font-black text-[#4A0E0E] text-xs">For {companyName.toUpperCase()}</p>
              <div className="h-10"></div>
              <p className="font-bold text-[10px] uppercase text-gray-600">Authorized Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModalPreview;
