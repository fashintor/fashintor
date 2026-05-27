'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { dashboardRoutes } from '@/lib/routes'
import styles from './DashboardShell.module.scss'

const navItems = [
  { href: dashboardRoutes.wallet, label: 'Wallet', icon: 'account_balance_wallet' },
  { href: dashboardRoutes.cards, label: 'My Cards', icon: 'credit_card' },
  { href: dashboardRoutes.addFunds, label: 'Add Funds', icon: 'payments' },
  { href: dashboardRoutes.transactions, label: 'Transactions', icon: 'receipt_long' },
  { href: dashboardRoutes.profile, label: 'Profile', icon: 'account_circle' },
]

function isActive(pathname, href) {
  if (href === dashboardRoutes.cards) {
    return pathname === href || pathname.startsWith(`${href}/`)
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function DashboardShell({ children }) {
  const pathname = usePathname()

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link href={dashboardRoutes.wallet} className={styles.brand}>
          AURA
        </Link>
        <p className={styles.brandHint}>Dashboard</p>

        <nav className={styles.nav} aria-label="Dashboard">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${isActive(pathname, item.href) ? styles.navLinkActive : ''}`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.backLink}>
            <span className="material-symbols-outlined">arrow_back</span>
            Back to website
          </Link>
        </div>
      </aside>

      <div className={styles.main}>
        <div className={styles.content}>{children}</div>

        <nav className={styles.mobileBar} aria-label="Dashboard mobile">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.mobileLink} ${isActive(pathname, item.href) ? styles.mobileLinkActive : ''}`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
