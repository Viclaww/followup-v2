import { useState, useEffect } from "react";
import { FollowUp } from "@/types/followup";

// Local storage key
const STORAGE_KEY = "followup-reminders";

// Sample data for demo
const sampleReminders: FollowUp[] = [
  {
    id: "1",
    customerName: "Adebayo Johnson",
    channel: "whatsapp",
    reminderDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    notes: "Interested in our premium package. Follow up after lunch.",
    status: "pending",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: "2",
    customerName: "Fatima Abdullahi",
    channel: "call",
    reminderDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    notes: "Requested quote for catering services.",
    status: "pending",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
  },
  {
    id: "3",
    customerName: "Chioma Okoro",
    channel: "sms",
    reminderDate: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago (overdue)
    notes: "Check if she's ready to place order.",
    status: "pending",
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
  },
];

export function useFollowUps() {
  const [reminders, setReminders] = useState<FollowUp[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load reminders from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const restored = parsed.map((reminder: any) => ({
          ...reminder,
          reminderDate: new Date(reminder.reminderDate),
          createdAt: new Date(reminder.createdAt),
          completedAt: reminder.completedAt ? new Date(reminder.completedAt) : undefined,
        }));
        setReminders(restored);
      } else {
        // First time user - set sample data
        setReminders(sampleReminders);
      }
    } catch (error) {
      console.error("Error loading reminders:", error);
      setReminders(sampleReminders);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever reminders change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
      } catch (error) {
        console.error("Error saving reminders:", error);
      }
    }
  }, [reminders, isLoaded]);

  const addReminder = (reminderData: Omit<FollowUp, "id" | "createdAt" | "status">) => {
    const newReminder: FollowUp = {
      ...reminderData,
      id: Date.now().toString(),
      createdAt: new Date(),
      status: "pending",
    };
    setReminders(prev => [...prev, newReminder]);
  };

  const updateReminder = (id: string, updates: Partial<FollowUp>) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id 
          ? { ...reminder, ...updates }
          : reminder
      )
    );
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  return {
    reminders,
    addReminder,
    updateReminder,
    deleteReminder,
    isLoaded,
  };
}