import { mockTenants } from "@/lib/data"
import { TenantsClient } from "@/components/tenants/tenants-client"

export default async function TenantsPage() {
  const tenants = mockTenants
  return <TenantsClient initialTenants={tenants} />
}
