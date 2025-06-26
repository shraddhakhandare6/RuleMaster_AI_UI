
"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { User, GroupUser } from "@/lib/types"
import { useTranslations } from "@/hooks/use-translations"

const addUserSchema = z.object({
  userId: z.string().min(1, "Please select a user."),
  role: z.string().min(2, "Role is required."),
})

type AddUserFormData = z.infer<typeof addUserSchema>

type AddUserDialogProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSave: (user: Omit<GroupUser, 'name' | 'email'>) => void
  allUsers: User[]
  groupUsers: GroupUser[]
}

export function AddUserDialog({ isOpen, onOpenChange, onSave, allUsers, groupUsers }: AddUserDialogProps) {
  const t = useTranslations();
  const form = useForm<AddUserFormData>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      userId: "",
      role: "",
    },
  })

  useEffect(() => {
    if (isOpen) {
      form.reset()
    }
  }, [isOpen, form])
  
  const availableUsers = allUsers.filter(
    (user) => !groupUsers.some((gu) => gu.id === user.id)
  );


  const onSubmit = (data: AddUserFormData) => {
    onSave({ id: data.userId, role: data.role })
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.groups.addUserToGroup}</DialogTitle>
          <DialogDescription>
            {t.groups.addUserDescription}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.users.title}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t.groups.selectUser} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableUsers.length > 0 ? (
                        availableUsers.map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          {t.groups.noUsersAvailable}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.groups.roleInGroup}</FormLabel>
                  <FormControl>
                    <Input placeholder={t.groups.roleInGroupPlaceholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>{t.shared.cancel}</Button>
              <Button type="submit">{t.shared.add}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
