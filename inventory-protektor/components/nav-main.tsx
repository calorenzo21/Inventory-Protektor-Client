"use client"

import type { Icon } from "@tabler/icons-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible"
import { ChevronDownIcon } from "lucide-react"
import { useSideBarBreakpoints } from "@/hooks/use-sidebar-breakpoints"
import { cn } from "@/lib/utils"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
    subItems?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const { config } = useSideBarBreakpoints()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-4">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.subItems ? (
                <Collapsible defaultOpen className="group/collapsible">
                  <CollapsibleTrigger asChild className="w-full">
                    <SidebarMenuButton
                      tooltip={item.title}
                      size={config.menuItemSize}
                      className={cn(
                        "flex justify-between items-center w-full transition-all duration-200",
                        config.menuTextSize,
                        `[&>div>svg]:${config.iconSize}`,
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {item.icon && <item.icon className={cn("transition-all duration-200", config.iconSize)} />}
                        <span className="font-medium">{item.title}</span>
                      </div>
                      <ChevronDownIcon
                        className={cn(
                          "transition-all duration-200 group-data-[state=open]/collapsible:rotate-180",
                          config.iconSize,
                        )}
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.subItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <Link href={subItem.url} className="block w-full">
                            <SidebarMenuSubButton
                              asChild
                              className={cn("transition-all duration-200", config.menuTextSize)}
                            >
                              <div className="flex items-center gap-2 pl-6 text-white">
                                <span>{subItem.title}</span>
                              </div>
                            </SidebarMenuSubButton>
                          </Link>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link href={item.url} className="block w-full">
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    size={config.menuItemSize}
                    className={cn("transition-all duration-200", config.menuTextSize, `[&>div>svg]:${config.iconSize}`)}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon && <item.icon className={cn("transition-all duration-200", config.iconSize)} />}
                      <span className="font-medium">{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
