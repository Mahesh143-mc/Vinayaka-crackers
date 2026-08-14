import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, CheckCircle, Loader2, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveOrderToFirestore, saveCustomerToFirestore } from '../services/firebaseService';

const Checkout = () => {
  const { cartItems, cartTotals, addToCart, decrementQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    pincode: '',
    notes: ''
  });

  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = cartTotals.totalAmount;
  const grandTotal = subtotal - discountAmount;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'DIWALI20') {
      setDiscountAmount(subtotal * 0.20);
      setCouponApplied(true);
    } else {
      alert("Invalid coupon code.");
      setDiscountAmount(0);
      setCouponApplied(false);
    }
  };

  const triggerSparkles = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x, y },
      colors: ['#25D366', '#ffffff'],
      zIndex: 150,
      disableForReducedMotion: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    triggerSparkles(e);
    setIsSubmitting(true);

    const newOrderId = `ORD-${Math.floor(Math.random() * 90000 + 10000)}`;
    const now = new Date().toISOString();

    const orderPayload = {
      id: newOrderId,
      customerName: formData.name,
      phone: formData.phone,
      whatsapp: formData.whatsapp,
      email: formData.email || '',
      address: `${formData.address}, ${formData.pincode}`,
      pincode: formData.pincode,
      notes: formData.notes || '',
      itemsCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: grandTotal,
      subtotal: subtotal,
      discount: discountAmount,
      status: 'Pending',
      createdAt: now,
      updatedAt: now
    };

    // Save order & customer to Cloud Firestore
    try {
      await saveOrderToFirestore(orderPayload);
      await saveCustomerToFirestore({
        id: formData.phone || `CUST-${Date.now()}`,
        name: formData.name,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        address: `${formData.address}, ${formData.pincode}`,
        createdAt: now,
        updatedAt: now
      });
    } catch (err) {
      console.warn("Cloud Firestore order save notice:", err);
    }

    setTimeout(() => {
      // Format the WhatsApp message
      let message = `🛒 *Karuppa Crackers - Order Confirmation*\n\n`;
      message += `🆔 *Order ID:* ${newOrderId}\n`;
      message += `👤 *Customer Details:*\n`;
      message += `Name: ${formData.name}\n`;
      message += `Phone: ${formData.phone}\n`;
      message += `WhatsApp: ${formData.whatsapp}\n`;
      if (formData.email) message += `Email: ${formData.email}\n`;
      message += `Address: ${formData.address}\n`;
      message += `Pincode: ${formData.pincode}\n\n`;
      
      message += `📦 *Order Summary:*\n`;
      cartItems.forEach((item) => {
        const priceNum = typeof item.price === 'number' ? item.price : parseInt(String(item.price).replace(/[^\d]/g, ''), 10) || 0;
        const itemTotal = priceNum * item.quantity;
        message += `${item.quantity} × ${item.name} = ₹${itemTotal.toLocaleString('en-IN')}\n`;
      });
      
      if (discountAmount > 0) {
        message += `Discount applied: -₹${discountAmount.toLocaleString('en-IN')}\n`;
      }

      message += `\n💳 *Total Amount: ₹${grandTotal.toLocaleString('en-IN')}*\n\n`;

      if (formData.notes) {
        message += `📝 *Notes:*\n${formData.notes}\n\n`;
      }

      message += `Thank you for choosing Karuppa Crackers! 🎆`;

      // Encode and redirect
      const whatsappNumber = "918825419454";
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      
      window.open(whatsappUrl, '_blank');
      
      setIsSubmitting(false);
      setIsSuccess(true);
      clearCart();
    }, 1200);
  };

  const handleDownloadBill = () => {
    const invId = `INV-${Math.floor(Math.random() * 90000 + 10000)}`;
    const invoiceHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Karuppa Crackers Official Tax Invoice - #${invId}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 30px; color: #111; line-height: 1.5; background: #fff; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #4A0E0E; padding-bottom: 15px; margin-bottom: 20px; }
    .company-title { color: #4A0E0E; font-size: 26px; font-weight: bold; margin: 0; }
    .tagline { color: #701515; font-size: 12px; font-weight: bold; margin: 2px 0 6px 0; }
    .meta-text { font-size: 11px; color: #555; margin: 0; }
    .badge { background: #4A0E0E; color: #FFD700; padding: 6px 14px; font-weight: bold; border-radius: 6px; display: inline-block; font-size: 11px; text-transform: uppercase; }
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
    @media print {
      body { margin: 0; padding: 15px; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="company-title">KARUPPA CRACKERS</h1>
      <p class="tagline">Sivakasi Premium Fireworks & Fancy Sky Shots Direct Manufacturer</p>
      <p class="meta-text">
        123 Main Road, Industrial Estate, Sivakasi, Tamil Nadu - 626123<br/>
        Phone: +91 88254 19454 | Email: sales@karuppacrackers.com<br/>
        <strong>GSTIN: 33AAACK1234F1Z9</strong> | Explosives License: E/SC/TN/22/10082
      </p>
    </div>
    <div style="text-align: right;">
      <div class="badge">OFFICIAL GST TAX INVOICE</div>
      <p style="margin: 8px 0 2px 0; font-weight: bold; font-size: 13px;">Invoice No: #${invId}</p>
      <p style="margin: 0; font-size: 12px;">Date: ${new Date().toLocaleDateString('en-IN')}</p>
      <p style="margin: 4px 0 0 0; font-size: 12px; font-weight: bold; color: #065f46;">STATUS: ORDER CONFIRMED</p>
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <h4>Billed To (Customer Details)</h4>
      <strong style="font-size: 14px; color: #000;">${formData.name || 'Valued Customer'}</strong><br/>
      Phone: ${formData.phone || 'N/A'}<br/>
      WhatsApp: ${formData.whatsapp || 'N/A'}<br/>
      Address: ${formData.address || 'Direct Order'}, Pincode: ${formData.pincode || ''}
    </div>
    <div class="card">
      <h4>Store & Dispatch Hub</h4>
      <strong>Karuppa Crackers Main Outlet & Warehouse</strong><br/>
      Industrial Estate, Sivakasi Hub<br/>
      Dispatch Method: Doorstep Delivery Courier / Transport
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
      ${cartItems.map((item, idx) => {
        const priceNum = typeof item.price === 'number' ? item.price : parseInt(String(item.price).replace(/[^\d]/g, ''), 10) || 0;
        return `
        <tr>
          <td style="text-align: center;">${idx + 1}</td>
          <td><strong>${item.name}</strong><br/><small style="color: #666;">Code: ${item.id}</small></td>
          <td style="text-align: center;">${item.category || 'Fireworks'}</td>
          <td style="text-align: right;">₹${priceNum.toLocaleString('en-IN')}</td>
          <td style="text-align: center;"><strong>${item.quantity}</strong></td>
          <td style="text-align: right;"><strong>₹${(priceNum * item.quantity).toLocaleString('en-IN')}</strong></td>
        </tr>
      `;
      }).join('')}
    </tbody>
  </table>

  <div class="totals-wrap">
    <div style="flex: 1; font-size: 11px; color: #555; padding-right: 20px;">
      <div style="background: #faf5eb; padding: 10px; border-radius: 6px; border: 1px solid #e2d7c5; margin-bottom: 10px;">
        <strong>Order Summary Notes:</strong><br/>
        Order Status: Sent to Store WhatsApp Admin<br/>
        Notes: ${formData.notes || 'No special instructions'}
      </div>
      <div style="background: #fff8e6; padding: 8px; border-radius: 6px; border: 1px solid #ffd591; color: #873800;">
        <strong>Safety Warning:</strong> Burst fireworks strictly outdoors under adult supervision. Keep water nearby.
      </div>
    </div>
    <div class="totals">
      <div class="total-row"><span>Items Subtotal:</span> <strong>₹${subtotal.toLocaleString('en-IN')}</strong></div>
      ${discountAmount > 0 ? `<div class="total-row" style="color: #047857;"><span>Coupon Discount:</span> <span>-₹${discountAmount.toLocaleString('en-IN')}</span></div>` : ''}
      <div class="total-row"><span>Estimated CGST (9%):</span> <span>₹${(grandTotal * 0.09).toFixed(2)}</span></div>
      <div class="total-row"><span>Estimated SGST (9%):</span> <span>₹${(grandTotal * 0.09).toFixed(2)}</span></div>
      <div class="total-row grand-total"><span>TOTAL ORDER AMOUNT:</span> <span>₹${grandTotal.toLocaleString('en-IN')}</span></div>
    </div>
  </div>

  <div class="footer">
    <div>
      <strong>Terms & Conditions:</strong>
      <ol style="margin: 4px 0 0 0; padding-left: 16px; font-size: 10px;">
        <li>Goods once sold will not be returned or exchanged.</li>
        <li>All disputes subject to Sivakasi Jurisdiction only.</li>
        <li>Computer-generated official Karuppa Crackers Tax Invoice.</li>
      </ol>
    </div>
    <div class="sign-box">
      <strong style="color: #4A0E0E; font-size: 12px;">For KARUPPA CRACKERS</strong><br/><br/><br/>
      <small style="text-transform: uppercase;">Authorized Signatory</small>
    </div>
  </div>

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(invoiceHtml);
      printWindow.document.close();
    }
  };

  // SUCCESS STATE VIEW
  if (isSuccess) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-[#FFF8E7] flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border-2 border-[#2E7D32] rounded-2xl p-10 max-w-lg w-full text-center shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-[#2E7D32]"></div>
          <div className="flex justify-center mb-6">
            <CheckCircle className="text-[#2E7D32] w-20 h-20" />
          </div>
          <h2 className="text-3xl font-serif font-black text-[#B71C1C] mb-4">Order Sent Successfully!</h2>
          <p className="text-[#2C2C2C] text-lg font-semibold mb-2">We've sent your order to our WhatsApp. We'll confirm shortly.</p>
          <p className="text-gray-500 text-sm mb-8">You'll receive a confirmation message from our team.</p>
          
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
            <button 
              onClick={() => window.open('https://wa.me/918825419454', '_blank')}
              className="bg-[#FFB300] hover:bg-[#FF8F00] text-white font-bold py-3 px-6 rounded-full transition-colors flex items-center justify-center"
            >
              View Order Status
            </button>
            <button 
              onClick={handleDownloadBill}
              className="bg-[#2C2C2C] hover:bg-black text-white font-bold py-3 px-6 rounded-full transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Bill
            </button>
            <button 
              onClick={() => {
                setIsSuccess(false);
                navigate('/products');
              }}
              className="bg-transparent border-2 border-[#FFB300] text-[#FFB300] hover:bg-orange-50 font-bold py-3 px-6 rounded-full transition-colors flex items-center justify-center"
            >
              Continue Shopping
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // EMPTY CART VIEW
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-[#FFF8E7] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
        <h2 className="text-3xl font-serif font-black text-[#B71C1C] mb-4">Your Festive Basket is Empty</h2>
        <button 
          onClick={() => navigate('/products')}
          className="bg-[#B71C1C] hover:bg-[#a00000] text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:-translate-y-1"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  // MAIN CHECKOUT VIEW
  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#FFF8E7] relative overflow-hidden">
      {/* Sparkle background element (visual only) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.05)_0%,transparent_60%)] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative flex items-center justify-center sm:justify-between mb-8"
        >
          <button 
            onClick={() => navigate('/products')}
            className="absolute left-0 sm:relative group flex items-center gap-2 text-[#B71C1C] font-bold hover:text-[#FFB300] transition-colors z-10"
          >
            <ArrowLeft className="w-6 h-6 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" /> 
            <span className="hidden sm:inline">Back to Shopping</span>
          </button>
          <div className="text-center sm:text-right w-full px-10 sm:px-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-[#B71C1C]">🛒 Your Festive Basket</h1>
            <p className="text-[#2C2C2C] text-xs sm:text-sm md:text-base mt-1">Review your order and confirm details.</p>
          </div>
        </motion.div>

        <div className="flex flex-col-reverse lg:flex-row-reverse gap-8">
          
          {/* LEFT COLUMN: Product Summary */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-[60%] flex flex-col gap-6"
          >
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[rgba(255,215,0,0.12)]">
              <h2 className="text-xl sm:text-2xl font-serif font-black text-[#B71C1C] mb-1">📦 Product Summary</h2>
              <p className="text-[#2C2C2C] text-sm mb-6 pb-4 border-b border-[rgba(255,215,0,0.2)]">Review your order before confirming.</p>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                <AnimatePresence>
                  {cartItems.map((item, index) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 4, backgroundColor: "#FFF8E7" }}
                      className="group flex flex-col sm:flex-row gap-4 p-3 sm:p-4 bg-[#FFF8E7] rounded-xl border border-[rgba(255,215,0,0.15)] relative transition-all shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-[60px] h-[60px] rounded-lg overflow-hidden shrink-0 border-2 border-[rgba(255,215,0,0.2)] bg-white">
                          <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#B71C1C] text-[0.95rem] leading-tight mb-1 pr-8">{item.name}</h4>
                          <span className="text-[#666666] text-[0.75rem]">{item.category}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/2 sm:shrink-0">
                        <div className="flex items-center gap-3">
                          <button onClick={() => decrementQuantity(item.id)} className="w-7 h-7 flex items-center justify-center bg-[#FFB300] hover:bg-[#FF8F00] text-white rounded-full font-bold shadow-sm">-</button>
                          <span className="w-4 text-center font-bold text-[#B71C1C]">{item.quantity}</span>
                          <button onClick={() => addToCart(item)} className="w-7 h-7 flex items-center justify-center bg-[#FFB300] hover:bg-[#FF8F00] text-white rounded-full font-bold shadow-sm">+</button>
                        </div>
                        <div className="font-bold text-[#FFB300] min-w-[80px] text-right">
                          ₹{(parseInt(item.price.replace(/[^\d]/g, ''), 10) * item.quantity).toLocaleString('en-IN')}
                        </div>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="absolute top-2 right-2 sm:bottom-2 sm:top-auto sm:right-4 text-gray-400 hover:text-red-600 transition-colors hover:scale-110 p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Totals Summary */}
              <div className="mt-6 pt-4 border-t-2 border-[rgba(255,215,0,0.2)] space-y-2">
                <div className="flex justify-between text-[#2C2C2C] text-[0.95rem]">
                  <span>Subtotal ({cartTotals.totalQuantity} items)</span>
                  <span className="font-bold text-[#B71C1C]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#2C2C2C] text-[0.95rem]">
                    <span>Discount (Coupon)</span>
                    <span className="font-bold text-green-600">-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#2C2C2C] text-[0.95rem]">
                  <span>Delivery Charges</span>
                  <span className="font-bold text-[#B71C1C]">Calculated on WhatsApp</span>
                </div>
                
                <div className="flex justify-between items-end mt-4 pt-4 border-t border-[rgba(255,215,0,0.1)]">
                  <span className="font-bold text-[#2C2C2C]">Total Amount</span>
                  <span className="font-bold text-[#FFB300] text-2xl">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="mt-2 text-right">
                    <span className="inline-block bg-[rgba(46,125,50,0.1)] text-[#2E7D32] font-bold text-[0.9rem] py-1 px-3 rounded-full">
                      You saved ₹{discountAmount.toLocaleString('en-IN')}! 🎉
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Coupon Code Section */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[rgba(255,215,0,0.12)]">
              <h3 className="font-bold text-[#2C2C2C] mb-4 flex items-center gap-2">
                ✨ Have a coupon code?
              </h3>
              <form onSubmit={handleApplyCoupon} className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code (Try DIWALI20)"
                  className="flex-1 px-4 py-2 border border-[rgba(255,215,0,0.3)] rounded-full focus:outline-none focus:border-[#FFB300] focus:shadow-[0_0_10px_rgba(255,179,0,0.2)] transition-all uppercase"
                />
                <button 
                  type="submit"
                  disabled={couponApplied || !couponCode}
                  className="bg-[#FFB300] hover:bg-[#FF8F00] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-full transition-colors whitespace-nowrap"
                >
                  {couponApplied ? 'Applied' : 'Apply ▶'}
                </button>
              </form>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Customer Details */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:w-[40%]"
          >
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[rgba(255,215,0,0.12)] sticky top-24">
              <h2 className="text-xl sm:text-2xl font-serif font-black text-[#B71C1C] mb-1">📋 Confirm Your Order</h2>
              <p className="text-[#2C2C2C] text-sm mb-6 pb-4 border-b border-[rgba(255,215,0,0.2)]">We'll send confirmation to your WhatsApp.</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="relative">
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-[#E0E0E0] focus:border-[#FFB300] outline-none transition-colors bg-transparent"
                  />
                  <label className="absolute left-4 top-1 text-xs text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#FFB300] pointer-events-none">Full Name *</label>
                </div>

                <div className="relative">
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    pattern="[0-9]{10}"
                    title="Please enter a valid 10-digit mobile number"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-[#E0E0E0] focus:border-[#FFB300] outline-none transition-colors bg-transparent"
                  />
                  <label className="absolute left-4 top-1 text-xs text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#FFB300] pointer-events-none">Phone Number *</label>
                </div>

                <div className="relative">
                  <input 
                    type="tel" 
                    name="whatsapp"
                    required
                    pattern="[0-9]{10}"
                    title="Please enter a valid 10-digit WhatsApp number"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-[#E0E0E0] focus:border-[#FFB300] outline-none transition-colors bg-transparent"
                  />
                  <label className="absolute left-4 top-1 text-xs text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#FFB300] pointer-events-none flex items-center gap-1">WhatsApp Number * <CheckCircle className="w-3 h-3 text-[#25D366] hidden peer-valid:block" /></label>
                </div>

                <div className="relative">
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-[#E0E0E0] focus:border-[#FFB300] outline-none transition-colors bg-transparent"
                  />
                  <label className="absolute left-4 top-1 text-xs text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#FFB300] pointer-events-none">Email Address (Optional)</label>
                </div>

                <div className="relative">
                  <textarea 
                    name="address"
                    required
                    rows="2"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-[#E0E0E0] focus:border-[#FFB300] outline-none transition-colors bg-transparent resize-none"
                  ></textarea>
                  <label className="absolute left-4 top-1 text-xs text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#FFB300] pointer-events-none">Delivery Address *</label>
                </div>

                <div className="relative">
                  <input 
                    type="text" 
                    name="pincode"
                    required
                    pattern="[0-9]{6}"
                    title="Please enter a valid 6-digit pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-[#E0E0E0] focus:border-[#FFB300] outline-none transition-colors bg-transparent"
                  />
                  <label className="absolute left-4 top-1 text-xs text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#FFB300] pointer-events-none">Pincode *</label>
                </div>

                <div className="relative">
                  <textarea 
                    name="notes"
                    rows="2"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder=" "
                    className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-[#E0E0E0] focus:border-[#FFB300] outline-none transition-colors bg-transparent resize-none"
                  ></textarea>
                  <label className="absolute left-4 top-1 text-xs text-gray-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#FFB300] pointer-events-none">Order Notes (Optional)</label>
                </div>
                
                <div className="pt-4 text-center">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-[#25D366] text-white font-bold py-3 sm:py-4 px-2 sm:px-6 rounded-full shadow-[0_8px_30px_rgba(37,211,102,0.3)] transition-all flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg
                      ${isSubmitting ? 'opacity-90 scale-95' : 'hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(37,211,102,0.4)]'}
                    `}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Redirecting to WhatsApp...
                      </>
                    ) : (
                      <>
                        📞 Confirm Order via WhatsApp
                      </>
                    )}
                  </button>
                  <p className="text-[#666666] text-[0.75rem] mt-3">You will be redirected to WhatsApp with your order details.</p>
                </div>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
