
import { mockUsers, mockTenants } from "@/lib/data"
import { UsersClient } from "@/components/users/users-client"

export default async function UsersPage() {
  const users = mockUsers
  const tenants = mockTenants
  return <UsersClient initialUsers={users} allTenants={tenants} />
}
