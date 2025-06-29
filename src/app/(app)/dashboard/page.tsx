
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { CopilotPopup } from "@copilotkit/react-ui";
import { useTranslations } from "@/hooks/use-translations";

export default function DashboardPage() {
  const t = useTranslations();
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <div className="space-y-6">
        <PageHeader title={t.dashboard.title} />
        <StatsCards />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>{t.dashboard.aiEngine.title}</CardTitle>
               <CardDescription>
                {t.dashboard.aiEngine.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center p-6">
               <p className="mb-4 text-sm text-muted-foreground">
                Click the button below to interact with the AI assistant.
              </p>
              <Button onClick={() => setShowPopup(true)}>
                <Bot className="mr-2 h-4 w-4" />
                Ask our AI
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <CopilotPopup
        open={showPopup}
        onOpenChange={setShowPopup}
        labels={{
          title: "RuleWise AI Assistant",
          initial: "Hello! I'm the RuleWise AI assistant. How can I help you define or understand your business rules today?",
        }}
      />
    </>
  )
}
