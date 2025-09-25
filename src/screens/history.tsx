import { format } from "date-fns";
import { MessageCircle, Phone, MessageSquare, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FollowUp, ContactChannel } from "@/types/followup";
import { cn } from "@/lib/utils";

interface HistoryProps {
  reminders: FollowUp[];
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

const outcomeColors = {
  sale: "bg-success text-success-foreground",
  meeting: "bg-warning text-warning-foreground",
  no_response: "bg-muted text-muted-foreground",
};

const outcomeLabels = {
  sale: "Sale",
  meeting: "Meeting",
  no_response: "No Response",
};

export function History({ reminders }: HistoryProps) {
  const completedReminders = reminders
    .filter(r => r.status === "completed" || r.status === "skipped")
    .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0));

  if (completedReminders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-20 h-20 bg-primary-soft rounded-full flex items-center justify-center mb-4">
          <TrendingUp className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No history yet</h2>
        <p className="text-muted-foreground max-w-sm">
          Complete some follow-ups to start building your customer interaction history.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-20">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Customer History ({completedReminders.length})
        </h2>
        <p className="text-sm text-muted-foreground">
          Track your follow-up performance and customer interactions
        </p>
      </div>

      <div className="space-y-3">
        {completedReminders.map((reminder) => {
          const Icon = channelIcons[reminder.channel];
          
          return (
            <Card key={reminder.id} className="transition-all hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg mb-1">
                      {reminder.customerName}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={cn("h-4 w-4", channelColors[reminder.channel])} />
                      <span className="text-sm text-muted-foreground capitalize">
                        {reminder.channel === "call" ? "Phone Call" : reminder.channel}
                      </span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Added {format(reminder.createdAt, "MMM d, yyyy")}
                      </span>
                    </div>
                    {reminder.notes && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {reminder.notes}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Outcome:</span>
                    {reminder.status === "skipped" ? (
                      <Badge variant="outline" className="text-muted-foreground">
                        Skipped
                      </Badge>
                    ) : reminder.outcome ? (
                      <Badge className={outcomeColors[reminder.outcome.type]}>
                        {outcomeLabels[reminder.outcome.type]}
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        Completed
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {reminder.outcome?.amount && (
                      <span className="text-sm font-medium text-success">
                        ₦{reminder.outcome.amount.toLocaleString()}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {reminder.completedAt ? format(reminder.completedAt, "MMM d, h:mm a") : ""}
                    </span>
                  </div>
                </div>
                
                {reminder.outcome?.notes && (
                  <div className="mt-2 pt-2 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Notes:</span> {reminder.outcome.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}