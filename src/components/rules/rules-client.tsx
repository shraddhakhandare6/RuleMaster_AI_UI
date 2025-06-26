"use client"

import { useState } from "react"
import type { Rule } from "@/lib/types"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Plus, MoreHorizontal } from "lucide-react"
import { RuleEditor } from "./rule-editor"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog"
import { useTranslations } from "@/hooks/use-translations"

type RulesClientProps = {
  initialRules: Rule[]
}

export function RulesClient({ initialRules }: RulesClientProps) {
  const t = useTranslations()
  const { toast } = useToast()
  const [rules, setRules] = useState<Rule[]>(initialRules)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [selectedRule, setSelectedRule] = useState<Partial<Rule> | undefined>(undefined)
  const [ruleToDelete, setRuleToDelete] = useState<Rule | undefined>(undefined)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const handleCreateNew = () => {
    setSelectedRule({})
    setIsEditorOpen(true)
  }

  const handleEdit = (rule: Rule) => {
    setSelectedRule(rule)
    setIsEditorOpen(true)
  }

  const handleSaveRule = (data: Omit<Rule, 'id' | 'active'> & { id?: string }) => {
    if (data.id) {
      // Update existing rule
      const updatedRules = rules.map(r => 
        r.id === data.id ? { ...r, ...data, id: r.id } : r
      )
      setRules(updatedRules)
      toast({ title: t.rules.ruleUpdated, description: t.rules.ruleUpdatedDesc(data.name) })
    } else {
      // Create new rule
      const newRule: Rule = {
        ...data,
        id: `rule-${Date.now()}`,
        active: true,
      }
      setRules([newRule, ...rules])
      toast({ title: t.rules.ruleCreated, description: t.rules.ruleCreatedDesc(data.name) })
    }
  }
  
  const handleDuplicate = (rule: Rule) => {
    const newRule: Rule = {
      ...rule,
      id: `rule-${Date.now()}`,
      name: `${rule.name} (Copy)`,
    }
    setRules([newRule, ...rules])
    toast({ title: t.rules.ruleDuplicated, description: t.rules.ruleDuplicatedDesc(rule.name) })
  }

  const handleDelete = () => {
    if (!ruleToDelete) return
    setRules(rules.filter(r => r.id !== ruleToDelete.id))
    toast({ variant: "destructive", title: t.rules.ruleDeleted, description: t.rules.ruleDeletedDesc(ruleToDelete.name) })
    setRuleToDelete(undefined)
  }

  const openDeleteConfirm = (rule: Rule) => {
    setRuleToDelete(rule)
    setIsConfirmOpen(true)
  }

  const toggleRuleStatus = (ruleId: string) => {
    setRules(rules.map(r => r.id === ruleId ? {...r, active: !r.active} : r));
  }

  return (
    <>
      <PageHeader title={t.rules.title}>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          {t.rules.createRule}
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">{t.rules.rule}</TableHead>
                <TableHead>{t.rules.priority}</TableHead>
                <TableHead>{t.rules.status}</TableHead>
                <TableHead>{t.shared.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>
                    <div className="font-medium">{rule.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {rule.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{rule.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={rule.active}
                        onCheckedChange={() => toggleRuleStatus(rule.id)}
                        aria-label="Toggle rule status"
                      />
                       <span className={`text-sm font-medium ${rule.active ? 'text-green-600' : 'text-muted-foreground'}`}>
                        {rule.active ? t.rules.active : t.rules.inactive}
                      </span>
                    </div>
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
                        <DropdownMenuItem onClick={() => handleEdit(rule)}>
                          {t.rules.edit}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(rule)}>
                          {t.rules.duplicate}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => openDeleteConfirm(rule)}
                        >
                          {t.rules.delete}
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
      
      <RuleEditor
        isOpen={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        rule={selectedRule}
        onSave={handleSaveRule}
      />

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={handleDelete}
        title={t.rules.deleteConfirmationTitle}
        description={t.rules.deleteConfirmationDesc(ruleToDelete?.name || '')}
      />
    </>
  )
}
