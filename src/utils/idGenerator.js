/**
 * Karuppa Crackers - Standardized Entity ID Generator
 * Formats:
 * - Product: KC-PRO-0001, KC-PRO-0002...
 * - Category: KC-CTG-001, KC-CTG-002...
 * - Order: KC-ORD-0001, KC-ORD-0002... (or KC-POS-0001 for POS bills)
 * - Invoice: KC-INV-0001, KC-INV-0002...
 * - Expense: KC-EXP-001, KC-EXP-002...
 * - Expense Category: KC-EXP-CTG-001, KC-EXP-CTG-002...
 * - Customer: KC-CUST-0001, KC-CUST-0002...
 */

const extractMaxNumericId = (items = [], prefix) => {
  let max = 0;
  items.forEach(item => {
    const idStr = String(typeof item === 'string' ? item : (item?.id || item?.orderId || item?.invoiceNumber || ''));
    if (idStr.toUpperCase().startsWith(prefix.toUpperCase())) {
      const match = idStr.match(/\d+$/);
      if (match) {
        const num = parseInt(match[0], 10);
        if (!isNaN(num) && num > max) {
          max = num;
        }
      }
    }
  });
  return max;
};

export const generateProductId = (existingProducts = []) => {
  const max = extractMaxNumericId(existingProducts, 'KC-PRO-');
  const next = max + 1;
  return `KC-PRO-${String(next).padStart(4, '0')}`;
};

export const generateCategoryId = (existingCategories = []) => {
  const max = extractMaxNumericId(existingCategories, 'KC-CTG-');
  const next = max + 1;
  return `KC-CTG-${String(next).padStart(3, '0')}`;
};

export const generateOrderId = (existingOrders = [], isOffline = false) => {
  const prefix = isOffline ? 'KC-POS-' : 'KC-ORD-';
  const max = extractMaxNumericId(existingOrders, prefix);
  const next = max + 1;
  return `${prefix}${String(next).padStart(4, '0')}`;
};

export const generateInvoiceId = (existingOrdersOrInvoices = []) => {
  const max = extractMaxNumericId(existingOrdersOrInvoices, 'KC-INV-');
  const next = max + 1;
  return `KC-INV-${String(next).padStart(4, '0')}`;
};

export const generateExpenseId = (existingExpenses = []) => {
  const max = extractMaxNumericId(existingExpenses, 'KC-EXP-');
  const next = max + 1;
  return `KC-EXP-${String(next).padStart(3, '0')}`;
};

export const generateExpenseCategoryId = (existingCategories = []) => {
  const max = extractMaxNumericId(existingCategories, 'KC-EXP-CTG-');
  const next = max + 1;
  return `KC-EXP-CTG-${String(next).padStart(3, '0')}`;
};

export const generateCustomerId = (existingCustomers = []) => {
  const max = extractMaxNumericId(existingCustomers, 'KC-CUST-');
  const next = max + 1;
  return `KC-CUST-${String(next).padStart(4, '0')}`;
};
