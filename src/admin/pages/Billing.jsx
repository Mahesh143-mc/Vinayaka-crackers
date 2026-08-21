import { useState, useEffect, useRef } from 'react';
import { useOutletContext, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Edit3, X, AlertCircle } from 'lucide-react';
import { saveOrderToFirestore, subscribeProducts, subscribeOrders, subscribeCustomers } from '../../services/firebaseService';
import { printInvoicePdf, downloadInvoiceFile } from '../../utils/generateInvoicePdf';
import { useToast } from '../../context/ToastContext';
import { generateOrderId } from '../../utils/idGenerator';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Modular Sub-Components
import PosHeaderToolbar from '../components/billing/PosHeaderToolbar';
import ProductCatalogGrid from '../components/billing/ProductCatalogGrid';
import StickyCartBar from '../components/billing/StickyCartBar';
import CartReceiptDrawer from '../components/billing/CartReceiptDrawer';
import OrderConfirmModal from '../components/billing/OrderConfirmModal';
import OrderSuccessModal from '../components/billing/OrderSuccessModal';
import InvoiceModalPreview from '../components/billing/InvoiceModalPreview';

const AdminBilling = () => {
  const context = useOutletContext();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isDesktopSidebarExpanded = context?.isDesktopSidebarExpanded ?? true;
  const isFullscreenPos = context?.isFullscreenPos ?? false;
  const toggleFullscreen = context?.toggleFullscreen || (() => {});

  const [editingOrder, setEditingOrder] = useState(location.state?.editOrder || null);

  // Persistence State Hooks
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('karuppa_pos_view_mode') || 'grid';
    } catch {
      return 'grid';
    }
  });

  const [gridCols, setGridCols] = useState(() => {
    try {
      const saved = localStorage.getItem('karuppa_pos_grid_cols');
      return saved ? Number(saved) : 3;
    } catch {
      return 3;
    }
  });

  const [visibleColumns, setVisibleColumns] = useState(() => {
    try {
      const saved = localStorage.getItem('karuppa_pos_visible_cols');
      return saved ? JSON.parse(saved) : {
        id: true,
        image: true,
        name: true,
        category: true,
        price: true,
        stock: true,
        actions: true
      };
    } catch {
      return {
        id: true,
        image: true,
        name: true,
        category: true,
        price: true,
        stock: true,
        actions: true
      };
    }
  });

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('karuppa_pos_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [customerName, setCustomerName] = useState(() => {
    try {
      return localStorage.getItem('karuppa_pos_cust_name') || 'Walk-in Customer';
    } catch {
      return 'Walk-in Customer';
    }
  });

  const [customerPhone, setCustomerPhone] = useState(() => {
    try {
      return localStorage.getItem('karuppa_pos_cust_phone') || '';
    } catch {
      return '';
    }
  });

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  // UI Interactive States
  const [showColMenu, setShowColMenu] = useState(false);
  const [showCatMenu, setShowCatMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [isCartDrawerClosing, setIsCartDrawerClosing] = useState(false);
  const [catalog, setCatalog] = useState([]);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Initialize cart & customer info when editing an order
  useEffect(() => {
    if (location.state?.editOrder) {
      const target = location.state.editOrder;
      setEditingOrder(target);
      if (Array.isArray(target.items) && target.items.length > 0) {
        setCart(target.items.map(item => ({
          ...item,
          id: String(item.id || item.productId || `PRD-${Math.floor(Math.random()*1000)}`),
          name: item.name || item.title || 'Firework Product',
          price: typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^\d.]/g, '')) || 0,
          qty: item.quantity || item.qty || 1
        })));
      }
      if (target.customer || target.customerName) {
        setCustomerName(target.customer || target.customerName);
      }
      if (target.phone) {
        setCustomerPhone(target.phone);
      }
    }
  }, [location.state]);

  const catDropdownRef = useRef(null);
  const colDropdownRef = useRef(null);
  const customerDropdownRef = useRef(null);

  // Outside Click Ref Listeners
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (catDropdownRef.current && !catDropdownRef.current.contains(event.target)) {
        setShowCatMenu(false);
      }
      if (colDropdownRef.current && !colDropdownRef.current.contains(event.target)) {
        setShowColMenu(false);
      }
      if (customerDropdownRef.current && !customerDropdownRef.current.contains(event.target)) {
        setShowCustomerDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    try { localStorage.setItem('karuppa_pos_cart', JSON.stringify(cart)); } catch (e) { }
  }, [cart]);

  useEffect(() => {
    try { localStorage.setItem('karuppa_pos_cust_name', customerName); } catch (e) { }
  }, [customerName]);

  useEffect(() => {
    try { localStorage.setItem('karuppa_pos_cust_phone', customerPhone); } catch (e) { }
  }, [customerPhone]);

  useEffect(() => {
    try { localStorage.setItem('karuppa_pos_view_mode', viewMode); } catch (e) { }
  }, [viewMode]);

  useEffect(() => {
    try { localStorage.setItem('karuppa_pos_grid_cols', String(gridCols)); } catch (e) { }
  }, [gridCols]);

  useEffect(() => {
    try { localStorage.setItem('karuppa_pos_selected_cat', selectedCategory); } catch (e) { }
  }, [selectedCategory]);

  const [allOrders, setAllOrders] = useState([]);
  const [existingCustomers, setExistingCustomers] = useState([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(true);

  // Firestore Subscriptions
  useEffect(() => {
    const unsubscribe = subscribeProducts((firestoreProducts) => {
      if (firestoreProducts) setCatalog(firestoreProducts);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubOrders = subscribeOrders((firestoreOrders) => {
      if (Array.isArray(firestoreOrders)) {
        setAllOrders(firestoreOrders);
        const customerMap = new Map();
        firestoreOrders.forEach(order => {
          const phone = (order.phone || '').trim();
          const name = (order.customer || '').trim();
          if (phone && phone !== 'Walk-in Customer' && name && name !== 'Walk-in Customer') {
            if (!customerMap.has(phone)) {
              customerMap.set(phone, { name, phone, orderCount: 1 });
            } else {
              const existing = customerMap.get(phone);
              customerMap.set(phone, { ...existing, orderCount: (existing.orderCount || 1) + 1 });
            }
          }
        });
        setExistingCustomers(Array.from(customerMap.values()));
      }
    });

    const unsubCust = subscribeCustomers((firestoreCusts) => {
      if (Array.isArray(firestoreCusts) && firestoreCusts.length > 0) {
        setExistingCustomers(prev => {
          const map = new Map(prev.map(c => [c.phone, c]));
          firestoreCusts.forEach(c => {
            if (c.phone && !map.has(c.phone)) {
              map.set(c.phone, { name: c.name || 'Customer', phone: c.phone, orderCount: 1 });
            }
          });
          return Array.from(map.values());
        });
      }
    });

    return () => {
      if (unsubOrders) unsubOrders();
      if (unsubCust) unsubCust();
    };
  }, []);

  const categories = ['All', 'Sparklers', 'Bombs', 'Fancy', 'Fountains', 'Novelty'];

  // Cart Management Functions
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
      if (item.id === id) return { ...item, qty: item.qty + delta };
      return item;
    }).filter(item => item.qty > 0));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const getItemQtyInCart = (productId) => {
    const item = cart.find(i => i.id === productId);
    return item ? item.qty : 0;
  };

  const closeCartDrawer = () => {
    setIsCartDrawerClosing(true);
    setTimeout(() => {
      setShowCartDrawer(false);
      setIsCartDrawerClosing(false);
    }, 300);
  };

  const openCartDrawer = () => {
    setIsCartDrawerClosing(false);
    setShowCartDrawer(true);
  };

  const triggerSuccess = (msg) => {
    showToast(msg, 'success');
  };

  const handleResetBill = () => {
    setCart([]);
    setCustomerName('Walk-in Customer');
    setCustomerPhone('');
    try {
      localStorage.removeItem('karuppa_pos_cart');
      localStorage.removeItem('karuppa_pos_cust_name');
      localStorage.removeItem('karuppa_pos_cust_phone');
    } catch (e) { }
  };

  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirmOrder = () => {
    if (cart.length === 0 || isProcessingOrder || isConfirming) return;
    setIsConfirming(true);
    setTimeout(() => {
      closeCartDrawer();
      setShowConfirmModal(true);
      setIsConfirming(false);
    }, 250);
  };

  const handleFinalConfirmSave = async () => {
    setIsProcessingOrder(true);
    const isEditingMode = Boolean(editingOrder);
    const targetOrderId = isEditingMode ? editingOrder.id : generateOrderId(allOrders, true);
    const nowIso = new Date().toISOString();

    const orderData = {
      ...editingOrder,
      id: targetOrderId,
      orderId: targetOrderId,
      customer: customerName || (isEditingMode ? editingOrder.customer : 'Walk-in Customer'),
      customerName: customerName || (isEditingMode ? editingOrder.customer : 'Walk-in Customer'),
      phone: customerPhone || (isEditingMode ? editingOrder.phone : '9943852902'),
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.qty || item.quantity || 1,
        category: item.category || ''
      })),
      itemsCount: cart.reduce((sum, item) => sum + (item.qty || item.quantity || 1), 0),
      totalAmount: grandTotal,
      subtotal,
      discount,
      gst,
      grandTotal,
      status: isEditingMode ? (editingOrder.status || 'Pending') : 'Delivered',
      paymentStatus: isEditingMode ? (editingOrder.paymentStatus || 'Confirmed') : 'PAID',
      paymentMode: isEditingMode ? (editingOrder.paymentMode || 'Online') : 'Cash on Counter',
      orderType: isEditingMode ? (editingOrder.orderType || 'Online') : 'Offline',
      isOffline: isEditingMode ? false : true,
      updatedAt: nowIso,
      createdAt: isEditingMode ? (editingOrder.createdAt || nowIso) : nowIso,
      date: isEditingMode ? (editingOrder.date || new Date().toLocaleDateString('en-IN')) : new Date().toLocaleDateString('en-IN')
    };

    try {
      await saveOrderToFirestore(orderData);
    } catch (err) {
      console.error("Error saving order to Firestore:", err);
    }

    await new Promise(r => setTimeout(r, 600));

    setIsProcessingOrder(false);
    setShowConfirmModal(false);
    closeCartDrawer();

    if (isEditingMode) {
      showToast(`Online Order #${targetOrderId} Updated Successfully!`, 'success');
      setEditingOrder(null);
      handleResetBill();
      setTimeout(() => {
        navigate('/admin/orders');
      }, 1200);
    } else {
      showToast(`🎉 POS Bill #${targetOrderId} Saved & Confirmed!`, 'success');
      setCompletedOrder(orderData);
    }
  };

  const handleStartNewOrder = () => {
    setCompletedOrder(null);
    handleResetBill();
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = Math.round(subtotal * 0.1);
  const gst = Math.round((subtotal - discount) * 0.18);
  const grandTotal = subtotal - discount + gst;

  const handleTriggerPrint = () => {
    const currentOrder = completedOrder || {
      orderId: generateOrderId(allOrders, true),
      customer: customerName || 'Walk-in Customer',
      phone: customerPhone || '+91 9876543210',
      items: cart.length > 0 ? cart : catalog.slice(0, 2),
      subtotal,
      discount,
      gst,
      grandTotal,
      createdAt: new Date().toISOString()
    };
    showToast('Generating Official Tax Invoice PDF...', 'info');
    printInvoicePdf(currentOrder);
  };

  const handleDownloadInvoice = () => {
    const currentOrder = completedOrder || {
      orderId: generateOrderId(allOrders, true),
      customer: customerName || 'Walk-in Customer',
      phone: customerPhone || '+91 9876543210',
      items: cart.length > 0 ? cart : catalog.slice(0, 2),
      subtotal,
      discount,
      gst,
      grandTotal,
      createdAt: new Date().toISOString()
    };
    showToast(`Downloading Tax Invoice for #${currentOrder.orderId}...`, 'info');
    downloadInvoiceFile(currentOrder);
  };

  const filteredCatalog = catalog.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className={`flex flex-col items-start max-w-[1650px] mx-auto pb-28 relative space-y-6 sm:space-y-8 ${isFullscreenPos
      ? 'fixed inset-0 z-[999999] bg-[#F4F1EA] p-3 sm:p-6 overflow-y-auto w-full h-full max-w-none rounded-none'
      : '-mx-4 -mt-4 sm:mx-0 sm:mt-0'
      }`}>
      {/* Editing Online Order Top Active Alert Banner */}
      {editingOrder && (
        <div className="w-full bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white p-4 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-2 border-amber-300 animate-in slide-in-from-top-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-2xl shrink-0">
              <Edit3 size={22} className="text-[#FFD700]" />
            </div>
            <div>
              <p className="font-black text-sm text-[#FFD700]">
                ✏️ Editing Online Customer Order #{editingOrder.id} ({editingOrder.customer || editingOrder.customerName})
              </p>
              <p className="text-xs text-amber-100 font-medium">
                Add, remove, or adjust cracker quantities below. When ready, click "Update Online Order" to save changes back to online orders.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingOrder(null);
              handleResetBill();
            }}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <X size={15} /> Cancel Editing
          </button>
        </div>
      )}

      {/* POS Toolbar */}
      <PosHeaderToolbar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        showCatMenu={showCatMenu}
        setShowCatMenu={setShowCatMenu}
        catDropdownRef={catDropdownRef}
        categories={categories}
        viewMode={viewMode}
        setViewMode={setViewMode}
        gridCols={gridCols}
        setGridCols={setGridCols}
        showColMenu={showColMenu}
        setShowColMenu={setShowColMenu}
        colDropdownRef={colDropdownRef}
        isFullscreenPos={isFullscreenPos}
        toggleFullscreen={toggleFullscreen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Product Catalog Grid / List / Loading State */}
      {isLoading ? (
        <div className="w-full">
          <LoadingSpinner message="Loading firecracker inventory catalog..." />
        </div>
      ) : (
        <ProductCatalogGrid
          viewMode={viewMode}
          gridCols={gridCols}
          filteredCatalog={filteredCatalog}
          getItemQtyInCart={getItemQtyInCart}
          addToCart={addToCart}
          updateQty={updateQty}
        />
      )}

      {/* Sticky Bottom Cart Bar */}
      <StickyCartBar
        cart={cart}
        grandTotal={grandTotal}
        openCartDrawer={openCartDrawer}
        handleResetBill={handleResetBill}
        isFullscreenPos={isFullscreenPos}
        isDesktopSidebarExpanded={isDesktopSidebarExpanded}
        editingOrder={editingOrder}
      />

      {/* Itemized Cart Receipt Slide-Over Drawer */}
      <CartReceiptDrawer
        showCartDrawer={showCartDrawer}
        closeCartDrawer={closeCartDrawer}
        isCartDrawerClosing={isCartDrawerClosing}
        customerName={customerName}
        setCustomerName={setCustomerName}
        customerPhone={customerPhone}
        setCustomerPhone={setCustomerPhone}
        showCustomerDropdown={showCustomerDropdown}
        setShowCustomerDropdown={setShowCustomerDropdown}
        customerDropdownRef={customerDropdownRef}
        existingCustomers={existingCustomers}
        cart={cart}
        updateQty={updateQty}
        removeFromCart={removeFromCart}
        subtotal={subtotal}
        discount={discount}
        gst={gst}
        grandTotal={grandTotal}
        handleResetBill={handleResetBill}
        handleConfirmOrder={handleConfirmOrder}
        isConfirming={isConfirming}
        isProcessingOrder={isProcessingOrder}
        editingOrder={editingOrder}
        triggerSuccess={triggerSuccess}
      />

      {/* Pre-Save Order Confirmation Modal */}
      <OrderConfirmModal
        showConfirmModal={showConfirmModal}
        setShowConfirmModal={setShowConfirmModal}
        customerName={customerName}
        cart={cart}
        grandTotal={grandTotal}
        handleFinalConfirmSave={handleFinalConfirmSave}
        isProcessingOrder={isProcessingOrder}
        editingOrder={editingOrder}
      />

      {/* Order Confirmed Success Modal */}
      <OrderSuccessModal
        completedOrder={completedOrder}
        handleTriggerPrint={handleTriggerPrint}
        handleDownloadInvoice={handleDownloadInvoice}
        handleStartNewOrder={handleStartNewOrder}
      />

      {/* Official Tax Invoice Modal Preview */}
      <InvoiceModalPreview
        showInvoiceModal={showInvoiceModal}
        setShowInvoiceModal={setShowInvoiceModal}
        completedOrder={completedOrder}
        customerName={customerName}
        customerPhone={customerPhone}
        cart={cart}
        catalog={catalog}
        subtotal={subtotal}
        discount={discount}
        gst={gst}
        grandTotal={grandTotal}
        handleDownloadInvoice={handleDownloadInvoice}
        triggerSuccess={triggerSuccess}
      />
    </div>
  );
};

export default AdminBilling;
