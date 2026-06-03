'use client'
import { useState } from 'react'
import Link from 'next/link'
import PaymentLogos from '@/components/ui/PaymentLogos'
import { dashboardRoutes } from '@/lib/routes'
import styles from './page.module.scss'

export default function HowItWorks() {
  const [activeFaq, setActiveFaq] = useState(0)

  const faqs = [
    {
      question: 'How quickly can I use my virtual card?',
      answer: 'Cards are generated instantly upon funding clearance and are immediately ready for use across global e-commerce platforms.'
    },
    {
      question: 'Are there foreign transaction fees?',
      answer: 'We utilize institutional exchange rates with zero opaque markups, ensuring transparency in every international acquisition.'
    },
    {
      question: 'Is there a limit on card generation?',
      answer: 'Premium accounts feature unlimited virtual card generation, allowing granular control over individual purchases or vendor subscriptions.'
    }
  ]

  const steps = [
    { icon: 'person_add', title: 'Create Account', description: 'Sign Up CTA' },
    { icon: 'mark_email_read', title: 'Verify Email', description: 'Confirmation' },
    { icon: 'payments', title: 'Add Funds', description: 'Min 10.00' },
    { icon: 'account_balance_wallet', title: 'Access Wallet', description: 'Balance overview' },
    { icon: 'credit_card', title: 'Virtual Card', description: 'Instant creation' },
    { icon: 'shopping_bag', title: 'Global Shopping', description: 'Shop anywhere' }
  ]

  const useCases = [
    { icon: 'diamond', title: 'Luxury Fashion', description: 'Seamless transactions across international luxury boutiques without foreign exchange friction.' },
    { icon: 'public', title: 'Global Payments', description: 'Settle invoices in major currencies instantly, bypassing traditional wire delays.' }
  ]

  return (
    <>
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>How It Works</h1>
          <p className={styles.heroDescription}>
            Simple, secure, and designed for global shopping
          </p>
        </section>

        {/* Journey Visual Timeline */}
        <section className={styles.timeline}>
          <div className={styles.stepsGrid}>
            {steps.map((step, idx) => (
              <div key={idx} className={styles.step}>
                <div className={styles.stepIcon}>
                  <span className="material-symbols-outlined">{step.icon}</span>
                </div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
                {idx < steps.length - 1 && <div className={styles.stepLine}></div>}
              </div>
            ))}
          </div>
        </section>

        {/* Detailed Blocks */}
        <section className={styles.detailedBlocks}>
          {/* Block 1: Wallet */}
          <div className={styles.block}>
            <div className={styles.blockContent}>
              <h2 className={styles.blockTitle}>Your Centralized Hub</h2>
              <p className={styles.blockText}>
                Access your digital wallet instantly. Monitor balances, track transactions, 
                and manage multiple currencies in a serene, uncluttered environment designed 
                for high-value oversight.
              </p>
              <Link href={dashboardRoutes.wallet} className={styles.primaryBtn}>Open Wallet</Link>
            </div>
            <div className={styles.walletMockup}>
              <div className={styles.walletOverlay}></div>
              <div className={styles.walletCard}>
                <p className={styles.walletLabel}>Total Balance</p>
                <p className={styles.walletBalance}>$124,500.00</p>
                <div className={styles.walletTransactions}>
                  <div className={styles.transaction}>
                    <span>Saks Fifth Avenue</span>
                    <span>-$4,200.00</span>
                  </div>
                  <div className={styles.transaction}>
                    <span>Net-a-Porter</span>
                    <span>-$1,850.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Block 2: Virtual Card */}
          <div className={`${styles.block} ${styles.blockReverse}`}>
            <div className={styles.cardMockup}>
              <div className={styles.cardOverlay}></div>
              <div className={styles.virtualCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardLogo}>{(process.env.NEXT_PUBLIC_COMPANY_NAME || 'AURA').split(' ')[0]}</span>
                  <span className="material-symbols-outlined">contactless</span>
                </div>
                <div className={styles.cardBody}>
                  <p className={styles.cardNumber}>**** **** **** 4092</p>
                  <div className={styles.cardDetails}>
                    <span>J. DOE</span>
                    <span>12/26</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.blockContent}>
              <h2 className={styles.blockTitle}>Instant Virtual Cards</h2>
              <p className={styles.blockText}>
                Generate bespoke virtual cards for single purchases or specific vendors. 
                Maintain strict budget controls and absolute privacy while navigating 
                the global luxury market.
              </p>
              <Link href={dashboardRoutes.getCard} className={styles.secondaryBtn}>Create Card</Link>
            </div>
          </div>
        </section>

        {/* Security & Use Cases Grid */}
        <section className={styles.bentoGrid}>
          {/* Security Focus */}
          <div className={styles.securityCard}>
            <div className={styles.securityHeader}>
              <span className="material-symbols-outlined">lock</span>
              <h3>Bank-Grade Security</h3>
            </div>
            <p className={styles.securityText}>
              Your capital is protected by institutional-grade encryption and strict PCI DSS compliance. 
              We employ zero-knowledge architecture to ensure your transactional privacy remains absolute.
            </p>
            <PaymentLogos className={styles.paymentLogos} />
          </div>

          {/* Use Cases */}
          {useCases.map((useCase, idx) => (
            <div key={idx} className={styles.useCaseCard}>
              <span className="material-symbols-outlined">{useCase.icon}</span>
              <h4>{useCase.title}</h4>
              <p>{useCase.description}</p>
            </div>
          ))}

          {/* Precision Control */}
          <div className={styles.precisionCard}>
            <div className={styles.precisionOverlay}></div>
            <div className={styles.precisionContent}>
              <span className="material-symbols-outlined">tune</span>
              <h4>Precision Control</h4>
              <p>Implement rigid budget ceilings on bespoke virtual cards to manage personal styling expenses effortlessly.</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className={styles.faq}>
          <h2 className={styles.faqTitle}>Common Inquiries</h2>
          <div className={styles.faqList}>
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className={styles.faqItem}
                onClick={() => setActiveFaq(activeFaq === idx ? -1 : idx)}
              >
                <div className={styles.faqQuestion}>
                  <h4>{faq.question}</h4>
                  <span className="material-symbols-outlined">
                    {activeFaq === idx ? 'expand_less' : 'expand_more'}
                  </span>
                </div>
                {activeFaq === idx && (
                  <p className={styles.faqAnswer}>{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className={styles.cta}>
          <h2 className={styles.ctaTitle}>Start in minutes.</h2>
          <p className={styles.ctaText}>
            Experience the invisible concierge. Elevate your financial infrastructure today.
          </p>
          <Link href="/register" className={styles.ctaBtn}>Create Account</Link>
        </section>
      </main>
    </>
  )
}