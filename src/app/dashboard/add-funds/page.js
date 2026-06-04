'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { dashboardRoutes } from '@/lib/routes'
import styles from './page.module.scss'

export default function BuyBalance() {
  const router = useRouter()
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('EUR')
  const [cardDetails, setCardDetails] = useState({
    cardholderName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  })
  const [showBillingInfo, setShowBillingInfo] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState({})
  const [fees, setFees] = useState(0)
  const [virtualCardGate, setVirtualCardGate] = useState({ loading: true, hasCard: true })

  const currencySymbols = {
    EUR: '€',
    USD: '$',
    GBP: '£'
  }

  const exchangeRates = {
    EUR: 1,
    USD: 1.09,
    GBP: 0.85
  }

  useEffect(() => {
    // Calculate fees (1.5% for demo)
    const amountNum = parseFloat(amount) || 0
    setFees(amountNum * 0.015)
  }, [amount])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const headers = {}
        const t = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
        if (t) headers['Authorization'] = `Bearer ${t}`
        const res = await fetch('/api/cards', { credentials: 'same-origin', headers })
        if (cancelled) return
        if (res.ok) {
          const data = await res.json()
          const n = (data.cards || []).length
          setVirtualCardGate({ loading: false, hasCard: n > 0 })
        } else {
          setVirtualCardGate({ loading: false, hasCard: true })
        }
      } catch {
        if (!cancelled) setVirtualCardGate({ loading: false, hasCard: true })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const handleAmountChange = (e) => {
    const value = e.target.value
    if (value === '' || parseFloat(value) >= 0) {
      setAmount(value)
      if (errors.amount) {
        setErrors(prev => ({ ...prev, amount: '' }))
      }
    }
  }

  const handlePresetAmount = (value) => {
    setAmount(value.toString())
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: '' }))
    }
  }

  const handleCardInputChange = (field, value) => {
    let formattedValue = value
    
    // Format card number with spaces
    if (field === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
      if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19)
    }
    
    // Format expiry date
    if (field === 'expiry') {
      formattedValue = value.replace(/\D/g, '')
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4)
      }
      if (formattedValue.length > 5) formattedValue = formattedValue.slice(0, 5)
    }
    
    // Limit CVV length
    if (field === 'cvv') {
      if (value.length > 4) return
      formattedValue = value
    }
    
    setCardDetails(prev => ({ ...prev, [field]: formattedValue }))
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    const amountNum = parseFloat(amount)
    if (!amount || isNaN(amountNum) || amountNum < 10) {
      newErrors.amount = 'Minimum amount is €10'
    }
    
    if (!cardDetails.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required'
    }
    
    const cleanCardNumber = cardDetails.cardNumber.replace(/\s/g, '')
    if (!cleanCardNumber || cleanCardNumber.length < 16) {
      newErrors.cardNumber = 'Valid card number is required'
    }
    
    if (!cardDetails.expiry || cardDetails.expiry.length < 5) {
      newErrors.expiry = 'Valid expiry date is required'
    }
    
    if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
      newErrors.cvv = 'Valid CVV is required'
    }
    
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setIsProcessing(true)
    
    try {
      const response = await fetch('/api/wallet/top-up', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency,
          description: 'Top-up via card',
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Payment failed')
      }
      
      const data = await response.json()
      const { transaction, wallet } = data
      
      // Redirect to confirmation page with transaction details
      router.push(`${dashboardRoutes.orderConfirmation}?amount=${amount}&currency=${currency}&tx=${transaction._id}&newBalance=${wallet.totalBalance}`)
    } catch (error) {
      console.error('Payment failed:', error)
      setErrors({ submit: error.message || 'Payment failed. Please try again.' })
    } finally {
      setIsProcessing(false)
    }
  }

  const totalAmount = (parseFloat(amount) || 0) + fees

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Add Funds</h1>
          <p className={styles.pageSubtitle}>Top up your balance securely and instantly</p>
        </div>

        {virtualCardGate.loading ? (
          <p className={styles.pageSubtitle} style={{ marginTop: 24 }}>Checking your account…</p>
        ) : !virtualCardGate.hasCard ? (
          <div
            style={{
              maxWidth: 520,
              margin: '32px auto',
              padding: 24,
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 8,
              textAlign: 'center',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', marginBottom: 12 }}>Get a card first</h2>
            <p style={{ marginBottom: 20, lineHeight: 1.5, opacity: 0.9 }}>
              Wallet top-ups need at least one ${(process.env.NEXT_PUBLIC_BRAND_NAME || 'Fashintor').split(' ')[0]} card. Open My Cards and tap Get a Card, then you can add funds with your bank card.
            </p>
            <Link href={dashboardRoutes.cards} className={styles.confirmBtn} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', justifyContent: 'center' }}>
              <span>Go to My Cards</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        ) : (
        <div className={styles.contentGrid}>
          {/* Left Column: Form */}
          <div className={styles.formColumn}>
            {/* Amount Section */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Amount</h2>
              
              <div className={styles.amountRow}>
                <div className={styles.amountInput}>
                  <label className={styles.label}>Enter Amount</label>
                  <div className={styles.amountWrapper}>
                    <span className={styles.currencySymbol}>{currencySymbols[currency]}</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder="0.00"
                      min="10"
                      step="10"
                      className={`${styles.input} ${styles.amountField} ${errors.amount ? styles.inputError : ''}`}
                    />
                  </div>
                  {errors.amount && <span className={styles.errorMessage}>{errors.amount}</span>}
                </div>
                
                <div className={styles.currencySelect}>
                  <label className={styles.label}>Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className={`${styles.input} ${styles.selectField}`}
                  >
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>

              <div className={styles.presetAmounts}>
                <button onClick={() => handlePresetAmount(10)} className={styles.presetBtn}>+10</button>
                <button onClick={() => handlePresetAmount(50)} className={styles.presetBtn}>+50</button>
                <button onClick={() => handlePresetAmount(100)} className={styles.presetBtn}>+100</button>
                <button onClick={() => handlePresetAmount(200)} className={styles.presetBtn}>+200</button>
              </div>
            </section>

            {/* Payment Method Section */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Payment Method</h2>
                <div className={styles.cardIcons}>
                  <span className="material-symbols-outlined">credit_card</span>
                </div>
              </div>

              <div className={styles.paymentForm}>
                <div className={styles.formField}>
                  <label className={styles.label}>Cardholder Name</label>
                  <input
                    type="text"
                    value={cardDetails.cardholderName}
                    onChange={(e) => handleCardInputChange('cardholderName', e.target.value)}
                    placeholder="As it appears on card"
                    className={`${styles.input} ${errors.cardholderName ? styles.inputError : ''}`}
                  />
                  {errors.cardholderName && <span className={styles.errorMessage}>{errors.cardholderName}</span>}
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Card Number</label>
                  <div className={styles.cardNumberWrapper}>
                    <input
                      type="text"
                      value={cardDetails.cardNumber}
                      onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
                      placeholder="0000 0000 0000 0000"
                      className={`${styles.input} ${styles.cardNumberInput} ${errors.cardNumber ? styles.inputError : ''}`}
                    />
                    <span className="material-symbols-outlined">credit_score</span>
                  </div>
                  {errors.cardNumber && <span className={styles.errorMessage}>{errors.cardNumber}</span>}
                </div>

                <div className={styles.row}>
                  <div className={styles.formField}>
                    <label className={styles.label}>Expiry Date</label>
                    <input
                      type="text"
                      value={cardDetails.expiry}
                      onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                      placeholder="MM/YY"
                      className={`${styles.input} ${errors.expiry ? styles.inputError : ''}`}
                    />
                    {errors.expiry && <span className={styles.errorMessage}>{errors.expiry}</span>}
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.label}>CVV</label>
                    <input
                      type="password"
                      value={cardDetails.cvv}
                      onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                      placeholder="•••"
                      maxLength="4"
                      className={`${styles.input} ${errors.cvv ? styles.inputError : ''}`}
                    />
                    {errors.cvv && <span className={styles.errorMessage}>{errors.cvv}</span>}
                  </div>
                </div>
              </div>
            </section>

            {/* Billing Info */}
            <section 
              className={`${styles.billingSection} ${showBillingInfo ? styles.expanded : ''}`}
              onClick={() => setShowBillingInfo(!showBillingInfo)}
            >
              <div className={styles.billingHeader}>
                <div>
                  <h2 className={styles.sectionTitle}>Billing Information</h2>
                  <p className={styles.billingSubtitle}>Use saved address details</p>
                </div>
                <span className="material-symbols-outlined">
                  {showBillingInfo ? 'expand_less' : 'expand_more'}
                </span>
              </div>
              
              {showBillingInfo && (
                <div className={styles.billingContent}>
                  <div className={styles.formField}>
                    <label className={styles.label}>Address Line 1</label>
                    <input type="text" className={styles.input} placeholder="Street address" />
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.label}>City</label>
                    <input type="text" className={styles.input} placeholder="City" />
                  </div>
                  <div className={styles.row}>
                    <div className={styles.formField}>
                      <label className={styles.label}>Postal Code</label>
                      <input type="text" className={styles.input} placeholder="Postal code" />
                    </div>
                    <div className={styles.formField}>
                      <label className={styles.label}>Country</label>
                      <select className={`${styles.input} ${styles.selectField}`}>
                        <option>United Kingdom</option>
                        <option>United States</option>
                        <option>Switzerland</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Summary Sidebar */}
          <div className={styles.summaryColumn}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Order Summary</h3>
              
              <div className={styles.summaryDetails}>
                <div className={styles.summaryRow}>
                  <span>Amount</span>
                  <span>{currencySymbols[currency]}{parseFloat(amount || 0).toFixed(2)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Fees (1.5%)</span>
                  <span>{currencySymbols[currency]}{fees.toFixed(2)}</span>
                </div>
                
                <div className={styles.divider}></div>
                
                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                  <span>Total</span>
                  <span>{currencySymbols[currency]}{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handleSubmit}
                disabled={isProcessing}
                className={styles.confirmBtn}
              >
                <span>{isProcessing ? 'Processing...' : 'Confirm & Pay'}</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>

              {errors.submit && (
                <div className={styles.submitError}>{errors.submit}</div>
              )}

              <div className={styles.securityInfo}>
                <div className={styles.securityBadge}>
                  <span className="material-symbols-outlined">lock</span>
                  <span>SECURE PAYMENT</span>
                </div>
                <p className={styles.securityText}>
                  Your transaction is secured by PCI DSS compliant technology.
                </p>
              </div>
            </div>
          </div>
        </div>
        )}
      </main>
    </div>
  )
}