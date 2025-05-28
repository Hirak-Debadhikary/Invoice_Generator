import React from "react";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InvoiceFormData } from "@/types/invoice";

interface PaymentDetailsForm {
  paymentMethod: string;
  transactionId?: string;
}

interface PaymentDetailsProps {
  register: UseFormRegister<InvoiceFormData>;
  setValue: UseFormSetValue<InvoiceFormData>;
  watch: UseFormWatch<InvoiceFormData>;
}

export const PaymentDetailsSection: React.FC<PaymentDetailsProps> = ({
  register,
  setValue,
  watch,
}) => {
  const watchedPaymentMethod = watch("paymentMethod");

  return (
    <>
      <CardHeader>
        <CardTitle className="text-lg">Payment Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Payment Method *</Label>
          <Select
            value={watchedPaymentMethod}
            onValueChange={(value: string) => setValue("paymentMethod", value as "Cash" | "Online Transfer" | "On Credit")}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="Online Transfer">Online Transfer</SelectItem>
              <SelectItem value="On Credit">On Credit</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {watchedPaymentMethod === "Online Transfer" && (
          <div>
            <Label htmlFor="transactionId">UTR/Transaction ID</Label>
            <Input
              id="transactionId"
              {...register("transactionId")}
              placeholder="TXN12345678"
              className="mt-1"
            />
          </div>
        )}
      </CardContent>
    </>
  );
};
