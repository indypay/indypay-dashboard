'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button, Spin, Card, Divider, Row, Col, Tag, message, Switch } from 'antd';
import {
  DownloadOutlined,
  PrinterOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';
import {
  callGetInvoiceDetails,
  callMarkInvoiceViewed,
} from '@/lib/services/invoice-service';
import { IInvoice } from '@/lib/interfaces/invoice.interface';
import { formatInvoiceStatus, getFormattedTime } from '@/lib/utils/utils';
import InvoiceBankDetails from '@/lib/components/InvoiceBankDetails/InvoiceBankDetails';
import { invoiceBankDetailsHtml } from '@/lib/constants/invoice/invoice-bank-details';
import {
  getInvoiceLineItemDisplay,
  normalizeInvoiceFromApi,
  renderInvoiceItemNameCellHtml,
  shouldShowInvoiceBankDetails,
} from '@/lib/utils/invoice.utils';
import jsPDF from 'jspdf';
import { Logo } from '@/lib/components/Logo';
import { useTenant } from '@/context/TenantContext';
import { useTenantPageTheme } from '@/lib/utils/tenant-page-theme';

// Dynamically import html2canvas
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loadHtml2Canvas = async (): Promise<any> => {
  try {
    const html2canvasModule = await import('html2canvas');
    return html2canvasModule.default;
  } catch {
    // eslint-disable-next-line no-console
    console.warn('html2canvas not available, will use print dialog fallback');
    return null;
  }
};

const getStatusStyle = (status: string): React.CSSProperties => {
  const statusLower = status.toLowerCase();
  const baseStyle = {
    borderRadius: '6px',
    padding: '6px 16px',
    fontWeight: 500,
    border: 'none',
    fontSize: '14px',
  };

  switch (statusLower) {
    case 'draft':
      return {
        ...baseStyle,
        backgroundColor: '#FFF3E0',
        color: '#F57C00',
        border: '1px solid #FFB74D',
      };
    case 'sent':
      return {
        ...baseStyle,
        backgroundColor: '#E8F5E9',
        color: '#2E7D32',
        border: '1px solid #81C784',
      };
    case 'paid':
      return {
        ...baseStyle,
        backgroundColor: '#E3F2FD',
        color: '#1976D2',
        border: '1px solid #64B5F6',
      };
    case 'failed':
      return {
        ...baseStyle,
        backgroundColor: '#FFEBEE',
        color: '#C62828',
        border: '1px solid #E57373',
      };
    default:
      return {
        ...baseStyle,
        backgroundColor: '#F5F5F5',
        color: '#666666',
        border: '1px solid #E0E0E0',
      };
  }
};

const numberToWords = (num: number): string => {
  const ones = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
  ];
  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];
  const teens = [
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];

  if (num === 0) return 'Zero';

  const convertLessThanThousand = (n: number): string => {
    if (n === 0) return '';
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100)
      return (
        tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '')
      );
    return (
      ones[Math.floor(n / 100)] +
      ' Hundred' +
      (n % 100 !== 0 ? ' ' + convertLessThanThousand(n % 100) : '')
    );
  };

  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const remainder = num % 1000;

  let result = '';
  if (crore > 0) result += convertLessThanThousand(crore) + ' Crore ';
  if (lakh > 0) result += convertLessThanThousand(lakh) + ' Lakh ';
  if (thousand > 0) result += convertLessThanThousand(thousand) + ' Thousand ';
  if (remainder > 0) result += convertLessThanThousand(remainder);

  return result.trim() + ' Rupees Only';
};

