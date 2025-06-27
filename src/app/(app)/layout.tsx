import AppLayout from "@/components/layout/app-layout"
import type { Metadata } from "next"
import { UserProvider } from "@/context/user-context"
import { KeycloakProvider } from "@/context/KeycloakProvider"

export const metadata: Metadata = {
  title: "RuleWise Dashboard",
  description: "Manage your business rules with the power of AI.",
};

export default function AppPagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <KeycloakProvider>
      <UserProvider>
        <AppLayout>{children}</AppLayout>
      </UserProvider>
    </KeycloakProvider>
  )
}
