import Link from "next/link"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Sparkles } from "lucide-react"
import { Nav } from "./nav"
import { Button } from "../ui/button"
import { ProfileButton } from "./profile-button"

type Props = {
  children: React.ReactNode
}

export default async function AppLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader>
          <Button variant="ghost" className="h-10 w-full justify-start gap-3 px-2">
            <Sparkles className="size-6 text-logo" />
            <span className="font-headline text-lg font-semibold text-sidebar-foreground hover:text-black">
              RuleMaster AI
            </span>
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <Nav />
        </SidebarContent>
        <SidebarFooter>
          <ProfileButton />
        </SidebarFooter>
      </Sidebar>
      <SidebarRail />
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1" />
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
