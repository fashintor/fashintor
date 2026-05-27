import DashboardShell from '@/components/layout/DashboardShell'

export const metadata = {
  title: 'Dashboard | AURA',
  description: 'Manage your wallet, cards, and transactions',
}

export default function DashboardLayout({ children }) {
  return <DashboardShell>{children}</DashboardShell>
}
