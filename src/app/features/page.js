'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './page.module.scss'

export default function Features() {
  const router = useRouter()

  const features = [
    {
      icon: 'credit_card',
      title: 'Virtual Shopping Cards',
      description: 'Generate secure, single-use or multi-use virtual cards instantly for safe online transactions.',
      color: '#000000'
    },
    {
      icon: 'account_balance_wallet',
      title: 'Multi-currency Wallet',
      description: 'Hold and manage funds in EUR, USD, and GBP seamlessly, avoiding hefty conversion fees.',
      color: '#735c00'
    },
    {
      icon: 'bolt',
      title: 'Instant Top-up',
      description: 'Load funds instantly via bank transfer or existing cards. Zero waiting times.',
      color: '#000000'
    },
    {
      icon: 'lock',
      title: 'Secure Payments',
      description: 'Protected by military-grade encryption and advanced fraud monitoring systems.',
      color: '#735c00'
    },
    {
      icon: 'tune',
      title: 'Spending Control',
      description: 'Set real-time limits and control exactly how much can be charged to each virtual card.',
      color: '#000000'
    },
    {
      icon: 'speed',
      title: 'Simple Onboarding',
      description: 'Complete KYC verification in minutes and start shopping immediately.',
      color: '#735c00'
    }
  ]

  const handleGetStarted = () => {
    router.push('/register')
  }

  const handleCreateAccount = () => {
    router.push('/register')
  }

  const handleLogin = () => {
    router.push('/login')
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>A Smarter Way to Shop Globally</h1>
              <p className={styles.heroSubtitle}>
                Experience seamless international luxury shopping with secure virtual cards 
                and a flexible multi-currency wallet designed for the discerning individual.
              </p>
              <button onClick={handleGetStarted} className={styles.heroBtn}>
                Get Started
              </button>
            </div>
            
            <div className={styles.heroImage}>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6bRLozJLm1CugQtH_aCMM8sPM3k6_epsmbYzr8FRSfziUmx8ASxl7vlrWRTWnE7mjNixziHBz7qI_jPGiyezZipF5m56yajzht0u20b10BAxzVNwZTQhUbYUZywWIJWQVa5S7WW1wNoLSBGbfCc58OW7Prmb-esK9lDqvuwuatxVpgpNMWDPqMcPKb3_1Q5jjcYie4o7oJzjW5GUHFZeQqC_6QiNNpu1a8kzJWuwHO3r-wPrFSO-Yxwz6KOjLV-CYZjHNfpOLOK0"
                alt="Luxury Shopping"
                className={styles.image}
              />
              
              {/* Virtual Card Overlay */}
              <div className={styles.cardOverlay}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardLogo}>{(process.env.NEXT_PUBLIC_BRAND_NAME || 'Fashintor').split(' ')[0]}</span>
                  <span className="material-symbols-outlined">contactless</span>
                </div>
                <div className={styles.cardNumber}>**** **** **** 8429</div>
                <div className={styles.cardFooter}>
                  <span>J. DOE</span>
                  <span>12/26</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Overview */}
        <section className={styles.overviewSection}>
          <span className={styles.overviewLabel}>The Bridge</span>
          <h2 className={styles.overviewTitle}>Connecting you to global luxury.</h2>
          <p className={styles.overviewText}>
            {(process.env.NEXT_PUBLIC_BRAND_NAME || 'Fashintor')} provides a seamless financial bridge between discerning fashion shoppers 
            and the world's most exclusive luxury platforms. Bypass traditional banking 
            friction and shop globally with ease.
          </p>
        </section>

        {/* Core Features Grid */}
        <section className={styles.featuresSection}>
          <div className={styles.featuresGrid}>
            {features.map((feature, idx) => (
              <div key={idx} className={styles.featureCard}>
                <span className="material-symbols-outlined" style={{ color: feature.color }}>
                  {feature.icon}
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>Start shopping without limits</h2>
          <button onClick={handleCreateAccount} className={styles.ctaBtn}>
            Create Account
          </button>
        </section>
      </main>
    </div>
  )
}