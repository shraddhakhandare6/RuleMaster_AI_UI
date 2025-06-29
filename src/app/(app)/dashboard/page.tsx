
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { CopilotKit } from "@copilotkit/react-core";
import { useCopilotAction } from "@copilotkit/react-core";
import { useTranslations } from "@/hooks/use-translations";
import { CopilotChat } from "@/components/dashboard/copilot-chat";

export default function DashboardPage() {
  const t = useTranslations();
  
  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit"
      transcribeAudioUrl="/api/transcribe"
      textToSpeechUrl="/api/tts"
    >
      <DashboardContent t={t} />
    </CopilotKit>
  );
}

function DashboardContent({ t }: { t: any; }) {
  useCopilotAction({
    name: "findRules",
    description: "Find rules matching a query.",
    parameters: [
      { name: "query", type: "string", description: "The search query for rules." },
    ],
    handler: ({ query }) => {
      // In a real app, you would implement the logic to find and display rules.
      // For this demo, we'll just log it.
      console.log(`Finding rules with query: "${query}"`);
      alert(`Finding rules for query: "${query}". This is a demo action and is not fully implemented.`);
    },
  });

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 space-y-6">
        <PageHeader title={t.dashboard.title} />
        <StatsCards />
        <RecentActivity />
      </div>
      <aside className="w-full lg:w-[400px] xl:w-[450px] shrink-0">
        <CopilotChat />
      </aside>
    </div>
  );
}

