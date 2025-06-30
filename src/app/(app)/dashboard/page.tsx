
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { CopilotPopup, CopilotSidebar } from "@copilotkit/react-ui";
import { useTranslations } from "@/hooks/use-translations";
import "@copilotkit/react-ui/styles.css";

export default function DashboardPage() {
  const t = useTranslations();
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const copilotLabels = {
    title: "RuleMaster AI Assistant",
    initial: "Hello! I'm the RuleMaster AI assistant. How can I help you define or understand your business rules today?",
  };

  return (
    <>
      {/* The main dashboard content, which should always take up the full width of its container. */}
      <div className="space-y-6">
        <PageHeader title={t.dashboard.title} />
        <StatsCards />
        <RecentActivity />
      </div>

      {isClient && (
        <>
          {/* On large screens, the sidebar will appear. It is rendered outside the main content flow,
              so it will float on top and not affect the dashboard layout. */}
          <div className="hidden lg:block">
            <CopilotSidebar
                defaultOpen={true}
                labels={copilotLabels}
              />
          </div>
          
          {/* On small screens, a popup button will be used instead of the sidebar. */}
          <div className="lg:hidden">
            <CopilotPopup labels={copilotLabels} />
          </div>
        </>
      )}
    </>
  );
}
