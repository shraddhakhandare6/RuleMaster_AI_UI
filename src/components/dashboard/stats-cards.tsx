
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ListChecks, Building, Users, Activity } from "lucide-react"
import { mockRules, mockTenants, mockUsers } from "@/lib/data"
import { useTranslations } from "@/hooks/use-translations";

export function StatsCards() {
  const t = useTranslations();
  const stats = [
    {
      title: t.dashboard.stats.totalRules,
      value: mockRules.length,
      icon: ListChecks,
      description: t.dashboard.stats.totalRulesDesc,
    },
    {
      title: t.dashboard.stats.activeRules,
      value: mockRules.filter((r) => r.active).length,
      icon: Activity,
      description: t.dashboard.stats.activeRulesDesc,
    },
    {
      title: t.dashboard.stats.tenants,
      value: mockTenants.length,
      icon: Building,
      description: t.dashboard.stats.tenantsDesc,
    },
    {
      title: t.dashboard.stats.users,
      value: mockUsers.length,
      icon: Users,
      description: t.dashboard.stats.usersDesc,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium pr-2">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
