'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { dashboardRoutes } from '@/lib/routes'
import styles from './page.module.scss'

export default function Wallet() {
  const [showVerifiedBanner, setShowVerifiedBanner] = useState(false)
  const [balance, setBalance] = useState(0.00)
  const [selectedCurrency, setSelectedCurrency] = useState('EUR')
  const [isLoading, setIsLoading] = useState(false)
  const [hasCard, setHasCard] = useState(false)
  const [cardsFetched, setCardsFetched] = useState(false)
  const [user, setUser] = useState({
    name: '',
    cardLastFour: '',
    expiryMonth: '',
    expiryYear: ''
  })

  const exchangeRates = {
    EUR: 1,
    USD: 1.09,
    GBP: 0.85
  }

  const currencySymbols = {
    EUR: '€',
    USD: '$',
    GBP: '£'
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('verified') === '1') {
      setShowVerifiedBanner(true)
      window.history.replaceState({}, '', dashboardRoutes.wallet)
      const t = setTimeout(() => setShowVerifiedBanner(false), 8000)
      return () => clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const headers = {}
        const savedToken = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
        if (savedToken) headers['Authorization'] = `Bearer ${savedToken}`

        const [meRes, cardsRes] = await Promise.all([
          fetch('/api/auth/me', { credentials: 'same-origin', headers }),
          fetch('/api/cards', { credentials: 'same-origin', headers }),
        ])

        if (meRes.ok) {
          const data = await meRes.json()
          const userData = data.user
          if (userData?.wallet) {
            setBalance(userData.wallet.totalBalance || 0)
          }
          const displayName = `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim()
          if (displayName) {
            setUser(prev => ({ ...prev, name: displayName }))
          }
        }

        if (cardsRes.ok) {
          const cardsData = await cardsRes.json()
          const list = cardsData.cards || []
          if (list.length > 0) {
            const first = list[0]
            setHasCard(true)
            setUser(prev => ({
              ...prev,
              cardLastFour: first.last4 != null ? String(first.last4) : '',
              expiryMonth: first.expMonth != null ? String(first.expMonth).padStart(2, '0') : '',
              expiryYear: first.expYear != null ? String(first.expYear) : '',
            }))
          }
        }
      } catch (error) {
        console.error('Failed to fetch wallet data:', error)
      } finally {
        setCardsFetched(true)
      }
    }

    fetchWalletData()
  }, [])

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value
    const newBalance = balance * (exchangeRates[newCurrency] / exchangeRates[selectedCurrency])
    setBalance(parseFloat(newBalance.toFixed(2)))
    setSelectedCurrency(newCurrency)
  }

  const handleAddFunds = () => {
    setIsLoading(true)
    setTimeout(() => {
      window.location.href = dashboardRoutes.addFunds
    }, 300)
  }

  const companyShort = (process.env.NEXT_PUBLIC_COMPANY_NAME || 'Walletor').split(' ')[0]

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.bgBlur}></div>

        {showVerifiedBanner && (
          <div
            role="status"
            style={{
              margin: '0 auto 24px',
              maxWidth: 448,
              padding: '12px 16px',
              background: 'rgba(0, 128, 0, 0.08)',
              border: '1px solid rgba(0, 128, 0, 0.2)',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
            }}
          >
            <span className="material-symbols-outlined" style={{ color: '#1b7a1b' }}>check_circle</span>
            <span>Email verified successfully. Welcome to your wallet!</span>
          </div>
        )}

        <section className={styles.balanceSection}>
          <h2 className={styles.balanceLabel}>Your Balance</h2>

          <div className={styles.balanceDisplay}>
            <span className={styles.balanceAmount}>
              {currencySymbols[selectedCurrency]}{balance.toLocaleString()}
            </span>

            <div className={styles.currencySelectWrapper}>
              <select
                value={selectedCurrency}
                onChange={handleCurrencyChange}
                className={styles.currencySelect}
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
              </select>
              <span className="material-symbols-outlined">expand_more</span>
            </div>
          </div>

          <div className={styles.balanceActions}>
            <button
              onClick={handleAddFunds}
              disabled={isLoading}
              className={styles.primaryBtn}
            >
              Add Funds
            </button>
          </div>
        </section>

        <section className={styles.cardSection}>
          {!cardsFetched ? (
            <p className={styles.cardEmptyText}>Loading…</p>
          ) : !hasCard ? (
            <div className={styles.cardEmpty}>
              <span className="material-symbols-outlined">credit_card_off</span>
              <h3>No cards yet</h3>
              <p>
                You do not have a virtual card yet. Create one to start shopping with your wallet balance.
              </p>
              <Link href={dashboardRoutes.getCard} className={styles.primaryBtn}>
                Create Card
              </Link>
            </div>
          ) : (
            <div className={styles.virtualCard}>
              <div className={styles.cardInnerGlow}></div>

              <div className={styles.cardHeader}>
                <div className={styles.cardLogo}>{companyShort}</div>
                <span className="material-symbols-outlined">contactless</span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.cardNumber}>
                  **** **** **** {user.cardLastFour}
                </div>
                <div className={styles.cardDetails}>
                  <span>{user.name}</span>
                  <span>{user.expiryMonth}/{user.expiryYear}</span>
                </div>
              </div>

              <div className={styles.cardSheen}></div>
            </div>
          )}
        </section>

        <section className={styles.securitySection}>
          <div className={styles.securityItem}>
            <span className="material-symbols-outlined">verified_user</span>
            <span>PCI DSS Compliant</span>
          </div>
          <div className={styles.securityItem}>
            <span className="material-symbols-outlined">lock</span>
            <span>Secure Transactions</span>
          </div>
          <div className={styles.securityItem}>
            <span className="material-symbols-outlined">credit_card</span>
            <span>Visa/MasterCard</span>
          </div>
        </section>
      </main>
    </div>
  )
}
