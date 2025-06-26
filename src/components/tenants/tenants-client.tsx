
"use client"

import { useState } from "react"
import Link from "next/link"
import type { Tenant } from "@/lib/types"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Plus, MoreHorizontal } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { TenantEditor } from "./tenant-editor"
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog"
import { useToast } from "@/hooks/use-toast"
import { useTranslations } from "@/hooks/use-translations"

type TenantsClientProps = {
  initialTenants: Tenant[]
}

export function TenantsClient({ initialTenants }: TenantsClientProps) {
  const t = useTranslations()
  const { toast } = useToast()
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<Partial<Tenant> | undefined>(undefined)
  const [tenantToDelete, setTenantToDelete] = useState<Tenant | undefined>(undefined)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const handleCreateNew = () => {
    setSelectedTenant({})
    setIsEditorOpen(true)
  }

  const handleEdit = (tenant: Tenant) => {
    setSelectedTenant(tenant)
    setIsEditorOpen(true)
  }

  const handleSaveTenant = (data: Omit<Tenant, 'id' | 'realmId' | 'createdAt'> & { id?: string }) => {
    if (data.id) {
      // Update
      setTenants(tenants.map(t => t.id === data.id ? { ...t, ...data } : t))
      toast({ title: t.tenants.tenantUpdated, description: t.tenants.tenantUpdatedDesc(data.name) })
    } else {
      // Create
      const newTenant: Tenant = {
        ...data,
        id: `tenant-${Date.now()}`,
        realmId: `${data.name.toLowerCase().replace(/\s/g, '-')}-realm`,
        createdAt: new Date().toISOString().split('T')[0],
      }
      setTenants([newTenant, ...tenants])
      toast({ title: t.tenants.tenantCreated, description: t.tenants.tenantCreatedDesc(data.name) })
    }
  }

  const handleDelete = () => {
    if (!tenantToDelete) return
    setTenants(tenants.filter(t => t.id !== tenantToDelete.id))
    toast({ variant: "destructive", title: t.tenants.tenantDeleted, description: t.tenants.tenantDeletedDesc(tenantToDelete.name) })
    setTenantToDelete(undefined)
  }

  const openDeleteConfirm = (tenant: Tenant) => {
    setTenantToDelete(tenant)
    setIsConfirmOpen(true)
  }

  return (
    <>
      <PageHeader title={t.nav.tenants}>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          {t.tenants.addTenant}
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.shared.name}</TableHead>
                <TableHead>{t.tenants.realmId}</TableHead>
                <TableHead>{t.shared.status}</TableHead>
                <TableHead>{t.tenants.createdAt}</TableHead>
                <TableHead>{t.shared.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell className="font-medium">{tenant.name}</TableCell>
                  <TableCell className="font-code text-sm">{tenant.realmId}</TableCell>
                   <TableCell>
                    <Badge variant={tenant.status === 'active' ? 'default' : 'outline'} className={tenant.status === 'active' ? 'bg-green-600 hover:bg-green-700' : 'border-destructive text-destructive'}>
                      {t.shared[tenant.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>{tenant.createdAt}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">{t.shared.openMenu}</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(tenant)}>{t.tenants.editTenant}</DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/tenants/${tenant.id}/users`}>{t.tenants.manageUsers}</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => openDeleteConfirm(tenant)}
                        >
                          {t.tenants.deleteTenant}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TenantEditor 
        isOpen={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        tenant={selectedTenant}
        onSave={handleSaveTenant}
      />
      
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={handleDelete}
        title={t.shared.areYouSure}
        description={t.tenants.deleteConfirmation(tenantToDelete?.name || '')}
      />
    </>
  )
}
