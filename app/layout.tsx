import type { Metadata } from 'next'
import { Space_Mono, Rajdhani } from 'next/font/google'
import './globals.css'

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
})

const rajdhani = Rajdhani({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'Terra Incognita',
  description: 'Explore the unknown. Map your world.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceMono.variable} ${rajdhani.variable}`}>
      <body className="bg-[#030810] text-white overflow-hidden">
        {children}
      </body>
    </html>
  )
}
