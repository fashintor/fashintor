'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './page.module.scss'

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('introduction')
  const [lastUpdated] = useState('OCT 2023')
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'Fashintor'
  const companyShort = companyName.split(' ')[0]

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['introduction', 'data-collection', 'your-rights', 'security', 'updates', 'contact']
      const scrollPosition = window.scrollY + 200

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const navItems = [
    { id: 'introduction', label: 'Introduction', icon: 'info' },
    { id: 'data-collection', label: 'Data Collection', icon: 'database' },
    { id: 'your-rights', label: 'Your Rights', icon: 'verified_user' },
    { id: 'security', label: 'Security Protocols', icon: 'security' },
    { id: 'updates', label: 'Updates', icon: 'history' },
    { id: 'contact', label: 'Contact', icon: 'contact_support' }
  ]

  const handleEmailPrivacy = () => {
    window.location.href = `mailto:${process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'info@fashintor.com'}`
  }

  return (
    <div className={styles.container}>
      {/* Main Content Area */}
      <main className={styles.main}>
        {/* Hero Section */}
        <header className={styles.hero}>
          <h1 className={styles.heroTitle}>Privacy Policy</h1>
          <p className={styles.heroSubtitle}>
            Your privacy and data protection are central to the {companyShort} experience. 
            We treat your personal information with the same rigor and security as your financial assets.
          </p>
          <p className={styles.lastUpdated}>LAST UPDATED: {lastUpdated}</p>
        </header>

        <div className={styles.contentGrid}>
          {/* SideNavBar (Sticky Sidebar) */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarContent}>
              <div className={styles.sidebarHeader}>
                <h3 className={styles.sidebarTitle}>LEGAL SECTIONS</h3>
                <p className={styles.sidebarDate}>Last updated {lastUpdated}</p>
              </div>
              
              <nav className={styles.sidebarNav}>
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`${styles.navLink} ${
                      activeSection === item.id ? styles.activeNavLink : ''
                    }`}
                  >
                    <span className="material-symbols-outlined">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content Area */}
          <div className={styles.contentCard}>
            {/* Introduction Section */}
            <section id="introduction" className={styles.section}>
              <h2 className={styles.sectionTitle}>1. Introduction</h2>
              <div className={styles.sectionContent}>
                <p>
                  Welcome to {companyShort}. This Privacy Policy outlines our uncompromising approach to safeguarding 
                  your personal and financial data. We believe privacy is a fundamental right, especially 
                  when navigating high-net-worth ecosystems.
                </p>
                <p>
                  By utilizing the {companyShort} platform, Concierge services, or Vault features, you entrust us 
                  with critical information. This document details how we honor that trust.
                </p>
              </div>
            </section>

            {/* Data Collection Section */}
            <section id="data-collection" className={styles.section}>
              <h2 className={styles.sectionTitle}>2. Information We Collect</h2>
              <div className={styles.sectionContent}>
                <p>
                  To provide our bespoke financial services, we collect precisely what is necessary, 
                  and nothing more. Our data collection is categorized as follows:
                </p>
                
                <ul className={styles.dataList}>
                  <li>
                    <strong>Identity & Profile Data</strong>
                    <span>Legal name, date of birth, residential address, and government-issued identification required for stringent KYC and AML compliance.</span>
                  </li>
                  <li>
                    <strong>Financial Data</strong>
                    <span>Bank account details, transaction history within the {companyShort} platform, portfolio valuations, and funding sources necessary to execute trades and manage your wealth.</span>
                  </li>
                  <li>
                    <strong>Technical & Usage Data</strong>
                    <span>Device identifiers, IP addresses, secure login timestamps, and platform navigation metrics used strictly to enhance security and optimize the bespoke user interface.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Your Rights Section */}
            <section id="your-rights" className={styles.section}>
              <h2 className={styles.sectionTitle}>3. Your Rights</h2>
              <div className={styles.sectionContent}>
                <p>
                  Under applicable data protection laws, you have the following rights regarding your 
                  personal data:
                </p>
                
                <ul className={styles.rightsList}>
                  <li>
                    <span className="material-symbols-outlined">check_circle</span>
                    <span><strong>Right to Access</strong> - Request a copy of your personal data</span>
                  </li>
                  <li>
                    <span className="material-symbols-outlined">check_circle</span>
                    <span><strong>Right to Rectification</strong> - Correct inaccurate or incomplete data</span>
                  </li>
                  <li>
                    <span className="material-symbols-outlined">check_circle</span>
                    <span><strong>Right to Erasure</strong> - Request deletion of your data</span>
                  </li>
                  <li>
                    <span className="material-symbols-outlined">check_circle</span>
                    <span><strong>Right to Portability</strong> - Transfer your data to another service</span>
                  </li>
                  <li>
                    <span className="material-symbols-outlined">check_circle</span>
                    <span><strong>Right to Object</strong> - Object to certain data processing activities</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Security Protocols Section */}
            <section id="security" className={styles.section}>
              <h2 className={styles.sectionTitle}>4. Security Protocols & Storage</h2>
              <div className={styles.sectionContent}>
                <p>
                  Your data resides within a state-of-the-art cryptographic architecture. 
                  We employ military-grade encryption for data both at rest and in transit.
                </p>
                <p>
                  {companyShort} maintains strict compliance with international security standards, 
                  including full <strong>PCI DSS compliance</strong> for all payment processing 
                  and cardholder data environments.
                </p>
                
                <div className={styles.securityBox}>
                  <h4>INFRASTRUCTURE HIGHLIGHTS</h4>
                  <p>
                    End-to-end AES-256 encryption. Hardware Security Modules (HSMs) for key management. 
                    Biometric authentication gating for sensitive account actions.
                  </p>
                </div>
              </div>
            </section>

            {/* Updates Section */}
            <section id="updates" className={styles.section}>
              <h2 className={styles.sectionTitle}>5. Policy Updates</h2>
              <div className={styles.sectionContent}>
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices, 
                  technologies, legal requirements, or other factors. When we make changes, we will update 
                  the "Last Updated" date at the top of this policy.
                </p>
                <p>
                  We encourage you to review this Privacy Policy periodically to stay informed about how 
                  we are protecting your information. For material changes, we will provide prominent 
                  notice within the platform or via email.
                </p>
              </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className={styles.section}>
              <h2 className={styles.sectionTitle}>6. Contact & Inquiries</h2>
              <div className={styles.sectionContent}>
                <p>
                  For dedicated privacy support or to exercise your data rights, our Data Protection 
                  Concierge is available 24/7.
                </p>
                
                <div className={styles.contactActions}>
                  <button onClick={handleEmailPrivacy} className={styles.contactBtn}>
                    EMAIL PRIVACY TEAM
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}