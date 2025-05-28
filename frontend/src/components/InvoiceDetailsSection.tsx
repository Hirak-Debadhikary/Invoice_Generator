
import React from 'react';
import { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { InvoiceFormData } from '@/types/invoice';

interface InvoiceDetailsProps {
  register: UseFormRegister<InvoiceFormData>;
  setValue: UseFormSetValue<InvoiceFormData>;
  watch: UseFormWatch<InvoiceFormData>;
  errors: FieldErrors<InvoiceFormData>;
}

export const InvoiceDetailsSection: React.FC<InvoiceDetailsProps> = ({
  register,
  setValue,
  watch,
  errors
}) => {
  const watchedDate = watch('invoiceDate');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="invoiceNo">Invoice No *</Label>
        <Input
          id="invoiceNo"
          {...register('invoiceNo')}
          placeholder="INV001"
          className="mt-1"
        />
        {errors.invoiceNo && <p className="text-red-500 text-sm mt-1">{String(errors.invoiceNo.message)}</p>}
      </div>
      
      <div>
        <Label>Invoice Date *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full mt-1 justify-start text-left font-normal",
                !watchedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {watchedDate ? format(watchedDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white z-50" align="start">
            <Calendar
              mode="single"
              selected={watchedDate}
              onSelect={(date) => setValue('invoiceDate', date || new Date())}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        {errors.invoiceDate && <p className="text-red-500 text-sm mt-1">{String(errors.invoiceDate.message)}</p>}
      </div>
    </div>
  );
};
