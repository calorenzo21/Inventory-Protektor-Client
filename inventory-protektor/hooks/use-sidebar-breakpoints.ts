"use client"

import { useState, useEffect } from "react"

// Definimos 5 breakpoints personalizados
const breakpoints = {
  xs: 0, // Extra small: 0px+
  sm: 640, // Small: 640px+
  md: 768, // Medium: 768px+
  lg: 1024, // Large: 1024px+
  xl: 1280, // Extra large: 1280px+
} as const

type Breakpoint = keyof typeof breakpoints

interface BreakpointConfig {
  sidebarWidth: string
  sidebarWidthMobile: string
  menuItemSize: "sm" | "default" | "lg"
  menuTextSize: string
  iconSize: string
}

// Configuración para cada breakpoint
const breakpointConfigs: Record<Breakpoint, BreakpointConfig> = {
  xs: {
    sidebarWidth: "14rem",
    sidebarWidthMobile: "16rem",
    menuItemSize: "sm",
    menuTextSize: "text-xs",
    iconSize: "size-4",
  },
  sm: {
    sidebarWidth: "15rem",
    sidebarWidthMobile: "17rem",
    menuItemSize: "sm",
    menuTextSize: "text-sm",
    iconSize: "size-4",
  },
  md: {
    sidebarWidth: "16rem",
    sidebarWidthMobile: "18rem",
    menuItemSize: "default",
    menuTextSize: "text-sm",
    iconSize: "size-5",
  },
  lg: {
    sidebarWidth: "16rem",
    sidebarWidthMobile: "18rem",
    menuItemSize: "default",
    menuTextSize: "text-[14px]",
    iconSize: "size-5",
  },
  xl: {
    sidebarWidth: "18rem",
    sidebarWidthMobile: "20rem",
    menuItemSize: "default",
    menuTextSize: "text-[16px]",
    iconSize: "size-6",
  },
}

export function useSideBarBreakpoints() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>("md")
  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setWindowWidth(width)

      // Determinar el breakpoint actual
      let newBreakpoint: Breakpoint = "xs"

      if (width >= breakpoints.xl) {
        newBreakpoint = "xl"
      } else if (width >= breakpoints.lg) {
        newBreakpoint = "lg"
      } else if (width >= breakpoints.md) {
        newBreakpoint = "md"
      } else if (width >= breakpoints.sm) {
        newBreakpoint = "sm"
      } else {
        newBreakpoint = "xs"
      }

      setCurrentBreakpoint(newBreakpoint)
    }

    // Ejecutar al montar el componente
    handleResize()

    // Agregar listener para cambios de tamaño
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const config = breakpointConfigs[currentBreakpoint]

  return {
    currentBreakpoint,
    windowWidth,
    config,
    breakpoints,
    isXs: currentBreakpoint === "xs",
    isSm: currentBreakpoint === "sm",
    isMd: currentBreakpoint === "md",
    isLg: currentBreakpoint === "lg",
    isXl: currentBreakpoint === "xl",
  }
}