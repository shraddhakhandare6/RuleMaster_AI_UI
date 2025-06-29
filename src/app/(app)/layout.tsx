import AppLayout from "@/components/layout/app-layout"
import type { Metadata } from "next"
import { UserProvider } from "@/context/user-context"

export const metadata: Metadata = {
  title: "RuleMaster AI Dashboard",
  description: "Manage your business rules with the power of AI.",
};

export default function AppPagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserProvider>
      <AppLayout>{children}</AppLayout>
    </UserProvider>
  )
}
