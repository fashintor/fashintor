'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './not-found.module.scss'

export default function NotFound() {
  const router = useRouter()

  const handleGoToWallet = () => {
    router.push('/wallet')
  }

  const handleBackToHome = () => {
    router.push('/')
  }

  const handleContactSupport = () => {
    router.push('/contact')
  }

  return (
    <div className={styles.container}>
      {/* Content Canvas */}
      <main className={styles.main}>
        {/* Background decorative elements */}
        <div className={styles.bgDecorations}>
          <div className={styles.noiseBg}></div>
          <div className={styles.blurBg1}></div>
          <div className={styles.blurBg2}></div>
        </div>

        {/* 404 Hero Section */}
        <section className={styles.heroSection}>
          {/* Abstract Floating Card Visual */}
          <div className={styles.cardContainer}>
            <div className={styles.floatingCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardLogo}>{(process.env.NEXT_PUBLIC_COMPANY_NAME || 'AURA').split(' ')[0]}</span>
                <div className={styles.cardChip}></div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardLine}></div>
                <div className={styles.cardDigits}>
                  <div className={styles.digit}></div>
                  <div className={styles.digit}></div>
                  <div className={styles.digit}></div>
                  <div className={styles.digit}></div>
                </div>
              </div>
              {/* Error Indication */}
              <div className={styles.errorOverlay}>
                <span className={styles.errorNumber}>404</span>
              </div>
            </div>
            {/* Subtle glow behind card */}
            <div className={styles.cardGlow}></div>
          </div>

          {/* Typography Content */}
          <div className={styles.contentWrapper}>
            <h1 className={styles.title}>
              <span className={styles.errorCode}>404</span>
              <span className={styles.errorMessage}>This page does not exist</span>
            </h1>
            <p className={styles.description}>
              The destination you are looking for is unavailable or has been moved.
            </p>

            {/* Actions */}
            <div className={styles.actions}>
              <button onClick={handleGoToWallet} className={styles.primaryBtn}>
                Go to Wallet
              </button>
              <button onClick={handleBackToHome} className={styles.secondaryBtn}>
                Back to Home
              </button>
            </div>

            <div className={styles.supportLink}>
              <button onClick={handleContactSupport} className={styles.contactBtn}>
                Contact Support
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}