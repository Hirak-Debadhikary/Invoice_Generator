import React from "react";
import { UseFormRegister } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InvoiceFormData } from "@/types/invoice";

interface NarrationFormValues {
  narration: string;
}

interface NarrationProps {
  register: UseFormRegister<InvoiceFormData>;
}

export const NarrationSection: React.FC<NarrationProps> = ({ register }) => {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-lg">Narration</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          {...register("narration")}
          placeholder="Additional notes about this invoice..."
          rows={3}
        />
      </CardContent>
    </>
  );
};
