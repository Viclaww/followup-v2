import { useState } from "react";
import { TrendingUp, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OutcomeType } from "@/types/followup";
import { cn } from "@/lib/utils";

interface OutcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (outcome: { type: OutcomeType; amount?: number; notes?: string }) => void;
  customerName: string;
}

const outcomes = [
  {
    type: "sale" as OutcomeType,
    label: "Sale",
    icon: TrendingUp,
    color: "success",
    description: "Customer made a purchase",
  },
  {
    type: "meeting" as OutcomeType,
    label: "Meeting / Still in progress",
    icon: Clock,
    color: "warning",
    description: "Follow-up scheduled or ongoing",
  },
  {
    type: "no_response" as OutcomeType,
    label: "No response",
    icon: AlertCircle,
    color: "destructive",
    description: "Customer didn't respond",
  },
];

export function OutcomeModal({ isOpen, onClose, onSubmit, customerName }: OutcomeModalProps) {
  const [selectedType, setSelectedType] = useState<OutcomeType | null>(null);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!selectedType) return;
    
    onSubmit({
      type: selectedType,
      amount: selectedType === "sale" && amount ? parseFloat(amount) : undefined,
      notes: notes.trim() || undefined,
    });
    
    // Reset form
    setSelectedType(null);
    setAmount("");
    setNotes("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="text-center">
            What was the result with {customerName}?
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid gap-3">
            {outcomes.map((outcome) => {
              const Icon = outcome.icon;
              const isSelected = selectedType === outcome.type;
              
              return (
                <button
                  key={outcome.type}
                  onClick={() => setSelectedType(outcome.type)}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left",
                    isSelected
                      ? `border-${outcome.color} bg-${outcome.color}-soft`
                      : "border-border hover:border-muted-foreground"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    isSelected
                      ? `bg-${outcome.color} text-${outcome.color}-foreground`
                      : "bg-muted text-muted-foreground"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{outcome.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {outcome.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedType === "sale" && (
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₦)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Additional notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!selectedType}
              className="flex-1"
            >
              Save Result
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}