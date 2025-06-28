"use client";

import { PageHeader } from "@/components/layout/page-header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { useTranslations } from "@/hooks/use-translations";

export default function DashboardPage() {
  const t = useTranslations();

  return (
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
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video w-full">
              <Image
                src="https://placehold.co/600x400.png"
                alt="AI Brain"
                data-ai-hint="abstract ai"
                fill
                className="rounded-lg object-cover"
              />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {t.dashboard.aiEngine.description}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
