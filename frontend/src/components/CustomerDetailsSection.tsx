
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InvoiceFormData } from '@/types/invoice';

interface CustomerDetailsProps {
  register: UseFormRegister<InvoiceFormData>;
  errors: FieldErrors<InvoiceFormData>;
}

export const CustomerDetailsSection: React.FC<CustomerDetailsProps> = ({
  register,
  errors
}) => {
  // Helper function to safely get nested error messages
  const getNestedErrorMessage = (errorPath: string): string | undefined => {
    const pathParts = errorPath.split('.');
    let current: unknown = errors;
    
    for (const part of pathParts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return undefined;
      }
    }
    
    return (typeof current === 'object' && current !== null && 'message' in current)
      ? String((current as { message: unknown }).message)
      : undefined;
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-lg">Customer Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customerName">Customer Name *</Label>
            <Input
              id="customerName"
              {...register('customer.name')}
              placeholder="ABC Traders"
              className="mt-1"
            />
            {getNestedErrorMessage('customer.name') && (
              <p className="text-red-500 text-sm mt-1">{getNestedErrorMessage('customer.name')}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="customerPhone">Phone Number *</Label>
            <Input
              id="customerPhone"
              {...register('customer.phone')}
              placeholder="9876543210"
              className="mt-1"
            />
            {getNestedErrorMessage('customer.phone') && (
              <p className="text-red-500 text-sm mt-1">{getNestedErrorMessage('customer.phone')}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customerEmail">Email Address *</Label>
            <Input
              id="customerEmail"
              type="email"
              {...register('customer.email')}
              placeholder="customer@example.com"
              className="mt-1"
            />
            {getNestedErrorMessage('customer.email') && (
              <p className="text-red-500 text-sm mt-1">{getNestedErrorMessage('customer.email')}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="customerGstin">GSTIN (Optional)</Label>
            <Input
              id="customerGstin"
              {...register('customer.gstin')}
              placeholder="27ABCDE1234F1Z5"
              className="mt-1"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="customerAddress">Address *</Label>
          <Textarea
            id="customerAddress"
            {...register('customer.address')}
            placeholder="123 Market Street, City, State, PIN"
            className="mt-1"
            rows={3}
          />
          {getNestedErrorMessage('customer.address') && (
            <p className="text-red-500 text-sm mt-1">{getNestedErrorMessage('customer.address')}</p>
          )}
        </div>
      </CardContent>
    </>
  );
};
