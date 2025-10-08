import { useState, useEffect } from "react";
import { MobileHeader } from "@/components/ui/mobile-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Dashboard } from "@/screens/dashboard";
import { QuickAdd } from "@/screens/quick-add";
import { AnalyticsScreen } from "@/screens/analytics";
import { History } from "@/screens/history";
import { Onboarding } from "@/screens/onboarding";
import { useFollowUps } from "@/hooks/use-followups";
import { CustomerCareButton } from "@/components/customer-care-button";

type AppScreen = "onboarding" | "dashboard" | "add" | "history" | "analytics";

const ONBOARDING_KEY = "reveni-onboarding-completed";

export default function FollowUpApp() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("onboarding");
  const { reminders, addReminder, updateReminder, isLoaded } = useFollowUps();

  // Check if user has completed onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem(ONBOARDING_KEY);
    if (hasCompletedOnboarding && isLoaded) {
      setCurrentScreen("dashboard");
    }
  }, [isLoaded]);

  const handleOnboardingComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setCurrentScreen("dashboard");
  };

  const handleTabChange = (tab: string) => {
    setCurrentScreen(tab as AppScreen);
  };

  const getHeaderTitle = () => {
    switch (currentScreen) {
      case "dashboard":
        return "Reveni";
      case "add":
        return "Add Reminder";
      case "history":
        return "Customer History";
      case "analytics":
        return "Analytics";
      default:
        return "";
    }
  };

  const showHeader = currentScreen !== "onboarding";
  const showBottomNav = currentScreen !== "onboarding";

  if (currentScreen === "onboarding") {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {showHeader && (
        <MobileHeader
          title={getHeaderTitle()}
          onBack={currentScreen === "add" ? () => setCurrentScreen("dashboard") : undefined}
        />
      )}

      <main className="flex-1">
        {currentScreen === "dashboard" && (
          <Dashboard
            reminders={reminders}
            onUpdateReminder={updateReminder}
          />
        )}

        {currentScreen === "add" && (
          <QuickAdd
            onAddReminder={addReminder}
            onBack={() => setCurrentScreen("dashboard")}
          />
        )}

        {currentScreen === "history" && (
          <History reminders={reminders} />
        )}

        {currentScreen === "analytics" && (
          <AnalyticsScreen reminders={reminders} />
        )}
      </main>

      {showBottomNav && (
        <BottomNav
          activeTab={currentScreen}
          onTabChange={handleTabChange}
        />
      )}

      <CustomerCareButton />
    </div>
  );
}