'use client'
import { useState, useEffect } from 'react'
import { dashboardRoutes } from '@/lib/routes'
import styles from './page.module.scss'

export default function Wallet() {
  const [balance, setBalance] = useState(0.00)
  const [selectedCurrency, setSelectedCurrency] = useState('EUR')
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState({
    name: 'J. DOE',
    cardLastFour: '1234',
    expiryMonth: '12',
    expiryYear: '26'
  })

  // Currency exchange rates (mock)
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
    // Fetch user data and balance from API
    const fetchWalletData = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          const userData = data.user
          if (userData?.wallet) {
            setBalance(userData.wallet.totalBalance || 0)
          }
          setUser(prev => ({ ...prev, name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || prev.name }))
        }
      } catch (error) {
        console.error('Failed to fetch wallet data:', error)
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
    // Navigate to add funds page
    setTimeout(() => {
      window.location.href = dashboardRoutes.addFunds
    }, 300)
  }

  const handleCreateCard = () => {
    setIsLoading(true)
    // Navigate to My Cards
    setTimeout(() => {
      window.location.href = dashboardRoutes.cards
    }, 300)
  }

  const handleLogout = async () => {
    try {
      // await fetch('/api/auth/logout', { method: 'POST' })
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className={styles.container}>
      {/* Main Content */}
      <main className={styles.main}>
        {/* Abstract background blur */}
        <div className={styles.bgBlur}></div>

        {/* Balance Block */}
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
            <button 
              onClick={handleCreateCard}
              disabled={isLoading}
              className={styles.secondaryBtn}
            >
              Get a Card
            </button>
          </div>
        </section>

        {/* Virtual Card Preview */}
        <section className={styles.cardSection}>
          <div className={styles.virtualCard}>
            {/* Inner glow */}
            <div className={styles.cardInnerGlow}></div>
            
            <div className={styles.cardHeader}>
              <div className={styles.cardLogo}>MONOLITH</div>
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
            
            {/* Metallic sheen effect */}
            <div className={styles.cardSheen}></div>
          </div>
        </section>

        {/* Security Block */}
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