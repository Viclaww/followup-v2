import React from 'react';
import { Button } from '@/components/ui/button';

/**
 * Success
 * Create a SuccessBanner component that displays a success message with a checkmark icon. Use Alert from shadcn/ui with variant
 */
export function Success() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button>
        Success
      </Button>
    </div>
  );
}
