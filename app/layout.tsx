import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import "@fontsource/poppins/400.css"
import "@fontsource/poppins/500.css"
import "@fontsource/poppins/600.css"
import "@fontsource/poppins/700.css"
import "@fontsource/inter/400.css"
import "@fontsource/inter/500.css"
import "@fontsource/inter/600.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Daily Habit Tracker",
  description: "Track your daily habits with a modern, interactive checklist",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <main className="min-h-screen bg-background honeycomb-bg py-8">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
