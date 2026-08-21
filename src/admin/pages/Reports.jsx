import { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, PieChart, Download, Calendar, 
  ArrowUpRight, Award, ShieldCheck, FileText, CheckCircle2, Flame, 
  ChevronDown, Check, Users, ShoppingBag, Package, MessageCircle, Phone, 
  Filter, Layers, Receipt, ArrowUpDown, ArrowUp, ArrowDown, ExternalLink,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react';
import { subscribeOrders, subscribeExpenses, subscribeProducts, subscribeCustomers } from '../../services/firebaseService';
import { generateReportPdf } from '../../utils/generateReportPdf';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminReports = () => {
  const { showToast } = useToast();
  // Report Filter & Selection States
  const [reportType, setReportType] = useState('pnl'); // 'pnl' | 'customers' | 'products' | 'invoices'
  const [showReportTypeDropdown, setShowReportTypeDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [reportType]);

  const reportDropdownRef = useRef(null);

  // Firestore Real-time Collections
  const [orders, setOrders] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const unsubOrders = subscribeOrders((data) => {
      setOrders(data || []);
      setIsLoading(false);
    });
    const unsubExpenses = subscribeExpenses((data) => setExpenses(data || []));
    const unsubProducts = subscribeProducts((data) => setProducts(data || []));
    const unsubCustomers = subscribeCustomers((data) => setCustomers(data || []));

    return () => {
      unsubOrders();
      unsubExpenses();
      unsubProducts();
      unsubCustomers();
    };
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (reportDropdownRef.current && !reportDropdownRef.current.contains(event.target)) {
        setShowReportTypeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper to extract numeric amount from order
  const getOrderAmount = (o) => {
    if (!o) return 0;
    if (typeof o.grandTotal === 'number') return o.grandTotal;
    if (typeof o.totalAmount === 'number') return o.totalAmount;
    if (typeof o.amount === 'number') return o.amount;
    const str = String(o.grandTotal || o.totalAmount || o.amount || 0);
    return parseFloat(str.replace(/[^\d.]/g, '')) || 0;
  };

  // 1. FINANCIAL PROFIT & LOSS METRICS
  const grossRevenue = orders.reduce((sum, o) => sum + getOrderAmount(o), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e?.amount || 0), 0);
  const netProfit = grossRevenue - totalExpenses;
  const profitMarginPercent = grossRevenue > 0 ? ((netProfit / grossRevenue) * 100).toFixed(1) : '0.0';

  // 2. PRODUCT SALES PERFORMANCE REPORT DATA
  const productPerformanceList = (products || []).map(p => {
    let unitsSold = 0;
    let productRevenue = 0;

    (orders || []).forEach(o => {
      const items = Array.isArray(o.items) ? o.items : [];
      items.forEach(item => {
        if (item.id === p.id || item.name === p.name) {
          const qty = item.quantity || item.qty || 1;
          const price = typeof item.price === 'number' ? item.price : (parseFloat(String(item.price || 0).replace(/[^\d.]/g, '')) || p.price || 0);
          unitsSold += qty;
          productRevenue += (qty * price);
        }
      });
    });

    const cost = p.costPrice || p.cost || Math.round((p.price || 0) * 0.6);
    const profitPerUnit = (p.price || 0) - cost;
    const profitPct = (p.price || 0) > 0 ? ((profitPerUnit / (p.price || 1)) * 100).toFixed(0) + '%' : '0%';

    return {
      sku: String(p.id || 'PRD-000'),
      name: String(p.name || 'Firework Crackers'),
      category: String(p.category || 'General'),
      stock: p.stock !== undefined ? p.stock : (p.currentStock || 0),
      unitsSold: unitsSold,
      revenue: productRevenue > 0 ? productRevenue : (unitsSold * (p.price || 0)),
      costPrice: cost,
      profitMargin: profitPct
    };
  }).sort((a, b) => b.unitsSold - a.unitsSold || b.revenue - a.revenue);

  // 3. CUSTOMER DIRECTORY REPORT DATA
  const customerReportList = (() => {
    const custMap = new Map();

    (orders || []).forEach(o => {
      const phoneStr = String(o.phone || o.whatsapp || o.customerPhone || '9943852902').trim();
      const nameStr = String(o.customer || o.customerName || 'Valued Customer');
      const amount = getOrderAmount(o);
      const isOffline = Boolean(o.isOffline);

      const addressStr = String(o.address || o.shippingAddress || o.location || o.city || (isOffline ? 'Sivakasi Outlet' : 'Tamil Nadu'));

      if (!custMap.has(phoneStr)) {
        custMap.set(phoneStr, {
          id: `CUST-${phoneStr.length > 4 ? phoneStr.slice(-4) : '1001'}`,
          name: nameStr,
          phone: phoneStr,
          totalOrders: 1,
          totalSpent: amount,
          lastOrderDate: o.createdAt || o.date || 'Recent',
          address: addressStr,
          type: isOffline ? 'Counter POS' : 'Online Website'
        });
      } else {
        const existing = custMap.get(phoneStr);
        existing.totalOrders = (existing.totalOrders || 0) + 1;
        existing.totalSpent = (existing.totalSpent || 0) + amount;
        if (addressStr && addressStr !== 'Sivakasi Outlet') {
          existing.address = addressStr;
        }
      }
    });

    (customers || []).forEach(c => {
      const phoneStr = String(c.phone || c.id || 'Customer').trim();
      const addressStr = String(c.location || c.address || c.city || 'Sivakasi, Tamil Nadu');
      if (!custMap.has(phoneStr)) {
        custMap.set(phoneStr, {
          id: String(c.id || `CUST-${phoneStr.length > 4 ? phoneStr.slice(-4) : '1001'}`),
          name: String(c.name || c.customerName || 'Store Customer'),
          phone: phoneStr,
          totalOrders: Number(c.totalOrders || 0),
          totalSpent: Number(c.totalSpent || 0),
          lastOrderDate: c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : 'Registered Customer',
          address: addressStr,
          type: 'Registered Member'
        });
      } else {
        const existing = custMap.get(phoneStr);
        if (addressStr && !existing.address) {
          existing.address = addressStr;
        }
      }
    });

    return Array.from(custMap.values()).sort((a, b) => Number(b.totalSpent || 0) - Number(a.totalSpent || 0));
  })();

  // 4. INVOICE HISTORY REPORT DATA
  const invoiceReportList = (orders || []).map(o => {
    const invId = String(o.id || o.orderId || 'ORD-000');
    const amount = getOrderAmount(o);
    const estCost = Math.round(amount * 0.6);
    const estProfit = amount - estCost;

    let formattedDate = 'Today';
    if (o.createdAt) {
      if (typeof o.createdAt?.toDate === 'function') {
        formattedDate = o.createdAt.toDate().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' });
      } else {
        const parsed = new Date(o.createdAt);
        formattedDate = !isNaN(parsed.getTime()) ? parsed.toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : String(o.createdAt);
      }
    } else if (o.date) {
      formattedDate = String(o.date);
    }

    return {
      id: invId,
      customer: String(o.customer || o.customerName || 'Walk-in Customer'),
      phone: String(o.phone || o.whatsapp || 'N/A'),
      date: formattedDate,
      paymentMode: String(o.paymentMode || (o.isOffline ? 'Cash on Counter' : 'Online / UPI')),
      itemsCount: Array.isArray(o.items) ? o.items.reduce((sum, item) => sum + (item.quantity || item.qty || 1), 0) : (o.itemsCount || 1),
      amount: amount,
      profit: estProfit,
      isOffline: Boolean(o.isOffline)
    };
  }).sort((a, b) => b.id.localeCompare(a.id));

  // Paginated Data Slices for All 4 Tables
  const pnlStartIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPnl = productPerformanceList.slice(pnlStartIndex, pnlStartIndex + itemsPerPage);
  const pnlTotalPages = Math.ceil(productPerformanceList.length / itemsPerPage) || 1;

  const custStartIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = customerReportList.slice(custStartIndex, custStartIndex + itemsPerPage);
  const custTotalPages = Math.ceil(customerReportList.length / itemsPerPage) || 1;

  const prodStartIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = productPerformanceList.slice(prodStartIndex, prodStartIndex + itemsPerPage);
  const prodTotalPages = Math.ceil(productPerformanceList.length / itemsPerPage) || 1;

  const invStartIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = invoiceReportList.slice(invStartIndex, invStartIndex + itemsPerPage);
  const invTotalPages = Math.ceil(invoiceReportList.length / itemsPerPage) || 1;

  // Reusable Bottom Pagination Footer Bar Component matching Products.jsx
  const renderPaginationFooter = (totalCount, startIndex, totalPages) => (
    <div className="p-4 bg-[#FAF7F2] border-t border-amber-900/10 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-xs font-bold text-gray-700">
        Showing <span className="font-black text-[#4A0E0E]">{totalCount > 0 ? startIndex + 1 : 0}</span> to <span className="font-black text-[#4A0E0E]">{Math.min(startIndex + itemsPerPage, totalCount)}</span> of <span className="font-black text-[#4A0E0E]">{totalCount}</span> items
      </div>

      <div className="flex items-center gap-1">
        {/* First Page << */}
        <button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-xl text-xs font-black bg-white border border-amber-900/15 text-gray-700 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center cursor-pointer"
          title="First Page"
        >
          <ChevronsLeft size={16} strokeWidth={2.5} />
        </button>

        {/* Previous Page < */}
        <button
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-xl text-xs font-black bg-white border border-amber-900/15 text-gray-700 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center cursor-pointer"
          title="Previous Page"
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-8 h-8 rounded-xl text-xs font-black transition-all border shadow-sm cursor-pointer ${
              currentPage === page
                ? 'bg-[#4A0E0E] text-white border-[#4A0E0E]'
                : 'bg-white text-gray-800 border-amber-900/15 hover:bg-amber-100'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next Page > */}
        <button
          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl text-xs font-black bg-white border border-amber-900/15 text-gray-700 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center cursor-pointer"
          title="Next Page"
        >
          <ChevronRight size={16} strokeWidth={2.5} />
        </button>

        {/* Last Page >> */}
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl text-xs font-black bg-white border border-amber-900/15 text-gray-700 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center cursor-pointer"
          title="Last Page"
        >
          <ChevronsRight size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );

  // MAIN PDF REPORT EXPORT FUNCTION (Triggers Direct On-Page PDF File Download)
  const handleExportPDF = () => {
    try {
      const downloadedFileName = generateReportPdf({
        reportType,
        grossRevenue,
        totalExpenses,
        netProfit,
        profitMarginPercent,
        ordersCount: orders.length,
        expensesCount: expenses.length,
        productPerformanceList,
        customerReportList,
        invoiceReportList
      });
      const reportNames = {
        pnl: 'Profit & Loss Statement',
        customers: 'Customer Directory Report',
        products: 'Product Sales Performance Report',
        invoices: 'Invoice Audit Log'
      };
      showToast(`🎉 ${reportNames[reportType] || 'Business Report'} downloaded successfully!`, 'success');
    } catch (err) {
      console.error("PDF Export error:", err);
      showToast("Failed to generate PDF report", "error");
    }
  };

  const reportTypeOptions = [
    { id: 'pnl', label: 'Profit & Loss & Sales Revenue', shortLabel: 'Profit & Loss', icon: TrendingUp, count: `₹${netProfit.toLocaleString()}` },
    { id: 'customers', label: 'Customer Details & Directory', shortLabel: 'Customer Directory', icon: Users, count: `${customerReportList.length} Customers` },
    { id: 'products', label: 'Product Sales Performance', shortLabel: 'Product Catalog', icon: Package, count: `${products.length} Products` },
    { id: 'invoices', label: 'Invoice & Profit Audit Log', shortLabel: 'Invoice Audit Log', icon: Receipt, count: `${orders.length} Invoices` }
  ];

  const currentReportObj = reportTypeOptions.find(r => r.id === reportType) || reportTypeOptions[0];

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-5 sm:space-y-8 pb-12 relative px-1 sm:px-0">

      {/* Ultra-Responsive Mobile Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#4A0E0E] via-[#701515] to-[#4A0E0E] p-4 sm:p-7 rounded-2xl sm:rounded-3xl shadow-lg text-white">
        <div>
          <h1 className="text-xl sm:text-3xl font-serif font-black tracking-wide text-white flex items-center gap-2 sm:gap-3">
            <PieChart className="text-[#FFD700] shrink-0" size={24} /> 
            <span>Business Analytics & Reports</span>
          </h1>
          <p className="text-amber-200/90 text-xs sm:text-sm mt-1 font-medium leading-snug">
            Select report view, inspect live metrics, and download official PDF statements.
          </p>
        </div>

        {/* Action Controls for Mobile & Desktop */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto">
          {/* Report Type Selector Dropdown */}
          <div ref={reportDropdownRef} className="relative w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setShowReportTypeDropdown(!showReportTypeDropdown)}
              className="w-full sm:w-auto px-3.5 sm:px-4 py-2.5 bg-white border-2 border-amber-900/20 hover:border-[#FFD700] rounded-xl sm:rounded-2xl font-black text-gray-900 text-xs shadow-sm transition-all flex items-center justify-between gap-2 cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate">
                <currentReportObj.icon size={15} className="text-[#4A0E0E] shrink-0" />
                <span className="truncate">{currentReportObj.shortLabel}</span>
              </div>
              <ChevronDown size={15} className={`text-[#4A0E0E] shrink-0 transition-transform stroke-[2.5] ${showReportTypeDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showReportTypeDropdown && (
              <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-full sm:w-72 bg-white border-2 border-amber-900/20 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 space-y-1">
                <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between text-[#4A0E0E] font-black text-xs uppercase tracking-wider">
                  <span>Select Report Type</span>
                  <Filter size={14} className="text-[#4A0E0E]" />
                </div>
                <div className="space-y-1 pt-1">
                  {reportTypeOptions.map((opt) => {
                    const IconComp = opt.icon;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setReportType(opt.id);
                          setShowReportTypeDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-between ${
                          reportType === opt.id
                            ? 'bg-[#4A0E0E] text-[#FFD700] shadow-md'
                            : 'text-gray-800 hover:bg-amber-100/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <IconComp size={15} className={reportType === opt.id ? 'text-[#FFD700]' : 'text-amber-800'} />
                          <span className="truncate">{opt.label}</span>
                        </div>
                        {reportType === opt.id && <Check size={14} strokeWidth={3} className="shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Download PDF Button */}
          <button 
            type="button"
            onClick={handleExportPDF}
            className="w-full sm:w-auto justify-center bg-[#FFD700] hover:bg-amber-400 text-[#4A0E0E] px-4 py-2.5 rounded-xl sm:rounded-2xl font-black text-xs shadow-md flex items-center gap-1.5 transition-all transform active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Download size={16} /> Download PDF Report
          </button>
        </div>
      </div>



      {/* Main Report Body / Loading State */}
      {isLoading ? (
        <LoadingSpinner message="Calculating analytics and generating reports from database..." />
      ) : (
        <>
          {/* -------------------------------------------------------------------------- */}
          {/* 1. PROFIT & LOSS VIEW */}
          {/* -------------------------------------------------------------------------- */}
          {reportType === 'pnl' && (
            <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <div className="bg-[#FAF7F2] p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-amber-900/15 shadow-sm space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-black text-amber-950 uppercase tracking-wider">Gross Revenue</span>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                  <DollarSign size={18} />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-gray-900">₹{grossRevenue.toLocaleString()}</p>
              <p className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                <ArrowUpRight size={14} /> {orders.length} Total Orders
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-rose-900/20 shadow-sm space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-black text-rose-950 uppercase tracking-wider">Total Store Expenses</span>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center font-black">
                  <TrendingDown size={18} />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-rose-700">₹{totalExpenses.toLocaleString()}</p>
              <p className="text-gray-600 text-xs font-bold">{expenses.length} Store Expenses</p>
            </div>

            <div className="bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-amber-400 shadow-md space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-black text-[#4A0E0E] uppercase tracking-wider">Net Realized Profit</span>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#4A0E0E] text-[#FFD700] flex items-center justify-center font-black">
                  <Award size={18} />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-[#c00000]">₹{netProfit.toLocaleString()}</p>
              <p className="text-emerald-800 text-xs font-black flex items-center gap-1">
                <ArrowUpRight size={14} /> Net Margin: {profitMarginPercent}%
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-amber-900/15 shadow-sm space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-black text-amber-950 uppercase tracking-wider">Business Health</span>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center font-black">
                  <ShieldCheck size={18} />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-gray-900">{profitMarginPercent}%</p>
              <p className="text-emerald-700 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 size={14} /> Live Firestore Financial Sync
              </p>
            </div>
          </div>

          <div className="bg-[#FAF7F2] rounded-2xl sm:rounded-3xl border-2 border-amber-900/15 overflow-hidden shadow-sm">
            <div className="p-4 sm:p-6 bg-gradient-to-r from-[#4A0E0E] via-[#5C1212] to-[#3B0B0B] border-b-2 border-amber-400/40 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base sm:text-xl font-serif font-black text-white flex items-center gap-2">
                  <Flame className="text-[#FFD700]" size={18} /> Product Sales & Profit Contribution
                </h3>
                <p className="text-amber-200 font-medium text-[11px] sm:text-xs mt-0.5">Live store catalog items synced from backend database</p>
              </div>
              <span className="bg-[#FFD700] text-[#4A0E0E] text-[10px] sm:text-xs font-black px-3 py-1 rounded-full shadow-md self-start sm:self-auto">
                Catalog Items ({productPerformanceList.length})
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-bold text-gray-800">
                <thead className="bg-[#3B0B0B] text-white uppercase text-[10px] sm:text-xs font-black tracking-wider border-b-2 border-amber-400">
                  <tr>
                    <th className="py-3 sm:py-4 px-4 sm:px-6">SKU Code</th>
                    <th className="py-3 sm:py-4 px-4 sm:px-6">Product Name</th>
                    <th className="py-3 sm:py-4 px-4 sm:px-6">Category</th>
                    <th className="py-3 sm:py-4 px-4 sm:px-6 text-center">Units Sold</th>
                    <th className="py-3 sm:py-4 px-4 sm:px-6 text-right">Total Revenue</th>
                    <th className="py-3 sm:py-4 px-4 sm:px-6 text-right">Profit Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-900/10">
                  {paginatedPnl.map((p, idx) => (
                    <tr key={p.sku} className={`hover:bg-amber-100/70 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF7F2]'}`}>
                      <td className="py-3.5 px-4 sm:px-6 font-black text-[#4A0E0E] text-xs">{p.sku}</td>
                      <td className="py-3.5 px-4 sm:px-6 font-black text-gray-900 text-xs sm:text-sm">{p.name}</td>
                      <td className="py-3.5 px-4 sm:px-6">
                        <span className="bg-amber-200/90 text-[#4A0E0E] px-2.5 py-0.5 rounded-full border border-amber-300 font-black text-[10px] sm:text-xs">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-center font-black text-gray-900 text-xs sm:text-sm">{p.unitsSold} units</td>
                      <td className="py-3.5 px-4 sm:px-6 text-right font-black text-[#c00000] text-sm sm:text-base">₹{p.revenue.toLocaleString()}</td>
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <span className="bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full font-black border border-emerald-300 text-[10px] sm:text-xs">
                          {p.profitMargin}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Pagination Bar */}
            {renderPaginationFooter(productPerformanceList.length, pnlStartIndex, pnlTotalPages)}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* 2. CUSTOMER DETAILS & DIRECTORY VIEW */}
      {/* -------------------------------------------------------------------------- */}
      {reportType === 'customers' && (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
            <div className="bg-[#FAF7F2] p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-amber-900/15 shadow-sm space-y-2">
              <span className="text-[11px] sm:text-xs font-black text-amber-950 uppercase tracking-wider">Total Active Customers</span>
              <p className="text-2xl sm:text-3xl font-black text-gray-900">{customerReportList.length} Customers</p>
              <p className="text-emerald-700 text-xs font-bold">Synced from Orders & Customer DB</p>
            </div>

            <div className="bg-[#FAF7F2] p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-amber-900/15 shadow-sm space-y-2">
              <span className="text-[11px] sm:text-xs font-black text-amber-950 uppercase tracking-wider">Total Customer Orders</span>
              <p className="text-2xl sm:text-3xl font-black text-[#4A0E0E]">{orders.length} Orders</p>
              <p className="text-amber-800 text-xs font-bold">Lifetime combined store orders</p>
            </div>

            <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-amber-400 shadow-md space-y-2">
              <span className="text-[11px] sm:text-xs font-black text-[#4A0E0E] uppercase tracking-wider">Customer Lifetime Revenue</span>
              <p className="text-2xl sm:text-3xl font-black text-[#c00000]">₹{grossRevenue.toLocaleString()}</p>
              <p className="text-emerald-900 text-xs font-black">Avg Spend: ₹{customerReportList.length > 0 ? Math.round(grossRevenue / customerReportList.length).toLocaleString() : 0}</p>
            </div>
          </div>

          <div className="bg-[#FAF7F2] rounded-2xl sm:rounded-3xl border-2 border-amber-900/15 overflow-hidden shadow-sm">
            <div className="p-4 sm:p-6 bg-gradient-to-r from-[#4A0E0E] via-[#5C1212] to-[#3B0B0B] border-b-2 border-amber-400/40 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base sm:text-xl font-serif font-black text-white flex items-center gap-2">
                  <Users className="text-[#FFD700]" size={18} /> Customer Directory & Lifetime Spent
                </h3>
                <p className="text-amber-200 font-medium text-[11px] sm:text-xs mt-0.5">List of all registered website and counter POS customers</p>
              </div>
              <span className="bg-[#FFD700] text-[#4A0E0E] text-[10px] sm:text-xs font-black px-3 py-1 rounded-full shadow-md self-start sm:self-auto">
                {customerReportList.length} Customer Records
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-bold text-gray-800">
                <thead className="bg-[#3B0B0B] text-white uppercase text-[10px] sm:text-xs font-black tracking-wider border-b-2 border-amber-400">
                  <tr>
                    <th className="py-3 sm:py-4 px-4 sm:px-6">Customer Name</th>
                    <th className="py-3 sm:py-4 px-4 sm:px-6">Phone / WhatsApp</th>
                    <th className="py-3 sm:py-4 px-4 sm:px-6 text-center">Total Orders</th>
                    <th className="py-3 sm:py-4 px-4 sm:px-6 text-right">Total Spent</th>
                    <th className="py-3 sm:py-4 px-4 sm:px-6">Place / Address</th>
                    <th className="py-3 sm:py-4 px-4 sm:px-6 text-center">Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-900/10">
                  {paginatedCustomers.map((c, idx) => (
                    <tr key={c.phone || idx} className={`hover:bg-amber-100/70 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF7F2]'}`}>
                      <td className="py-3.5 px-4 sm:px-6 font-black text-gray-900 text-xs sm:text-sm">{c.name}</td>
                      <td className="py-3.5 px-4 sm:px-6 font-black text-amber-900">{c.phone}</td>
                      <td className="py-3.5 px-4 sm:px-6 text-center font-black text-gray-900 text-xs sm:text-sm">{c.totalOrders} Orders</td>
                      <td className="py-3.5 px-4 sm:px-6 text-right font-black text-[#c00000] text-sm sm:text-base">₹{c.totalSpent.toLocaleString()}</td>
                      <td className="py-3.5 px-4 sm:px-6">
                        <span className="bg-amber-100/80 text-gray-900 px-2.5 py-1 rounded-xl border border-amber-300/80 font-bold text-xs">
                          {c.address || 'Sivakasi'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-center">
                        <a
                          href={`https://wa.me/91${c.phone.replace(/[^\d]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-black shadow-sm transition-all"
                        >
                          <MessageCircle size={13} /> Chat
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Pagination Bar */}
            {renderPaginationFooter(customerReportList.length, custStartIndex, custTotalPages)}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* 3. PRODUCT PERFORMANCE VIEW */}
      {/* -------------------------------------------------------------------------- */}
      {reportType === 'products' && (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
            <div className="bg-[#FAF7F2] p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-amber-900/15 shadow-sm space-y-2">
              <span className="text-[11px] sm:text-xs font-black text-amber-950 uppercase tracking-wider">Total Product SKU Catalog</span>
              <p className="text-2xl sm:text-3xl font-black text-gray-900">{products.length} Products</p>
              <p className="text-emerald-700 text-xs font-bold">Synced live from Firestore Product DB</p>
            </div>

            <div className="bg-[#FAF7F2] p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-amber-900/15 shadow-sm space-y-2">
              <span className="text-[11px] sm:text-xs font-black text-amber-950 uppercase tracking-wider">Total Fireworks Units Sold</span>
              <p className="text-2xl sm:text-3xl font-black text-[#4A0E0E]">
                {productPerformanceList.reduce((sum, p) => sum + p.unitsSold, 0)} Units
              </p>
              <p className="text-amber-800 text-xs font-bold">Across all sales channels</p>
            </div>

            <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-amber-400 shadow-md space-y-2">
              <span className="text-[11px] sm:text-xs font-black text-[#4A0E0E] uppercase tracking-wider">Product Sales Revenue</span>
              <p className="text-2xl sm:text-3xl font-black text-[#c00000]">₹{grossRevenue.toLocaleString()}</p>
              <p className="text-emerald-900 text-xs font-black truncate">Top Selling: {productPerformanceList[0]?.name || 'N/A'}</p>
            </div>
          </div>

          <div className="bg-[#FAF7F2] rounded-2xl sm:rounded-3xl border-2 border-amber-900/15 overflow-hidden shadow-sm">
            <div className="p-4 sm:p-6 bg-gradient-to-r from-[#4A0E0E] via-[#5C1212] to-[#3B0B0B] border-b-2 border-amber-400/40 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base sm:text-xl font-serif font-black text-white flex items-center gap-2">
                  <Package className="text-[#FFD700]" size={18} /> Product Catalog Sales Performance
                </h3>
                <p className="text-amber-200 font-medium text-[11px] sm:text-xs mt-0.5">Comprehensive audit of units sold, in-stock count, and total product sales</p>
              </div>
              <span className="bg-[#FFD700] text-[#4A0E0E] text-[10px] sm:text-xs font-black px-3 py-1 rounded-full shadow-md self-start sm:self-auto">
                {products.length} Fireworks SKUs
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-bold text-gray-800">
                <thead className="bg-[#3B0B0B] text-white uppercase text-[10px] sm:text-xs font-black tracking-wider border-b-2 border-amber-400">
                  <tr>
                    <th className="py-3 sm:py-4 px-4 sm:px-6">SKU Code</th>
                    <th className="py-3 sm:py-4 px-4 sm:px-6">Product Name</th>
                    <th className="py-3 sm:py-4 px-4 sm:px-6">Category</th>
                    <th className="py-3 sm:py-4 px-4 sm:px-6 text-center">In Stock</th>
                    <th className="py-3 sm:py-4 px-4 sm:px-6 text-center">Units Sold</th>
                    <th className="py-3 sm:py-4 px-4 sm:px-6 text-right">Total Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-900/10">
                  {paginatedProducts.map((p, idx) => (
                    <tr key={p.sku} className={`hover:bg-amber-100/70 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF7F2]'}`}>
                      <td className="py-3.5 px-4 sm:px-6 font-black text-[#4A0E0E] text-xs">{p.sku}</td>
                      <td className="py-3.5 px-4 sm:px-6 font-black text-gray-900 text-xs sm:text-sm">{p.name}</td>
                      <td className="py-3.5 px-4 sm:px-6">
                        <span className="bg-amber-200/90 text-[#4A0E0E] px-2.5 py-0.5 rounded-full border border-amber-300 font-black text-[10px] sm:text-xs">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-center font-black text-emerald-800 text-xs sm:text-sm">{p.stock} units</td>
                      <td className="py-3.5 px-4 sm:px-6 text-center font-black text-gray-900 text-xs sm:text-sm">{p.unitsSold} units</td>
                      <td className="py-3.5 px-4 sm:px-6 text-right font-black text-[#c00000] text-sm sm:text-base">₹{p.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Pagination Bar */}
            {renderPaginationFooter(productPerformanceList.length, prodStartIndex, prodTotalPages)}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------------- */}
      {/* 4. INVOICE HISTORY VIEW */}
      {/* -------------------------------------------------------------------------- */}
      {reportType === 'invoices' && (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
            <div className="bg-[#FAF7F2] p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-amber-900/15 shadow-sm space-y-2">
              <span className="text-[11px] sm:text-xs font-black text-amber-950 uppercase tracking-wider">Total Issued Invoices</span>
              <p className="text-2xl sm:text-3xl font-black text-gray-900">{invoiceReportList.length} Invoices</p>
              <p className="text-emerald-700 text-xs font-bold">Online & Counter POS Orders</p>
            </div>

            <div className="bg-[#FAF7F2] p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-amber-900/15 shadow-sm space-y-2">
              <span className="text-[11px] sm:text-xs font-black text-amber-950 uppercase tracking-wider">Total Invoiced Amount</span>
              <p className="text-2xl sm:text-3xl font-black text-[#4A0E0E]">₹{grossRevenue.toLocaleString()}</p>
              <p className="text-amber-800 text-xs font-bold">Gross combined invoiced revenue</p>
            </div>

            <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-amber-400 shadow-md space-y-2">
              <span className="text-[11px] sm:text-xs font-black text-[#4A0E0E] uppercase tracking-wider">Total Realized Profit</span>
              <p className="text-2xl sm:text-3xl font-black text-[#c00000]">₹{netProfit.toLocaleString()}</p>
              <p className="text-emerald-900 text-xs font-black">Margin: {profitMarginPercent}%</p>
            </div>
          </div>

          <div className="bg-[#FAF7F2] rounded-2xl sm:rounded-3xl border-2 border-amber-900/15 overflow-hidden shadow-sm">
            <div className="p-4 sm:p-6 bg-gradient-to-r from-[#4A0E0E] via-[#5C1212] to-[#3B0B0B] border-b-2 border-amber-400/40 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base sm:text-xl font-serif font-black text-white flex items-center gap-2">
                  <Receipt className="text-[#FFD700]" size={18} /> Invoice History & Realized Profit Log
                </h3>
                <p className="text-amber-200 font-medium text-[11px] sm:text-xs mt-0.5">Itemized transaction log of all store sales and invoice receipts</p>
              </div>
              <span className="bg-[#FFD700] text-[#4A0E0E] text-[10px] sm:text-xs font-black px-3 py-1 rounded-full shadow-md self-start sm:self-auto">
                {invoiceReportList.length} Invoices
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-bold text-gray-800">
                <thead className="bg-[#3B0B0B] text-white uppercase text-[10px] sm:text-xs font-black tracking-wider border-b-2 border-amber-400">
                  <tr>
                    <th className="py-3 sm:py-4 px-4 sm:px-6">Invoice ID</th>
                    <th className="py-3 sm:py-4 px-4 sm:px-6">Date & Time</th>
                    <th className="py-3 sm:py-4 px-4 sm:px-6">Customer Name</th>
                    <th className="py-3 sm:py-4 px-4 sm:px-6">Payment Mode</th>
                    <th className="py-3 sm:py-4 px-4 sm:px-6 text-[#FFD700] text-right">Grand Total</th>
                    <th className="py-3 sm:py-4 px-4 sm:px-6 text-emerald-400 text-right">Est. Profit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-900/10">
                  {paginatedInvoices.map((inv, idx) => (
                    <tr key={inv.id || idx} className={`hover:bg-amber-100/70 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF7F2]'}`}>
                      <td className="py-3.5 px-4 sm:px-6 font-black text-[#4A0E0E] text-xs">{inv.id}</td>
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-gray-600">{inv.date}</td>
                      <td className="py-3.5 px-4 sm:px-6 font-black text-gray-900 text-xs sm:text-sm">{inv.customer}</td>
                      <td className="py-3.5 px-4 sm:px-6">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black border shadow-sm ${
                          inv.isOffline ? 'bg-amber-100 text-amber-950 border-amber-300' : 'bg-emerald-100 text-emerald-950 border-emerald-300'
                        }`}>
                          {inv.paymentMode}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right font-black text-[#c00000] text-sm sm:text-base">₹{inv.amount.toLocaleString()}</td>
                      <td className="py-3.5 px-4 sm:px-6 text-right font-black text-emerald-700 text-xs sm:text-sm">₹{inv.profit.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Pagination Bar */}
            {renderPaginationFooter(invoiceReportList.length, invStartIndex, invTotalPages)}
          </div>
        </div>
      )}
        </>
      )}
    </div>
  </>
);
};

export default AdminReports;
