'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import PaymentLogos from '@/components/ui/PaymentLogos'
import { companyDefaults } from '@/lib/company'
import styles from './page.module.scss'

export default function About() {
  const heroRef = useRef(null)

  useEffect(() => {
    // Intersection Observer for reveal animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.revealed)
          }
        })
      },
      { threshold: 0.1 }
    )

    const revealElements = document.querySelectorAll(`.${styles.revealUp}`)
    revealElements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const advantages = [
    {
      icon: 'lock',
      title: 'Secure Payments',
      description: 'Military-grade encryption protecting every acquisition, ensuring absolute privacy.'
    },
    {
      icon: 'public',
      title: 'Global Access',
      description: 'Borderless transactions allowing seamless purchases from boutiques worldwide.'
    },
    {
      icon: 'credit_card',
      title: 'Instant Cards',
      description: 'Immediate virtual card issuance for zero-delay luxury shopping.'
    },
    {
      icon: 'diamond',
      title: 'Curated Design',
      description: 'An interface crafted with the same attention to detail as Haute Couture.'
    }
  ]

  const handleMembershipClick = () => {
    window.location.href = '/register'
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroBg}>
            <div 
              className={styles.heroImage}
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCRrtXA-BALCFQAhdfZoR2Y2_zZd6IrR1UQ0bendyK-nPKndYFFGfOloGT_WE_K_Ev3RiTKK3hYk-qOecSDHNbOhyK0UiV6qryi9HamxJPewWlCKWrhwbiADO4Z2Gn1WQ_JxNJapooJ0cuUJ9jYg8wPs-4J-yhaARgkGBknjGDv9Ur1ocfUd98XhOEKp19Q_HnIgmycKukHqqPAJs0AT4wNt5lyjCRsKWqAbwStZygeaw-ZSG_DzexQzCi9cueQAI1vAMZK6eLNKbc')" }}
            ></div>
            <div className={styles.heroOverlay}></div>
          </div>
          <div className={`${styles.heroContent} ${styles.revealUp}`}>
            <h1 className={styles.heroTitle}>About Us</h1>
            <p className={styles.heroSubtitle}>
              Redefining global shopping through the seamless integration of high-end fashion 
              and precise financial technology.
            </p>
          </div>
        </section>

        {/* Intro Section */}
        <section className={`${styles.introSection} ${styles.revealUp}`}>
          <div className={styles.introContent}>
            <p className={styles.introText}>
              {(process.env.NEXT_PUBLIC_COMPANY_NAME || 'Aura')} exists at the intersection of exclusive access and absolute precision. 
              We are the invisible bridge connecting discerning individuals with the world's 
              most coveted luxury items, unbound by geographical limitations.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className={styles.missionSection}>
          <div className={styles.missionGrid}>
            <div className={`${styles.missionCard} ${styles.premiumCard} ${styles.revealUp}`}>
              <span className={styles.cardLabel}>Purpose</span>
              <h2 className={styles.cardTitle}>Our Mission</h2>
              <p className={styles.cardText}>
                To obliterate the friction between desire and acquisition. We provide an ecosystem 
                where personal finance empowers curated lifestyle choices, ensuring every transaction 
                is as refined as the item acquired.
              </p>
            </div>
            
            <div className={`${styles.visionCard} ${styles.premiumCard} ${styles.revealUp}`}>
              <span className={styles.cardLabel}>Future</span>
              <h2 className={styles.cardTitle}>Our Vision</h2>
              <p className={styles.cardText}>
                To become the definitive standard for luxury fintech, where spatial boundaries disappear 
                and global boutiques are instantaneously accessible to our members through a single, 
                elegant interface.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className={styles.advantagesSection}>
          <div className={styles.advantagesContainer}>
            <div className={styles.advantagesHeader}>
              <h2 className={styles.advantagesTitle}>The {(process.env.NEXT_PUBLIC_COMPANY_NAME || 'Aura')} Advantage</h2>
            </div>
            
            <div className={styles.advantagesGrid}>
              {advantages.map((adv, idx) => (
                <div key={idx} className={`${styles.advantageItem} ${styles.revealUp}`}>
                  <span className="material-symbols-outlined">{adv.icon}</span>
                  <h3>{adv.title}</h3>
                  <p>{adv.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lifestyle Image Section */}
        <section className={styles.lifestyleSection}>
          <div 
            className={styles.lifestyleBg}
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDhuBGPqnQS0HE6NpePIek6RClfvnZHovmKSd4F9odw29HcdKJOwSDbb-3vQ5nO1IdQsotq5FRF_epiDJEB6Lb-rxJ04wcTFXZs9ZQDqS1bVjNSTfbtsTlpJ2QDwKoAD-apd4B7Wegz57-cBb93cclNH-YLnbJenWSSS9LWXYTolyEDXEeNGF6bar_vAF6nLp6JJ5u3b_4uCBWDt9oADkPT4lHCYkpRx3zgbdqahmPhA5s_8PwMKR_HhVbTc74VkDTgft0SCj38yN0')" }}
          ></div>
          <div className={styles.lifestyleOverlay}></div>
          <div className={styles.lifestyleContent}>
            <h2 className={styles.lifestyleQuote}>
              "Luxury shopping without borders."
            </h2>
          </div>
        </section>

        {/* Trust & Security */}
        <section className={styles.trustSection}>
          <div className={styles.trustGrid}>
            <div className={`${styles.trustContent} ${styles.revealUp}`}>
              <span className={styles.sectionLabel}>Infrastructure</span>
              <h2 className={styles.sectionTitle}>Trust & Security</h2>
              <p className={styles.trustText}>
                Our platform is built on uncompromised security standards. We employ advanced 
                encryption protocols and partner with top-tier financial networks to guarantee 
                the sanctity of your capital.
              </p>
              <PaymentLogos className={styles.securityBadges} />
            </div>

            <div className={`${styles.companyDetails} ${styles.glassPanel} ${styles.revealUp}`}>
              <h3 className={styles.detailsTitle}>Corporate Details</h3>
              <div className={styles.detailsList}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Registration</span>
                  <p className={styles.detailValue}>{companyDefaults.name}</p>
                  <p className={styles.detailSubtext}>Company No. {companyDefaults.registration} (England & Wales)</p>
                </div>
                {companyDefaults.vat ? (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>VAT Number</span>
                    <p className={styles.detailValue}>{companyDefaults.vat}</p>
                  </div>
                ) : null}
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Headquarters</span>
                  <p className={styles.detailValue}>{companyDefaults.address}</p>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Contact</span>
                  <p className={styles.detailValue}>
                    <a href={`mailto:${companyDefaults.email}`}>{companyDefaults.email}</a>
                  </p>
                  <p className={styles.detailValue}>
                    <a href={`tel:${companyDefaults.phone.replace(/\s/g, '')}`}>{companyDefaults.phone}</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className={`${styles.ctaSection} ${styles.revealUp}`}>
          <h2 className={styles.ctaTitle}>Ready to elevate your access?</h2>
          <button onClick={handleMembershipClick} className={styles.ctaBtn}>
            Create Account
          </button>
        </section>
      </main>
    </div>
  )
}