import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, Calendar, ShoppingBag, Award, Send, Printer, Download, Eye, FileText, CheckCircle2, X, ChevronRight } from 'lucide-react';
import { subscribeCustomers, subscribeOrders } from '../../services/firebaseService';

const mockCustomerDatabase = {
  'CUST-001': {
    id: 'CUST-001',
    sno: 1,
    name: 'Rahul Sharma',
    phone: '+91 9876543210',
    email: 'rahul.sharma@gmail.com',
    location: 'Sivakasi, Tamil Nadu',
    status: 'VIP',
    totalOrders: 5,
    totalSpent: 45500,
    avgOrderValue: 9100,
    registeredDate: 'Jan 12, 2023',
    lastActive: 'Oct 15, 2023',
    orders: [
      {
        orderId: 'ORD-9842',
        date: 'Oct 15, 2023',
        paymentMode: 'UPI / GPay',
        paymentStatus: 'PAID',
        items: [
          { name: '120 Shots Multi-color', id: 'PRD-01', category: 'Fancy', price: 1200, qty: 5 },
          { name: 'Giant Sparklers (50pcs)', id: 'PRD-02', category: 'Sparklers', price: 350, qty: 10 },
          { name: 'Flower Pots Mega', id: 'PRD-04', category: 'Fountains', price: 650, qty: 4 }
        ],
        subtotal: 12100,
        discount: 1210,
        gst: 1960,
        grandTotal: 12850
      },
      {
        orderId: 'ORD-9104',
        date: 'Sep 28, 2023',
        paymentMode: 'Cash on Counter',
        paymentStatus: 'PAID',
        items: [
          { name: '7 Color Rockets (10pcs)', id: 'PRD-06', category: 'Fancy', price: 850, qty: 8 },
          { name: 'Chakra Ground Spinner', id: 'PRD-07', category: 'Fountains', price: 280, qty: 10 }
        ],
        subtotal: 9600,
        discount: 960,
        gst: 1555,
        grandTotal: 10195
      },
      {
        orderId: 'ORD-8512',
        date: 'Aug 14, 2023',
        paymentMode: 'Bank Transfer',
        paymentStatus: 'PAID',
        items: [
          { name: 'Lakshmi Bomb Deluxe', id: 'PRD-03', category: 'Bombs', price: 150, qty: 20 },
          { name: 'Electric Sparklers Gold', id: 'PRD-08', category: 'Sparklers', price: 450, qty: 15 }
        ],
        subtotal: 9750,
        discount: 975,
        gst: 1580,
        grandTotal: 10355
      },
      {
        orderId: 'ORD-7810',
        date: 'Jul 02, 2023',
        paymentMode: 'UPI / PhonePe',
        paymentStatus: 'PAID',
        items: [
          { name: 'Sky Lanterns Pack', id: 'PRD-05', category: 'Novelty', price: 400, qty: 10 },
          { name: 'Flower Pots Mega', id: 'PRD-04', category: 'Fountains', price: 650, qty: 6 }
        ],
        subtotal: 7900,
        discount: 790,
        gst: 1280,
        grandTotal: 8390
      },
      {
        orderId: 'ORD-6540',
        date: 'Feb 10, 2023',
        paymentMode: 'Cash',
        paymentStatus: 'PAID',
        items: [
          { name: 'Giant Sparklers (50pcs)', id: 'PRD-02', category: 'Sparklers', price: 350, qty: 10 }
        ],
        subtotal: 3500,
        discount: 350,
        gst: 567,
        grandTotal: 3717
      }
    ]
  },
  'CUST-002': {
    id: 'CUST-002',
    sno: 2,
    name: 'Priya Patel',
    phone: '+91 9123456789',
    email: 'priya.patel@gmail.com',
    location: 'Madurai, Tamil Nadu',
    status: 'New',
    totalOrders: 1,
    totalSpent: 8200,
    avgOrderValue: 8200,
    registeredDate: 'Oct 15, 2023',
    lastActive: 'Oct 15, 2023',
    orders: [
      {
        orderId: 'ORD-8761',
        date: 'Oct 15, 2023',
        paymentMode: 'UPI',
        paymentStatus: 'PAID',
        items: [
          { name: 'Flower Pots Mega', id: 'PRD-04', category: 'Fountains', price: 650, qty: 8 },
          { name: 'Sky Lanterns Pack', id: 'PRD-05', category: 'Novelty', price: 400, qty: 7 }
        ],
        subtotal: 8000,
        discount: 800,
        gst: 1296,
        grandTotal: 8496
      }
    ]
  },
  'CUST-003': {
    id: 'CUST-003',
    sno: 3,
    name: 'Vikram Singh',
    phone: '+91 9988776655',
    email: 'vikram.singh@gmail.com',
    location: 'Chennai, Tamil Nadu',
    status: 'Wholesale',
    totalOrders: 12,
    totalSpent: 122000,
    avgOrderValue: 10166,
    registeredDate: 'Mar 05, 2023',
    lastActive: 'Oct 14, 2023',
    orders: [
      {
        orderId: 'ORD-9901',
        date: 'Oct 14, 2023',
        paymentMode: 'Bank Transfer',
        paymentStatus: 'PAID',
        items: [
          { name: '7 Color Rockets (100pcs Bulk)', id: 'PRD-06', category: 'Fancy', price: 850, qty: 40 },
          { name: '120 Shots Multi-color', id: 'PRD-01', category: 'Fancy', price: 1200, qty: 10 }
        ],
        subtotal: 46000,
        discount: 4600,
        gst: 7452,
        grandTotal: 48852
      }
    ]
  }
};

