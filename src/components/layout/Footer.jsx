'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import styles from './Footer.module.scss'

export default function Footer() {
  const pathname = usePathname()
  const currentYear = new Date().getFullYear()

  // Company information (uses NEXT_PUBLIC_* env vars when available)
  const companyInfo = {
    name: process.env.NEXT_PUBLIC_COMPANY_NAME || 'AURA FINANCE LTD',
    registration: process.env.NEXT_PUBLIC_COMPANY_NUMBER || '12345678',
    vat: process.env.NEXT_PUBLIC_COMPANY_VAT || 'GB123456789',
    address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || '25 Berkeley Square, Mayfair, London, W1J 6HN, United Kingdom',
    email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'contact@aura.finance',
    phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || '+44 (0) 20 7123 4567',
  }

  // Main navigation links
  const mainLinks = [
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/pricing', label: 'Pricing & Fees' },
    { href: '/supported-countries', label: 'Availability & Security' },
    { href: '/faq', label: 'FAQ' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
  ]

  // Legal links
  const legalLinks = [
    { href: '/terms', label: 'Terms of Service' },
    { href: '/privacy', label: 'Privacy Policy' },
  ]

  // Product links
  const productLinks = [
    { href: '/wallet', label: 'Digital Wallet' },
    { href: '/virtual-card', label: 'My Cards' },
    { href: '/buy-balance', label: 'Add Funds' },
  ]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Main Footer Grid */}
        <div className={styles.grid}>
          {/* Brand Column */}
          <div className={styles.brandColumn}>
            <div className={styles.logo}>{(process.env.NEXT_PUBLIC_COMPANY_NAME || 'AURA').split(' ')[0]}</div>
            <p className={styles.tagline}>
              Global luxury financial ecosystem for discerning individuals.
            </p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink} aria-label="LinkedIn">
                <span className="material-symbols-outlined">work</span>
              </a>
              <a href="#" className={styles.socialLink} aria-label="Instagram">
                <span className="material-symbols-outlined">photo_camera</span>
              </a>
              <a href="#" className={styles.socialLink} aria-label="Twitter">
                <span className="material-symbols-outlined">alternate_email</span>
              </a>
            </div>
          </div>

          {/* Product Links Column */}
          <div className={styles.linksColumn}>
            <h3 className={styles.columnTitle}>Products</h3>
            <ul className={styles.linksList}>
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Main Links Column */}
          <div className={styles.linksColumn}>
            <h3 className={styles.columnTitle}>Resources</h3>
            <ul className={styles.linksList}>
              {mainLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links Column */}
          <div className={styles.linksColumn}>
            <h3 className={styles.columnTitle}>Legal</h3>
            <ul className={styles.linksList}>
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Company Information Section */}
        <div className={styles.companySection}>
          <div className={styles.companyInfo}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Company:</span>
              <span className={styles.infoValue}>{companyInfo.name}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Registration:</span>
              <span className={styles.infoValue}>{companyInfo.registration}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>VAT:</span>
              <span className={styles.infoValue}>{companyInfo.vat}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Address:</span>
              <span className={styles.infoValue}>{companyInfo.address}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Email:</span>
              <a href={`mailto:${companyInfo.email}`} className={styles.infoLink}>
                {companyInfo.email}
              </a>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Phone:</span>
              <a href={`tel:${companyInfo.phone}`} className={styles.infoLink}>
                {companyInfo.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Payment Logos & Certifications - ЗМІНЕНО ПОРЯДОК */}
        <div className={styles.paymentSection}>
          {/* Сертифікати тепер зліва */}
          <div className={styles.certBadges}>
            <span className={styles.badge}>Level 1 Certified</span>
            <span className={styles.badge}>ISO 27001</span>
            <span className={styles.badge}>GDPR Compliant</span>
          </div>

          {/* Платіжні логотипи тепер справа */}
          <div className={styles.paymentLogos}>
            <div className={styles.paymentItem}>
              <div className={styles.pciLogo}>
                <Image 
                  src="/pci-dss-compliant-logo-vector.svg" 
                  alt="PCI DSS Compliant"
                  width={40}
                  height={40}
                  className={styles.pciImage}
                />
              </div>
            </div>
            <div className={styles.paymentItem}>
              <div className={styles.visaLogo}>
                <Image 
                  src="/visa-logo.svg" 
                  alt="Visa"
                  width={50}
                  height={35}
                  className={styles.visaImage}
                />
              </div>
            </div>
            <div className={styles.paymentItem}>
              <div className={styles.mastercardLogo}>
                <Image 
                  src="/ma_symbol.svg" 
                  alt="Mastercard"
                  width={50}
                  height={35}
                  className={styles.mastercardImage}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            © {currentYear} {companyInfo.name}. All rights reserved.
          </div>
          <div className={styles.bottomLinks}>
            <button onClick={scrollToTop} className={styles.backToTop}>
              <span className="material-symbols-outlined">arrow_upward</span>
              Back to Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}