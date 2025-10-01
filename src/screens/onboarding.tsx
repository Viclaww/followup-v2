import { TrendingUp, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-soft to-background flex flex-col items-center justify-center px-6">
      <div className="max-w-sm text-center space-y-8">
        {/* App Icon/Logo */}
        <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto shadow-lg">
          <TrendingUp className="h-10 w-10 text-primary-foreground" />
        </div>

        {/* App Name */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Reveni</h1>
          <p className="text-lg text-muted-foreground">
            Big businesses never forget to follow up.
            <br />
            <span className="font-semibold text-primary">Now you won't either.</span>
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success-soft rounded-full flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div className="text-left">
              <p className="font-medium">Never miss a follow-up</p>
              <p className="text-sm text-muted-foreground">Get timely reminders</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning-soft rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-warning" />
            </div>
            <div className="text-left">
              <p className="font-medium">Track every customer</p>
              <p className="text-sm text-muted-foreground">Organize your outreach</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-soft rounded-full flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-medium">Measure your success</p>
              <p className="text-sm text-muted-foreground">See sales and progress</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Button 
          onClick={onComplete}
          className="w-full h-14 text-lg font-semibold shadow-lg"
        >
          Start Using Reveni
        </Button>

        <p className="text-xs text-muted-foreground">
          Simple. Professional. Effective.
        </p>
      </div>
    </div>
  );
}