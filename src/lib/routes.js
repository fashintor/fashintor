export const dashboardRoutes = {
  home: '/dashboard',
  wallet: '/dashboard/wallet',
  cards: '/dashboard/cards',
  getCard: '/dashboard/cards/get',
  addFunds: '/dashboard/add-funds',
  transactions: '/dashboard/transactions',
  orderConfirmation: '/dashboard/order-confirmation',
  profile: '/dashboard/profile',
}

/** Old URLs → dashboard (for middleware redirects) */
export const legacyDashboardRedirects = {
  '/wallet': dashboardRoutes.wallet,
  '/virtual-card': dashboardRoutes.cards,
  '/virtual-card/create': dashboardRoutes.getCard,
  '/buy-balance': dashboardRoutes.addFunds,
  '/transactions': dashboardRoutes.transactions,
  '/order-confirmation': dashboardRoutes.orderConfirmation,
  '/profile': dashboardRoutes.profile,
}
