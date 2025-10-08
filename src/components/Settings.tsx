import React from 'react';
import { Button } from '@/components/ui/button';

/**
 * Settings
 * Add a settings button using Button component from shadcn/ui
 */
export function Settings() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button>
        Settings
      </Button>
    </div>
  );
}
