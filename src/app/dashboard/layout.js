import DashboardShell from '@/components/layout/DashboardShell'

export const metadata = {
  title: `Dashboard | ${process.env.NEXT_PUBLIC_BRAND_NAME || 'Fashintor'}`,
  description: 'Manage your wallet, cards, and transactions',
}

export default function DashboardLayout({ children }) {
  return <DashboardShell>{children}</DashboardShell>
}
