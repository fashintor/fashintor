'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { dashboardRoutes } from '@/lib/routes'
import styles from './page.module.scss'

export default function CreateVirtualCard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    cardName: '',
    amount: '',
    currency: 'USD',
    cardType: 'one_time',
    merchant: '',
    expiry: '30'
  })
  const [errors, setErrors] = useState({})

  // Preview card data
  const [previewData, setPreviewData] = useState({
    lastFour: '1234',
    cardHolder: 'M. Laurent',
    expiry: '12/25'
  })

  const handleChange = (e) => {
    const { id, value, type, checked, name } = e.target
    const fieldId = id || name
    
    setFormData(prev => ({
      ...prev,
      [fieldId]: type === 'radio' ? value : value
    }))
    
    // Update preview for dynamic fields
    if (fieldId === 'cardName' && value) {
      const nameParts = value.split(' ')
      const formattedName = nameParts.length > 1 
        ? `${nameParts[0][0]}. ${nameParts[nameParts.length - 1]}`
        : value.substring(0, 12)
      setPreviewData(prev => ({ ...prev, cardHolder: formattedName || 'M. Laurent' }))
    }
    
    if (fieldId === 'expiry') {
      let expiryValue = value
      if (value === 'custom') {
        expiryValue = '12/25'
      }
      setPreviewData(prev => ({ ...prev, expiry: expiryValue }))
    }
    
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (formData.amount && (parseFloat(formData.amount) < 1)) {
      newErrors.amount = 'Amount must be at least 1'
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
    
    setIsLoading(true)
    
    try {
      const savedToken = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
      const headers = { 'Content-Type': 'application/json' }
      if (savedToken) headers['Authorization'] = `Bearer ${savedToken}`

      const last4 = String(Math.floor(1000 + Math.random() * 9000))
      const now = new Date()
      const expMonth = now.getMonth() + 1
      const expYear = (now.getFullYear() + 3) % 100

      const response = await fetch('/api/cards', {
        method: 'POST',
        headers,
        credentials: 'same-origin',
        body: JSON.stringify({
          brand: 'VISA',
          last4,
          expMonth,
          expYear,
          cardholderName: formData.cardName.trim() || 'Virtual Card',
          isVirtual: true,
          metadata: {
            spendingLimit: formData.amount ? parseFloat(formData.amount) : null,
            currency: formData.currency,
            cardType: formData.cardType,
            merchantLock: formData.merchant || null,
            expiryDays: parseInt(formData.expiry, 10) || 30,
          },
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // Використовуємо window.location.href замість router.push
        window.location.href = dashboardRoutes.cards
      } else {
        setErrors({ submit: data.error || 'Failed to create card' })
      }
    } catch (error) {
      console.error('Creation error:', error)
      setErrors({ submit: 'Something went wrong. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  // 🔥 ОНОВЛЕНА ФУНКЦІЯ ЗАКРИТТЯ
  const handleClose = () => {
    // Використовуємо window.location.href замість router.back()
    window.location.href = dashboardRoutes.cards
  }

  return (
    <main className={styles.main}>
      {/* Заголовок для сторінки створення */}
      <div className={styles.taskHeader}>
        <button onClick={handleClose} className={styles.closeBtn}>
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className={styles.taskLogo}>Aura</div>
        <div className={styles.spacer}></div>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Get a Card</h1>
          <p className={styles.subtitle}>
            Set up your Aura card for secure global luxury purchases.
          </p>
        </section>

        {/* Split Layout */}
        <div className={styles.splitLayout}>
          {/* Left Side: Form */}
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Card Name */}
              <div className={styles.fieldGroup}>
                <label htmlFor="cardName">Card Name (Optional)</label>
                <input
                  id="cardName"
                  type="text"
                  value={formData.cardName}
                  onChange={handleChange}
                  placeholder="e.g. Milan Fashion Week"
                />
              </div>

              {/* Amount & Currency */}
              <div className={styles.row}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="amount">Spending Limit</label>
                  <div className={styles.amountWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="0.00"
                      min="1"
                      step="1"
                    />
                  </div>
                  {errors.amount && <span className={styles.errorMessage}>{errors.amount}</span>}
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="currency">Currency</label>
                  <div className={styles.selectWrapper}>
                    <select
                      id="currency"
                      value={formData.currency}
                      onChange={handleChange}
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                    </select>
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
              </div>

              {/* Card Type */}
              <div className={styles.fieldGroup}>
                <label>Card Type</label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="cardType"
                      value="one_time"
                      checked={formData.cardType === 'one_time'}
                      onChange={handleChange}
                    />
                    <span>One-time use</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="cardType"
                      value="reusable"
                      checked={formData.cardType === 'reusable'}
                      onChange={handleChange}
                    />
                    <span>Reusable</span>
                  </label>
                </div>
              </div>

              {/* Merchant Lock */}
              <div className={styles.fieldGroup}>
                <label htmlFor="merchant">Lock to Merchant (Optional)</label>
                <input
                  id="merchant"
                  type="text"
                  value={formData.merchant}
                  onChange={handleChange}
                  placeholder="e.g. SSENSE"
                />
              </div>

              {/* Expiry */}
              <div className={styles.fieldGroup}>
                <label htmlFor="expiry">Valid Until</label>
                <div className={styles.selectWrapper}>
                  <select
                    id="expiry"
                    value={formData.expiry}
                    onChange={handleChange}
                  >
                    <option value="1">24 Hours</option>
                    <option value="7">7 Days</option>
                    <option value="30">30 Days</option>
                    <option value="custom">Custom Date...</option>
                  </select>
                  <span className="material-symbols-outlined">expand_more</span>
                </div>
              </div>

              {errors.submit && (
                <div className={styles.submitError}>{errors.submit}</div>
              )}

              {/* Submit Button */}
              <div className={styles.submitSection}>
                <button 
                  type="submit" 
                  className={styles.submitBtn}
                  disabled={isLoading}
                  data-action="get-a-card"
                >
                  {isLoading ? 'Issuing...' : 'Get a Card'}
                </button>
              </div>
            </form>

            {/* Security Trust Block */}
            <div className={styles.securityBlock}>
              <div className={styles.securityItem}>
                <span className="material-symbols-outlined">shield_lock</span>
                <div>
                  <h4>Bank-Level Encryption</h4>
                  <p>Your real account details are never exposed to the merchant.</p>
                </div>
              </div>
              <div className={styles.securityItem}>
                <span className="material-symbols-outlined">all_inclusive</span>
                <div>
                  <h4>Total Control</h4>
                  <p>Set strict spending limits and automatic self-destruction timers.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Live Preview */}
          <div className={styles.previewContainer}>
            <div className={styles.previewHeader}>
              <span>Live Preview</span>
            </div>

            {/* Premium Card Mockup */}
            <div className={styles.cardPreview}>
              <div className={styles.cardOverlay}></div>
              <div className={styles.cardBgPattern}></div>
              
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardLogo}>Aura</div>
                  <div className={styles.cardBadge}>Virtual</div>
                </div>

                <div className={styles.cardChip}>
                  <svg fill="none" height="28" viewBox="0 0 40 28" width="40" xmlns="http://www.w3.org/2000/svg">
                    <rect fill="url(#paint0_linear)" height="28" rx="4" width="40" />
                    <path d="M0 8H40M0 20H40M12 0V28M28 0V28" stroke="white" strokeOpacity="0.2" strokeWidth="0.5" />
                    <defs>
                      <linearGradient id="paint0_linear" x1="0" x2="40" y1="0" y2="28" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#E2E2E2" stopOpacity="0.4" />
                        <stop offset="1" stopColor="#C6C7C6" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <div className={styles.cardDetails}>
                  <div className={styles.cardNumber}>
                    <span>****</span>
                    <span>****</span>
                    <span>****</span>
                    <span>{previewData.lastFour}</span>
                  </div>
                  <div className={styles.cardFooter}>
                    <div className={styles.cardHolder}>{previewData.cardHolder}</div>
                    <div className={styles.cardExpiry}>
                      <span>Valid Thru</span>
                      <span>{previewData.expiry}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.previewNote}>
              <p>Card will be ready for immediate use upon creation.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}