
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useState } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { PageHeader } from "@/components/layout/page-header";
import "@/copilot-sidebar.css";

const DashboardContent = () => {
  const t = useTranslations();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [suggestions, setSuggestions] = useState([
    "Suggest a new business rule for employee bonuses",
    "Analyze the performance of marketing rules",
    "Which tenant has the most active rules?",
  ]);

  return (
    <>
      <div className="space-y-6">
        <PageHeader title={t.dashboard.title} />
        <StatsCards />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>{t.dashboard.aiEngine.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t.dashboard.aiEngine.description}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <CopilotSidebar
        show={sidebarOpen}
        onDismiss={() => setSidebarOpen(false)}
        labels={{
          title: "RuleWise AI Assistant",
          initial: "Welcome! How can I help you manage your business rules today?",
          placeholder: "Ask me anything...",
        }}
        suggestions={suggestions}
        onSuggestionsUpdate={setSuggestions}
        className="copilot-sidebar-custom"
      >
        <div className="copilot-chatbot">
          <div className="copilot-chat-header">
            <div className="copilot-chat-avatar">R</div>
            <div>
              <div className="title">RuleWise AI Assistant</div>
            </div>
          </div>
        </div>
      </CopilotSidebar>
    </>
  );
}

export default function DashboardPage() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit/">
      <DashboardContent />
    </CopilotKit>
  );
}
