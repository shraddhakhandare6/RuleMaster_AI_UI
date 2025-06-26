
"use client";

import { mockRules } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTranslations } from "@/hooks/use-translations";

export function RecentActivity() {
  const t = useTranslations();
  const recentRules = [...mockRules].slice(0, 4)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.dashboard.recentActivity.title}</CardTitle>
        <CardDescription>{t.dashboard.recentActivity.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentRules.map((rule, index) => (
            <div key={rule.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{rule.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{rule.name}</p>
                <p className="text-sm text-muted-foreground">{rule.description}</p>
              </div>
              <div className="ml-auto font-medium">{rule.active ? t.dashboard.recentActivity.active : t.dashboard.recentActivity.inactive}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
