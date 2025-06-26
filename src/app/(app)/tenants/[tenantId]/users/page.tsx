
"use client";

import { mockUsers, mockTenants } from "@/lib/data"
import { UsersClient } from "@/components/users/users-client"
import { PageHeader } from "@/components/layout/page-header"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useTranslations } from "@/hooks/use-translations";

export default function TenantUsersPage({ params }: { params: { tenantId: string } }) {
  const t = useTranslations();
  const { tenantId } = params
  const tenant = mockTenants.find(t => t.id === tenantId)
  const users = mockUsers.filter(u => u.tenantId === tenantId)
  const allTenants = mockTenants

  if (!tenant) {
    return (
        <div className="space-y-4">
            <PageHeader title={t.tenants.notFound} />
            <Button asChild variant="outline">
              <Link href="/tenants">{t.tenants.backToTenants}</Link>
            </Button>
        </div>
    )
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" asChild className="pl-1">
        <Link
          href="/tenants"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4 mr-2" />
            {t.tenants.backToTenants}
        </Link>
      </Button>
      <UsersClient 
          initialUsers={users} 
          allTenants={allTenants} 
          tenantId={tenant.id} 
          tenantName={tenant.name}
      />
    </div>
  );
}
