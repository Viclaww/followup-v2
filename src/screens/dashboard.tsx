import { useState } from "react";
import { format } from "date-fns";
import { CalendarDays, Clock } from "lucide-react";
import { ReminderCard } from "@/components/reminder-card";
import { OutcomeModal } from "@/components/outcome-modal";
import { FollowUp, OutcomeType } from "@/types/followup";
import { cn } from "@/lib/utils";

interface DashboardProps {
  reminders: FollowUp[];
  onUpdateReminder: (id: string, updates: Partial<FollowUp>) => void;
}

export function Dashboard({ reminders, onUpdateReminder }: DashboardProps) {
  const [outcomeModal, setOutcomeModal] = useState<{
    isOpen: boolean;
    reminderId: string;
    customerName: string;
  }>({
    isOpen: false,
    reminderId: "",
    customerName: "",
  });

  const pendingReminders = reminders
    .filter(r => r.status === "pending")
    .sort((a, b) => a.reminderDate.getTime() - b.reminderDate.getTime());

  const todayReminders = pendingReminders.filter(r => 
    format(r.reminderDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
  );

  const upcomingReminders = pendingReminders.filter(r => 
    format(r.reminderDate, "yyyy-MM-dd") > format(new Date(), "yyyy-MM-dd")
  );

  const overdueReminders = pendingReminders.filter(r => 
    r.reminderDate < new Date() && 
    format(r.reminderDate, "yyyy-MM-dd") < format(new Date(), "yyyy-MM-dd")
  );

  const handleComplete = (id: string) => {
    const reminder = reminders.find(r => r.id === id);
    if (!reminder) return;
    
    setOutcomeModal({
      isOpen: true,
      reminderId: id,
      customerName: reminder.customerName,
    });
  };

  const handleOutcomeSubmit = (outcome: { type: OutcomeType; amount?: number; notes?: string }) => {
    onUpdateReminder(outcomeModal.reminderId, {
      status: "completed",
      completedAt: new Date(),
      outcome,
    });
    setOutcomeModal({ isOpen: false, reminderId: "", customerName: "" });
  };

  const handleSnooze = (id: string) => {
    // Add 1 day to reminder date
    const reminder = reminders.find(r => r.id === id);
    if (!reminder) return;
    
    const newDate = new Date(reminder.reminderDate);
    newDate.setDate(newDate.getDate() + 1);
    
    onUpdateReminder(id, {
      reminderDate: newDate,
      status: "snoozed",
    });
  };

  const handleSkip = (id: string) => {
    onUpdateReminder(id, {
      status: "skipped",
    });
  };

  if (pendingReminders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-20 h-20 bg-primary-soft rounded-full flex items-center justify-center mb-4">
          <CalendarDays className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-xl font-semibold mb-2">All caught up!</h2>
        <p className="text-muted-foreground max-w-sm">
          You have no pending follow-ups. Add a new reminder to stay on top of your customer relationships.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-20">
      {/* Overdue Section */}
      {overdueReminders.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-destructive rounded-full"></div>
            <h2 className="text-lg font-semibold text-destructive">
              Overdue ({overdueReminders.length})
            </h2>
          </div>
          {overdueReminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onComplete={handleComplete}
              onSnooze={handleSnooze}
              onSkip={handleSkip}
            />
          ))}
        </div>
      )}

      {/* Today Section */}
      {todayReminders.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <h2 className="text-lg font-semibold text-foreground">
              Today ({todayReminders.length})
            </h2>
          </div>
          {todayReminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onComplete={handleComplete}
              onSnooze={handleSnooze}
              onSkip={handleSkip}
            />
          ))}
        </div>
      )}

      {/* Upcoming Section */}
      {upcomingReminders.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">
              Upcoming ({upcomingReminders.length})
            </h2>
          </div>
          {upcomingReminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onComplete={handleComplete}
              onSnooze={handleSnooze}
              onSkip={handleSkip}
            />
          ))}
        </div>
      )}

      <OutcomeModal
        isOpen={outcomeModal.isOpen}
        onClose={() => setOutcomeModal({ isOpen: false, reminderId: "", customerName: "" })}
        onSubmit={handleOutcomeSubmit}
        customerName={outcomeModal.customerName}
      />
    </div>
  );
}