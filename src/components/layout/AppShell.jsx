'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

export default function AppShell({ children }) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard')

  if (isDashboard) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <main style={{ paddingTop: '80px', minHeight: '100vh' }}>{children}</main>
      <Footer />
    </>
  )
}
