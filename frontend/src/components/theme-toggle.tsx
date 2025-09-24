"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="p-2 rounded-full text-gray-500 dark:text-gray-400">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </div>
    )
  }

  const toggleTheme = () => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    console.log(`Theme toggled from ${resolvedTheme} to ${newTheme}`)
    
    // Force DOM update as fallback
    setTimeout(() => {
      const html = document.documentElement
      if (newTheme === "dark") {
        html.classList.add("dark")
        html.style.background = "#0f172a"
        html.style.color = "#f9fafb"
      } else {
        html.classList.remove("dark")
        html.style.background = "white"
        html.style.color = "#111827"
      }
      console.log(`DOM updated: ${html.className}, background: ${html.style.background}`)
    }, 100)
  }

  return (
    <div className="relative">
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors duration-200"
        title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </button>
    </div>
  )
}
