import { mockRules } from "@/lib/data"
import { RulesClient } from "@/components/rules/rules-client"

export default async function RulesPage() {
  // In a real app, you'd fetch this data from your database.
  const rules = mockRules

  return <RulesClient initialRules={rules} />
}