export default function PublicInvoicePage() {
  const { tenantConfig } = useTenant();
  const c = tenantConfig.colors;
  const theme = useTenantPageTheme();
  const params = useParams();
  const invoiceId = params.id as string;
  const [invoice, setInvoice] = useState<IInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  /** User-controlled: include bank details in preview, print, and PDF download */
  const [showBankDetails, setShowBankDetails] = useState(false);

  // RupeeFlow company GSTIN (used to determine inter-state vs intra-state)
  const COMPANY_GSTIN = '29AAPCR1174A1ZD';
  const COMPANY_STATE_CODE = COMPANY_GSTIN.slice(0, 2);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const [response, err] = await callGetInvoiceDetails(invoiceId);

        if (err || !response) {
          setError('Failed to load invoice details');
          message.error('Failed to load invoice');
          return;
        }
        setInvoice(normalizeInvoiceFromApi(response.data));
        // Fire-and-forget: track that the customer opened the invoice
        callMarkInvoiceViewed(invoiceId).catch(() => {});
      } catch {
        setError('An error occurred while loading the invoice');
        message.error('Error loading invoice');
      } finally {
        setLoading(false);
      }
    };

    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId]);

  useEffect(() => {
    if (invoice) {
      setShowBankDetails(shouldShowInvoiceBankDetails(invoice));
    }
  }, [invoice]);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const generateInvoiceHTML = (includeBankDetails = showBankDetails) => {
    if (!invoice) return '';

    // Calculate totals from actual items
    let subTotal = 0;
    let totalGST = 0;
    let avgTaxRate = 18;

    if (
      invoice.items &&
      Array.isArray(invoice.items) &&
      invoice.items.length > 0
    ) {
      invoice.items.forEach((invoiceItem) => {
        const itemPrice = invoiceItem.item?.price || invoiceItem.rate || 0;
        const quantity = invoiceItem.quantity || 1;
        const taxRate = invoiceItem.item?.gstRate || invoiceItem.gstRate || 18;
        const itemSubTotal = itemPrice * quantity;
        const itemGST = (itemSubTotal * taxRate) / 100;

        subTotal += itemSubTotal;
        totalGST += itemGST;
      });

      // Calculate average tax rate
      const totalItemValue = invoice.items.reduce((sum, item) => {
        const price = item.item?.price || item.rate || 0;
        const qty = item.quantity || 1;
        return sum + price * qty;
      }, 0);

      if (totalItemValue > 0) {
        avgTaxRate = Math.round((totalGST / totalItemValue) * 100);
      }
    } else {
      // Fallback calculation
      const grandTotal = invoice.totalAmount;
      subTotal = grandTotal / 1.18;
      totalGST = grandTotal - subTotal;
    }

    const grandTotal = subTotal + totalGST;
    const cgst = totalGST / 2;
    const sgst = totalGST / 2;
    const gst = avgTaxRate;
    const halfGst = Math.round(avgTaxRate / 2);

    const formatTime = (date: Date | string) => {
      const d = new Date(date);
      return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    // Format number
    const formatNumber = (num: number) => {
      return num.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    };

    // Get logo as base64 (simplified - you may want to fetch actual logo)
    const logoBase64 =
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMjAwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjEwIiB5PSIyNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzEwQjk4MSI+UlVQRUVGTE9XPC90ZXh0Pjwvc3ZnPg==';

    // Build items table rows
    const itemsRows = invoice.items
      .map((invoiceItem, index) => {
        const line = getInvoiceLineItemDisplay(invoiceItem, index);
        const itemTotal = line.price * line.quantity;

        return `
          <tr>
            <td>${index + 1}</td>
            <td class="item-cell">${renderInvoiceItemNameCellHtml(line.name, line.description)}</td>
            <td>${line.hsnCode}</td>
            <td>${formatNumber(line.price)}</td>
            <td>${line.quantity}</td>
            <td>${formatNumber(itemTotal)}</td>
          </tr>
        `;
      })
      .join('');

    // Determine if inter-state based on GSTIN state codes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customerGstin = (invoice.customer as any)?.gstin as  // eslint-disable-line @typescript-eslint/no-explicit-any
      | string
      | undefined;
    const customerStateCode = customerGstin?.slice(0, 2);
    const isInterState =
      !!customerStateCode && customerStateCode !== COMPANY_STATE_CODE;

    const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Invoice ${invoice.invoiceNumber}</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'Segoe UI', 'Arial', 'Helvetica', sans-serif;
        color: #333;
        background: #fff;
        font-size: 12px;
        line-height: 1.4;
      }

      .invoice-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px 30px;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding-bottom: 15px;
        border-bottom: 3px solid ${c.primary};
        margin-bottom: 15px;
      }

      .company-info {
        flex: 1;
      }

      .company-logo {
        margin-bottom: 8px;
      }

      .company-logo img {
        height: 40px;
        width: auto;
      }

      .company-details {
        font-size: 10px;
        color: #666;
        line-height: 1.5;
      }

      .company-details p {
        margin: 1px 0;
        font-weight: 400;
      }

      .company-details p strong {
        font-weight: 600;
      }

      .invoice-title-section {
        text-align: right;
      }

      .invoice-title {
        font-size: 32px;
        font-weight: 700;
        color: #1F2937;
        letter-spacing: 2px;
      }

      .invoice-number {
        font-size: 13px;
        color: ${c.primary};
        font-weight: 600;
        margin-top: 3px;
      }

      .invoice-meta {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        gap: 20px;
      }

      .meta-box {
        flex: 1;
        background: #F9FAFB;
        padding: 12px 15px;
        border-radius: 6px;
      }

      .meta-box h3 {
        font-size: 11px;
        text-transform: uppercase;
        color: ${c.primary};
        font-weight: 600;
        margin-bottom: 6px;
        letter-spacing: 0.5px;
      }

      .meta-box p {
        margin: 2px 0;
        color: #374151;
        font-size: 11px;
      }

      .meta-box .name {
        font-weight: 600;
        font-size: 13px;
        color: #1F2937;
      }

      .table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 12px;
      }

      .table th {
        background: ${c.primary};
        color: #fff;
        padding: 10px 12px;
        font-size: 11px;
        font-weight: 600;
        text-align: left;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .table th:first-child {
        border-radius: 6px 0 0 0;
      }

      .table th:last-child {
        border-radius: 0 6px 0 0;
        text-align: right;
      }

      .table td {
        padding: 10px 12px;
        border-bottom: 1px solid #E5E7EB;
        color: #374151;
        font-size: 11px;
      }

      .table td.item-cell {
        vertical-align: top;
        max-width: 280px;
      }

      .item-name {
        font-weight: 600;
        font-size: 11px;
        color: #1F2937;
        line-height: 1.35;
      }

      .item-desc {
        font-size: 9px;
        color: #6B7280;
        margin-top: 4px;
        line-height: 1.45;
        font-weight: 400;
      }

      .table td:last-child {
        text-align: right;
        font-weight: 500;
      }

      .tax-summary {
        margin-bottom: 12px;
      }

      .tax-summary h4 {
        font-size: 12px;
        font-weight: 600;
        color: #1F2937;
        margin-bottom: 8px;
      }

      .tax-row {
        display: flex;
        justify-content: space-between;
        padding: 6px 0;
        border-bottom: 1px solid #E5E7EB;
        font-size: 11px;
      }

      .tax-row:last-child {
        border-bottom: none;
        font-weight: 600;
      }

      .tax-label {
        color: #374151;
      }

      .tax-value {
        color: #1F2937;
      }

      .summary-layout {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 20px;
        margin-top: 12px;
        margin-bottom: 10px;
      }

      .summary-layout-bank {
        flex: 1 1 260px;
        max-width: 340px;
        min-width: 220px;
      }

      .summary-layout-totals {
        flex: 0 0 280px;
        margin-left: auto;
      }

      .bank-details-inline {
        margin-bottom: 0;
        height: 100%;
      }

      .totals-box {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 0;
      }

      .totals-table {
        width: 280px;
        border: 1px solid #E5E7EB;
        border-radius: 6px;
        overflow: hidden;
      }

      .totals-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 12px;
        border-bottom: 1px solid #E5E7EB;
        font-size: 11px;
      }

      .totals-row:last-child {
        border-bottom: none;
        background: #EBF5FF;
        font-weight: 700;
        font-size: 13px;
      }

      .totals-row .label {
        color: #374151;
      }

      .totals-row .value {
        color: #1F2937;
      }

      .totals-row:last-child .label {
        color: #1E40AF;
      }

      .totals-row:last-child .value {
        color: #1E40AF;
      }

      .amount-words {
        text-align: center;
        font-size: 11px;
        color: #1E40AF;
        font-style: italic;
        margin-bottom: 12px;
        padding: 8px;
        background: #F0F9FF;
        border-radius: 6px;
      }

      .bank-details-box {
        margin-bottom: 12px;
        padding: 10px 12px;
        background: #F8FAF9;
        border-radius: 6px;
        border: 1px solid #E5E7EB;
      }

      .bank-details-box h4 {
        font-size: 10px;
        color: #6B7280;
        margin: 0 0 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .bank-details-box p {
        font-size: 10px;
        margin: 2px 0;
        color: #374151;
      }

      .notes-section {
        display: flex;
        gap: 15px;
        margin-bottom: 12px;
      }

      .notes-box {
        flex: 1;
        padding: 10px 12px;
        background: #F9FAFB;
        border-radius: 6px;
      }

      .notes-box h4 {
        font-size: 10px;
        text-transform: uppercase;
        color: ${c.primary};
        font-weight: 600;
        margin-bottom: 5px;
        letter-spacing: 0.5px;
      }

      .notes-box p {
        color: #4B5563;
        font-size: 10px;
        line-height: 1.5;
      }

      .footer {
        text-align: center;
        padding-top: 12px;
        border-top: 2px solid #E5E7EB;
      }

      .footer-thanks {
        font-size: 14px;
        font-weight: 600;
        color: ${c.primary};
        margin-bottom: 5px;
      }

      .footer-contact {
        font-size: 12px;
        color: #6B7280;
        margin-bottom: 15px;
      }

      .footer-company {
        font-size: 11px;
        color: #9CA3AF;
        line-height: 1.6;
      }

      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    </style>
  </head>
  <body>
    <div class="invoice-container">
      <div class="header">
        <div class="company-info">
          <div class="company-logo">
            <img src="${logoBase64}" alt="Rupeeflow" style="height: 40px; width: auto;" />
          </div>
          <div class="company-details">
            <p><strong>RUPEEFLOW FINANCE PRIVATE LIMITED</strong></p>
            <p>CIN: U64990KA2025PTC209485</p>
            <p>GSTIN: 29AAPCR1174A1ZD</p>
            <p>NO. 112 AKR TECH PARK, KRISHNA REDDY IND. AREA</p>
            <p>Bommanahalli, Bangalore, Karnataka 560068, India</p>
          </div>
        </div>
        <div class="invoice-title-section">
          <div class="invoice-title">INVOICE</div>
          <div class="invoice-number">#${invoice.invoiceNumber}</div>
        </div>
      </div>

      <div class="invoice-meta">
        <div class="meta-box" style="max-width: 350px;">
          <h3>Bill To</h3>
          <p class="name">${invoice.customer.name}</p>
          <p>${invoice.billingAddress || invoice.customer.email}</p>
          ${(invoice.customer as any)?.gstin ? `<p><strong>GSTIN:</strong> ${(invoice.customer as any).gstin}</p>` : ''}
        </div>
        <div class="meta-box" style="max-width: 200px;">
          <h3>Invoice Details</h3>
          <p><strong>Date:</strong> ${formatTime(invoice.issueDate)}</p>
          <p><strong>Invoice #:</strong> ${invoice.invoiceNumber}</p>
        </div>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th style="width: 35px;">SL.</th>
            <th>Item Name</th>
            <th style="width: 90px;">HSN Code</th>
            <th style="width: 80px;">Price</th>
            <th style="width: 50px;">Qty.</th>
            <th style="width: 90px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <div class="tax-summary">
        <h4>Tax Summary ${isInterState ? '(Inter-State)' : '(Intra-State)'}</h4>
        ${
          isInterState
            ? `
        <div class="tax-row">
          <span class="tax-label">IGST @ ${gst}%</span>
          <span class="tax-value">₹ ${formatNumber(totalGST)}</span>
        </div>
        `
            : `
        <div class="tax-row">
          <span class="tax-label">CGST @ ${halfGst}%</span>
          <span class="tax-value">₹ ${formatNumber(cgst)}</span>
        </div>
        <div class="tax-row">
          <span class="tax-label">SGST @ ${halfGst}%</span>
          <span class="tax-value">₹ ${formatNumber(sgst)}</span>
        </div>
        `
        }
        <div class="tax-row">
          <span class="tax-label">Total GST (${gst}%)</span>
          <span class="tax-value">₹ ${formatNumber(totalGST)}</span>
        </div>
      </div>

      <div class="summary-layout">
        ${
          includeBankDetails
            ? `<div class="summary-layout-bank">${invoiceBankDetailsHtml(true)}</div>`
            : ''
        }
        <div class="summary-layout-totals">
          <div class="totals-box">
            <div class="totals-table">
              <div class="totals-row">
                <span class="label">Sub Total:</span>
                <span class="value">₹ ${formatNumber(subTotal)}</span>
              </div>
              ${
                isInterState
                  ? `
              <div class="totals-row">
                <span class="label">IGST (${gst}%):</span>
                <span class="value">₹ ${formatNumber(totalGST)}</span>
              </div>
              `
                  : `
              <div class="totals-row">
                <span class="label">CGST (${halfGst}%):</span>
                <span class="value">₹ ${formatNumber(cgst)}</span>
              </div>
              <div class="totals-row">
                <span class="label">SGST (${halfGst}%):</span>
                <span class="value">₹ ${formatNumber(sgst)}</span>
              </div>
              `
              }
              <div class="totals-row">
                <span class="label">Grand Total:</span>
                <span class="value">₹ ${formatNumber(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="amount-words">
        (Amount in Words: ${numberToWords(Math.round(grandTotal))})
      </div>

      <div class="notes-section">
        ${
          invoice.customerNotes
            ? `
        <div class="notes-box">
          <h4>Notes</h4>
          <p>${invoice.customerNotes}</p>
        </div>
        `
            : ''
        }
        <div class="notes-box">
          <h4>Terms & Conditions</h4>
          <p style="font-size: 9px; line-height: 1.4;">
            1. Payment is due within the specified due date. Late payments may incur additional charges.<br>
            2. All disputes are subject to Bangalore jurisdiction.<br>
            3. This is a computer-generated invoice and does not require a signature.<br>
            4. For complete terms, visit: <span style="color: ${c.primary};">https://rupeeflow.co/legal/terms/</span>
          </p>
        </div>
      </div>

      <div class="footer">
        <div class="footer-thanks">Thank you for your business!</div>
        <div class="footer-contact">For any queries, please contact us at support@rupeeflow.co</div>
        <div class="footer-company">
          RUPEEFLOW FINANCE PRIVATE LIMITED | CIN: U64990KA2025PTC209485 | GSTIN: 29AAPCR1174A1ZD
        </div>
      </div>
    </div>
  </body>
</html>`;

    return html;
  };
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const handleDownload = async () => {
    try {
      if (!invoice) return;

      // Try to load html2canvas
      const html2canvas = await loadHtml2Canvas();

      // Fallback: Use print dialog if html2canvas is not available
      if (!html2canvas) {
        const htmlContent = generateInvoiceHTML(showBankDetails);
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(htmlContent);
          printWindow.document.close();
          setTimeout(() => {
            printWindow.print();
          }, 250);
          message.info(
            'Please select "Save as PDF" in the print dialog. Run "pnpm install" to enable direct PDF download.',
          );
        } else {
          message.error('Please allow popups to download the invoice.');
        }
        return;
      }

      message.loading({
        content: 'Generating PDF...',
        key: 'pdf-gen',
        duration: 0,
      });

      const htmlContent = generateInvoiceHTML(showBankDetails);

      // Create a temporary container to render the HTML
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '800px';
      tempDiv.style.padding = '20px';
      tempDiv.style.background = '#fff';
      tempDiv.innerHTML = htmlContent;
      document.body.appendChild(tempDiv);

      // Wait for images and fonts to load
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Convert HTML to canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: 800,
        windowWidth: 800,
        backgroundColor: '#ffffff',
        letterRendering: true,
        allowTaint: false,
      });

      // Remove temporary div
      document.body.removeChild(tempDiv);

      // Calculate PDF dimensions
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = (imgHeight * pdfWidth) / imgWidth;

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        0,
        pdfWidth,
        pdfHeight,
      );

      // Save PDF
      pdf.save(`Invoice-${invoice.invoiceNumber || invoiceId}.pdf`);

      message.success({
        content: 'Invoice PDF downloaded successfully!',
        key: 'pdf-gen',
      });
    } catch (error) {
      message.error({
        content: 'Failed to generate PDF. Please try again.',
        key: 'pdf-gen',
      });
      // eslint-disable-next-line no-console
      console.error('Download error:', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleProceedToPay = () => {
    message.info('Proceeding to payment...');
    // TODO: Implement payment checkout
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: '#F5F5F5',
        }}
      >
        <Spin size="large" tip="Loading invoice..." />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: '#F5F5F5',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div style={{ fontSize: '48px', color: '#D51C44' }}>⚠️</div>
        <div style={{ fontSize: '24px', color: '#666666', fontWeight: 600 }}>
          {error || 'Invoice not found'}
        </div>
        <div style={{ fontSize: '14px', color: '#999999' }}>
          Please check the invoice link and try again
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F5F5F5',
        padding: '40px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        {/* Download options */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 20px',
              background: '#FFFFFF',
              borderRadius: '10px',
              border: '1px solid #E0E0E0',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            }}
          >
            <Switch
              checked={showBankDetails}
              onChange={setShowBankDetails}
              style={{
                backgroundColor: showBankDetails ? c.primary : undefined,
              }}
            />
            <span style={{ fontSize: '14px', color: '#333333', fontWeight: 500 }}>
              Include bank account details on invoice
            </span>
          </div>
        </div>

        {/* Action Buttons - Fixed at top */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '30px',
            flexWrap: 'wrap',
          }}
        >
          <Button
            type="default"
            size="large"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            style={{
              background: '#FFFFFF',
              border: '2px solid transparent',
              backgroundImage:
                `linear-gradient(white, white), ${theme.gradientButton}`,
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
              color: c.secondary,
              fontWeight: 600,
              height: '48px',
              fontSize: '16px',
              borderRadius: '8px',
              minWidth: '180px',
            }}
          >
            Download Invoice
          </Button>
          <Button
            type="default"
            size="large"
            icon={<PrinterOutlined />}
            onClick={handlePrint}
            style={{
              background: '#FFFFFF',
              border: '2px solid transparent',
              backgroundImage:
                `linear-gradient(white, white), ${theme.gradientButton}`,
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
              color: c.secondary,
              fontWeight: 600,
              height: '48px',
              fontSize: '16px',
              borderRadius: '8px',
              minWidth: '180px',
            }}
          >
            Print Invoice
          </Button>
          <Button
            type="primary"
            size="large"
            icon={<CreditCardOutlined />}
            onClick={handleProceedToPay}
            style={{
              background: theme.gradientButton,
              border: 'none',
              color: '#FFFFFF',
              fontWeight: 600,
              height: '48px',
              fontSize: '16px',
              borderRadius: '8px',
              minWidth: '180px',
            }}
          >
            Proceed to Pay
          </Button>
        </div>

        {/* Invoice Card */}
        <Card
          id="invoice-content"
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            border: 'none',
          }}
          styles={{ body: { padding: '40px' } }}
        >
          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <Row justify="space-between" align="top">
              <Col>
                <div style={{ marginBottom: '12px' }}>
                  {/* <Image
                    src={CompanyLogo}
                    alt="RupeeFlow"
                    width={200}
                    height={40}
                  /> */}

                  <Logo isCollapsed={false} compact />
                </div>
                <div style={{ color: '#666666', fontSize: '14px' }}>
                  Invoicing and payments powered by {tenantConfig.name}
                </div>
              </Col>
              <Col style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: '32px',
                    fontWeight: 700,
                    color: '#333333',
                    marginBottom: '8px',
                  }}
                >
                  INVOICE
                </div>
                <Tag
                  style={getStatusStyle(formatInvoiceStatus(invoice.status))}
                  bordered={false}
                >
                  {formatInvoiceStatus(invoice.status)}
                </Tag>
              </Col>
            </Row>
          </div>

          <Divider style={{ borderColor: '#E0E0E0' }} />

          {/* Invoice Details */}
          <Row gutter={[32, 24]} style={{ marginBottom: '32px' }}>
            <Col span={12}>
              <div style={{ marginBottom: '24px' }}>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#999999',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    marginBottom: '8px',
                  }}
                >
                  INVOICE NUMBER
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    color: '#333333',
                    fontWeight: 600,
                  }}
                >
                  {invoice.invoiceNumber}
                </div>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#999999',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    marginBottom: '8px',
                  }}
                >
                  ISSUE DATE
                </div>
                <div style={{ fontSize: '16px', color: '#333333' }}>
                  {getFormattedTime(invoice.issueDate)}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#999999',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    marginBottom: '8px',
                  }}
                >
                  DUE DATE
                </div>
                <div style={{ fontSize: '16px', color: '#333333' }}>
                  {getFormattedTime(invoice.expiryDate)}
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#999999',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    marginBottom: '8px',
                  }}
                >
                  BILLED TO
                </div>
                <div
                  style={{
                    fontSize: '18px',
                    color: '#333333',
                    fontWeight: 600,
                    marginBottom: '8px',
                  }}
                >
                  {invoice.customer.name}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: '#666666',
                    marginBottom: '4px',
                  }}
                >
                  {invoice.customer.email}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: '#666666',
                    marginBottom: '12px',
                  }}
                >
                  {invoice.customer.contactNumber}
                </div>
                {invoice.billingAddress && (
                  <div
                    style={{
                      fontSize: '14px',
                      color: '#666666',
                      lineHeight: '1.6',
                      maxWidth: '300px',
                    }}
                  >
                    {invoice.billingAddress}
                  </div>
                )}
              </div>
            </Col>
          </Row>

          {/* Description */}
          {invoice.description && (
            <div style={{ marginBottom: '32px' }}>
              <div
                style={{
                  fontSize: '12px',
                  color: '#999999',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  marginBottom: '8px',
                }}
              >
                DESCRIPTION
              </div>
              <div
                style={{
                  fontSize: '16px',
                  color: '#333333',
                  lineHeight: '1.6',
                }}
              >
                {invoice.description}
              </div>
            </div>
          )}

          <Divider style={{ borderColor: '#E0E0E0' }} />

          {/* Items Table */}
          {invoice.items &&
            Array.isArray(invoice.items) &&
            invoice.items.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    marginBottom: '24px',
                  }}
                >
                  <thead>
                    <tr style={{ background: c.primary }}>
                      <th
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          color: '#FFFFFF',
                          fontSize: '11px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          width: '50px',
                        }}
                      >
                        SL.
                      </th>
                      <th
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          color: '#FFFFFF',
                          fontSize: '11px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Item Name
                      </th>
                      <th
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          color: '#FFFFFF',
                          fontSize: '11px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          width: '120px',
                        }}
                      >
                        HSN Code
                      </th>
                      <th
                        style={{
                          padding: '12px',
                          textAlign: 'right',
                          color: '#FFFFFF',
                          fontSize: '11px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          width: '100px',
                        }}
                      >
                        Price
                      </th>
                      <th
                        style={{
                          padding: '12px',
                          textAlign: 'center',
                          color: '#FFFFFF',
                          fontSize: '11px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          width: '80px',
                        }}
                      >
                        Qty.
                      </th>
                      <th
                        style={{
                          padding: '12px',
                          textAlign: 'right',
                          color: '#FFFFFF',
                          fontSize: '11px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          width: '120px',
                        }}
                      >
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((invoiceItem, index) => {
                      const line = getInvoiceLineItemDisplay(invoiceItem, index);
                      const itemTotal = line.price * line.quantity;

                      return (
                        <tr
                          key={invoiceItem.id || invoiceItem.item?.id || index}
                          style={{
                            borderBottom: '1px solid #E5E7EB',
                          }}
                        >
                          <td
                            style={{
                              padding: '12px',
                              color: '#374151',
                              fontSize: '12px',
                            }}
                          >
                            {index + 1}
                          </td>
                          <td
                            style={{
                              padding: '12px',
                              color: '#374151',
                              fontSize: '12px',
                              fontWeight: 500,
                              verticalAlign: 'top',
                            }}
                          >
                            <div
                              style={{
                                fontWeight: 600,
                                fontSize: '13px',
                                color: '#1F2937',
                                lineHeight: 1.35,
                              }}
                            >
                              {line.name}
                            </div>
                            {line.description ? (
                              <div
                                style={{
                                  fontSize: '11px',
                                  color: '#6B7280',
                                  marginTop: '4px',
                                  lineHeight: 1.45,
                                  fontWeight: 400,
                                }}
                              >
                                {line.description}
                              </div>
                            ) : null}
                          </td>
                          <td
                            style={{
                              padding: '12px',
                              color: '#374151',
                              fontSize: '12px',
                            }}
                          >
                            {line.hsnCode}
                          </td>
                          <td
                            style={{
                              padding: '12px',
                              color: '#374151',
                              fontSize: '12px',
                              textAlign: 'right',
                            }}
                          >
                            ₹{' '}
                            {line.price.toLocaleString('en-IN', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td
                            style={{
                              padding: '12px',
                              color: '#374151',
                              fontSize: '12px',
                              textAlign: 'center',
                            }}
                          >
                            {line.quantity}
                          </td>
                          <td
                            style={{
                              padding: '12px',
                              color: '#374151',
                              fontSize: '12px',
                              fontWeight: 500,
                              textAlign: 'right',
                            }}
                          >
                            ₹{' '}
                            {itemTotal.toLocaleString('en-IN', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

          <Divider style={{ borderColor: '#E0E0E0' }} />

          {/* Tax Summary Section */}
          <div style={{ marginTop: '32px' }}>
            <div
              style={{
                fontSize: '20px',
                fontWeight: 600,
                color: '#1A5490',
                marginBottom: '24px',
              }}
            >
              Tax Summary
            </div>

            {/* Tax Breakdown */}
            <div style={{ marginBottom: '24px' }}>
              {(() => {
                // Calculate from actual items
                let subTotal = 0;
                let totalGST = 0;
                let avgTaxRate = 18;

                if (invoice.items && Array.isArray(invoice.items)) {
                  invoice.items.forEach((invoiceItem) => {
                    const itemPrice =
                      invoiceItem.item?.price || invoiceItem.rate || 0;
                    const quantity = invoiceItem.quantity || 1;
                    const taxRate =
                      invoiceItem.item?.gstRate || invoiceItem.gstRate || 18;
                    const itemSubTotal = itemPrice * quantity;
                    const itemGST = (itemSubTotal * taxRate) / 100;

                    subTotal += itemSubTotal;
                    totalGST += itemGST;
                  });

                  if (subTotal > 0) {
                    avgTaxRate = Math.round((totalGST / subTotal) * 100);
                  }
                } else {
                  // Fallback calculation
                  const grandTotal = invoice.totalAmount;
                  subTotal = grandTotal / 1.18;
                  totalGST = grandTotal - subTotal;
                  avgTaxRate = 18;
                }

                const grandTotal = subTotal + totalGST;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const customerGstin = (invoice.customer as any)?.gstin as
                  | string
                  | undefined;
                const customerStateCode = customerGstin?.slice(0, 2);
                const isInterState =
                  !!customerStateCode &&
                  customerStateCode !== COMPANY_STATE_CODE;

                const cgst = isInterState ? 0 : totalGST / 2;
                const sgst = isInterState ? 0 : totalGST / 2;
                const igst = isInterState ? totalGST : 0;
                const halfGstRate = Math.round(avgTaxRate / 2);

                return (
                  <>
                    {/* GST Breakdown */}
                    {isInterState ? (
                      <>
                        {/* IGST */}
                        <Row
                          justify="space-between"
                          style={{
                            padding: '12px 0',
                            borderBottom: '2px solid #333333',
                          }}
                        >
                          <Col>
                            <span
                              style={{ fontSize: '15px', color: '#333333' }}
                            >
                              IGST @ {avgTaxRate}%
                            </span>
                          </Col>
                          <Col>
                            <span
                              style={{
                                fontSize: '15px',
                                color: '#333333',
                                fontWeight: 500,
                              }}
                            >
                              ₹ {igst.toFixed(2)}
                            </span>
                          </Col>
                        </Row>
                      </>
                    ) : (
                      <>
                        {/* CGST */}
                        <Row
                          justify="space-between"
                          style={{
                            padding: '12px 0',
                            borderBottom: '1px solid #E0E0E0',
                          }}
                        >
                          <Col>
                            <span
                              style={{ fontSize: '15px', color: '#333333' }}
                            >
                              CGST @ {halfGstRate}%
                            </span>
                          </Col>
                          <Col>
                            <span
                              style={{
                                fontSize: '15px',
                                color: '#333333',
                                fontWeight: 500,
                              }}
                            >
                              ₹ {cgst.toFixed(2)}
                            </span>
                          </Col>
                        </Row>

                        {/* SGST */}
                        <Row
                          justify="space-between"
                          style={{
                            padding: '12px 0',
                            borderBottom: '1px solid #E0E0E0',
                          }}
                        >
                          <Col>
                            <span
                              style={{ fontSize: '15px', color: '#333333' }}
                            >
                              SGST @ {halfGstRate}%
                            </span>
                          </Col>
                          <Col>
                            <span
                              style={{
                                fontSize: '15px',
                                color: '#333333',
                                fontWeight: 500,
                              }}
                            >
                              ₹ {sgst.toFixed(2)}
                            </span>
                          </Col>
                        </Row>

                        {/* Total GST */}
                        <Row
                          justify="space-between"
                          style={{
                            padding: '12px 0',
                            borderBottom: '2px solid #333333',
                          }}
                        >
                          <Col>
                            <span
                              style={{
                                fontSize: '15px',
                                color: '#333333',
                                fontWeight: 600,
                              }}
                            >
                              Total GST ({avgTaxRate}%)
                            </span>
                          </Col>
                          <Col>
                            <span
                              style={{
                                fontSize: '15px',
                                color: '#333333',
                                fontWeight: 600,
                              }}
                            >
                              ₹ {totalGST.toFixed(2)}
                            </span>
                          </Col>
                        </Row>
                      </>
                    )}

                    {/* Bank details (left) + totals (right) */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '24px',
                        marginTop: '24px',
                        flexWrap: 'wrap',
                      }}
                    >
                      {showBankDetails && (
                        <div
                          style={{
                            flex: '1 1 280px',
                            maxWidth: '380px',
                            minWidth: '240px',
                          }}
                        >
                          <InvoiceBankDetails variant="inline" />
                        </div>
                      )}
                      <div
                        style={{
                          flex: showBankDetails ? '0 0 450px' : '1 1 auto',
                          marginLeft: showBankDetails ? 0 : 'auto',
                          maxWidth: '450px',
                          width: showBankDetails ? '450px' : '100%',
                        }}
                      >
                      {/* Sub Total */}
                      <Row
                        justify="space-between"
                        style={{
                          padding: '12px 16px',
                          backgroundColor: '#F5F5F5',
                        }}
                      >
                        <Col>
                          <span style={{ fontSize: '15px', color: '#333333' }}>
                            Sub Total:
                          </span>
                        </Col>
                        <Col>
                          <span
                            style={{
                              fontSize: '15px',
                              color: '#333333',
                              fontWeight: 500,
                            }}
                          >
                            ₹ {subTotal.toFixed(2)}
                          </span>
                        </Col>
                      </Row>

                      {/* GST Rows */}
                      {isInterState ? (
                        <Row
                          justify="space-between"
                          style={{
                            padding: '12px 16px',
                            backgroundColor: '#F5F5F5',
                          }}
                        >
                          <Col>
                            <span
                              style={{ fontSize: '15px', color: '#333333' }}
                            >
                              IGST ({avgTaxRate}%):
                            </span>
                          </Col>
                          <Col>
                            <span
                              style={{
                                fontSize: '15px',
                                color: '#333333',
                                fontWeight: 500,
                              }}
                            >
                              ₹ {igst.toFixed(2)}
                            </span>
                          </Col>
                        </Row>
                      ) : (
                        <>
                          <Row
                            justify="space-between"
                            style={{
                              padding: '12px 16px',
                              backgroundColor: '#F5F5F5',
                            }}
                          >
                            <Col>
                              <span
                                style={{ fontSize: '15px', color: '#333333' }}
                              >
                                CGST ({halfGstRate}%):
                              </span>
                            </Col>
                            <Col>
                              <span
                                style={{
                                  fontSize: '15px',
                                  color: '#333333',
                                  fontWeight: 500,
                                }}
                              >
                                ₹ {cgst.toFixed(2)}
                              </span>
                            </Col>
                          </Row>

                          <Row
                            justify="space-between"
                            style={{
                              padding: '12px 16px',
                              backgroundColor: '#F5F5F5',
                            }}
                          >
                            <Col>
                              <span
                                style={{ fontSize: '15px', color: '#333333' }}
                              >
                                SGST ({halfGstRate}%):
                              </span>
                            </Col>
                            <Col>
                              <span
                                style={{
                                  fontSize: '15px',
                                  color: '#333333',
                                  fontWeight: 500,
                                }}
                              >
                                ₹ {sgst.toFixed(2)}
                              </span>
                            </Col>
                          </Row>
                        </>
                      )}

                      {/* Grand Total */}
                      <Row
                        justify="space-between"
                        style={{
                          padding: '14px 16px',
                          backgroundColor: '#D6E4F0',
                        }}
                      >
                        <Col>
                          <span
                            style={{
                              fontSize: '16px',
                              color: '#1A5490',
                              fontWeight: 600,
                            }}
                          >
                            Grand Total:
                          </span>
                        </Col>
                        <Col>
                          <span
                            style={{
                              fontSize: '16px',
                              color: '#1A5490',
                              fontWeight: 700,
                            }}
                          >
                            ₹{' '}
                            {grandTotal.toLocaleString('en-IN', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </Col>
                      </Row>
                      </div>
                    </div>

                    {/* Amount in Words */}
                    <div
                      style={{
                        marginTop: '16px',
                        textAlign: 'center',
                        fontSize: '14px',
                        color: '#666666',
                        fontStyle: 'italic',
                      }}
                    >
                      (Amount in Words: {numberToWords(Math.round(grandTotal))})
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Notes and Terms */}
          {(invoice.customerNotes || invoice.termsAndServices) && (
            <>
              <Divider style={{ borderColor: '#E0E0E0', marginTop: '32px' }} />
              <Row gutter={[32, 24]} style={{ marginTop: '24px' }}>
                {invoice.customerNotes && (
                  <Col span={12}>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#999999',
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        marginBottom: '8px',
                      }}
                    >
                      NOTES
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: '#666666',
                        lineHeight: '1.6',
                      }}
                    >
                      {invoice.customerNotes}
                    </div>
                  </Col>
                )}
                {invoice.termsAndServices && (
                  <Col span={12}>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#999999',
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        marginBottom: '8px',
                      }}
                    >
                      TERMS & CONDITIONS
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: '#666666',
                        lineHeight: '1.6',
                      }}
                    >
                      {invoice.termsAndServices}
                    </div>
                  </Col>
                )}
              </Row>
            </>
          )}

          {/* Footer */}
          <div
            style={{
              marginTop: '40px',
              paddingTop: '24px',
              borderTop: '1px solid #E0E0E0',
              textAlign: 'center',
              color: '#999999',
              fontSize: '12px',
            }}
          >
            Invoice ID: {invoice.id} | Created:{' '}
            {getFormattedTime(invoice.createdAt)}
          </div>
        </Card>

        {/* Promotional Banner */}
        <Card
          className="no-print"
          style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            border: '1px solid #E0E0E0',
            marginTop: '30px',
          }}
          styles={{ body: { padding: '24px 32px' } }}
        >
          <Row justify="space-between" align="middle" gutter={[16, 16]}>
            <Col xs={24} md={16}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                {/* <Image
                  src={CompanyLogo}
                  alt="RupeeFlow"
                  width={140}
                  height={35}
                  style={{ objectFit: 'contain' }}
                /> */}
                <Logo isCollapsed={false} compact />
                <div
                  style={{
                    fontSize: '16px',
                    color: '#333333',
                    lineHeight: '1.5',
                  }}
                >
                  Want to create invoices for your business? Visit{' '}
                  <a
                    href="https://rupeeflow.com/invoices/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: theme.gradientButton,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    https://rupeeflow.com/invoices/
                  </a>{' '}
                  and get started instantly.
                </div>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#666666',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <svg width="40" height="16" viewBox="0 0 40 16" fill="none">
                    <text
                      x="0"
                      y="12"
                      fontSize="12"
                      fontWeight="600"
                      fill="#666666"
                    >
                      UPI
                    </text>
                  </svg>
                  <svg width="40" height="24" viewBox="0 0 40 24">
                    <rect width="40" height="24" rx="3" fill="#1A1F71" />
                    <text
                      x="6"
                      y="16"
                      fontSize="10"
                      fontWeight="bold"
                      fill="white"
                    >
                      VISA
                    </text>
                  </svg>
                  <svg width="36" height="24" viewBox="0 0 36 24">
                    <circle cx="12" cy="12" r="10" fill="#EB001B" />
                    <circle cx="24" cy="12" r="10" fill="#F79E1B" />
                  </svg>
                  <svg width="45" height="16" viewBox="0 0 45 16">
                    <text
                      x="0"
                      y="12"
                      fontSize="11"
                      fontWeight="600"
                      fill="#097939"
                    >
                      RuPay
                    </text>
                  </svg>
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Footer Text */}
        <div
          className="no-print"
          style={{
            textAlign: 'center',
            marginTop: '30px',
            color: '#999999',
            fontSize: '14px',
          }}
        >
          Powered by{' '}
          <span
            style={{
              background: theme.gradientButton,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 600,
            }}
          >
            {tenantConfig.name}
          </span>
        </div>
      </div>

      {/* Print Styles */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            margin: 0;
            padding: 0;
          }
          #invoice-content {
            box-shadow: none !important;
            border: 1px solid #e0e0e0 !important;
            page-break-inside: avoid;
          }
          @page {
            margin: 1cm;
            size: A4;
          }
        }
      `}</style>
    </div>
  );
}
