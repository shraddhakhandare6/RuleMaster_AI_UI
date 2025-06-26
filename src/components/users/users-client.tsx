
"use client"

import { useState } from "react"
import type { User, Tenant } from "@/lib/types"
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
import { UserEditor } from "./user-editor"
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog"
import { useToast } from "@/hooks/use-toast"
import { useTranslations } from "@/hooks/use-translations"

type UsersClientProps = {
  initialUsers: User[];
  allTenants?: Tenant[];
  tenantId?: string;
  tenantName?: string;
}

export function UsersClient({ initialUsers, allTenants, tenantId, tenantName }: UsersClientProps) {
  const t = useTranslations()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<Partial<User> | undefined>(undefined)
  const [userToDelete, setUserToDelete] = useState<User | undefined>(undefined)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const pageTitle = tenantName ? t.users.usersFor(tenantName) : t.nav.users

  const handleCreateNew = () => {
    setSelectedUser({})
    setIsEditorOpen(true)
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsEditorOpen(true)
  }

  const handleSaveUser = (data: Omit<User, 'id' | 'createdAt'> & { id?: string }) => {
    if (data.id) {
      // Update
      setUsers(users.map(u => u.id === data.id ? { ...u, ...data, tenantId: data.tenantId } : u))
      toast({ title: t.users.userUpdated, description: t.users.userUpdatedDesc(data.name) })
    } else {
      // Create
      const newUser: User = {
        ...data,
        id: `user-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
      }
      setUsers([newUser, ...users])
      toast({ title: t.users.userCreated, description: t.users.userCreatedDesc(data.name) })
    }
  }

  const handleDelete = () => {
    if (!userToDelete) return
    setUsers(users.filter(u => u.id !== userToDelete.id))
    toast({ variant: "destructive", title: t.users.userRemoved, description: t.users.userRemovedDesc(userToDelete.name) })
    setUserToDelete(undefined)
  }

  const openDeleteConfirm = (user: User) => {
    setUserToDelete(user)
    setIsConfirmOpen(true)
  }

  const handleResetPassword = (user: User) => {
    toast({
      title: t.users.passwordReset,
      description: t.users.passwordResetDesc(user.email)
    })
  }

  return (
    <>
      <PageHeader title={pageTitle}>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          {t.users.addUser}
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.shared.name}</TableHead>
                <TableHead>{t.shared.email}</TableHead>
                {!tenantId && <TableHead>{t.users.tenant}</TableHead>}
                <TableHead>{t.shared.role}</TableHead>
                <TableHead>{t.users.createdAt}</TableHead>
                <TableHead>{t.shared.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  {!tenantId && (
                    <TableCell>
                      {allTenants?.find((t) => t.id === user.tenantId)?.name || 'N/A'}
                    </TableCell>
                  )}
                  <TableCell>
                    <Badge variant="outline">{t.users[user.role]}</Badge>
                  </TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">{t.shared.openMenu}</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(user)}>{t.users.editUser}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleResetPassword(user)}>{t.users.resetPassword}</DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => openDeleteConfirm(user)}
                        >
                          {t.users.removeUser}
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

      <UserEditor
        isOpen={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        user={selectedUser}
        onSave={handleSaveUser}
        allTenants={allTenants}
        tenantId={tenantId}
      />

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={handleDelete}
        title={t.shared.areYouSure}
        description={t.users.deleteConfirmation(userToDelete?.name || '')}
      />
    </>
  )
}
