import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Peyza AI - Advanced AI Assistant",
  description: "Peyza AI - Your intelligent companion powered by cutting-edge AI models",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/Favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/Favicon.jpg",
        type: "image/jpeg",
      },
    ],
    apple: "/Favicon.jpg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
