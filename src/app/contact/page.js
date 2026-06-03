'use client'
import { useState } from 'react'
import Link from 'next/link'
import styles from './page.module.scss'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
    // Clear error when user types
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.subject) {
      newErrors.subject = 'Please select a subject'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
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
    
    setIsSubmitting(true)
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Form submitted:', formData)
      setSubmitSuccess(true)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
      
      // Hide success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000)
    } catch (error) {
      console.error('Submission error:', error)
      setErrors({ submit: 'Failed to send message. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const companyEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'info@fashintor.com'
  const companyPhone = process.env.NEXT_PUBLIC_COMPANY_PHONE || '+44 7863 779241'
  const companyAddress = process.env.NEXT_PUBLIC_COMPANY_ADDRESS || 'Dept 6792, 196 High Road, Wood Green, London, United Kingdom, N22 8HH'

  const contactMethods = [
    {
      icon: 'mail',
      title: 'Email Support',
      description: 'For general inquiries and detailed requests.',
      contact: companyEmail,
      link: `mailto:${companyEmail}`
    },
    {
      icon: 'call',
      title: 'Direct Line',
      description: 'Assistance from our client support team.',
      contact: companyPhone,
      link: `tel:${companyPhone.replace(/\s/g, '')}`
    },
    {
      icon: 'location_on',
      title: 'Office',
      description: 'Registered office address.',
      contact: companyAddress
    }
  ]

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <h1 className={styles.heroTitle}>Contact Us</h1>
          <p className={styles.heroSubtitle}>
            We're here to help you anytime. Our concierge team is available around the clock 
            to assist with your portfolio and account inquiries.
          </p>
        </section>

        {/* Contact Method Cards */}
        <section className={styles.methodsSection}>
          {contactMethods.map((method, idx) => (
            <div key={idx} className={styles.methodCard}>
              <span className="material-symbols-outlined">{method.icon}</span>
              <h3>{method.title}</h3>
              <p>{method.description}</p>
              {method.link ? (
                <a href={method.link} className={styles.methodLink}>
                  {method.contact}
                </a>
              ) : (
                <span className={styles.methodText}>{method.contact}</span>
              )}
            </div>
          ))}
        </section>

        {/* Main Content: Form & Location */}
        <div className={styles.contentGrid}>
          {/* Contact Form */}
          <section className={styles.formSection}>
            <h2 className={styles.formTitle}>Send a Message</h2>
            
            <form onSubmit={handleSubmit} className={styles.contactForm}>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={errors.name ? styles.inputError : ''}
                  />
                  {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
                </div>
                
                <div className={styles.formField}>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your registered email"
                    className={errors.email ? styles.inputError : ''}
                  />
                  {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                </div>
              </div>

              <div className={styles.formField}>
                <label htmlFor="subject">Subject</label>
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={errors.subject ? styles.inputError : ''}
                >
                  <option value="" disabled>Select an inquiry type</option>
                  <option value="portfolio">Portfolio Management</option>
                  <option value="card">Card Services</option>
                  <option value="technical">Technical Support</option>
                  <option value="other">Other</option>
                </select>
                {errors.subject && <span className={styles.errorMessage}>{errors.subject}</span>}
              </div>

              <div className={styles.formField}>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we assist you today?"
                  className={errors.message ? styles.inputError : ''}
                ></textarea>
                {errors.message && <span className={styles.errorMessage}>{errors.message}</span>}
              </div>

              {errors.submit && (
                <div className={styles.submitError}>{errors.submit}</div>
              )}

              {submitSuccess && (
                <div className={styles.successMessage}>
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>Message sent successfully! We'll respond within 24 hours.</span>
                </div>
              )}

              <div className={styles.formFooter}>
                <p className={styles.responseNote}>
                  We typically respond to client inquiries within 24 hours.
                </p>
                <button 
                  type="submit" 
                  className={styles.submitBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </section>

          {/* Location & Trust Block */}
          <section className={styles.rightSection}>
            <div className={styles.mapContainer}>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxNjgFvk6hJJGhFeKVqEnMH9_3jANIlR98GLiFxe3iyrwMCURcFZsgUWiu20YHQkN6gJRCwW-vaHpjhia4ypWNch2h_-WOyytl0YrTPhLZacI3MbpSZWtcSgGaVXrwFUHIE3O4cDfrY3MgCvmSnYF1nXZpInFDY8IA5Q24ymjiQ7zHdOSNTzrp9L167X8-LeIHtS4M6cQ-LRaaYgEZpAidIwOsT52qkbthtwl9mztw6cZPSDJ7HMD2HJZTeNXAtfCD22UyXxbsmmc"
                alt="London Mayfair Area"
                className={styles.mapImage}
              />
              <div className={styles.mapOverlay}></div>
            </div>

            <div className={styles.securityCard}>
              <h3 className={styles.securityTitle}>Secure Communication</h3>
              <ul className={styles.securityList}>
                <li>
                  <span className="material-symbols-outlined">lock</span>
                  <p>End-to-end encryption for all digital communications.</p>
                </li>
                <li>
                  <span className="material-symbols-outlined">verified_user</span>
                  <p>Strict adherence to global data protection regulations.</p>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}