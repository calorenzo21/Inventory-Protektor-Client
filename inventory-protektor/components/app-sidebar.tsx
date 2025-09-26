"use client"

import type * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconSettings,
  IconBoxSeam,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSideBarBreakpoints } from "@/hooks/use-sidebar-breakpoints"
import { cn } from "@/lib/utils"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Analíticas de Ventas",
      url: "/analytics",
      icon: IconChartBar,
    },
    {
      title: "Inventario",
      url: "/inventory",
      icon: IconBoxSeam,
      subItems: [
        {
          title: "Lista de Productos",
          url: "/inventory",
        },
        {
          title: "Gestionar Inventario",
          url: "/inventory/upload",
        },
      ],
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Configuración",
      url: "#",
      icon: IconSettings,
    },
  ],
  documents: [],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { config } = useSideBarBreakpoints()

  return (
    <Sidebar collapsible="offcanvas" {...props} className="bg-navy-blue transition-all duration-300">
      <SidebarHeader className="bg-navy-blue">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size={config.menuItemSize}
              className={cn("data-[slot=sidebar-menu-button]:!p-1.5 transition-all duration-200", config.menuTextSize)}
            >
              <a href="#">
                <span className="font-semibold text-white">Representaciones Stevan</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-navy-blue text-white">
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter className="bg-navy-blue">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}