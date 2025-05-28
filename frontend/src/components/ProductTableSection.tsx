
import React from 'react';
import { UseFormRegister, UseFormSetValue, UseFormWatch, UseFormTrigger, Control, FieldArrayWithId, UseFieldArrayAppend, UseFieldArrayRemove, FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { InvoiceFormData, Product } from '@/types/invoice';

const products = [
  { name: 'Laptop Computer', hsnCode: '8471' },
  { name: 'Mobile Phone', hsnCode: '8517' },
  { name: 'Tablet Device', hsnCode: '8471' },
  { name: 'Wireless Headphones', hsnCode: '8518' },
  { name: 'Smart Watch', hsnCode: '9102' },
  { name: 'External Hard Drive', hsnCode: '8471' },
  { name: 'Wireless Mouse', hsnCode: '8471' },
  { name: 'Bluetooth Speaker', hsnCode: '8518' },
  { name: 'USB Cable', hsnCode: '8544' },
  { name: 'Power Bank', hsnCode: '8507' }
];

interface ProductTableProps {
  register: UseFormRegister<InvoiceFormData>;
  setValue: UseFormSetValue<InvoiceFormData>;
  watch: UseFormWatch<InvoiceFormData>;
  trigger: UseFormTrigger<InvoiceFormData>;
  fields: FieldArrayWithId<InvoiceFormData, "products", "id">[];
  append: UseFieldArrayAppend<InvoiceFormData, "products">;
  remove: UseFieldArrayRemove;
  errors: FieldErrors<InvoiceFormData>;
}

export const ProductTableSection: React.FC<ProductTableProps> = ({
  register,
  setValue,
  watch,
  trigger,
  fields,
  append,
  remove,
  errors
}) => {
  const watchedProducts = watch('products');

  const handleProductSelect = (index: number, productName: string) => {
    const selectedProduct = products.find(p => p.name === productName);
    if (selectedProduct) {
      setValue(`products.${index}.productName`, selectedProduct.name);
      setValue(`products.${index}.hsnCode`, selectedProduct.hsnCode);
      trigger(`products.${index}`);
    }
  };

  const handleInputChange = (index: number, field: keyof Product, value: string | number) => {
    setValue(`products.${index}.${field}`, value);
    trigger(`products.${index}`);
  };

  const totalInvoiceValue = watchedProducts.reduce((sum: number, product: Product) => {
    return sum + (Number(product.totalValue) || 0);
  }, 0);

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Products</CardTitle>
        <Button
          type="button"
          onClick={() => append({ 
            productName: '', 
            hsnCode: '', 
            qty: 1, 
            salePrice: 0, 
            discount: 0,
            taxableValue: 0,
            gst: 0,
            totalValue: 0
          })}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 md:space-y-0">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 min-w-[200px]">Product</th>
                  <th className="text-left p-2 min-w-[80px]">HSN</th>
                  <th className="text-left p-2 min-w-[70px]">Qty</th>
                  <th className="text-left p-2 min-w-[100px]">Price</th>
                  <th className="text-left p-2 min-w-[80px]">Discount %</th>
                  <th className="text-left p-2 min-w-[120px]">Taxable Value</th>
                  <th className="text-left p-2 min-w-[100px]">GST @18%</th>
                  <th className="text-left p-2 min-w-[120px]">Total</th>
                  <th className="text-left p-2 min-w-[80px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr key={field.id} className="border-b">
                    <td className="p-2">
                      <Select
                        value={watchedProducts[index]?.productName || ''}
                        onValueChange={(value) => handleProductSelect(index, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          {products.map((product) => (
                            <SelectItem key={product.name} value={product.name}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.products?.[index]?.productName && (
                        <p className="text-red-500 text-xs mt-1">{String(errors.products[index]?.productName?.message)}</p>
                      )}
                    </td>
                    <td className="p-2">
                      <Input
                        value={watchedProducts[index]?.hsnCode || ''}
                        onChange={(e) => handleInputChange(index, 'hsnCode', e.target.value)}
                        placeholder="HSN"
                        className="w-20"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        value={watchedProducts[index]?.qty || 1}
                        onChange={(e) => handleInputChange(index, 'qty', Number(e.target.value))}
                        type="number"
                        min="1"
                        className="w-20"
                        placeholder="1"
                      />
                      {errors.products?.[index]?.qty && (
                        <p className="text-red-500 text-xs mt-1">{String(errors.products[index]?.qty?.message)}</p>
                      )}
                    </td>
                    <td className="p-2">
                      <Input
                        value={watchedProducts[index]?.salePrice || 0}
                        onChange={(e) => handleInputChange(index, 'salePrice', Number(e.target.value))}
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-24"
                        placeholder="0.00"
                      />
                      {errors.products?.[index]?.salePrice && (
                        <p className="text-red-500 text-xs mt-1">{String(errors.products[index]?.salePrice?.message)}</p>
                      )}
                    </td>
                    <td className="p-2">
                      <Input
                        value={watchedProducts[index]?.discount || 0}
                        onChange={(e) => {
                          const value = Math.min(Math.max(Number(e.target.value), 0), 100);
                          handleInputChange(index, 'discount', value);
                        }}
                        type="number"
                        min="0"
                        max="100"
                        className="w-20"
                        placeholder="0"
                      />
                    </td>
                    <td className="p-2">
                      <span className="font-medium">₹{watchedProducts[index]?.taxableValue?.toFixed(2) || '0.00'}</span>
                    </td>
                    <td className="p-2">
                      <span className="font-medium">₹{watchedProducts[index]?.gst?.toFixed(2) || '0.00'}</span>
                    </td>
                    <td className="p-2">
                      <span className="font-bold">₹{watchedProducts[index]?.totalValue?.toFixed(2) || '0.00'}</span>
                    </td>
                    <td className="p-2">
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {fields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-semibold">Product {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="col-span-full">
                    <Label>Product *</Label>
                    <Select
                      value={watchedProducts[index]?.productName || ''}
                      onValueChange={(value) => handleProductSelect(index, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        {products.map((product) => (
                          <SelectItem key={product.name} value={product.name}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.products?.[index]?.productName && (
                      <p className="text-red-500 text-xs mt-1">{String(errors.products[index]?.productName?.message)}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label>HSN Code *</Label>
                    <Input
                      value={watchedProducts[index]?.hsnCode || ''}
                      onChange={(e) => handleInputChange(index, 'hsnCode', e.target.value)}
                      placeholder="HSN Code"
                    />
                  </div>
                  
                  <div>
                    <Label>Quantity *</Label>
                    <Input
                      value={watchedProducts[index]?.qty || 1}
                      onChange={(e) => handleInputChange(index, 'qty', Number(e.target.value))}
                      type="number"
                      min="1"
                      placeholder="1"
                    />
                    {errors.products?.[index]?.qty && (
                      <p className="text-red-500 text-xs mt-1">{String(errors.products[index]?.qty?.message)}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label>Sale Price *</Label>
                    <Input
                      value={watchedProducts[index]?.salePrice || 0}
                      onChange={(e) => handleInputChange(index, 'salePrice', Number(e.target.value))}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                    {errors.products?.[index]?.salePrice && (
                      <p className="text-red-500 text-xs mt-1">{String(errors.products[index]?.salePrice?.message)}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label>Discount %</Label>
                    <Input
                      value={watchedProducts[index]?.discount || 0}
                      onChange={(e) => {
                        const value = Math.min(Math.max(Number(e.target.value), 0), 100);
                        handleInputChange(index, 'discount', value);
                      }}
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="col-span-full bg-gray-50 p-3 rounded">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Taxable Value:</span>
                        <div className="font-bold">₹{watchedProducts[index]?.taxableValue?.toFixed(2) || '0.00'}</div>
                      </div>
                      <div>
                        <span className="font-medium">GST @18%:</span>
                        <div className="font-bold">₹{watchedProducts[index]?.gst?.toFixed(2) || '0.00'}</div>
                      </div>
                      <div>
                        <span className="font-medium">Total Value:</span>
                        <div className="font-bold text-blue-600">₹{watchedProducts[index]?.totalValue?.toFixed(2) || '0.00'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <div className="text-right">
            <p className="text-xl font-bold">
              Total Invoice Value: ₹{totalInvoiceValue.toFixed(2)}
            </p>
          </div>
        </div>
        
        {errors.products && <p className="text-red-500 text-sm mt-2">{String(errors.products.message)}</p>}
      </CardContent>
    </>
  );
};
