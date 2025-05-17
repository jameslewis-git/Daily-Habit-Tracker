"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="hexagon-button bg-[#1e293b] border-indigo-500/70 text-indigo-300 h-10 w-10 p-0">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-[#1e293b] border-indigo-500/50">
        <DropdownMenuItem onClick={() => setTheme("light")} className="text-gray-200 hover:text-white hover:bg-indigo-600/30">Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="text-gray-200 hover:text-white hover:bg-indigo-600/30">Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="text-gray-200 hover:text-white hover:bg-indigo-600/30">System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
