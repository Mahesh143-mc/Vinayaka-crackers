import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';

const getLocalItems = (key) => {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) { return []; }
};

const setLocalItems = (key, items) => {
  try { localStorage.setItem(key, JSON.stringify(items)); } catch (e) {}
};

// =========================================================================
// 1. PRODUCTS FIRESTORE SERVICE (DIRECT FIREBASE ONLY)
// =========================================================================
export const subscribeProducts = (callback) => {
  try {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      callback(products);
    }, (error) => {
      console.warn("Firestore listener notice, trying basic collection:", error);
      return onSnapshot(collection(db, 'products'), (snapshot) => {
        const products = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        callback(products);
      });
    });
  } catch (err) {
    return onSnapshot(collection(db, 'products'), (snapshot) => {
      const products = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      callback(products);
    });
  }
};

export const saveProductToFirestore = async (product) => {
  const now = new Date().toISOString();
  const cleanProduct = {
    ...product,
    updatedAt: now,
    createdAt: product.createdAt || now
  };

  // Direct Write to Firebase Cloud Firestore Database ONLY
  const docRef = doc(db, 'products', String(cleanProduct.id));
  await setDoc(docRef, cleanProduct, { merge: true });
};

export const deleteProductFromFirestore = async (id) => {
  await deleteDoc(doc(db, 'products', String(id)));
};

export const updateProductStockInFirestore = async (id, newStock) => {
  const docRef = doc(db, 'products', String(id));
  await updateDoc(docRef, {
    stock: Number(newStock),
    updatedAt: new Date().toISOString()
  });
};

// =========================================================================
// 2. CATEGORIES FIRESTORE SERVICE
// =========================================================================
export const subscribeCategories = (callback) => {
  try {
    const q = query(collection(db, 'categories'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const categories = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      callback(categories);
    }, () => {
      return onSnapshot(collection(db, 'categories'), (snapshot) => {
        const categories = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        callback(categories);
      });
    });
  } catch (err) {
    return onSnapshot(collection(db, 'categories'), (snapshot) => {
      const categories = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      callback(categories);
    });
  }
};

export const saveCategoryToFirestore = async (category) => {
  const docRef = doc(db, 'categories', String(category.id));
  const now = new Date().toISOString();
  const cleanCategory = JSON.parse(JSON.stringify(category));
  await setDoc(docRef, {
    ...cleanCategory,
    updatedAt: now,
    createdAt: cleanCategory.createdAt || now
  }, { merge: true });
};

export const deleteCategoryFromFirestore = async (id) => {
  await deleteDoc(doc(db, 'categories', String(id)));
};

// =========================================================================
// 3. ORDERS & BILLING FIRESTORE SERVICE
// =========================================================================
export const subscribeOrders = (callback) => {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    callback(orders);
  }, (error) => {
    console.error("Firestore Orders subscription error:", error);
  });
};


export const saveOrderToFirestore = async (order) => {
  const orderId = order.id || `ORD-${Math.floor(Math.random() * 9000 + 1000)}`;
  const docRef = doc(db, 'orders', String(orderId));
  await setDoc(docRef, {
    ...order,
    id: orderId,
    updatedAt: serverTimestamp(),
    createdAt: order.createdAt || serverTimestamp()
  }, { merge: true });

  if (order.phone && order.phone !== 'Walk-in Customer') {
    try {
      await setDoc(doc(db, 'customers', String(order.phone)), {
        name: order.customer || 'Walk-in Customer',
        phone: order.phone,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      }, { merge: true });
    } catch (e) {
      console.warn("Could not save customer record:", e);
    }
  }
};

export const updateOrderStatusInFirestore = async (orderId, newStatus) => {
  const docRef = doc(db, 'orders', String(orderId));
  await updateDoc(docRef, {
    status: newStatus,
    updatedAt: serverTimestamp()
  });
};

export const deleteOrderFromFirestore = async (orderId) => {
  await deleteDoc(doc(db, 'orders', String(orderId)));
};

