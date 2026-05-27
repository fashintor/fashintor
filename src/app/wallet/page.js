import { redirect } from 'next/navigation'
import { dashboardRoutes } from '@/lib/routes'

export default function LegacyWalletRedirect() {
  redirect(dashboardRoutes.wallet)
}
