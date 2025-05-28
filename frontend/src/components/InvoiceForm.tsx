import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { InvoiceDetailsSection } from './InvoiceDetailsSection';
import { CustomerDetailsSection } from './CustomerDetailsSection';
import { ProductTableSection } from './ProductTableSection';
import { PaymentDetailsSection } from './PaymentDetailsSection';
import { NarrationSection } from './NarrationSection';
import { InvoiceFormData, InvoiceData } from '@/types/invoice';

// Updated Zod schema with stricter validation
const productSchema = z.object({
  productName: z.string().min(1, 'Product is required'),
  hsnCode: z.string().min(1, 'HSN Code is required'),
  qty: z.number().min(1, 'Quantity must be at least 1'),
  salePrice: z.number().min(0.01, 'Sale price must be greater than 0'),
  discount: z.number().min(0).max(100, 'Discount must be between 0 and 100').default(0),
  taxableValue: z.number(),
  gst: z.number(),
  totalValue: z.number()
});

const invoiceSchema = z.object({
  invoiceNo: z.string().min(1, 'Invoice number is required'),
  invoiceDate: z.date({
    required_error: 'Invoice date is required'
  }),
  invoiceTime: z.string().min(1, 'Invoice time is required'),
  customer: z.object({
    name: z.string().min(1, 'Customer name is required'),
    address: z.string().min(1, 'Customer address is required'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits').regex(/^\d+$/, 'Phone number must contain only digits'),
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    gstin: z.string().optional()
  }),
  products: z.array(productSchema).min(1, 'At least one product is required'),
  paymentMethod: z.enum(['Cash', 'Online Transfer', 'On Credit']),
  transactionId: z.string().optional(),
  narration: z.string().optional()
}).refine((data) => {
  return data.products.every(product => 
    product.productName && 
    product.hsnCode && 
    product.qty > 0 && 
    product.salePrice > 0
  );
}, {
  message: "All products must have valid name, HSN code, quantity, and sale price",
  path: ["products"]
});

interface InvoiceFormProps {
  onSubmit: (data: InvoiceData) => void;
  onGeneratePDF: (data: InvoiceData) => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ onSubmit, onGeneratePDF }) => {
  const [validationError, setValidationError] = useState<string>('');

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid }
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceDate: new Date(),
      invoiceTime: format(new Date(), 'HH:mm'),
      customer: { name: '', address: '', phone: '', email: '', gstin: '' },
      products: [{ 
        productName: '', 
        hsnCode: '', 
        qty: 1, 
        salePrice: 0, 
        discount: 0,
        taxableValue: 0,
        gst: 0,
        totalValue: 0
      }],
      paymentMethod: 'Cash',
      narration: ''
    },
    mode: 'onChange'
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products'
  });

  const watchedProducts = watch('products');

  // Real-time calculation with proper dependencies
  const watchedProductsSignature = watchedProducts.map(p => `${p.qty}-${p.salePrice}-${p.discount}`).join(',');
  useEffect(() => {
    let hasChanges = false;
    
    watchedProducts.forEach((product, index) => {
      if (product.qty && product.salePrice !== undefined) {
        const salePrice = Number(product.salePrice) || 0;
        const qty = Number(product.qty) || 0;
        const discount = Math.min(Math.max(Number(product.discount) || 0, 0), 100); // Ensure discount is between 0-100
        
        const grossAmount = qty * salePrice;
        const discountAmount = grossAmount * discount / 100;
        const taxableValue = grossAmount - discountAmount;
        const gst = taxableValue * 0.18;
        const totalValue = taxableValue + gst;

        const roundedTaxableValue = Math.round(taxableValue * 100) / 100;
        const roundedGst = Math.round(gst * 100) / 100;
        const roundedTotalValue = Math.round(totalValue * 100) / 100;

        if (product.taxableValue !== roundedTaxableValue ||
            product.gst !== roundedGst ||
            product.totalValue !== roundedTotalValue ||
            product.discount !== discount) {
          
          setValue(`products.${index}.discount`, discount);
          setValue(`products.${index}.taxableValue`, roundedTaxableValue);
          setValue(`products.${index}.gst`, roundedGst);
          setValue(`products.${index}.totalValue`, roundedTotalValue);
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      trigger('products');
    }
  }, [watchedProducts, watchedProductsSignature, setValue, trigger]);

  const totalInvoiceValue = watchedProducts.reduce((sum, product) => {
    return sum + (Number(product.totalValue) || 0);
  }, 0);

  const getFormValidationErrors = (): string[] => {
    const errorMessages: string[] = [];
    
    if (errors.invoiceNo) errorMessages.push('Invoice number is required');
    if (errors.invoiceDate) errorMessages.push('Invoice date is required');
    if (errors.invoiceTime) errorMessages.push('Invoice time is required');
    
    if (errors.customer) {
      if (errors.customer.name) errorMessages.push('Customer name is required');
      if (errors.customer.address) errorMessages.push('Customer address is required');
      if (errors.customer.phone) errorMessages.push('Valid phone number is required');
      if (errors.customer.email) errorMessages.push('Valid email address is required');
    }
    
    if (errors.products) {
      if (Array.isArray(errors.products)) {
        errors.products.forEach((productError, index) => {
          if (productError) {
            if (productError.productName) errorMessages.push(`Product ${index + 1}: Product selection is required`);
            if (productError.hsnCode) errorMessages.push(`Product ${index + 1}: HSN code is required`);
            if (productError.qty) errorMessages.push(`Product ${index + 1}: Valid quantity is required`);
            if (productError.salePrice) errorMessages.push(`Product ${index + 1}: Valid sale price is required`);
            if (productError.discount) errorMessages.push(`Product ${index + 1}: Discount must be between 0 and 100`);
          }
        });
      } else if (typeof errors.products.message === 'string') {
        errorMessages.push(errors.products.message);
      }
    }
    
    return errorMessages;
  };

  const validateAndSubmit = async (data: InvoiceFormData) => {
    setValidationError('');
    
    const result = await trigger();
    if (!result || !isValid) {
      const errorMessages = getFormValidationErrors();
      const errorText = errorMessages.length > 0 
        ? errorMessages.join('; ') 
        : 'Please fill all required fields correctly before generating the invoice.';
      
      setValidationError(errorText);
      toast({
        title: "Validation Error",
        description: "Please check the form and fix all errors.",
        variant: "destructive"
      });
      return;
    }

    const hasEmptyProducts = data.products.some(product => 
      !product.productName || !product.hsnCode || product.qty <= 0 || product.salePrice <= 0
    );

    if (hasEmptyProducts) {
      setValidationError('All products must have valid name, HSN code, quantity, and sale price.');
      toast({
        title: "Product Validation Error",
        description: "All products must have valid name, HSN code, quantity, and sale price.",
        variant: "destructive"
      });
      return;
    }

    // Generate real-time timestamp
    const generationTimestamp = new Date().toISOString();
    const finalData: InvoiceData = { 
      ...data, 
      totalInvoiceValue: Math.round(totalInvoiceValue * 100) / 100,
      generationTimestamp
    };
    
    onSubmit(finalData);
  };

  const validateAndGeneratePDF = async () => {
    setValidationError('');
    
    const data = watch();
    const result = await trigger();
    
    if (!result || !isValid) {
      const errorMessages = getFormValidationErrors();
      const errorText = errorMessages.length > 0 
        ? errorMessages.join('; ') 
        : 'Please fill all required fields correctly before generating the PDF.';
      
      setValidationError(errorText);
      toast({
        title: "Validation Error",
        description: "Please check the form and fix all errors.",
        variant: "destructive"
      });
      return;
    }

    const hasEmptyProducts = data.products.some(product => 
      !product.productName || !product.hsnCode || product.qty <= 0 || product.salePrice <= 0
    );

    if (hasEmptyProducts) {
      setValidationError('All products must have valid name, HSN code, quantity, and sale price.');
      toast({
        title: "Product Validation Error",
        description: "All products must have valid name, HSN code, quantity, and sale price.",
        variant: "destructive"
      });
      return;
    }

    // Generate real-time timestamp
    const generationTimestamp = new Date().toISOString();
    const finalData: InvoiceData = { 
      ...data, 
      totalInvoiceValue: Math.round(totalInvoiceValue * 100) / 100,
      generationTimestamp
    };
    
    onGeneratePDF(finalData);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Invoice Generator</CardTitle>
        </CardHeader>
        <CardContent>
          {validationError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Please fix the following errors:</strong><br />
                {validationError}
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit(validateAndSubmit)} className="space-y-6">
            <InvoiceDetailsSection 
              register={register}
              setValue={setValue}
              watch={watch}
              errors={errors}
            />

            <CustomerDetailsSection 
              register={register}
              errors={errors}
            />

            <ProductTableSection
              register={register}
              setValue={setValue}
              watch={watch}
              trigger={trigger}
              fields={fields}
              append={append}
              remove={remove}
              errors={errors}
            />

            <PaymentDetailsSection
              register={register}
              setValue={setValue}
              watch={watch}
            />

            <NarrationSection register={register} />

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                type="submit" 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!isValid}
              >
                Generate JSON Payload
              </Button>
              <Button 
                type="button" 
                onClick={validateAndGeneratePDF}
                size="lg" 
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
                disabled={!isValid}
              >
                Download PDF Invoice
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