// =========================================================================
// 4. EXPENSES FIRESTORE SERVICE
// =========================================================================
export const subscribeExpenses = (callback) => {
  const q = query(collection(db, 'expenses'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const expenses = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    callback(expenses);
  }, (error) => {
    console.error("Firestore Expenses subscription error:", error);
  });
};

export const saveExpenseToFirestore = async (expense) => {
  const expenseId = expense.id || `EXP-${Math.floor(Math.random() * 900 + 100)}`;
  const docRef = doc(db, 'expenses', String(expenseId));
  await setDoc(docRef, {
    ...expense,
    id: expenseId,
    amount: Number(expense.amount),
    updatedAt: serverTimestamp(),
    createdAt: expense.createdAt || serverTimestamp()
  }, { merge: true });
};

export const deleteExpenseFromFirestore = async (expenseId) => {
  await deleteDoc(doc(db, 'expenses', String(expenseId)));
};

export const subscribeExpenseCategories = (callback) => {
  try {
    const q = query(collection(db, 'expense_categories'), orderBy('name', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const cats = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      callback(cats);
    }, () => {
      return onSnapshot(collection(db, 'expense_categories'), (snapshot) => {
        const cats = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        callback(cats);
      });
    });
  } catch (err) {
    return onSnapshot(collection(db, 'expense_categories'), (snapshot) => {
      const cats = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      callback(cats);
    });
  }
};

export const saveExpenseCategoryToFirestore = async (catName) => {
  const cleanId = String(catName).toLowerCase().replace(/[^a-z0-9]/g, '_');
  const docRef = doc(db, 'expense_categories', cleanId);
  await setDoc(docRef, {
    id: cleanId,
    name: catName.trim(),
    createdAt: serverTimestamp()
  }, { merge: true });
};

export const deleteExpenseCategoryFromFirestore = async (catId) => {
  await deleteDoc(doc(db, 'expense_categories', String(catId)));
};

// =========================================================================
// 5. CUSTOMERS FIRESTORE SERVICE
// =========================================================================
export const subscribeCustomers = (callback) => {
  try {
    return onSnapshot(collection(db, 'customers'), (snapshot) => {
      const customers = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      callback(customers);
    }, (error) => {
      console.warn("Firestore Customers subscription notice:", error);
      callback([]);
    });
  } catch (err) {
    console.warn("Firestore Customers error:", err);
    callback([]);
    return () => {};
  }
};

export const saveCustomerToFirestore = async (customer) => {
  const docRef = doc(db, 'customers', String(customer.id));
  await setDoc(docRef, {
    ...customer,
    updatedAt: serverTimestamp(),
    createdAt: customer.createdAt || serverTimestamp()
  }, { merge: true });
};

// =========================================================================
// 6. WEBSITE CMS & SETTINGS FIRESTORE SERVICE
// =========================================================================
export const subscribeWebsiteCMS = (callback) => {
  return onSnapshot(doc(db, 'settings', 'websiteCMS'), (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    }
  }, (error) => {
    console.error("Firestore Website CMS subscription error:", error);
  });
};

export const saveWebsiteCMSToFirestore = async (cmsData) => {
  await setDoc(doc(db, 'settings', 'websiteCMS'), {
    ...cmsData,
    updatedAt: serverTimestamp()
  }, { merge: true });
};

export const subscribeStoreSettings = (callback) => {
  return onSnapshot(doc(db, 'settings', 'storeConfig'), (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback({ gstPercentage: 18, festiveDiscount: 80 });
    }
  }, (error) => {
    console.error("Firestore Store Settings subscription error:", error);
    callback({ gstPercentage: 18, festiveDiscount: 80 });
  });
};

export const saveStoreSettingsToFirestore = async (settingsData) => {
  await setDoc(doc(db, 'settings', 'storeConfig'), {
    ...settingsData,
    updatedAt: serverTimestamp()
  }, { merge: true });
};
