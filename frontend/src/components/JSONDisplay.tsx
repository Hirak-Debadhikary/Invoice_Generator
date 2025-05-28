
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface JSONDisplayProps {
  data: unknown;
  onClear: () => void;
}

export const JSONDisplay: React.FC<JSONDisplayProps> = ({ data, onClear }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  return (
    <Card className="max-w-6xl mx-auto mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Generated API Payload</CardTitle>
        <div className="space-x-2">
          <Button onClick={copyToClipboard} variant="outline" size="sm">
            Copy JSON
          </Button>
          <Button onClick={onClear} variant="outline" size="sm">
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      </CardContent>
    </Card>
  );
};
