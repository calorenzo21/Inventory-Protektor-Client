"use client";
import { useSideBarBreakpoints } from "@/hooks/use-sidebar-breakpoints";
import { AppSidebar } from "./app-sidebar";
import { SiteHeader } from "./site-header";
import { SidebarInset, SidebarProvider } from "./ui/sidebar";

export function SbProvider({ children }: { children: React.ReactNode }) {
  const { config } = useSideBarBreakpoints()
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": config.sidebarWidth,
              "--sidebar-width-mobile": config.sidebarWidthMobile,
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          {/* Sidebar y header se renderizan globalmente */}
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col w-full">{children}</div>
          </SidebarInset>
      </SidebarProvider>
  )
}