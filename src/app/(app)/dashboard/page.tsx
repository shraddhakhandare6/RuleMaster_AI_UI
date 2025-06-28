"use client";

import "@/copilot-sidebar.css";

import { PageHeader } from "@/components/layout/page-header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar, useCopilotChatSuggestions } from "@copilotkit/react-ui";
import { useCopilotAction } from "@copilotkit/react-core";
import { useTranslations } from "@/hooks/use-translations";
import { INSTRUCTIONS } from "../../instructions";

export default function DashboardPage() {
  const t = useTranslations();

  return (
    <CopilotKit
      // These URLs are placeholders and would need to be implemented
      // in a real application.
      runtimeUrl="/api/copilotkit" 
    >
      <DashboardContent t={t} />
    </CopilotKit>
  );
}

function DashboardContent({ t }: { t: any }) {
  // A placeholder action to make the assistant interactive.
  useCopilotAction({
    name: "analyzeRevenue",
    description: "Analyzes revenue trends for a given period.",
    parameters: [
      { name: "quarter", type: "string", description: "The quarter to analyze (e.g., 'last quarter')." }
    ],
    handler: async ({ quarter }) => {
      alert(`Analyzing revenue for ${quarter}...`);
    },
  });
  
  // Suggestions that will appear in the UI, as seen in the image.
  useCopilotChatSuggestions({
    initial: [
      "Compare client performance metrics",
      "Generate an executive summary report",
      "Identify clients with expiring contracts",
      "Show me the highest value projects",
    ]
  });

  return (
    <div className="space-y-6">
      <PageHeader title={t.dashboard.title} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <StatsCards />
          <RecentActivity />
        </div>
        
        <div className="lg:col-span-1">
          {/* 
            This is a custom wrapper to achieve the look from the image.
            The actual CopilotSidebar component is inside.
          */}
          <div className="copilot-chatbot">
              <div className="copilot-chat-header">
                  <div className="copilot-chat-avatar">AI</div>
                  <div>
                    <h2 className="title">Dashboard</h2>
                    <h2 className="title">Assistant</h2>
                  </div>
              </div>
              <CopilotSidebar
                  instructions={INSTRUCTIONS}
                  labels={{
                      initial: "Hello! I'm your AI assistant. How can I help with your dashboard today?",
                      placeholder: "Type your message..."
                  }}
                  defaultOpen={true}
                  clickOutsideToClose={false}
                  className="copilot-sidebar-custom"
              >
              </CopilotSidebar>
          </div>
        </div>
      </div>
    </div>
  );
}
