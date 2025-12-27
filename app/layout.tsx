import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/navbar'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ExposeClients - Freelancer Reviews',
  description: 'Share your experience with clients.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen bg-slate-50")}>
        <Navbar />
        <main className="container py-6">
          {children}
        </main>
      </body>
    </html>
  )
}
