import { useState } from "react";
import { MessageCircle, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function CustomerCareButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        size="icon"
        className={cn(
          "fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full shadow-lg",
          "hover:scale-110 transition-transform duration-200",
          "md:bottom-4"
        )}
        onClick={() => setIsOpen(true)}
        aria-label="Customer Support"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Customer Support</DialogTitle>
            <DialogDescription>
              We're here to help! Choose how you'd like to reach us.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 mt-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-14"
              onClick={() => window.location.href = "mailto:support@reveni.app"}
            >
              <Mail className="h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">Email Support</p>
                <p className="text-xs text-muted-foreground">support@reveni.app</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-14"
              onClick={() => window.location.href = "tel:+1234567890"}
            >
              <Phone className="h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">Call Us</p>
                <p className="text-xs text-muted-foreground">+1 (234) 567-890</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-14"
              onClick={() => {
                // In a real app, this would open a live chat widget
                alert("Live chat feature coming soon!");
              }}
            >
              <MessageCircle className="h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">Live Chat</p>
                <p className="text-xs text-muted-foreground">Chat with our team</p>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
