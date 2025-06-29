
import AppLayout from "@/components/layout/app-layout"
import type { Metadata } from "next"
import { UserProvider } from "@/context/user-context"
import { CopilotKit } from "@copilotkit/react-core";

export const metadata: Metadata = {
  title: "RuleWise Dashboard",
  description: "Manage your business rules with the power of AI.",
};

const runtimeUrl = process.env.NEXT_PUBLIC_COPILOTKIT_RUNTIME_URL
const publicApiKey = process.env.NEXT_PUBLIC_COPILOT_API_KEY;
const agentName = process.env.NEXT_PUBLIC_COPILOTKIT_AGENT_NAME

export default function AppPagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CopilotKit
      runtimeUrl={runtimeUrl}
      publicApiKey={publicApiKey}
      agent={agentName}
    >
      <UserProvider>
        <AppLayout>{children}</AppLayout>
      </UserProvider>
    </CopilotKit>
  )
}
