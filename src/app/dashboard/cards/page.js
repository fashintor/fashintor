'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { dashboardRoutes } from '@/lib/routes'
import styles from './page.module.scss'

export default function VirtualCard() {
  const [cards, setCards] = useState([])
  const [cardsFetched, setCardsFetched] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    last4: null,
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '***',
    isActive: false,
    id: null,
  })
  
  const [showFullDetails, setShowFullDetails] = useState(false)
  const [isFrozen, setIsFrozen] = useState(false)
  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      merchant: 'Net-a-Porter',
      date: 'Today',
      time: '14:30',
      amount: -1200.00,
      currency: '€',
      icon: 'shopping_bag'
    },
    {
      id: 2,
      merchant: 'LuisaViaRoma',
      date: 'Yesterday',
      time: '09:15',
      amount: -850.00,
      currency: '€',
      icon: 'shopping_bag'
    }
  ])

  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        const headers = {}
        const savedToken = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
        if (savedToken) headers['Authorization'] = `Bearer ${savedToken}`
        const res = await fetch('/api/cards', { credentials: 'same-origin', headers })
        if (res.ok) {
          const json = await res.json()
          const list = json.cards || []
          setCards(list)
          if (list.length > 0) {
            const first = list[0]
            const last4 = first.last4 != null ? String(first.last4) : '0000'
            setCardDetails({
              cardNumber: `**** **** **** ${last4}`,
              last4,
              cardHolder: first.cardholderName || '—',
              expiryMonth: first.expMonth != null ? String(first.expMonth).padStart(2, '0') : '—',
              expiryYear: first.expYear != null ? String(first.expYear) : '—',
              cvv: '***',
              isActive: first.isActive !== false,
              id: first._id != null ? String(first._id) : null,
            })
          } else {
            setCardDetails({
              cardNumber: '',
              last4: null,
              cardHolder: '',
              expiryMonth: '',
              expiryYear: '',
              cvv: '***',
              isActive: false,
              id: null,
            })
          }
        }
      } catch (error) {
        console.error('Failed to fetch card details:', error)
      } finally {
        setCardsFetched(true)
      }
    }

    fetchCardDetails()
  }, [])

  const toggleCardDetails = () => {
    if (!cardDetails.last4) return
    const last4 = cardDetails.last4
    if (!showFullDetails) {
      setCardDetails(prev => ({
        ...prev,
        cardNumber: `4532 1234 5678 ${last4}`,
        cvv: '123',
      }))
    } else {
      setCardDetails(prev => ({
        ...prev,
        cardNumber: `**** **** **** ${last4}`,
        cvv: '***',
      }))
    }
    setShowFullDetails(!showFullDetails)
  }

  const handleFreezeCard = async () => {
    setIsLoading(true)
    try {
      setIsFrozen(!isFrozen)
      setCardDetails(prev => ({
        ...prev,
        isActive: !prev.isActive
      }))
    } catch (error) {
      console.error('Failed to freeze card:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCard = async () => {
    const cardId = cardDetails.id
    if (!cardId) {
      alert('No saved card to delete. Create a card first.')
      return
    }
    if (!confirm('Are you sure you want to delete this card? This action cannot be undone.')) {
      return
    }
    setIsLoading(true)
    try {
      const headers = { 'Content-Type': 'application/json' }
      const savedToken = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
      if (savedToken) headers['Authorization'] = `Bearer ${savedToken}`
      const res = await fetch(`/api/cards/${encodeURIComponent(cardId)}`, {
        method: 'DELETE',
        credentials: 'same-origin',
        headers,
      })
      if (res.ok) {
        const remaining = cards.filter(c => String(c._id) !== String(cardId))
        setCards(remaining)
        if (remaining.length > 0) {
          const first = remaining[0]
          const last4 = first.last4 != null ? String(first.last4) : '0000'
          setCardDetails({
            cardNumber: `**** **** **** ${last4}`,
            last4,
            cardHolder: first.cardholderName || '—',
            expiryMonth: first.expMonth != null ? String(first.expMonth).padStart(2, '0') : '—',
            expiryYear: first.expYear != null ? String(first.expYear) : '—',
            cvv: '***',
            isActive: first.isActive !== false,
            id: first._id != null ? String(first._id) : null,
          })
        } else {
          setCardDetails({
            cardNumber: '',
            last4: null,
            cardHolder: '',
            expiryMonth: '',
            expiryYear: '',
            cvv: '***',
            isActive: false,
            id: null,
          })
        }
        setShowFullDetails(false)
      } else {
        const err = await res.json().catch(() => null)
        console.error('Delete failed', err)
        alert(err?.error || 'Failed to delete card')
      }
    } catch (error) {
      console.error('Failed to delete card:', error)
      alert('Failed to delete card')
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    const absAmount = Math.abs(amount).toFixed(2)
    return amount < 0 ? `- €${absAmount}` : `€${absAmount}`
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>My Cards</h1>
          <p className={styles.pageSubtitle}>
            View and manage your {(process.env.NEXT_PUBLIC_COMPANY_NAME || 'Aura').split(' ')[0]} cards. Use Get a Card to issue a new one.
          </p>
        </div>
        {cardsFetched && (
          <Link
            href={dashboardRoutes.getCard}
            className={styles.getCardBtn}
            data-action="get-a-card"
          >
            <span className="material-symbols-outlined">add_card</span>
            <span>Get a Card</span>
          </Link>
        )}
      </header>

      <main className={styles.main}>
      {/* Left Column: Card Visual & Core Actions */}
      <div className={styles.leftColumn}>
        <section className={styles.cardSection}>
          <div className={styles.cardBgBlur}></div>

          {!cardsFetched ? (
            <p style={{ position: 'relative', zIndex: 1, padding: '2rem', margin: 0 }}>Loading card…</p>
          ) : !cardDetails.id ? (
            <div style={{ position: 'relative', zIndex: 1, padding: '2rem', textAlign: 'center' }}>
              <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.25rem', fontWeight: 600 }}>No cards yet</h2>
              <p style={{ margin: '0 0 1.5rem', opacity: 0.88, lineHeight: 1.5 }}>
                Get your first Aura card to start shopping. You can top up your wallet anytime from the dashboard.
              </p>
              <Link
                href={dashboardRoutes.getCard}
                className={styles.primaryActionBtn}
                data-action="get-a-card"
              >
                <span className="material-symbols-outlined">add_card</span>
                <span>Get a Card</span>
              </Link>
            </div>
          ) : (
            <>
              <div className={`${styles.virtualCard} ${!cardDetails.isActive ? styles.frozenCard : ''}`}>
                <div className={styles.cardInnerGlow}></div>

                  <div className={styles.cardHeader}>
                    <span className={styles.cardLogo}>{(process.env.NEXT_PUBLIC_COMPANY_NAME || 'Aura').split(' ')[0]}</span>
                  <div className={styles.cardStatus}>
                    <span className={`${styles.statusDot} ${cardDetails.isActive && !isFrozen ? styles.active : styles.inactive}`}></span>
                    <span className={styles.statusText}>
                      {isFrozen ? 'Frozen' : (cardDetails.isActive ? 'Active' : 'Inactive')}
                    </span>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <span className={styles.cardNumber}>
                    {showFullDetails
                      ? cardDetails.cardNumber
                      : (cardDetails.last4 ? `**** **** **** ${cardDetails.last4}` : '···· ···· ···· ····')}
                  </span>
                  <div className={styles.cardDetailsRow}>
                    <div className={styles.cardDetailItem}>
                      <span className={styles.cardDetailLabel}>Card Holder</span>
                      <span className={styles.cardDetailValue}>{cardDetails.cardHolder}</span>
                    </div>
                    <div className={styles.cardDetailItem}>
                      <span className={styles.cardDetailLabel}>Expires</span>
                      <span className={styles.cardDetailValue}>{cardDetails.expiryMonth}/{cardDetails.expiryYear}</span>
                    </div>
                    {showFullDetails && (
                      <div className={styles.cardDetailItem}>
                        <span className={styles.cardDetailLabel}>CVV</span>
                        <span className={styles.cardDetailValue}>{cardDetails.cvv}</span>
                      </div>
                    )}
                  </div>
                </div>

                {isFrozen && (
                  <div className={styles.frozenOverlay}>
                    <span className="material-symbols-outlined">ac_unit</span>
                    <span>Card Frozen</span>
                  </div>
                )}
              </div>

              <div className={styles.cardActions}>
                <button
                  type="button"
                  onClick={toggleCardDetails}
                  disabled={!cardDetails.last4}
                  className={styles.primaryActionBtn}
                >
                  <span className="material-symbols-outlined">
                    {showFullDetails ? 'visibility_off' : 'visibility'}
                  </span>
                  <span>{showFullDetails ? 'Hide Card Details' : 'Show Card Details'}</span>
                </button>
              </div>
            </>
          )}
        </section>

        {cardDetails.id ? (
          <section className={styles.secondaryActions}>
            <button
              type="button"
              onClick={handleFreezeCard}
              disabled={isLoading}
              className={`${styles.actionBtn} ${isFrozen ? styles.frozenAction : ''}`}
            >
              <span className="material-symbols-outlined">ac_unit</span>
              <span>{isFrozen ? 'Unfreeze Card' : 'Freeze Card'}</span>
            </button>
            <button
              type="button"
              onClick={handleDeleteCard}
              disabled={isLoading}
              className={styles.dangerActionBtn}
            >
              <span className="material-symbols-outlined">delete</span>
              <span>Delete Card</span>
            </button>
          </section>
        ) : null}
      </div>

      {/* Right Column: Details & Activity */}
      <div className={styles.rightColumn}>
        <section className={styles.securitySection}>
          <h3 className={styles.securityTitle}>Usage Security</h3>
          <div className={styles.securityGrid}>
            <div className={styles.securityItem}>
              <span className="material-symbols-outlined">lock</span>
              <span>Encrypted Data</span>
            </div>
            <div className={styles.securityItem}>
              <span className="material-symbols-outlined">verified_user</span>
              <span>PCI DSS Compliant</span>
            </div>
            <div className={styles.securityItem}>
              <span className="material-symbols-outlined">shield</span>
              <span>Secure Payments</span>
            </div>
          </div>
        </section>

        <section className={styles.activitySection}>
          <div className={styles.activityHeader}>
            <h3 className={styles.activityTitle}>Recent Activity</h3>
            <Link href={dashboardRoutes.transactions} className={styles.viewAllLink}>
              View All
            </Link>
          </div>
          
          <div className={styles.activityList}>
            {recentActivity.map(activity => (
              <div key={activity.id} className={styles.activityItem}>
                <div className={styles.activityInfo}>
                  <div className={styles.activityIcon}>
                    <span className="material-symbols-outlined">{activity.icon}</span>
                  </div>
                  <div className={styles.activityDetails}>
                    <span className={styles.activityMerchant}>{activity.merchant}</span>
                    <span className={styles.activityDate}>
                      {activity.date}, {activity.time}
                    </span>
                  </div>
                </div>
                <span className={styles.activityAmount}>
                  {formatCurrency(activity.amount)}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.retailersSection}>
          <h4 className={styles.retailersTitle}>Accepted At Premium Retailers</h4>
          <div className={styles.retailersList}>
            <span>SSENSE</span>
            <span>Mytheresa</span>
            <span>Net-a-Porter</span>
            <span>Farfetch</span>
          </div>
        </section>
      </div>
      </main>
    </div>
  )
}