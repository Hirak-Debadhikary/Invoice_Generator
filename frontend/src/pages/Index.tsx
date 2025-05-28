
import React, { useState } from 'react';
import { InvoiceForm } from '@/components/InvoiceForm';
import { JSONDisplay } from '@/components/JSONDisplay';
import { generateInvoicePDF } from '@/utils/pdfGenerator';
import { toast } from '@/hooks/use-toast';
import { InvoiceData } from '@/types/invoice';

const Index = () => {
  const [generatedData, setGeneratedData] = useState<InvoiceData | null>(null);

  const handleFormSubmit = (data: InvoiceData) => {
    console.log('Generated Invoice Data:', data);
    setGeneratedData(data);
    toast({
      title: "Success!",
      description: "Invoice data generated successfully. Check the JSON payload below.",
    });
  };

  const handlePDFGeneration = (data: InvoiceData) => {
    try {
      generateInvoicePDF(data);
      toast({
        title: "PDF Generated!",
        description: "Your invoice PDF is being generated. Please check your browser's print dialog.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const clearData = () => {
    setGeneratedData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <InvoiceForm 
          onSubmit={handleFormSubmit}
          onGeneratePDF={handlePDFGeneration}
        />
        
        {generatedData && (
          <JSONDisplay 
            data={generatedData} 
            onClear={clearData}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
