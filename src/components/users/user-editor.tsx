
"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Tenant } from "@/lib/types"
import { useTranslations } from "@/hooks/use-translations"

const userSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Invalid email address."),
  role: z.enum(['admin', 'editor', 'viewer']),
  tenantId: z.string().min(1, "Tenant is required"),
})

type UserFormData = z.infer<typeof userSchema>

type UserEditorProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSave: (user: Omit<User, 'id' | 'createdAt'> & { id?: string }) => void
  user?: Partial<User>
  allTenants?: Tenant[]
  tenantId?: string
}

export function UserEditor({ isOpen, onOpenChange, user, onSave, allTenants, tenantId }: UserEditorProps) {
  const t = useTranslations()
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  })

  useEffect(() => {
    if (isOpen) {
      const defaultValues = user && user.id
      ? { ...user, tenantId: user.tenantId || '' }
      : {
          name: "",
          email: "",
          role: "viewer" as const,
          tenantId: tenantId || "",
        }
      form.reset(defaultValues)
    }
  }, [isOpen, user, form, tenantId])

  const onSubmit = (data: UserFormData) => {
    onSave({ ...data, id: user?.id })
    onOpenChange(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle>{user?.id ? t.users.editUser : t.users.addNewUser}</SheetTitle>
          <SheetDescription>
            {t.users.editorDescription}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto pr-6 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.users.fullName}</FormLabel>
                    <FormControl><Input placeholder="e.g., Alice Johnson" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.shared.email}</FormLabel>
                    <FormControl><Input type="email" placeholder="e.g., alice@example.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tenantId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.users.tenant}</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!tenantId}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t.users.selectTenant} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allTenants?.map(t => (
                          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
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
                    <FormLabel>{t.shared.role}</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t.users.selectRole} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">{t.users.admin}</SelectItem>
                        <SelectItem value="editor">{t.users.editor}</SelectItem>
                        <SelectItem value="viewer">{t.users.viewer}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SheetFooter className="mt-auto pt-4">
                  <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>{t.shared.cancel}</Button>
                  <Button type="submit">{t.shared.save}</Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
