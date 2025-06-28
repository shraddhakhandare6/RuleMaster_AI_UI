
"use client";

import "@/copilot-sidebar.css";

import { PageHeader } from "@/components/layout/page-header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useCopilotAction } from "@copilotkit/react-core";
import { useState } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { INSTRUCTIONS } from "../../instructions";

export default function DashboardPage() {
  const t = useTranslations();
  
  return (
    <CopilotKit runtimeUrl="api/copilotkit">
      <DashboardContent t={t} />
    </CopilotKit>
  );
}

function DashboardContent({ t }: { t: any }) {
  const [suggestions] = useState([
    "Create a spreadsheet of top markets",
    "Generate revenue report for Q3",
    "Show client acquisition metrics",
    "Compare year-over-year growth",
  ]);

  useCopilotAction({
    name: "createSpreadsheet",
    description: "Create a new spreadsheet",
    parameters: [
      { name: "rows", type: "object[]", description: "Rows of the spreadsheet" },
      { name: "title", type: "string", description: "Title of the spreadsheet" },
    ],
    handler: ({ rows, title }) => {
      console.log("Spreadsheet created with title:", title);
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader title={t.dashboard.title} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <StatsCards />
          <RecentActivity />
        </div>

        <div className="h-full">
          <CopilotSidebar
            className="copilot-sidebar-custom"
            labels={{
              title: "Dashboard Assistant",
              initial: "Hello! I'm your AI assistant. How can I help with your dashboard today?",
            }}
            defaultOpen={true}
            clickOutsideToClose={false}
            suggestions={suggestions}
            instructions={INSTRUCTIONS}
          />
        </div>
      </div>
    </div>
  );
}
