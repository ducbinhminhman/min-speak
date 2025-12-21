import type React from "react"
import type { Metadata, Viewport } from "next"
import { Nunito, Cormorant_Garamond } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { MantineProvider, createTheme } from "@mantine/core"
import "@mantine/core/styles.css"
import "./globals.css"

const nunito = Nunito({ 
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-nunito"
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cormorant"
})

const theme = createTheme({
  colors: {
    coral: ['#ffe8e0', '#ffd4c4', '#ffbfa8', '#ffaa8c', '#ff9570', '#ff8054', '#e66b38', '#cc561c', '#b34100', '#992c00'],
    sky: ['#e0f2ff', '#b3e0ff', '#80ceff', '#4dbcff', '#1aaaff', '#0099e6', '#0080cc', '#0066b3', '#004d99', '#003380'],
    mint: ['#e0fff5', '#b3ffe9', '#80ffdc', '#4dffd0', '#1affc4', '#00e6a8', '#00cc94', '#00b380', '#00996b', '#008057'],
    purple: ['#f3e5ff', '#e0c2ff', '#cc99ff', '#b870ff', '#a347ff', '#8f1eff', '#7a00e6', '#6600cc', '#5200b3', '#3d0099'],
  },
  primaryColor: 'coral',
  fontFamily: nunito.style.fontFamily,
  headings: {
    fontFamily: cormorant.style.fontFamily,
  },
})

export const metadata: Metadata = {
  title: "Thương - Learn to Express Yourself",
  description: "A gentle space to practice English through voice conversations, guided by compassion and AI-powered feedback",
  generator: "v0.app",
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#1a1a2e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${nunito.variable} ${cormorant.variable} font-sans antialiased`}>
        <MantineProvider theme={theme}>
          {children}
          <Analytics />
        </MantineProvider>
      </body>
    </html>
  )
}
