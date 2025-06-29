
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useTranslations } from "@/hooks/use-translations";
import "@copilotkit/react-ui/styles.css";

export default function DashboardPage() {
  const t = useTranslations();

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-6 h-full">
      <div className="space-y-6 overflow-y-auto">
        <PageHeader title={t.dashboard.title} />
        <StatsCards />
        <RecentActivity />
      </div>
      <aside className="hidden lg:flex flex-col h-full">
        <CopilotSidebar
          defaultOpen={true}
          clickOutsideToClose={false}
          labels={{
            title: "RuleWise AI Assistant",
            initial: "Hello! I'm the RuleWise AI assistant. How can I help you define or understand your business rules today?",
          }}
          className="[&>div]:shadow-none [&>div]:border-0 [&>div]:h-full"
        />
      </aside>
    </div>
  );
}
