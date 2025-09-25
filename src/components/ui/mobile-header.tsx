import { ArrowLeft } from "lucide-react";
import { Button } from "./button";

interface MobileHeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export function MobileHeader({ title, onBack, rightAction }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-14 px-4 bg-background border-b border-border">
      <div className="flex items-center">
        {onBack && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="mr-2 p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>
      {rightAction && <div>{rightAction}</div>}
    </header>
  );
}