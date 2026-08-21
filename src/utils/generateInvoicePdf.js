import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Karuppa Crackers - Professional Tax Invoice Generator
 * Generates clean, high-resolution official A4 tax invoices for POS & online orders.
 */

export const generateInvoiceHtml = (orderData, storeSettings = {}) => {
  const invId = orderData?.orderId || orderData?.id || 'POS-101';
  const customerName = orderData?.customer || orderData?.customerName || orderData?.name || 'Walk-in Customer';
  const customerPhone = orderData?.phone || orderData?.customerPhone || 'N/A';
  const customerAddress = orderData?.address || orderData?.shippingAddress || 'Direct Store Delivery';
  const items = orderData?.items || [];
  const subtotal = Number(orderData?.subtotal || 0);
  const discount = Number(orderData?.discount || 0);
  const gst = Number(orderData?.gst || 0);
  const grandTotal = Number(orderData?.grandTotal || (subtotal - discount + gst));
  const dateStr = orderData?.createdAt 
    ? (typeof orderData.createdAt === 'string' ? orderData.createdAt.split('T')[0] : new Date(orderData.createdAt).toLocaleDateString('en-IN'))
    : new Date().toLocaleDateString('en-IN');
  const paymentMode = orderData?.paymentMode || 'Cash / Counter Payment';
  const paymentStatus = orderData?.paymentStatus || 'PAID (COUNTER POS)';

  // Dynamic Company Profile
  const companyName = storeSettings?.companyName || storeSettings?.storeName || 'KARUPPA CRACKERS';
  const tagline = storeSettings?.tagline || 'Sivakasi Premium Fireworks Direct Manufacturer';
  const address = storeSettings?.address || '124/B, Sivakasi Main Road, Sivakasi, Tamil Nadu - 626123';
  const phone = storeSettings?.phone || storeSettings?.supportPhone || '8825419454';
  const email = storeSettings?.email || storeSettings?.supportEmail || 'chimeratechweb@gmail.com';
  const gstNumber = storeSettings?.gstNumber || '33AAAAA0000A1Z5';
  const bankName = storeSettings?.bankName || 'State Bank of India';
  const accountNumber = storeSettings?.accountNumber || '123456789012';
  const ifscCode = storeSettings?.ifscCode || 'SBIN0001234';
  const branch = storeSettings?.branch || 'Sivakasi Main Branch';
  const upiId = storeSettings?.upiId || '8825419454@upi';

  const itemsRows = items.map((item, idx) => `
    <tr style="border-bottom: 1px solid #e2e8f0; text-align: left;">
      <td style="padding: 10px; text-align: center; font-weight: bold; color: #475569;">${idx + 1}</td>
      <td style="padding: 10px;">
        <span style="font-weight: 800; color: #0f172a; font-size: 13px;">${item.name}</span><br/>
        <span style="font-size: 10px; color: #64748b; font-weight: 600;">Code: ${item.id || 'PRD-' + (idx + 1)}</span>
      </td>
      <td style="padding: 10px; text-align: center; color: #475569; font-size: 11px; font-weight: 700;">${item.category || 'Fireworks'}</td>
      <td style="padding: 10px; text-align: center; font-weight: 800; color: #0f172a;">${item.qty || item.quantity || 1}</td>
      <td style="padding: 10px; text-align: right; color: #0f172a; font-weight: 600;">₹${Number(item.price).toLocaleString('en-IN')}</td>
      <td style="padding: 10px; text-align: right; font-weight: 900; color: #c00000; font-size: 13px;">₹${(item.price * (item.qty || item.quantity || 1)).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${companyName} Tax Invoice - #${invId}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 5mm;
    }
    * {
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      margin: 0;
      padding: 0;
      background: #ffffff;
      line-height: 1.4;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .invoice-wrapper {
      width: 100%;
      margin: 0;
      padding: 10px 15px;
      border: none;
      border-radius: 0;
      background: #ffffff;
    }
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2.5px solid #4A0E0E;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .brand-block {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .brand-logo {
      width: 65px;
      height: 65px;
      border-radius: 10px;
      border: 1px solid #cbd5e1;
      object-fit: contain;
    }
    .company-name {
      font-size: 24px;
      font-weight: 900;
      color: #4A0E0E;
      margin: 0;
      letter-spacing: 0.5px;
      font-family: Georgia, serif;
    }
    .company-subtitle {
      font-size: 11px;
      font-weight: 800;
      color: #92400e;
      margin: 2px 0 4px 0;
    }
    .company-address {
      font-size: 10px;
      color: #475569;
      margin: 0;
      line-height: 1.3;
    }
    .tax-badge {
      background: #4A0E0E;
      color: #FFD700;
      font-size: 10px;
      font-weight: 900;
      padding: 5px 14px;
      border-radius: 6px;
      display: inline-block;
      text-transform: uppercase;
      letter-spacing: 1px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .meta-block {
      text-align: right;
      font-size: 12px;
    }
    .meta-line {
      margin: 4px 0 0 0;
      color: #334155;
    }
    .two-col-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 22px;
    }
    .info-card {
      background: #fefce8;
      border: 1px solid #fef08a;
      padding: 14px;
      border-radius: 10px;
    }
    .info-card-title {
      font-size: 10px;
      font-weight: 900;
      color: #4A0E0E;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      border-bottom: 1px solid #fde047;
      padding-bottom: 4px;
      margin-bottom: 8px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 22px;
    }
    th {
      background: #4A0E0E;
      color: #ffffff;
      padding: 10px 12px;
      font-weight: 800;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .finance-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
      gap: 16px;
    }
    .notice-box {
      flex: 1;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 12px;
      border-radius: 8px;
      font-size: 11px;
    }
    .totals-box {
      width: 280px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      padding: 14px;
      border-radius: 10px;
      font-size: 12px;
    }
    .tot-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      color: #334155;
      font-weight: 600;
    }
    .grand-tot {
      border-top: 2px solid #4A0E0E;
      padding-top: 8px;
      margin-top: 6px;
      font-size: 16px;
      font-weight: 900;
      color: #c00000;
    }
    .footer-block {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-top: 1.5px solid #e2e8f0;
      padding-top: 16px;
      font-size: 10px;
      color: #64748b;
    }
    .sign-box {
      text-align: center;
      border-top: 1.5px solid #0f172a;
      width: 200px;
      padding-top: 6px;
      font-weight: 800;
      color: #4A0E0E;
      font-size: 11px;
    }
  </style>
</head>
<body>
  <div class="invoice-wrapper">
    <!-- Header -->
    <div class="header-row">
      <div class="brand-block">
        <img src="https://res.cloudinary.com/vf0fqhwo/image/upload/v1786363324/logo_q7lezq.jpg" alt="${companyName} Logo" class="brand-logo" />
        <div>
          <h1 class="company-name">${companyName}</h1>
          <p class="company-subtitle">${tagline}</p>
          <p class="company-address">
            ${address}<br/>
            Phone: +91 ${phone} | Email: ${email}<br/>
            <strong>GSTIN: ${gstNumber}</strong>
          </p>
        </div>
      </div>
      <div class="meta-block">
        <span class="tax-badge">OFFICIAL GST TAX INVOICE</span>
        <p class="meta-line">Invoice / Order No: <strong style="color:#0f172a; font-size:14px;">#${invId}</strong></p>
        <p class="meta-line">Date: <strong>${dateStr}</strong></p>
        <p class="meta-line" style="color:#047857; font-weight:800;">Status: ${paymentStatus}</p>
      </div>
    </div>

    <!-- Details Grid -->
    <div class="two-col-grid">
      <div class="info-card">
        <div class="info-card-title">CUSTOMER DETAILS (BILLED TO)</div>
        <p style="margin:0; font-weight:900; font-size:14px; color:#0f172a;">${customerName}</p>
        <p style="margin:4px 0 0 0; color:#334155; font-size:12px;">Phone: <strong>${customerPhone}</strong></p>
        <p style="margin:2px 0 0 0; color:#475569; font-size:11px;">Address: ${customerAddress}</p>
        <p style="margin:2px 0 0 0; color:#64748b; font-size:11px;">Payment Mode: ${paymentMode}</p>
      </div>
      <div class="info-card">
        <div class="info-card-title">BANK & PAYMENT DETAILS</div>
        <p style="margin:0; font-weight:800; font-size:12px; color:#0f172a;">Bank: ${bankName}</p>
        <p style="margin:2px 0 0 0; color:#334155; font-size:11px;">A/C No: <strong>${accountNumber}</strong> | IFSC: <strong>${ifscCode}</strong></p>
        <p style="margin:2px 0 0 0; color:#334155; font-size:11px;">Branch: ${branch}</p>
        <p style="margin:2px 0 0 0; color:#047857; font-weight:800; font-size:11px;">UPI ID: ${upiId}</p>
      </div>
    </div>

    <!-- Items Table -->
    <table>
      <thead>
        <tr>
          <th style="width: 40px; text-align: center;">S.NO</th>
          <th style="text-align: left;">PRODUCT ITEM DESCRIPTION</th>
          <th style="text-align: center;">CATEGORY</th>
          <th style="text-align: center;">QTY</th>
          <th style="text-align: right;">UNIT PRICE</th>
          <th style="text-align: right;">TOTAL (₹)</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>

    <!-- Financial Breakdown & Notes -->
    <div class="finance-wrapper">
      <div class="notice-box">
        <p style="margin:0 0 4px 0; font-weight:800; color:#4A0E0E; text-transform:uppercase; font-size:10px;">Payment & Safety Instructions:</p>
        <p style="margin:0 0 2px 0; color:#334155;">• Payment Mode: ${paymentMode} (${paymentStatus})</p>
        <p style="margin:0; color:#92400e; font-weight:700;">• Safety Instructions: Burst fireworks strictly outdoors under adult supervision. Keep water nearby.</p>
      </div>

      <div class="totals-box">
        <div class="tot-row"><span>Items Subtotal:</span><span>₹${subtotal.toLocaleString('en-IN')}</span></div>
        ${discount > 0 ? `<div class="tot-row" style="color:#047857;"><span>Festive Discount:</span><span>-₹${discount.toLocaleString('en-IN')}</span></div>` : ''}
        <div class="tot-row"><span>CGST (9%):</span><span>₹${Math.round(gst / 2).toLocaleString('en-IN')}</span></div>
        <div class="tot-row"><span>SGST (9%):</span><span>₹${Math.round(gst / 2).toLocaleString('en-IN')}</span></div>
        <div class="tot-row grand-tot"><span>NET BILL PAID:</span><span>₹${grandTotal.toLocaleString('en-IN')}</span></div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer-block">
      <div>
        <p style="margin:0; font-weight:800; color:#0f172a; text-transform:uppercase;">Terms & Conditions:</p>
        <p style="margin:2px 0 0 0;">1. Goods once sold will not be returned or exchanged.</p>
        <p style="margin:1px 0 0 0;">2. All disputes subject to Sivakasi Jurisdiction only.</p>
        <p style="margin:1px 0 0 0;">3. Official computer-generated tax invoice receipt.</p>
      </div>
      <div class="sign-box">
        For ${companyName}
        <div style="height:35px;"></div>
        AUTHORIZED SIGNATORY
      </div>
    </div>
  </div>
</body>
</html>`;
};

/**
 * Triggers clean print dialog in the CURRENT screen using a hidden iframe
 */
export const printInvoicePdf = (orderData, storeSettings = {}) => {
  const invoiceHtml = generateInvoiceHtml(orderData, storeSettings);

  let printFrame = document.getElementById('karuppa-print-frame');
  if (!printFrame) {
    printFrame = document.createElement('iframe');
    printFrame.id = 'karuppa-print-frame';
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    printFrame.style.visibility = 'hidden';
    document.body.appendChild(printFrame);
  }

  const frameDoc = printFrame.contentWindow || printFrame.contentDocument;
  const doc = frameDoc.document || frameDoc;
  doc.open();
  doc.write(invoiceHtml);
  doc.close();

  setTimeout(() => {
    try {
      printFrame.contentWindow.focus();
      printFrame.contentWindow.print();
    } catch (e) {
      window.print();
    }
  }, 250);
};

/**
 * Downloads official Tax Invoice directly as a native crisp .pdf vector document using jsPDF & autoTable
 */
export const downloadInvoiceFile = (orderData, storeSettings = {}) => {
  const invId = orderData?.orderId || orderData?.id || 'POS-101';
  const customerName = orderData?.customer || orderData?.customerName || orderData?.name || 'Walk-in Customer';
  const customerPhone = orderData?.phone || orderData?.customerPhone || 'N/A';
  const items = orderData?.items || [];
  const subtotal = Number(orderData?.subtotal || 0);
  const discount = Number(orderData?.discount || 0);
  const gst = Number(orderData?.gst || 0);
  const grandTotal = Number(orderData?.grandTotal || (subtotal - discount + gst));
  const dateStr = orderData?.createdAt 
    ? (typeof orderData.createdAt === 'string' ? orderData.createdAt.split('T')[0] : new Date(orderData.createdAt).toLocaleDateString('en-IN'))
    : new Date().toLocaleDateString('en-IN');
  const paymentMode = orderData?.paymentMode || 'Cash / Counter Payment';

  const companyName = storeSettings?.companyName || storeSettings?.storeName || 'KARUPPA CRACKERS';
  const tagline = storeSettings?.tagline || 'Sivakasi Premium Fireworks Direct Manufacturer';
  const address = storeSettings?.address || '124/B, Sivakasi Main Road, Sivakasi, Tamil Nadu - 626123';
  const phone = storeSettings?.phone || storeSettings?.supportPhone || '8825419454';
  const email = storeSettings?.email || storeSettings?.supportEmail || 'chimeratechweb@gmail.com';
  const gstNumber = storeSettings?.gstNumber || '33AAAAA0000A1Z5';
  const bankName = storeSettings?.bankName || 'State Bank of India';
  const accountNumber = storeSettings?.accountNumber || '123456789012';
  const ifscCode = storeSettings?.ifscCode || 'SBIN0001234';

  const fileName = `${companyName.replace(/\s+/g, '_')}_Tax_Invoice_${invId}.pdf`;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // 1. Company Header Title & Meta
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(74, 14, 14); // Maroon #4A0E0E
  doc.text(companyName.toUpperCase(), 14, 18);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(146, 64, 14); // Amber
  doc.text(tagline, 14, 23.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(address, 14, 28);
  doc.text(`Phone: +91 ${phone}  |  Email: ${email}`, 14, 32);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`GSTIN: ${gstNumber}`, 14, 36.5);

  // Right Tax Badge & Invoice No
  doc.setFillColor(74, 14, 14);
  doc.roundedRect(132, 12, 64, 7, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 215, 0); // Gold
  doc.text('OFFICIAL GST TAX INVOICE', 164, 16.5, { align: 'center' });

  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(`Invoice No: #${invId}`, 196, 25, { align: 'right' });
  doc.text(`Date: ${dateStr}`, 196, 30, { align: 'right' });
  doc.setTextColor(4, 120, 87); // Emerald
  doc.text(`Payment: ${paymentMode}`, 196, 35, { align: 'right' });

  // Divider Line
  doc.setDrawColor(74, 14, 14);
  doc.setLineWidth(0.8);
  doc.line(14, 40, 196, 40);

  // 2. Details Grid (Customer + Bank)
  doc.setFillColor(254, 252, 232); // amber-50
  doc.setDrawColor(254, 240, 138); // amber-200
  doc.roundedRect(14, 43, 89, 23, 3, 3, 'FD');
  doc.roundedRect(107, 43, 89, 23, 3, 3, 'FD');

  // Customer Card Text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(74, 14, 14);
  doc.text('CUSTOMER DETAILS (BILLED TO)', 18, 48);
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(String(customerName).substring(0, 30), 18, 54);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Phone: ${customerPhone}`, 18, 59.5);
  doc.text(`Payment: ${paymentMode}`, 18, 64);

  // Bank Card Text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(74, 14, 14);
  doc.text('BANK & PAYMENT ACCOUNT', 111, 48);
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(`Bank: ${bankName}`, 111, 54);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`A/C: ${accountNumber} | IFSC: ${ifscCode}`, 111, 59.5);
  doc.text(`UPI: ${storeSettings?.upiId || phone + '@upi'}`, 111, 64);

  // 3. Items Table via autoTable
  const tableRows = items.map((item, idx) => [
    idx + 1,
    item.name,
    item.category || 'Fireworks',
    item.qty || item.quantity || 1,
    `Rs.${Number(item.price).toLocaleString('en-IN')}`,
    `Rs.${(Number(item.price) * (item.qty || item.quantity || 1)).toLocaleString('en-IN')}`
  ]);

  autoTable(doc, {
    startY: 70,
    head: [['S.NO', 'PRODUCT ITEM DESCRIPTION', 'CATEGORY', 'QTY', 'UNIT PRICE', 'TOTAL (Rs.)']],
    body: tableRows,
    headStyles: {
      fillColor: [74, 14, 14],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [15, 23, 42]
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 14 },
      1: { halign: 'left' },
      2: { halign: 'center', cellWidth: 28 },
      3: { halign: 'center', cellWidth: 16, fontStyle: 'bold' },
      4: { halign: 'right', cellWidth: 28 },
      5: { halign: 'right', cellWidth: 32, fontStyle: 'bold', textColor: [192, 0, 0] }
    },
    alternateRowStyles: {
      fillColor: [254, 252, 232]
    },
    margin: { left: 14, right: 14 }
  });

  const finalY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : 120) + 8;

  // 4. Summary Totals Box (Right Aligned)
  const totalsX = 120;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(totalsX, finalY, 76, 38, 3, 3, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text('Items Subtotal:', totalsX + 4, finalY + 6);
  doc.text(`Rs.${subtotal.toLocaleString('en-IN')}`, 192, finalY + 6, { align: 'right' });

  doc.setTextColor(4, 120, 87); // Emerald discount
  doc.text('Festive Discount (10%):', totalsX + 4, finalY + 12);
  doc.text(`-Rs.${discount.toLocaleString('en-IN')}`, 192, finalY + 12, { align: 'right' });

  doc.setTextColor(51, 65, 85);
  doc.text('CGST (9%):', totalsX + 4, finalY + 18);
  doc.text(`Rs.${Math.round(gst / 2).toLocaleString('en-IN')}`, 192, finalY + 18, { align: 'right' });

  doc.text('SGST (9%):', totalsX + 4, finalY + 24);
  doc.text(`Rs.${Math.round(gst / 2).toLocaleString('en-IN')}`, 192, finalY + 24, { align: 'right' });

  // Net Bill Line
  doc.setDrawColor(74, 14, 14);
  doc.setLineWidth(0.6);
  doc.line(totalsX + 4, finalY + 27, 192, finalY + 27);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(192, 0, 0);
  doc.text('NET BILL PAID:', totalsX + 4, finalY + 34);
  doc.text(`Rs.${grandTotal.toLocaleString('en-IN')}`, 192, finalY + 34, { align: 'right' });

  // 5. Payment & Safety Notes (Left Aligned)
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, finalY, 100, 38, 3, 3, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(74, 14, 14);
  doc.text('PAYMENT & SAFETY INSTRUCTIONS:', 18, finalY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text('• Payment Status: Verified Counter Cash Payment', 18, finalY + 13);
  doc.setTextColor(146, 64, 14);
  doc.setFont('helvetica', 'bold');
  doc.text('• Safety Warning:', 18, finalY + 20);
  doc.setFont('helvetica', 'normal');
  doc.text('Burst crackers strictly outdoors under adult supervision.', 18, finalY + 25);
  doc.text('Keep water bucket nearby during fireworks activity.', 18, finalY + 30);

  // 6. Footer Terms & Signatory
  const footerY = finalY + 46;
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('TERMS & CONDITIONS:', 14, footerY);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('1. Goods once sold will not be returned or exchanged.', 14, footerY + 4);
  doc.text('2. All disputes subject to Sivakasi Jurisdiction only.', 14, footerY + 8);
  doc.text('3. This is an official computer-generated POS tax invoice receipt.', 14, footerY + 12);

  // Authorized Signatory
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.4);
  doc.line(140, footerY + 6, 196, footerY + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(74, 14, 14);
  doc.text(`For ${companyName.toUpperCase()}`, 168, footerY + 2, { align: 'center' });

  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('AUTHORIZED SIGNATORY', 168, footerY + 11, { align: 'center' });

  // Save PDF file
  doc.save(fileName);
};
