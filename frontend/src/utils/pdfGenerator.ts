import { InvoiceData } from '@/types/invoice';

export const generateInvoicePDF = (invoiceData: InvoiceData) => {
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Please allow popups to generate PDF');
    return;
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice ${invoiceData.invoiceNo}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          border: 1px solid #ddd;
          padding: 20px;
        }
        .invoice-header {
          text-align: center;
          border-bottom: 2px solid #007bff;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .invoice-title {
          font-size: 32px;
          font-weight: bold;
          color: #007bff;
          margin: 0;
        }
        .invoice-details {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .invoice-info, .customer-info {
          flex: 1;
        }
        .invoice-info {
          margin-right: 20px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #007bff;
          margin-bottom: 10px;
          border-bottom: 1px solid #eee;
          padding-bottom: 5px;
        }
        .info-row {
          margin-bottom: 8px;
        }
        .label {
          font-weight: bold;
          display: inline-block;
          width: 120px;
        }
        .products-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .products-table th,
        .products-table td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }
        .products-table th {
          background-color: #f8f9fa;
          font-weight: bold;
          color: #007bff;
        }
        .products-table tr:nth-child(even) {
          background-color: #f8f9fa;
        }
        .text-right {
          text-align: right;
        }
        .text-center {
          text-align: center;
        }
        .total-section {
          margin-top: 20px;
          padding: 15px;
          background-color: #f8f9fa;
          border-radius: 5px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 18px;
          font-weight: bold;
        }
        .grand-total {
          color: #007bff;
          font-size: 24px;
          border-top: 2px solid #007bff;
          padding-top: 10px;
        }
        .payment-section {
          margin-top: 30px;
          padding: 15px;
          background-color: #fff3cd;
          border-radius: 5px;
          border-left: 4px solid #ffc107;
        }
        .narration-section {
          margin-top: 20px;
          padding: 15px;
          background-color: #e7f3ff;
          border-radius: 5px;
          border-left: 4px solid #007bff;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #666;
          font-size: 12px;
        }
        .generation-info {
          margin-top: 10px;
          padding: 10px;
          background-color: #f8f9fa;
          border-radius: 5px;
          font-size: 12px;
          color: #666;
        }
        @media print {
          body { margin: 0; }
          .invoice-container { border: none; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="invoice-header">
          <h1 class="invoice-title">INVOICE</h1>
        </div>

        <div class="invoice-details">
          <div class="invoice-info">
            <h3 class="section-title">Invoice Details</h3>
            <div class="info-row">
              <span class="label">Invoice No:</span>
              <span>${invoiceData.invoiceNo}</span>
            </div>
            <div class="info-row">
              <span class="label">Date:</span>
              <span>${formatDate(invoiceData.invoiceDate)}</span>
            </div>
            <div class="info-row">
              <span class="label">Time:</span>
              <span>${invoiceData.invoiceTime}</span>
            </div>
          </div>

          <div class="customer-info">
            <h3 class="section-title">Bill To</h3>
            <div class="info-row">
              <span class="label">Name:</span>
              <span>${invoiceData.customer.name}</span>
            </div>
            <div class="info-row">
              <span class="label">Email:</span>
              <span>${invoiceData.customer.email}</span>
            </div>
            <div class="info-row">
              <span class="label">Phone:</span>
              <span>${invoiceData.customer.phone}</span>
            </div>
            <div class="info-row">
              <span class="label">Address:</span>
              <span>${invoiceData.customer.address}</span>
            </div>
            ${invoiceData.customer.gstin ? `
            <div class="info-row">
              <span class="label">GSTIN:</span>
              <span>${invoiceData.customer.gstin}</span>
            </div>
            ` : ''}
          </div>
        </div>

        <h3 class="section-title">Products & Services</h3>
        <table class="products-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Product/Service</th>
              <th>HSN Code</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Discount</th>
              <th>Taxable Value</th>
              <th>GST (18%)</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoiceData.products.map((product, index) => `
              <tr>
                <td class="text-center">${index + 1}</td>
                <td>${product.productName}</td>
                <td class="text-center">${product.hsnCode}</td>
                <td class="text-center">${product.qty}</td>
                <td class="text-right">${formatCurrency(product.salePrice)}</td>
                <td class="text-center">${product.discount}%</td>
                <td class="text-right">${formatCurrency(product.taxableValue)}</td>
                <td class="text-right">${formatCurrency(product.gst)}</td>
                <td class="text-right">${formatCurrency(product.totalValue)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total-section">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>${formatCurrency(invoiceData.products.reduce((sum, p) => sum + p.taxableValue, 0))}</span>
          </div>
          <div class="total-row">
            <span>Total GST:</span>
            <span>${formatCurrency(invoiceData.products.reduce((sum, p) => sum + p.gst, 0))}</span>
          </div>
          <div class="total-row grand-total">
            <span>Grand Total:</span>
            <span>${formatCurrency(invoiceData.totalInvoiceValue)}</span>
          </div>
        </div>

        <div class="payment-section">
          <h3 class="section-title">Payment Information</h3>
          <div class="info-row">
            <span class="label">Payment Method:</span>
            <span>${invoiceData.paymentMethod}</span>
          </div>
          ${invoiceData.transactionId ? `
          <div class="info-row">
            <span class="label">Transaction ID:</span>
            <span>${invoiceData.transactionId}</span>
          </div>
          ` : ''}
        </div>

        ${invoiceData.narration ? `
        <div class="narration-section">
          <h3 class="section-title">Notes</h3>
          <p>${invoiceData.narration}</p>
        </div>
        ` : ''}

        <div class="footer">
          <p>Thank you for your business!</p>
          <div class="generation-info">
            <p><strong>Invoice Generated:</strong> ${formatDateTime(invoiceData.generationTimestamp)}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
};
