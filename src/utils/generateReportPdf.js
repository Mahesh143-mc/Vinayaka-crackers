import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Karuppa Crackers - Pure Minimalist PDF Report Generator
 * Zero dark background fills, clean white canvas, crisp vector grid lines.
 */
export const generateReportPdf = ({
  reportType = 'pnl',
  grossRevenue = 0,
  totalExpenses = 0,
  netProfit = 0,
  profitMarginPercent = '0.0',
  ordersCount = 0,
  expensesCount = 0,
  productPerformanceList = [],
  customerReportList = [],
  invoiceReportList = [],
  storeSettings = {},
  dateRangeLabel = 'All Time'
}) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const primaryMaroon = [74, 14, 14]; // #4A0E0E
  const darkTextColor = [15, 23, 42]; // #0F172A
  const subTextColor = [71, 85, 105]; // #475569
  const nowStr = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  const companyName = (storeSettings?.companyName || storeSettings?.storeName || 'KARUPPA CRACKERS').toUpperCase();
  const address = storeSettings?.address || 'Sivakasi, Tamil Nadu';

  // 1. Header Section (PURE WHITE BACKGROUND - NO DARK BG FILL)
  doc.setFont("helvetica", "bold");
  doc.setTextColor(74, 14, 14); // Maroon text
  doc.setFontSize(16);
  doc.text(companyName, 14, 13);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(8.5);
  doc.text(`Official Business Analytics & Financial Audit Statement • Period: ${dateRangeLabel}`, 14, 18.5);
  doc.text(`Generated: ${nowStr}`, 196, 18.5, { align: 'right' });

  // Divider Line below Header
  doc.setDrawColor(74, 14, 14);
  doc.setLineWidth(0.6);
  doc.line(14, 22, 196, 22);

  let fileName = `${companyName.replace(/\s+/g, '_')}_Report_${new Date().toISOString().slice(0, 10)}.pdf`;

  // Common Table Grid Options (Clean Light Header & Solid Grid Borders)
  const gridOptions = {
    theme: 'grid',
    margin: { left: 14, right: 14 },
    headStyles: {
      fillColor: [245, 245, 247], // Light clean header fill
      textColor: primaryMaroon, // Bold Maroon Header Text
      fontStyle: 'bold',
      fontSize: 8,
      lineColor: [180, 180, 180],
      lineWidth: 0.25
    },
    styles: {
      fontSize: 8,
      textColor: darkTextColor,
      lineColor: [210, 210, 210],
      lineWidth: 0.15,
      cellPadding: 2.8
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255]
    }
  };

  // 2. Report Specific Header, Summary Box (NO BG FILL) & Grid Table
  if (reportType === 'pnl') {
    fileName = `Karuppa_Crackers_PnL_Report_${new Date().toISOString().slice(0, 10)}.pdf`;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(74, 14, 14);
    doc.setFontSize(11);
    doc.text("1. PROFIT & LOSS FINANCIAL STATEMENT", 14, 30);

    // Clean Transparent Outline Box (No Background Fill)
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.3);
    doc.roundedRect(14, 33, 182, 18, 2, 2, 'S');

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(74, 14, 14);
    doc.text(`Gross Sales Revenue: Rs. ${Number(grossRevenue).toLocaleString('en-IN')}`, 18, 40);
    doc.text(`Total Store Expenses: Rs. ${Number(totalExpenses).toLocaleString('en-IN')}`, 82, 40);
    doc.text(`Net Realized Profit: Rs. ${Number(netProfit).toLocaleString('en-IN')} (${profitMarginPercent}%)`, 142, 40);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(`Total Orders Audited: ${ordersCount} orders`, 18, 47);
    doc.text(`Total Expenses Logged: ${expensesCount} records`, 82, 47);

    const tableRows = (productPerformanceList || []).map(p => [
      String(p.sku || 'PRD-000'),
      String(p.name || 'Firework Item'),
      String(p.category || 'General'),
      `${p.unitsSold || 0} units`,
      `Rs. ${Number(p.revenue || 0).toLocaleString('en-IN')}`,
      String(p.profitMargin || '0%')
    ]);

    autoTable(doc, {
      ...gridOptions,
      startY: 56,
      head: [['SKU CODE', 'PRODUCT ITEM NAME', 'CATEGORY', 'UNITS SOLD', 'REVENUE (Rs.)', 'MARGIN']],
      body: tableRows,
      columnStyles: {
        0: { halign: 'center', cellWidth: 24, fontStyle: 'bold' },
        1: { halign: 'left', fontStyle: 'bold' },
        2: { halign: 'left', cellWidth: 32 },
        3: { halign: 'center', cellWidth: 24 },
        4: { halign: 'right', cellWidth: 34, fontStyle: 'bold', textColor: [192, 0, 0] },
        5: { halign: 'center', cellWidth: 22, fontStyle: 'bold', textColor: [4, 120, 87] }
      }
    });

  } else if (reportType === 'customers') {
    fileName = `Karuppa_Crackers_Customer_Directory_${new Date().toISOString().slice(0, 10)}.pdf`;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(74, 14, 14);
    doc.setFontSize(11);
    doc.text("2. CUSTOMER DIRECTORY & PURCHASE ANALYTICS REPORT", 14, 30);

    // Clean Transparent Outline Box (No Background Fill)
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.3);
    doc.roundedRect(14, 33, 182, 14, 2, 2, 'S');

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(74, 14, 14);
    doc.text(`Active Customers: ${customerReportList.length}`, 18, 41.5);
    doc.text(`Total Orders Placed: ${ordersCount}`, 82, 41.5);
    doc.text(`Total Customer Spent: Rs. ${Number(grossRevenue).toLocaleString('en-IN')}`, 142, 41.5);

    const tableRows = (customerReportList || []).map(c => [
      String(c.name || 'Valued Customer'),
      String(c.phone || 'N/A'),
      `${c.totalOrders || 0} Orders`,
      `Rs. ${Number(c.totalSpent || 0).toLocaleString('en-IN')}`,
      String(c.address || c.location || c.city || 'Sivakasi')
    ]);

    autoTable(doc, {
      ...gridOptions,
      startY: 52,
      head: [['CUSTOMER NAME', 'PHONE / WHATSAPP', 'TOTAL ORDERS', 'TOTAL SPENT (Rs.)', 'PLACE / ADDRESS']],
      body: tableRows,
      columnStyles: {
        0: { halign: 'left', fontStyle: 'bold' },
        1: { halign: 'center', cellWidth: 34 },
        2: { halign: 'center', cellWidth: 26 },
        3: { halign: 'right', cellWidth: 34, fontStyle: 'bold', textColor: [192, 0, 0] },
        4: { halign: 'left', cellWidth: 44 }
      }
    });

  } else if (reportType === 'products') {
    fileName = `Karuppa_Crackers_Product_Performance_${new Date().toISOString().slice(0, 10)}.pdf`;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(74, 14, 14);
    doc.setFontSize(11);
    doc.text("3. PRODUCT CATALOG SALES & STOCK PERFORMANCE REPORT", 14, 30);

    // Clean Transparent Outline Box (No Background Fill)
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.3);
    doc.roundedRect(14, 33, 182, 14, 2, 2, 'S');

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(74, 14, 14);
    doc.text(`Catalog Product Items: ${productPerformanceList.length}`, 18, 41.5);
    doc.text(`Total Units Sold: ${productPerformanceList.reduce((sum, p) => sum + (p.unitsSold || 0), 0)} units`, 82, 41.5);
    doc.text(`Total Product Revenue: Rs. ${Number(grossRevenue).toLocaleString('en-IN')}`, 140, 41.5);

    const tableRows = (productPerformanceList || []).map(p => [
      String(p.sku || 'PRD-000'),
      String(p.name || 'Firework Item'),
      String(p.category || 'General'),
      `${p.stock || 0} units`,
      `${p.unitsSold || 0} units`,
      `Rs. ${Number(p.revenue || 0).toLocaleString('en-IN')}`
    ]);

    autoTable(doc, {
      ...gridOptions,
      startY: 52,
      head: [['SKU CODE', 'PRODUCT ITEM NAME', 'CATEGORY', 'IN STOCK', 'UNITS SOLD', 'TOTAL REVENUE (Rs.)']],
      body: tableRows,
      columnStyles: {
        0: { halign: 'center', cellWidth: 24, fontStyle: 'bold' },
        1: { halign: 'left', fontStyle: 'bold' },
        2: { halign: 'left', cellWidth: 30 },
        3: { halign: 'center', cellWidth: 24, textColor: [4, 120, 87], fontStyle: 'bold' },
        4: { halign: 'center', cellWidth: 24 },
        5: { halign: 'right', cellWidth: 36, fontStyle: 'bold', textColor: [192, 0, 0] }
      }
    });

  } else if (reportType === 'invoices') {
    fileName = `Karuppa_Crackers_Invoice_History_${new Date().toISOString().slice(0, 10)}.pdf`;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(74, 14, 14);
    doc.setFontSize(11);
    doc.text("4. INVOICE TRANSACTION & PROFIT HISTORY REPORT", 14, 30);

    // Clean Transparent Outline Box (No Background Fill)
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.3);
    doc.roundedRect(14, 33, 182, 14, 2, 2, 'S');

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(74, 14, 14);
    doc.text(`Total Invoices Issued: ${invoiceReportList.length}`, 18, 41.5);
    doc.text(`Total Invoiced Revenue: Rs. ${Number(grossRevenue).toLocaleString('en-IN')}`, 82, 41.5);
    doc.text(`Est. Net Profit: Rs. ${Number(netProfit).toLocaleString('en-IN')}`, 142, 41.5);

    const tableRows = (invoiceReportList || []).map(i => [
      String(i.id || 'ORD-000'),
      String(i.date || 'Today'),
      String(i.customer || 'Valued Customer'),
      String(i.paymentMode || 'Paid'),
      `Rs. ${Number(i.amount || 0).toLocaleString('en-IN')}`,
      `Rs. ${Number(i.profit || 0).toLocaleString('en-IN')}`
    ]);

    autoTable(doc, {
      ...gridOptions,
      startY: 52,
      head: [['INVOICE ID', 'DATE & TIME', 'CUSTOMER NAME', 'PAYMENT MODE', 'GRAND TOTAL (Rs.)', 'EST. PROFIT (Rs.)']],
      body: tableRows,
      columnStyles: {
        0: { halign: 'center', cellWidth: 24, fontStyle: 'bold' },
        1: { halign: 'left', cellWidth: 35 },
        2: { halign: 'left', fontStyle: 'bold' },
        3: { halign: 'center', cellWidth: 32 },
        4: { halign: 'right', cellWidth: 32, fontStyle: 'bold', textColor: [192, 0, 0] },
        5: { halign: 'right', cellWidth: 28, fontStyle: 'bold', textColor: [4, 120, 87] }
      }
    });
  }

  // Footer Sign-Off
  const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 180;
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(74, 14, 14);
  doc.text("For KARUPPA CRACKERS SIVAKASI", 140, finalY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text("Official Computer Generated Financial Statement", 140, finalY + 4);

  // Directly save file to downloads folder on current page
  doc.save(fileName);
  return fileName;
};
