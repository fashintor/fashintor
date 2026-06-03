'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './page.module.scss'

export default function Pricing() {
  const router = useRouter()

  const pricingCards = [
    {
      icon: 'credit_card',
      title: 'Card Creation',
      description: 'Your physical and virtual entry to Walletor.',
      price: 'Free'
    },
    {
      icon: 'account_balance_wallet',
      title: 'Wallet Usage',
      description: 'Maintenance and daily operational capacity.',
      price: 'Free'
    },
    {
      icon: 'add_circle',
      title: 'Top-up',
      description: 'Adding liquidity to your reserves.',
      price: 'No hidden fees'
    }
  ]

  const feesBreakdown = [
    {
      label: 'BANK TRANSFERS',
      description: 'Standard top-up methodology',
      value: '0%'
    },
    {
      label: 'INSTANT CARD TOP-UPS',
      description: 'Expedited liquidity via external cards',
      value: '0%'
    },
    {
      label: 'CURRENCY CONVERSION',
      description: 'Mid-market rate with no additional fee',
      value: '0%'
    }
  ]

  const limitsBreakdown = [
    {
      label: 'MINIMUM TOP-UP',
      description: 'Base entry point',
      value: '10.00'
    },
    {
      label: 'MAXIMUM BALANCE',
      description: 'Upper capacity limit',
      value: 'No Limit'
    },
    {
      label: 'SUPPORTED CURRENCIES',
      description: 'EUR, USD, GBP',
      value: 'language'
    }
  ]

  const handleInquire = () => {
    router.push('/contact')
  }

  const handleCreateAccount = () => {
    router.push('/register')
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <h1 className={styles.heroTitle}>Pricing & Fees</h1>
          <p className={styles.heroSubtitle}>
            Transparent pricing with no hidden charges. Architectural permanence in finance requires absolute clarity.
          </p>
        </section>

        {/* Main Pricing Cards */}
        <section className={styles.pricingCards}>
          {pricingCards.map((card, idx) => (
            <div key={idx} className={styles.card}>
              <div className={styles.cardBg}></div>
              <div className={styles.cardContent}>
                <span className="material-symbols-outlined">{card.icon}</span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <div className={styles.cardPrice}>{card.price}</div>
              </div>
            </div>
          ))}
        </section>

        {/* Detailed Breakdown Grid */}
        <section className={styles.breakdownSection}>
          {/* Fees Breakdown */}
          <div>
            <h2 className={styles.sectionTitle}>Fees Breakdown</h2>
            <ul className={styles.breakdownList}>
              {feesBreakdown.map((item, idx) => (
                <li key={idx} className={styles.breakdownItem}>
                  <div className={styles.breakdownInfo}>
                    <span className={styles.breakdownLabel}>{item.label}</span>
                    <span className={styles.breakdownDesc}>{item.description}</span>
                  </div>
                  <span className={styles.breakdownValue}>{item.value}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Limits & Thresholds */}
          <div>
            <h2 className={styles.sectionTitle}>Limits & Thresholds</h2>
            <ul className={styles.breakdownList}>
              {limitsBreakdown.map((item, idx) => (
                <li key={idx} className={styles.breakdownItem}>
                  <div className={styles.breakdownInfo}>
                    <span className={styles.breakdownLabel}>{item.label}</span>
                    <span className={styles.breakdownDesc}>{item.description}</span>
                  </div>
                  {item.value === 'language' ? (
                    <span className="material-symbols-outlined">{item.value}</span>
                  ) : (
                    <span className={styles.breakdownValue}>{item.value}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Final CTA */}
        <section className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>Start with full transparency.</h2>
          <p className={styles.ctaSubtitle}>Experience the invisible concierge.</p>
          <button onClick={handleCreateAccount} className={styles.ctaBtn}>
            <span className={styles.btnText}>Create Account</span>
            <div className={styles.btnOverlay}></div>
          </button>
        </section>
      </main>
    </div>
  )
}