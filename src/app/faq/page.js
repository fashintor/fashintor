'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './page.module.scss'

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('general')
  const [openItems, setOpenItems] = useState({})
  const [filteredFAQs, setFilteredFAQs] = useState([])

  const categories = [
    { id: 'general', name: 'General', icon: 'info' },
    { id: 'account', name: 'Account', icon: 'person' },
    { id: 'wallet', name: 'Wallet', icon: 'account_balance_wallet' },
    { id: 'cards', name: 'Cards', icon: 'credit_card' },
    { id: 'security', name: 'Security', icon: 'shield' }
  ]
  const companyName = process.env.NEXT_PUBLIC_BRAND_NAME || 'Fashintor'
  const companyShort = companyName.split(' ')[0]

  const faqs = {
    general: [
      {
        id: 'what-is-fashintor',
        question: `What is ${companyShort}?`,
        answer: `${companyName} is a luxury financial ecosystem designed to seamlessly integrate high-end lifestyle management with robust wealth tools. We offer bespoke virtual cards, concierge services, and secure asset vaults.`
      },
      {
        id: 'where-use-card',
        question: 'Where can I use my card?',
        answer: `Your ${companyShort} virtual card can be used at any merchant that accepts Visa or Mastercard, both online and in-store, globally. There are no geographic restrictions for premium members.`
      },
      {
        id: 'membership-benefits',
        question: `What are the benefits of ${companyShort} membership?`,
        answer: 'Members enjoy unlimited virtual card generation, institutional-grade exchange rates, a dedicated personal concierge, and exclusive access to luxury brand partnerships.'
      }
    ],
    account: [
      {
        id: 'create-account',
        question: 'How do I create an account?',
        answer: 'You can create an account by clicking the "Sign Up" button and completing our streamlined KYC process. The entire process takes less than 2 minutes.'
      },
      {
        id: 'verify-identity',
        question: 'Why do I need to verify my identity?',
        answer: 'Identity verification is required to comply with financial regulations and ensure the security of all transactions. We use bank-grade encryption to protect your data.'
      }
    ],
    wallet: [
      {
        id: 'add-funds',
        question: 'How do I add funds to my wallet?',
        answer: 'You can add funds via bank transfer, credit card, or cryptocurrency. Funds typically clear within minutes for card payments and 1-2 business days for bank transfers.'
      },
      {
        id: 'withdraw-funds',
        question: 'How do I withdraw funds?',
        answer: 'Withdrawals can be initiated from your wallet dashboard. Funds are sent to your verified bank account within 1-3 business days.'
      }
    ],
    cards: [
      {
        id: 'create-virtual-card',
        question: 'How do I create a virtual card?',
        answer: 'Navigate to the Virtual Card section and click "Create New Card". You can generate single-use or merchant-locked cards instantly.'
      },
      {
        id: 'freeze-card',
        question: 'How to freeze a card?',
        answer: 'From your virtual card dashboard, click the "Freeze Card" button. You can unfreeze it at any time with a single click.'
      },
      {
        id: 'card-limits',
        question: 'Are there limits on card generation?',
        answer: 'Premium members can generate an unlimited number of virtual cards. Each card can have custom spending limits you define.'
      }
    ],
    security: [
      {
        id: 'data-protection',
        question: 'How is my data protected?',
        answer: 'We use 256-bit AES encryption, PCI DSS Level 1 compliance, and zero-knowledge architecture to ensure your data remains private and secure.'
      },
      {
        id: 'fraud-protection',
        question: 'What fraud protection do you offer?',
        answer: 'All transactions are monitored in real-time for suspicious activity. You can instantly freeze cards and set transaction alerts.'
      }
    ]
  }

  useEffect(() => {
    filterFAQs()
  }, [searchQuery, activeCategory])

  const filterFAQs = () => {
    let filtered = [...faqs[activeCategory]]
    
    if (searchQuery.trim()) {
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    setFilteredFAQs(filtered)
  }

  const toggleAccordion = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId)
    setOpenItems({})
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    setOpenItems({})
  }

  const scrollToCategory = (categoryId) => {
    setActiveCategory(categoryId)
    const element = document.getElementById(`category-${categoryId}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const featuredCards = [
    {
      icon: 'credit_card',
      title: 'Virtual Cards',
      description: 'Learn how to instantly generate and manage your disposable and permanent virtual cards.'
    },
      {
      icon: 'account_balance_wallet',
      title: 'Funding Options',
      description: `Discover the methods available for adding liquidity to your ${companyShort} Vault securely.`
    },
    {
      icon: 'shield_lock',
      title: 'Security Protocol',
      description: 'Understand the multi-layered encryption and authentication safeguarding your assets.'
    }
  ]

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* Hero & Search */}
        <section className={styles.heroSection}>
          <h1 className={styles.heroTitle}>Frequently Asked Questions</h1>
          <p className={styles.heroSubtitle}>
            How can we assist you today? Search our knowledge base or browse categories below.
          </p>
          
          <div className={styles.searchWrapper}>
            <span className="material-symbols-outlined">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search for answers..."
              className={styles.searchInput}
            />
            <div className={styles.searchBorder}></div>
          </div>
        </section>

        {/* Featured Questions Bento */}
        <section className={styles.featuredSection}>
          {featuredCards.map((card, idx) => (
            <div 
              key={idx} 
              className={styles.featuredCard}
              onClick={() => scrollToCategory(
                card.title === 'Virtual Cards' ? 'cards' : 
                card.title === 'Funding Options' ? 'wallet' : 'security'
              )}
            >
              <span className="material-symbols-outlined">{card.icon}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </section>

        {/* Main FAQ Section */}
        <section className={styles.faqSection}>
          {/* Category Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.stickySidebar}>
              <h4 className={styles.categoriesTitle}>Categories</h4>
              <nav className={styles.categoriesNav}>
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`${styles.categoryLink} ${
                      activeCategory === category.id ? styles.activeCategory : ''
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Accordion List */}
          <div className={styles.accordionContainer}>
            {categories.map(category => (
              <div 
                key={category.id} 
                id={`category-${category.id}`}
                className={`${styles.categorySection} ${
                  activeCategory === category.id ? styles.activeSection : styles.hiddenSection
                }`}
              >
                <h2 className={styles.categoryTitle}>{category.name}</h2>
                
                {filteredFAQs.length > 0 && activeCategory === category.id ? (
                  filteredFAQs.map((faq, idx) => (
                    <div key={faq.id} className={styles.accordionItem}>
                      <div 
                        className={styles.accordionHeader}
                        onClick={() => toggleAccordion(faq.id)}
                      >
                        <h3>{faq.question}</h3>
                        <span className="material-symbols-outlined">
                          {openItems[faq.id] ? 'remove' : 'add'}
                        </span>
                      </div>
                      
                      <div 
                        className={`${styles.accordionContent} ${
                          openItems[faq.id] ? styles.expanded : ''
                        }`}
                      >
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  ))
                ) : activeCategory === category.id && (
                  <div className={styles.noResults}>
                    <p>No results found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Support CTA */}
        <section className={styles.supportCTA}>
          <div className={styles.ctaOverlay}></div>
          <div className={styles.ctaContent}>
            <h2>Still require assistance?</h2>
            <p>Our Invisible Concierge is available to address your specific needs with discretion and precision.</p>
            <button className={styles.contactBtn}>
              CONTACT SUPPORT
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}