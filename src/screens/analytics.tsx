import { useMemo } from "react";
import { BarChart3, TrendingUp, Calendar, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FollowUp, Analytics } from "@/types/followup";
import { format, startOfWeek, endOfWeek, isWithinInterval } from "date-fns";

interface AnalyticsScreenProps {
  reminders: FollowUp[];
}

export function AnalyticsScreen({ reminders }: AnalyticsScreenProps) {
  const analytics = useMemo((): Analytics => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 }); // Sunday
    
    const thisWeekReminders = reminders.filter(r => 
      isWithinInterval(r.createdAt, { start: weekStart, end: weekEnd })
    );
    
    const completedReminders = reminders.filter(r => r.status === "completed");
    const completedThisWeek = completedReminders.filter(r => 
      r.completedAt && isWithinInterval(r.completedAt, { start: weekStart, end: weekEnd })
    );

    const outcomes = completedReminders.reduce(
      (acc, r) => {
        if (r.outcome) {
          switch (r.outcome.type) {
            case "sale":
              acc.sales++;
              break;
            case "meeting":
              acc.meetings++;
              break;
            case "no_response":
              acc.noResponse++;
              break;
          }
        }
        return acc;
      },
      { sales: 0, meetings: 0, noResponse: 0 }
    );

    const totalRevenue = completedReminders
      .filter(r => r.outcome?.type === "sale" && r.outcome.amount)
      .reduce((sum, r) => sum + (r.outcome!.amount || 0), 0);

    const completionRate = reminders.length > 0 
      ? Math.round((completedReminders.length / reminders.length) * 100)
      : 0;

    return {
      totalFollowUps: thisWeekReminders.length,
      completedThisWeek: completedThisWeek.length,
      completionRate,
      outcomes,
      totalRevenue,
    };
  }, [reminders]);

  const statCards = [
    {
      title: "Follow-ups Created",
      value: analytics.totalFollowUps,
      subtitle: "This week",
      icon: Calendar,
      color: "primary",
    },
    {
      title: "Completed",
      value: analytics.completedThisWeek,
      subtitle: "This week",
      icon: CheckCircle,
      color: "success",
    },
    {
      title: "Completion Rate",
      value: `${analytics.completionRate}%`,
      subtitle: "All time",
      icon: BarChart3,
      color: "warning",
    },
    {
      title: "Revenue",
      value: `₦${analytics.totalRevenue.toLocaleString()}`,
      subtitle: "From sales",
      icon: TrendingUp,
      color: "success",
    },
  ];

  return (
    <div className="px-4 pb-20 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-full bg-${stat.color}-soft flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 text-${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Outcomes Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Outcomes Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-success-soft rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="font-medium">Sales</span>
            </div>
            <span className="font-bold text-lg">{analytics.outcomes.sales}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-warning-soft rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-warning rounded-full"></div>
              <span className="font-medium">Meetings / In Progress</span>
            </div>
            <span className="font-bold text-lg">{analytics.outcomes.meetings}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-destructive-soft rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-destructive rounded-full"></div>
              <span className="font-medium">No Response</span>
            </div>
            <span className="font-bold text-lg">{analytics.outcomes.noResponse}</span>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle>This Week's Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Follow-ups completed</span>
              <span className="font-medium">
                {analytics.completedThisWeek} / {analytics.totalFollowUps}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary rounded-full h-2 transition-all"
                style={{ 
                  width: analytics.totalFollowUps > 0 
                    ? `${(analytics.completedThisWeek / analytics.totalFollowUps) * 100}%` 
                    : "0%" 
                }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics.totalFollowUps === 0 
                ? "No follow-ups created this week"
                : `Week of ${format(startOfWeek(new Date(), { weekStartsOn: 1 }), "MMM d")} - ${format(endOfWeek(new Date(), { weekStartsOn: 1 }), "MMM d")}`
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}