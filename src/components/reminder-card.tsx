import { format } from "date-fns";
import { MessageCircle, Phone, MessageSquare, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FollowUp, ContactChannel } from "@/types/followup";
import { cn } from "@/lib/utils";

interface ReminderCardProps {
  reminder: FollowUp;
  onComplete: (id: string) => void;
  onSkip: (id: string) => void;
}

const channelIcons: Record<ContactChannel, React.ElementType> = {
  whatsapp: MessageCircle,
  instagram: MessageSquare,
  tiktok: MessageSquare,
  call: Phone,
  sms: MessageSquare,
};

const channelColors: Record<ContactChannel, string> = {
  whatsapp: "text-green-600",
  instagram: "text-pink-600",
  tiktok: "text-purple-600",
  call: "text-blue-600", 
  sms: "text-orange-600",
};

export function ReminderCard({ reminder, onComplete, onSkip }: ReminderCardProps) {
  const Icon = channelIcons[reminder.channel];
  const isOverdue = new Date() > reminder.reminderDate;
  
  return (
    <Card className={cn(
      "mb-3 transition-all hover:shadow-md",
      isOverdue && "border-l-4 border-l-destructive"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-lg mb-1">
              {reminder.customerName}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <Icon className={cn("h-4 w-4", channelColors[reminder.channel])} />
              <span className="text-sm text-muted-foreground capitalize">
                {reminder.channel}
              </span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className={cn(
                "text-sm font-medium",
                isOverdue ? "text-destructive" : "text-muted-foreground"
              )}>
                {format(reminder.reminderDate, "MMM d, h:mm a")}
              </span>
            </div>
            {reminder.notes && (
              <p className="text-sm text-muted-foreground">
                {reminder.notes}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => onComplete(reminder.id)}
            size="sm"
            className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Done
          </Button>
          <Button
            onClick={() => onSkip(reminder.id)}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <X className="h-4 w-4 mr-1" />
            Skip / Missed
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}