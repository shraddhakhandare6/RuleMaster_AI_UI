
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
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form"
import type { Group } from "@/lib/types"
import { ScrollArea } from "../ui/scroll-area"
import { useTranslations } from "@/hooks/use-translations"

const ALL_PERMISSIONS = [
  { id: 'rule:create', labelKey: 'rule:create' },
  { id: 'rule:read', labelKey: 'rule:read' },
  { id: 'rule:update', labelKey: 'rule:update' },
  { id: 'rule:delete', labelKey: 'rule:delete' },
  { id: 'rule:activate-deactivate', labelKey: 'rule:activate-deactivate' },
  { id: 'rule:apply', labelKey: 'rule:apply' },
  { id: 'custom-function:manage', labelKey: 'custom-function:manage' },
  { id: 'user:manage', labelKey: 'user:manage' },
  { id: 'tenant:monitor', labelKey: 'tenant:monitor' },
] as const;

const groupSchema = z.object({
  name: z.string().min(3, "Group name is required."),
  description: z.string().optional(),
  roles: z.array(z.string()).refine(value => value.some(item => item), {
    message: "You have to select at least one permission.",
  }),
})

type GroupFormData = z.infer<typeof groupSchema>

type GroupEditorProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSave: (group: Omit<Group, 'id' | 'users'> & { id?: string }) => void
  group?: Partial<Group>
}

export function GroupEditor({ isOpen, onOpenChange, group, onSave }: GroupEditorProps) {
  const t = useTranslations();
  const form = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
  })

  useEffect(() => {
    if (isOpen) {
      const defaultValues = group
        ? { ...group, description: group.description || "", roles: group.roles || [] }
        : {
            name: "",
            description: "",
            roles: [],
          }
      form.reset(defaultValues)
    }
  }, [isOpen, group, form])

  const onSubmit = (data: GroupFormData) => {
    onSave({ ...data, id: group?.id })
    onOpenChange(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl flex flex-col">
        <SheetHeader>
          <SheetTitle>{group?.id ? t.groups.editGroup : t.groups.createGroup}</SheetTitle>
          <SheetDescription>
            {t.groups.editorDescription}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 pr-6 -mr-6">
              <div className="space-y-6 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.groups.groupName}</FormLabel>
                      <FormControl>
                        <Input placeholder={t.groups.groupNamePlaceholder} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.shared.description}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t.groups.descriptionPlaceholder}
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="roles"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">{t.groups.permissions}</FormLabel>
                        <FormDescription>
                          {t.groups.permissionsDescription}
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ALL_PERMISSIONS.map(permission => (
                          <FormField
                            key={permission.id}
                            control={form.control}
                            name="roles"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={permission.id}
                                  className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(permission.id)}
                                      onCheckedChange={checked => {
                                        return checked
                                          ? field.onChange([...field.value, permission.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                value => value !== permission.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {t.groups[permission.labelKey]}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
            <SheetFooter className="mt-auto pt-4 pr-6">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                {t.shared.cancel}
              </Button>
              <Button type="submit">{t.shared.save}</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