const generateFallbackCustomer = (id) => {
  return {
    id: id || 'CUST-001',
    sno: 1,
    name: 'Rahul Sharma',
    phone: '+91 9876543210',
    email: 'rahul.sharma@gmail.com',
    location: 'Sivakasi, Tamil Nadu',
    status: 'VIP',
    totalOrders: 3,
    totalSpent: 34500,
    avgOrderValue: 11500,
    registeredDate: 'Feb 18, 2023',
    lastActive: 'Oct 15, 2023',
    orders: [
      {
        orderId: `ORD-${Math.floor(Math.random() * 9000 + 1000)}`,
        date: 'Oct 15, 2023',
        paymentMode: 'UPI / Online',
        paymentStatus: 'PAID',
        items: [
          { name: '120 Shots Multi-color', id: 'PRD-01', category: 'Fancy', price: 1200, qty: 6 },
          { name: 'Giant Sparklers (50pcs)', id: 'PRD-02', category: 'Sparklers', price: 350, qty: 12 },
          { name: 'Flower Pots Mega', id: 'PRD-04', category: 'Fountains', price: 650, qty: 5 }
        ],
        subtotal: 14650,
        discount: 1465,
        gst: 2373,
        grandTotal: 15558
      },
      {
        orderId: `ORD-${Math.floor(Math.random() * 9000 + 1000)}`,
        date: 'Sep 12, 2023',
        paymentMode: 'Cash',
        paymentStatus: 'PAID',
        items: [
          { name: '7 Color Rockets (10pcs)', id: 'PRD-06', category: 'Fancy', price: 850, qty: 10 },
          { name: 'Chakra Ground Spinner', id: 'PRD-07', category: 'Fountains', price: 280, qty: 15 }
        ],
        subtotal: 12700,
        discount: 1270,
        gst: 2057,
        grandTotal: 13487
      }
    ]
  };
};

const AdminCustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(() => mockCustomerDatabase[id] || generateFallbackCustomer(id));
  const [allOrders, setAllOrders] = useState([]);
  const [firestoreCustomers, setFirestoreCustomers] = useState([]);

  useEffect(() => {
    const unsubCust = subscribeCustomers((custs) => {
      setFirestoreCustomers(custs || []);
    });
    const unsubOrd = subscribeOrders((ords) => {
      setAllOrders(ords || []);
    });
    return () => {
      unsubCust();
      unsubOrd();
    };
  }, []);

  useEffect(() => {
    const foundCust = firestoreCustomers.find(c => String(c.id) === String(id) || String(c.phone).includes(String(id)));
    const custPhone = foundCust?.phone || id;
    const cleanPhone = String(custPhone).replace(/[^\d]/g, '');

    // Match all orders for this customer by phone, id, or customerName
    const userOrders = allOrders.filter(o => {
      const oPhoneClean = String(o.phone || '').replace(/[^\d]/g, '');
      const phoneMatch = cleanPhone && oPhoneClean && (cleanPhone.endsWith(oPhoneClean) || oPhoneClean.endsWith(cleanPhone));
      const idMatch = String(o.id) === String(id) || String(o.customerPhone) === String(id) || String(o.phone) === String(id);
      const nameMatch = foundCust?.name && o.customerName && foundCust.name.toLowerCase().trim() === o.customerName.toLowerCase().trim();
      return phoneMatch || idMatch || nameMatch;
    });

    const computedOrders = userOrders.map(o => {
      const subtotal = o.subtotal || o.totalAmount || o.grandTotal || o.amount || 0;
      const discount = o.discount || 0;
      const gst = o.gst || 0;
      const grandTotal = o.grandTotal || o.totalAmount || o.amount || subtotal;
      const rawDate = o.createdAt || o.date;
      let dateStr = 'Today';
      if (rawDate) {
        if (typeof rawDate?.toDate === 'function') dateStr = rawDate.toDate().toLocaleDateString('en-IN');
        else if (typeof rawDate === 'object' && rawDate?.seconds) dateStr = new Date(rawDate.seconds * 1000).toLocaleDateString('en-IN');
        else {
          const p = new Date(rawDate);
          dateStr = !isNaN(p.getTime()) ? p.toLocaleDateString('en-IN') : String(rawDate);
        }
      }

      return {
        orderId: String(o.id || o.orderId),
        date: dateStr,
        paymentMode: o.paymentMode || 'Online / WhatsApp',
        paymentStatus: o.paymentStatus || 'PAID',
        items: (o.items || []).map(i => ({
          name: i.name || 'Firework Item',
          id: i.id || 'PRD',
          category: i.category || 'Fireworks',
          price: typeof i.price === 'number' ? i.price : parseInt(String(i.price).replace(/[^\d]/g, ''), 10) || 0,
          qty: i.quantity || i.qty || 1
        })),
        subtotal: subtotal,
        discount: discount,
        gst: gst,
        grandTotal: grandTotal,
        status: o.status || 'Pending'
      };
    });

    const totalSpentSum = computedOrders.reduce((sum, o) => sum + o.grandTotal, 0);
    const totalOrdersCount = computedOrders.length;

    if (foundCust || computedOrders.length > 0) {
      const targetOrder = allOrders.find(o => String(o.id) === String(id) || String(o.phone).includes(String(id)));
      const baseName = foundCust?.name || (targetOrder ? (targetOrder.customerName || targetOrder.customer) : 'Valued Customer');
      setCustomer({
        id: String(id),
        sno: foundCust?.sno || 1,
        name: baseName || 'Valued Customer',
        phone: foundCust?.phone || (targetOrder?.phone || id),
        email: foundCust?.email || 'N/A',
        location: foundCust?.location || 'Sivakasi, Tamil Nadu',
        status: foundCust?.status || (totalSpentSum > 10000 ? 'VIP' : 'Regular'),
        totalOrders: totalOrdersCount,
        totalSpent: totalSpentSum,
        avgOrderValue: totalOrdersCount > 0 ? Math.round(totalSpentSum / totalOrdersCount) : 0,
        registeredDate: foundCust?.createdAt ? new Date(foundCust.createdAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN'),
        lastActive: computedOrders[0]?.date || 'Today',
        orders: computedOrders
      });
    } else if (mockCustomerDatabase[id]) {
      setCustomer(mockCustomerDatabase[id]);
    }
  }, [id, firestoreCustomers, allOrders]);

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [successToast, setSuccessToast] = useState('');

  const triggerSuccess = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleDownloadInvoice = (inv) => {
    triggerSuccess(`Downloading Tax Invoice #${inv.orderId}...`);

    const invoiceHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Karuppa Crackers Tax Invoice - #${inv.orderId}</title>
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
      <div class="badge">OFFICIAL CUSTOMER TAX INVOICE</div>
      <p style="margin: 8px 0 2px 0; font-weight: bold; font-size: 13px;">Invoice No: #${inv.orderId}</p>
      <p style="margin: 0; font-size: 12px;">Date: ${inv.date}</p>
      <p style="margin: 4px 0 0 0; font-size: 12px; font-weight: bold; color: #065f46;">STATUS: ${inv.paymentStatus}</p>
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <h4>Customer Details (Billed To)</h4>
      <strong style="font-size: 14px; color: #000;">${customer.name}</strong><br/>
      Phone: ${customer.phone}<br/>
      Email: ${customer.email}<br/>
      Location: ${customer.location}
    </div>
    <div class="card">
      <h4>Store Dispatch Location</h4>
      <strong>Karuppa Crackers Retail Outlet, Sivakasi Hub</strong><br/>
      Payment Mode: ${inv.paymentMode}
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
      ${inv.items.map((item, idx) => `
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
        Payment Method: ${inv.paymentMode}<br/>
        Verified By: Mahesh Admin
      </div>
      <div style="background: #fff8e6; padding: 8px; border-radius: 6px; border: 1px solid #ffd591; color: #873800;">
        <strong>Safety Instructions:</strong> Burst crackers strictly outdoors under adult supervision.
      </div>
    </div>
    <div class="totals">
      <div class="total-row"><span>Items Subtotal:</span> <strong>₹${inv.subtotal.toLocaleString()}</strong></div>
      <div class="total-row" style="color: #047857;"><span>Special Discount:</span> <span>-₹${inv.discount.toLocaleString()}</span></div>
      <div class="total-row"><span>CGST (9%):</span> <span>₹${(inv.gst / 2).toLocaleString()}</span></div>
      <div class="total-row"><span>SGST (9%):</span> <span>₹${(inv.gst / 2).toLocaleString()}</span></div>
      <div class="total-row grand-total"><span>NET BILL PAID:</span> <span>₹${inv.grandTotal.toLocaleString()}</span></div>
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
    a.download = `Customer_Tax_Invoice_${inv.orderId}_KaruppaCrackers.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Toast Notification Banner */}
      {successToast && (
        <div className="fixed top-6 right-6 z-[1000005] bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white font-black text-xs sm:text-sm px-5 py-3.5 rounded-2xl shadow-2xl border-2 border-amber-300 flex items-center gap-3 animate-in slide-in-from-top-5 duration-300">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} className="text-[#FFD700]" />
          </div>
          <span>{successToast}</span>
        </div>
      )}

      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/admin/customers')}
          className="px-4 py-2.5 bg-[#FAF7F2] hover:bg-amber-100/70 border border-amber-900/20 text-[#4A0E0E] rounded-2xl text-xs font-black transition-all flex items-center gap-2 shadow-sm"
        >
          <ArrowLeft size={16} strokeWidth={2.5} /> Back to All Customers
        </button>

        <span className="text-xs font-black text-[#4A0E0E] bg-[#FFD700] px-3.5 py-1.5 rounded-full border border-amber-400 shadow-sm">
          Customer Record #{customer.id}
        </span>
      </div>

      {/* Customer Full Profile Card (Warm Light Theme) */}
      <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-3xl text-gray-900 shadow-md border-2 border-amber-900/15 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-[#4A0E0E] via-[#701515] to-amber-700 text-[#FFD700] font-serif font-black text-4xl sm:text-5xl flex items-center justify-center shadow-lg shrink-0 border-2 border-amber-400/50">
              {customer.name.charAt(0)}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-serif font-black text-gray-900">{customer.name}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm ${
                  customer.status === 'VIP' ? 'bg-purple-100 text-purple-900 border border-purple-300' :
                  customer.status === 'Wholesale' ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                  customer.status === 'New' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                  'bg-amber-100 text-amber-950 border border-amber-300'
                }`}>
                  {customer.status} Buyer
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold text-gray-700 flex-wrap pt-1">
                <span className="flex items-center gap-1.5 text-gray-800"><Phone size={14} className="text-emerald-700" /> {customer.phone}</span>
                <span className="text-gray-400">•</span>
                <span className="flex items-center gap-1.5 text-gray-800"><Mail size={14} className="text-amber-800" /> {customer.email}</span>
                <span className="text-gray-400">•</span>
                <span className="flex items-center gap-1.5 text-gray-800"><MapPin size={14} className="text-rose-700" /> {customer.location}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`https://wa.me/91${customer.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(customer.name)},%20special%20festive%20offers%20from%20Karuppa%20Crackers!`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-[#25D366] hover:bg-[#1ebd53] text-white rounded-2xl font-black text-xs shadow-md flex items-center gap-2 transform hover:scale-105 transition-all"
            >
              <Send size={16} /> Send WhatsApp Offer
            </a>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-amber-900/15">
          <div className="bg-white p-4 rounded-2xl border border-amber-900/10 shadow-sm space-y-1">
            <p className="text-[10px] font-black uppercase text-amber-950 tracking-wider">Total Lifetime Orders</p>
            <p className="text-2xl font-black text-gray-900">{customer.totalOrders} Orders</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-amber-900/10 shadow-sm space-y-1">
            <p className="text-[10px] font-black uppercase text-amber-950 tracking-wider">Total Lifetime Revenue</p>
            <p className="text-2xl font-black text-[#c00000]">₹{customer.totalSpent.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-amber-900/10 shadow-sm space-y-1">
            <p className="text-[10px] font-black uppercase text-amber-950 tracking-wider">Average Order Value</p>
            <p className="text-2xl font-black text-emerald-800">₹{(customer.totalSpent / (customer.totalOrders || 1)).toFixed(0).toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-amber-900/10 shadow-sm space-y-1">
            <p className="text-[10px] font-black uppercase text-amber-950 tracking-wider">Customer Registered</p>
            <p className="text-base font-black text-gray-900">{customer.registeredDate}</p>
          </div>
        </div>
      </div>

      {/* Customer Invoices & Order History Table */}
      <div className="bg-[#FAF7F2] rounded-3xl border-2 border-amber-900/15 overflow-hidden shadow-sm space-y-0">
        <div className="p-6 bg-gradient-to-r from-[#4A0E0E] via-[#5C1212] to-[#3B0B0B] border-b-2 border-amber-400/40 text-white flex items-center justify-between">
          <div>
            <h3 className="text-xl font-serif font-black text-white flex items-center gap-2">
              🧾 Customer Invoices & Bills History ({customer.orders.length})
            </h3>
            <p className="text-amber-200 font-medium text-xs mt-0.5">Click any invoice to view and print complete itemized tax bill details</p>
          </div>
          <span className="bg-[#FFD700] text-[#4A0E0E] text-xs font-black px-4 py-1.5 rounded-full shadow-md">
            Total Billed: ₹{customer.totalSpent.toLocaleString()}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bold text-gray-800">
            <thead className="bg-[#3B0B0B] text-white uppercase text-xs font-black tracking-wider border-b-2 border-amber-400">
              <tr>
                <th className="py-4 px-6">Invoice Order ID</th>
                <th className="py-4 px-6">Order Date</th>
                <th className="py-4 px-6">Items Purchased</th>
                <th className="py-4 px-6">Payment Mode</th>
                <th className="py-4 px-6 text-right">Total Bill (₹)</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-center">Invoice Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-900/10">
              {customer.orders.map((inv, idx) => (
                <tr 
                  key={inv.orderId}
                  onClick={() => setSelectedInvoice(inv)}
                  className={`hover:bg-amber-100/60 transition-colors cursor-pointer ${idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF7F2]'}`}
                >
                  <td className="py-4 px-6 font-black text-[#4A0E0E] text-sm">{inv.orderId}</td>
                  <td className="py-4 px-6 font-bold text-gray-600">{inv.date}</td>
                  <td className="py-4 px-6">
                    <p className="font-black text-gray-900 line-clamp-1">{inv.items.map(i => `${i.name} (x${i.qty})`).join(', ')}</p>
                    <span className="text-[10px] text-amber-900 font-bold">{inv.items.length} Product Types</span>
                  </td>
                  <td className="py-4 px-6 font-bold text-gray-700">{inv.paymentMode}</td>
                  <td className="py-4 px-6 text-right font-black text-[#c00000] text-base">₹{inv.grandTotal.toLocaleString()}</td>
                  <td className="py-4 px-6 text-center">
                    <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-full font-black text-[10px] uppercase">
                      {inv.paymentStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-4 py-2 bg-[#4A0E0E] hover:bg-red-950 text-white rounded-xl font-black text-xs shadow-sm flex items-center gap-1.5 mx-auto transition-transform transform hover:scale-105"
                    >
                      <Eye size={14} /> View Full Bill
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL TAX INVOICE MODAL POPUP & PRINT VIEW */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000001] flex items-center justify-center p-4 sm:p-6 overflow-y-auto no-print">
          <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-gray-300 relative overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Top Header Controls */}
            <div className="p-4 bg-gradient-to-r from-[#4A0E0E] to-[#2B0808] text-white flex justify-between items-center shrink-0 border-b-2 border-amber-400">
              <div className="flex items-center gap-2">
                <FileText className="text-[#FFD700]" size={20} />
                <h3 className="font-serif font-black text-lg text-white">
                  Official Customer Tax Invoice — #{selectedInvoice.orderId}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleDownloadInvoice(selectedInvoice)}
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
                  onClick={() => setSelectedInvoice(null)}
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
                    OFFICIAL TAX INVOICE
                  </span>
                  <p className="text-xs font-bold text-gray-800">Invoice No: <span className="font-black text-gray-900">#{selectedInvoice.orderId}</span></p>
                  <p className="text-xs text-gray-600">Date: <span className="font-bold text-gray-800">{selectedInvoice.date}</span></p>
                  <p className="text-xs text-gray-600">Payment Status: <span className="font-black text-emerald-800 uppercase">{selectedInvoice.paymentStatus}</span></p>
                </div>
              </div>

              {/* Billed To & Store Grid */}
              <div className="grid grid-cols-2 gap-6 border-b-2 border-gray-900 pb-6 mb-6 text-xs">
                <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-900/15">
                  <h3 className="font-black uppercase text-[#4A0E0E] text-xs border-b border-amber-900/20 pb-1 mb-2">CUSTOMER DETAILS (BILLED TO)</h3>
                  <p className="font-black text-sm text-gray-900">{customer.name}</p>
                  <p className="text-gray-700 font-bold mt-1">Phone: {customer.phone}</p>
                  <p className="text-gray-700 font-bold">Email: {customer.email}</p>
                  <p className="text-gray-700 font-medium">Location: {customer.location}</p>
                </div>

                <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-900/15">
                  <h3 className="font-black uppercase text-[#4A0E0E] text-xs border-b border-amber-900/20 pb-1 mb-2">STORE DISPATCH LOCATION</h3>
                  <p className="text-gray-900 font-bold leading-relaxed">Karuppa Crackers Main Retail Store & Warehouse Hub, Sivakasi</p>
                  <p className="text-gray-700 font-bold mt-2">Payment Mode: {selectedInvoice.paymentMode}</p>
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
                  {selectedInvoice.items.map((item, idx) => (
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
                    <p className="font-black text-gray-900 uppercase text-[10px]">Payment & Dispatch Summary</p>
                    <p className="text-gray-700">Payment Mode: <span className="font-bold">{selectedInvoice.paymentMode}</span></p>
                    <p className="text-gray-700">Billing Cashier: <span className="font-bold">Mahesh Admin</span></p>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-gray-700 font-medium">
                    <p className="font-black text-gray-900 mb-0.5">Safety Instructions:</p>
                    Burst crackers strictly outdoors under adult supervision. Keep water nearby.
                  </div>
                </div>

                <div className="w-80 space-y-1.5 text-xs font-bold text-gray-800">
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span>Items Subtotal:</span>
                    <span className="font-black text-gray-900">₹{selectedInvoice.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200 text-emerald-700">
                    <span>Special Discount:</span>
                    <span>-₹{selectedInvoice.discount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span>CGST (9%):</span>
                    <span>₹{(selectedInvoice.gst / 2).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-200">
                    <span>SGST (9%):</span>
                    <span>₹{(selectedInvoice.gst / 2).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t-2 border-gray-900 text-base font-black text-gray-900 bg-amber-100/70 px-3 rounded-lg mt-2">
                    <span>NET BILL PAID:</span>
                    <span className="text-[#c00000]">₹{selectedInvoice.grandTotal.toLocaleString()}</span>
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

      {/* DEDICATED PRINTABLE TAX INVOICE (Visible ONLY in browser print dialog) */}
      {selectedInvoice && (
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
                OFFICIAL TAX INVOICE
              </span>
              <p className="text-xs font-bold text-gray-800">Invoice No: <span className="font-black text-gray-900">#{selectedInvoice.orderId}</span></p>
              <p className="text-xs text-gray-600">Date: <span className="font-bold text-gray-800">{selectedInvoice.date}</span></p>
              <p className="text-xs text-gray-600">Payment Status: <span className="font-black text-emerald-800 uppercase">{selectedInvoice.paymentStatus}</span></p>
            </div>
          </div>

          {/* Billed To & Store Grid */}
          <div className="grid grid-cols-2 gap-6 border-b-2 border-gray-900 pb-6 mb-6 text-xs">
            <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-900/15">
              <h3 className="font-black uppercase text-[#4A0E0E] text-xs border-b border-amber-900/20 pb-1 mb-2">CUSTOMER DETAILS (BILLED TO)</h3>
              <p className="font-black text-sm text-gray-900">{customer.name}</p>
              <p className="text-gray-700 font-bold mt-1">Phone: {customer.phone}</p>
              <p className="text-gray-700 font-bold">Email: {customer.email}</p>
              <p className="text-gray-700 font-medium">Location: {customer.location}</p>
            </div>

            <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-900/15">
              <h3 className="font-black uppercase text-[#4A0E0E] text-xs border-b border-amber-900/20 pb-1 mb-2">STORE DISPATCH LOCATION</h3>
              <p className="text-gray-900 font-bold leading-relaxed">Karuppa Crackers Main Retail Store & Warehouse Hub, Sivakasi</p>
              <p className="text-gray-700 font-bold mt-2">Payment Mode: {selectedInvoice.paymentMode}</p>
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
              {selectedInvoice.items.map((item, idx) => (
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
                <p className="font-black text-gray-900 uppercase text-[10px]">Payment & Dispatch Summary</p>
                <p className="text-gray-700">Payment Mode: <span className="font-bold">{selectedInvoice.paymentMode}</span></p>
                <p className="text-gray-700">Billing Cashier: <span className="font-bold">Mahesh Admin</span></p>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-gray-700 font-medium">
                <p className="font-black text-gray-900 mb-0.5">Safety Instructions:</p>
                Burst crackers strictly outdoors under adult supervision. Keep water nearby.
              </div>
            </div>

            <div className="w-80 space-y-1.5 text-xs font-bold text-gray-800">
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span>Items Subtotal:</span>
                <span className="font-black text-gray-900">₹{selectedInvoice.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200 text-emerald-700">
                <span>Special Discount:</span>
                <span>-₹{selectedInvoice.discount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span>CGST (9%):</span>
                <span>₹{(selectedInvoice.gst / 2).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span>SGST (9%):</span>
                <span>₹{(selectedInvoice.gst / 2).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-t-2 border-gray-900 text-base font-black text-gray-900 bg-amber-100/70 px-3 rounded-lg mt-2">
                <span>NET BILL PAID:</span>
                <span className="text-[#c00000]">₹{selectedInvoice.grandTotal.toLocaleString()}</span>
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
      )}
    </div>
  );
};

export default AdminCustomerDetails;
