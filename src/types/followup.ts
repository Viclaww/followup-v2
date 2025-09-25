export type ContactChannel = "whatsapp" | "call" | "sms";

export type FollowUpStatus = "pending" | "completed" | "snoozed" | "skipped";

export type OutcomeType = "sale" | "meeting" | "no_response";

export interface FollowUp {
  id: string;
  customerName: string;
  channel: ContactChannel;
  reminderDate: Date;
  notes?: string;
  status: FollowUpStatus;
  createdAt: Date;
  completedAt?: Date;
  outcome?: {
    type: OutcomeType;
    amount?: number; // in Naira
    notes?: string;
  };
}

export interface Analytics {
  totalFollowUps: number;
  completedThisWeek: number;
  completionRate: number;
  outcomes: {
    sales: number;
    meetings: number;
    noResponse: number;
  };
  totalRevenue: number;
}