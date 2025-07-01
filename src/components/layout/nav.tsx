
"use client"

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  ListChecks,
  Users,
  Settings,
  Users2,
} from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useTranslations } from "@/hooks/use-translations"

const navLinks = [
  { href: "/dashboard", icon: LayoutDashboard, labelKey: "dashboard" },
  { href: "/rules", icon: ListChecks, labelKey: "rules" },
  { href: "/users", icon: Users, labelKey: "users" },
  { href: "/groups", icon: Users2, labelKey: "groups" },
  { href: "/settings", icon: Settings, labelKey: "settings" },
] as const;

export function Nav() {
  const pathname = usePathname()
  const t = useTranslations()

  const navItems = navLinks.map(item => ({
    ...item,
    label: t.nav[item.labelKey]
  }))

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(item.href)}
            tooltip={item.label}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
