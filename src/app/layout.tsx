import { Manrope, Noto_Serif } from 'next/font/google'
import AppShell from '@/components/layout/AppShell'
import './globals.scss'
import { ReactNode } from 'react'

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-manrope',
})

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-serif',
})

export const metadata = {
  title: 'AURA | Private Wellness & Global Luxury Fintech',
  description: 'Secure virtual cards for luxury shopping worldwide',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,0..1"
        />
      </head>
      <body className={`${manrope.variable} ${notoSerif.variable}`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}