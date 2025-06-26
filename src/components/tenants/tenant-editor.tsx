
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
import { Tenant } from "@/lib/types"
import { useTranslations } from "@/hooks/use-translations"

const tenantSchema = z.object({
  name: z.string().min(3, "Tenant name is required."),
  status: z.enum(['active', 'inactive']),
})

type TenantFormData = z.infer<typeof tenantSchema>

type TenantEditorProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSave: (tenant: Omit<Tenant, 'id' | 'realmId' | 'createdAt'> & { id?: string }) => void
  tenant?: Partial<Tenant>
}

export function TenantEditor({ isOpen, onOpenChange, tenant, onSave }: TenantEditorProps) {
  const t = useTranslations();
  const form = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
  })

  useEffect(() => {
    if (isOpen) {
      const defaultValues = tenant
      ? { ...tenant }
      : {
          name: "",
          status: "active" as const,
        }
      form.reset(defaultValues)
    }
  }, [isOpen, tenant, form])

  const onSubmit = (data: TenantFormData) => {
    onSave({ ...data, id: tenant?.id })
    onOpenChange(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle>{tenant?.id ? t.tenants.editTenant : t.tenants.addNewTenant}</SheetTitle>
          <SheetDescription>
            {t.tenants.editorDescription}
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
                    <FormLabel>{t.tenants.tenantName}</FormLabel>
                    <FormControl><Input placeholder="e.g., Innovate Corp" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.shared.status}</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t.tenants.selectStatus} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">{t.shared.active}</SelectItem>
                        <SelectItem value="inactive">{t.shared.inactive}</SelectItem>
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
