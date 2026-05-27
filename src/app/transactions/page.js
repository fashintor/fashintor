import { redirect } from 'next/navigation'
import { dashboardRoutes } from '@/lib/routes'

export default function LegacyTransactionsRedirect() {
  redirect(dashboardRoutes.transactions)
}
