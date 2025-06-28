// "use client";

// import { PageHeader } from "@/components/layout/page-header"
// import { StatsCards } from "@/components/dashboard/stats-cards"
// import { RecentActivity } from "@/components/dashboard/recent-activity"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import Image from "next/image"
// import { useTranslations } from "@/hooks/use-translations";

// export default function DashboardPage() {
//   const t = useTranslations();

//   return (
//     <div className="space-y-6">
//       <PageHeader title={t.dashboard.title} />
//       <StatsCards />
//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//         <div className="lg:col-span-2">
//           <RecentActivity />
//         </div>
//         <Card>
//           <CardHeader>
//             <CardTitle>{t.dashboard.aiEngine.title}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="relative aspect-video w-full">
//               <Image
//                 src="https://placehold.co/600x400.png"
//                 alt="AI Brain"
//                 data-ai-hint="abstract ai"
//                 fill
//                 className="rounded-lg object-cover"
//               />
//             </div>
//             <p className="mt-4 text-sm text-muted-foreground">
//               {t.dashboard.aiEngine.description}
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }



"use client";

import "@/copilot-sidebar.css";

import { PageHeader } from "@/components/layout/page-header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar, useCopilotChatSuggestions } from "@copilotkit/react-ui";
import { useCopilotAction } from "@copilotkit/react-core";
import { useState } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { INSTRUCTIONS } from "../../instructions";

export default function DashboardPage() {
  const t = useTranslations();
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <CopilotKit
      runtimeUrl="api/copilotkit"
      transcribeAudioUrl="/api/transcribe"
      textToSpeechUrl="/api/tts"
    >
      <DashboardContent t={t} showSidebar={showSidebar} />
    </CopilotKit>
  );
}

function DashboardContent({ t, showSidebar }: { t: any; showSidebar: boolean }) {
  // CopilotKit hooks must be used inside CopilotKit provider!
  useCopilotAction({
    name: "createSpreadsheet",
    description: "Create a new spreadsheet",
    parameters: [
      {
        name: "rows",
        type: "object[]",
        description: "Rows of the spreadsheet",
      },
      {
        name: "title",
        type: "string",
        description: "Title of the spreadsheet",
      },
    ],
    handler: ({ rows, title }) => {
      console.log("Spreadsheet created with title:", title);
      // Logic for creating the spreadsheet
    },
  });

  useCopilotChatSuggestions({
    instructions: "Suggest actions like creating a new sheet, adding data, etc.",
    maxSuggestions: 3,
    minSuggestions: 1,
  });

  return (
    <div className="space-y-6">
      <PageHeader title={t.dashboard.title} />

      {/* Copilot Sidebar for interaction */}
      {showSidebar && (
        // <CopilotSidebar
        //   instructions={INSTRUCTIONS}
        //   labels={{
        //     initial: "Welcome to the dashboard! How can I assist you?",
        //   }}
        //   defaultOpen={true}
        //   clickOutsideToClose={false}
        // >

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RecentActivity />
            </div>
            <Card>
              <CardHeader>
                <CardTitle>{t.dashboard.aiEngine.title}</CardTitle>
                
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video w-full">
                  <CopilotSidebar
                    instructions={INSTRUCTIONS}
                    labels={{
                      initial: "Welcome to the dashboard! How can I assist you?",
                    }}
                    defaultOpen={true}
                    clickOutsideToClose={false}
                    className="copilot-sidebar-custom"
                  >
                  <p className="mt-4 text-sm text-muted-foreground">
                    {t.dashboard.aiEngine.description}
                  </p>
                          </CopilotSidebar>
                </div>
              </CardContent>
            </Card>
          </div>
      )}

      {/* Stats Cards */}
      <StatsCards />
    </div>
  );
}

