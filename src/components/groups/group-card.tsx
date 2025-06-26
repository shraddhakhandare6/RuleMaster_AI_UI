
"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, PlusCircle, Trash2, Edit } from "lucide-react"
import type { Group } from "@/lib/types"
import { useTranslations } from "@/hooks/use-translations"

type GroupCardProps = {
  group: Group;
  onAddUser: (groupId: string) => void;
  onRemoveUser: (groupId: string, userId: string) => void;
  onEdit: (group: Group) => void;
  onDelete: (group: Group) => void;
};

export function GroupCard({ group, onAddUser, onRemoveUser, onEdit, onDelete }: GroupCardProps) {
  const t = useTranslations();
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>{group.name}</CardTitle>
          <CardDescription>{group.description}</CardDescription>
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">{t.shared.openMenu}</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(group)}>
                <Edit className="mr-2 h-4 w-4" />
                {t.groups.editGroup}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(group)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t.groups.deleteGroup}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="mb-2 text-sm font-semibold">{t.groups.permissions}</h4>
          <div className="flex flex-wrap gap-2">
            {group.roles.map((role) => (
              <Badge key={role} variant="secondary" className="font-normal">
                {t.groups[role as keyof typeof t.groups] || role}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-2 text-sm font-semibold">{t.groups.usersInGroup}</h4>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.shared.name}</TableHead>
                  <TableHead>{t.shared.email}</TableHead>
                  <TableHead>{t.groups.roleInGroup}</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.users.length > 0 ? (
                  group.users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">{t.shared.openMenu}</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => onRemoveUser(group.id, user.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t.groups.removeFromGroup}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      {t.groups.noUsersInGroup}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={() => onAddUser(group.id)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t.users.addUser}
        </Button>
      </CardFooter>
    </Card>
  );
}
