
"use client"

import { useEffect, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
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
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Rule, Group } from "@/lib/types"
import { PlusCircle, Trash2, Wand2, Loader2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { parseRuleWithAI } from "@/app/actions/rules"
import { useTranslations } from "@/hooks/use-translations"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const conditionSchema = z.object({
  id: z.string().optional(),
  fact: z.string().min(1, "Fact is required."),
  operator: z.string().min(1, "Operator is required."),
  value: z.string().min(1, "Value is required."),
})

const actionSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, "Action description is required."),
})

const ruleSchema = z.object({
  name: z.string().min(3, "Rule name is required."),
  description: z.string().optional(),
  priority: z.coerce.number().int().min(1, "Priority must be at least 1."),
  tag: z.string().min(1, "Category is required."),
  conditions: z.array(conditionSchema).min(1, "At least one condition is required."),
  actions: z.array(actionSchema).min(1, "At least one action is required."),
  customCode: z.string().optional(),
})

type RuleFormData = z.infer<typeof ruleSchema>

type RuleEditorProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSave: (rule: Omit<Rule, 'id' | 'active'> & { id?: string }, naturalLanguage: string) => Promise<void>
  rule?: Partial<Rule>
  groups: Group[]
}

export function RuleEditor({ isOpen, onOpenChange, rule, onSave, groups }: RuleEditorProps) {
  const t = useTranslations()
  const { toast } = useToast()
  const [naturalLanguage, setNaturalLanguage] = useState("")
  const [isParsing, setIsParsing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const form = useForm<RuleFormData>({
    resolver: zodResolver(ruleSchema),
  })
  
  useEffect(() => {
    if (isOpen) {
      const defaultValues = rule?.id
      ? { ...rule, description: rule.description || "", customCode: rule.customCode || "", tag: rule.tag || "" }
      : {
          name: "",
          description: "",
          priority: 1,
          tag: "",
          conditions: [],
          actions: [],
          customCode: "",
        }
      form.reset(defaultValues)
      setNaturalLanguage("")
    }
  }, [isOpen, rule, form])


  const {
    fields: conditionFields,
    append: appendCondition,
    remove: removeCondition,
  } = useFieldArray({ control: form.control, name: "conditions" })

  const {
    fields: actionFields,
    append: appendAction,
    remove: removeAction,
  } = useFieldArray({ control: form.control, name: "actions" })
  
  const handleParse = async () => {
    setIsParsing(true)
    const result = await parseRuleWithAI(naturalLanguage)
    if (result.success) {
      const { conditions, operators, values, actions } = result.data
      form.setValue("conditions", conditions.map((fact, i) => ({ fact, operator: operators[i] || '', value: values[i] || '' })))
      form.setValue("actions", actions.map(description => ({ description })))
      toast({
        title: t.rules.ruleParsedTitle,
        description: t.rules.ruleParsedDesc,
      })
    } else {
      toast({
        variant: "destructive",
        title: t.rules.parsingFailedTitle,
        description: result.error,
      })
    }
    setIsParsing(false)
  }

  const onSubmit = async (data: RuleFormData) => {
    setIsSaving(true)
    await onSave({ ...data, id: rule?.id }, naturalLanguage)
    setIsSaving(false)
    onOpenChange(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl flex flex-col">
        <SheetHeader>
          <SheetTitle>{rule?.id ? t.rules.editTitle : t.rules.createTitle}</SheetTitle>
          <SheetDescription>
            {t.rules.editorDescription}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto pr-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="natural-language">{t.rules.defineWithAI}</Label>
                <Textarea
                  id="natural-language"
                  placeholder={t.rules.defineWithAIPlaceholder}
                  value={naturalLanguage}
                  onChange={(e) => setNaturalLanguage(e.target.value)}
                  className="font-body"
                />
                 <Button type="button" onClick={handleParse} disabled={!naturalLanguage || isParsing}>
                  {isParsing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                  {isParsing ? t.rules.parsing : t.rules.generateWithAI}
                </Button>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.rules.ruleName}</FormLabel>
                      <FormControl><Input placeholder={t.rules.ruleNamePlaceholder} {...field} value={field.value ?? ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.rules.priority}</FormLabel>
                      <FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="tag"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.rules.category}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t.rules.selectCategory} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {groups.map(group => (
                            <SelectItem key={group.id} value={group.name}>
                              {group.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.rules.descriptionLabel}</FormLabel>
                      <FormControl><Textarea placeholder={t.rules.descriptionPlaceholder} {...field} value={field.value ?? ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <div>
                <h3 className="text-lg font-medium mb-2">{t.rules.conditionsTitle}</h3>
                <div className="space-y-4">
                  {conditionFields.map((field, index) => (
                    <div key={field.id} className="flex items-start gap-2 p-3 border rounded-md bg-background/50">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                        <FormField
                          control={form.control}
                          name={`conditions.${index}.fact`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t.rules.fact}</FormLabel>
                              <FormControl>
                                <Input placeholder={t.rules.factPlaceholder} {...field} value={field.value ?? ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`conditions.${index}.operator`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t.rules.operator}</FormLabel>
                              <FormControl>
                                <Input placeholder={t.rules.operatorPlaceholder} {...field} value={field.value ?? ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`conditions.${index}.value`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t.rules.value}</FormLabel>
                              <FormControl>
                                <Input placeholder={t.rules.valuePlaceholder} {...field} value={field.value ?? ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeCondition(index)} className="mt-7"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => appendCondition({ fact: '', operator: '', value: '' })}><PlusCircle className="mr-2 h-4 w-4" /> {t.rules.addCondition}</Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">{t.rules.actionsTitle}</h3>
                 <div className="space-y-4">
                  {actionFields.map((field, index) => (
                    <div key={field.id} className="flex items-start gap-2 p-3 border rounded-md bg-background/50">
                      <div className="flex-1">
                        <FormField
                          control={form.control}
                          name={`actions.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t.rules.action}</FormLabel>
                              <FormControl>
                                <Input placeholder={t.rules.actionPlaceholder} {...field} value={field.value ?? ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeAction(index)} className="mt-7"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => appendAction({ description: ''})}><PlusCircle className="mr-2 h-4 w-4" /> {t.rules.addAction}</Button>
                </div>
              </div>

               <FormField
                  control={form.control}
                  name="customCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.rules.customCodeLabel}</FormLabel>
                      <FormControl><Textarea placeholder={t.rules.customCodePlaceholder} {...field} value={field.value ?? ''} className="font-code min-h-[150px]" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <SheetFooter className="mt-auto pt-4">
                    <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>{t.shared.cancel}</Button>
                    <Button type="submit" disabled={isSaving || isParsing}>
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {isSaving ? "Saving..." : t.rules.saveRule}
                    </Button>
                </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
