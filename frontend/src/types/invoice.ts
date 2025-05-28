
export interface Customer {
  name: string;
  address: string;
  phone: string;
  email: string;
  gstin?: string;
}

export interface Product {
  productName: string;
  hsnCode: string;
  qty: number;
  salePrice: number;
  discount: number;
  taxableValue: number;
  gst: number;
  totalValue: number;
}

export interface InvoiceFormData {
  invoiceNo: string;
  invoiceDate: Date;
  invoiceTime: string;
  customer: Customer;
  products: Product[];
  paymentMethod: 'Cash' | 'Online Transfer' | 'On Credit';
  transactionId?: string;
  narration?: string;
}

export interface InvoiceData extends InvoiceFormData {
  totalInvoiceValue: number;
  generationTimestamp: string;
}
