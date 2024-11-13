import React from 'react';
import { Loader } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}