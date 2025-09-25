import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, MessageCircle, Phone, MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ContactChannel, FollowUp } from "@/types/followup";
import { cn } from "@/lib/utils";

interface QuickAddProps {
  onAddReminder: (reminder: Omit<FollowUp, "id" | "createdAt" | "status">) => void;
  onBack: () => void;
}

const channels: Array<{ id: ContactChannel; label: string; icon: React.ElementType; color: string }> = [
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "text-green-600" },
  { id: "instagram", label: "Instagram", icon: MessageSquare, color: "text-pink-600" },
  { id: "tiktok", label: "TikTok", icon: MessageSquare, color: "text-purple-600" },
  { id: "call", label: "Phone Call", icon: Phone, color: "text-blue-600" },
  { id: "sms", label: "SMS", icon: MessageSquare, color: "text-orange-600" },
];

export function QuickAdd({ onAddReminder, onBack }: QuickAddProps) {
  const [customerName, setCustomerName] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<ContactChannel | null>(null);
  const [reminderDate, setReminderDate] = useState<Date>();
  const [reminderTime, setReminderTime] = useState("09:00");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !selectedChannel || !reminderDate) return;

    setIsSubmitting(true);

    // Combine date and time
    const [hours, minutes] = reminderTime.split(":").map(Number);
    const combinedDateTime = new Date(reminderDate);
    combinedDateTime.setHours(hours, minutes, 0, 0);

    const reminder: Omit<FollowUp, "id" | "createdAt" | "status"> = {
      customerName: customerName.trim(),
      channel: selectedChannel,
      reminderDate: combinedDateTime,
      notes: notes.trim() || undefined,
    };

    onAddReminder(reminder);

    // Reset form
    setCustomerName("");
    setSelectedChannel(null);
    setReminderDate(undefined);
    setReminderTime("09:00");
    setNotes("");
    setIsSubmitting(false);
    
    onBack();
  };

  const isFormValid = customerName.trim() && selectedChannel && reminderDate;

  return (
    <div className="px-4 pb-20">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Name */}
        <div className="space-y-2">
          <Label htmlFor="customerName">Customer Name</Label>
          <Input
            id="customerName"
            placeholder="Enter customer name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="text-lg"
          />
        </div>

        {/* Contact Channel */}
        <div className="space-y-3">
          <Label>Contact Channel</Label>
          <div className="grid gap-2">
            {channels.map((channel) => {
              const Icon = channel.icon;
              const isSelected = selectedChannel === channel.id;
              
              return (
                <button
                  key={channel.id}
                  type="button"
                  onClick={() => setSelectedChannel(channel.id)}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left",
                    isSelected
                      ? "border-primary bg-primary-soft"
                      : "border-border hover:border-muted-foreground"
                  )}
                >
                  <Icon className={cn("h-5 w-5", channel.color)} />
                  <span className="font-medium">{channel.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date & Time */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Reminder Date & Time</Label>
            <span className="text-sm text-muted-foreground">Recommended: 3 days after initial contact</span>
          </div>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex-1 justify-start text-left font-normal",
                    !reminderDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {reminderDate ? format(reminderDate, "MMM d, yyyy") : "Pick date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={reminderDate}
                  onSelect={setReminderDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            <Input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-32"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            placeholder="Add any additional context or details..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="w-full h-14 text-lg font-semibold"
        >
          <Plus className="mr-2 h-5 w-5" />
          {isSubmitting ? "Saving..." : "Save Reminder"}
        </Button>
      </form>
    </div>
  );
}