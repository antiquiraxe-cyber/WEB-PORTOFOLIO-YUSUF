import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Space_Mono, Syne } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
})
const _syne = Syne({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-syne",
})

export const metadata: Metadata = {
  title: "Sakha Yusuf - Generalist Web Developer",
  description: "Bridging the gap between a blank canvas and a live website.",
}

import CustomCursor from "@/components/CustomCursor"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${_spaceMono.variable} ${_syne.variable} font-sans antialiased`} suppressHydrationWarning>
        <CustomCursor />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
