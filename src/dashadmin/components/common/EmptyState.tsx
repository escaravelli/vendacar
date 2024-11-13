import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  message: string;
  description?: string;
}

export function EmptyState({ icon: Icon, message, description }: EmptyStateProps) {
  return (
    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
      <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-500">{message}</p>
      {description && (
        <p className="text-gray-400 text-sm mt-2">{description}</p>
      )}
    </div>
  );
}