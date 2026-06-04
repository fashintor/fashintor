'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { countries } from '@/utils/countries'
import styles from './page.module.scss'

export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    dob: '',
    street: '',
    city: '',
    postcode: '',
    country: '',
    termsAccepted: false
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }))
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    if (!formData.street.trim()) newErrors.street = 'Street address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.postcode.trim()) newErrors.postcode = 'Postcode is required'
    if (!formData.country) newErrors.country = 'Country is required'
    if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms'
    
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
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          dateOfBirth: formData.dob,
          address: {
            street: formData.street,
            city: formData.city,
            postcode: formData.postcode,
            country: formData.country,
          }
        }),
      })
      
      const data = await response.json()
      
      console.log('==========================================')
      console.log('📦 REGISTRATION RESPONSE:')
      console.log('  Status:', response.status)
      console.log('  OK:', response.ok)
      console.log('  testMode:', data.testMode)
      console.log('  emailVerified:', data.user?.emailVerified)
      console.log('==========================================')
      
      if (response.ok) {
        if (data.token) {
          localStorage.setItem('auth-token', data.token)
          console.log('✅ Token saved to localStorage')
        }
        
        window.dispatchEvent(new Event('auth-change'))
        
        const isTestMode = data.testMode === true
        const isEmailVerified = data.user?.emailVerified === true
        const goToWallet = isTestMode || isEmailVerified
        
        if (goToWallet) {
          window.location.href = '/virtual-card'
        } else {
          const emailParam = encodeURIComponent(formData.email || data.user?.email || '')
          window.location.href = `/verify-email?email=${emailParam}`
        }
      } else {
        setErrors({ submit: data.error || 'Registration failed' })
      }
    } catch (error) {
      console.error('❌ Submission error:', error)
      setErrors({ submit: 'Something went wrong. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    // ❌ ВИДАЛЕНО локальний <header> - використовуємо глобальний з layout.js
    <main className={styles.main}>
      <div className={styles.formContainer}>
        <div className={styles.formWrapper}>
          <div className={styles.formHeader}>
            <h1 className={styles.title}>Create Account</h1>
            <p className={styles.subtitle}>Join {process.env.NEXT_PUBLIC_COMPANY_NAME || 'Fashintor'} for secure global shopping</p>
          </div>

          {errors.submit && (
            <div className={styles.submitError}>{errors.submit}</div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Personal Information */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>PERSONAL INFORMATION</h2>
              
              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="firstName">FIRST NAME</label>
                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  {errors.firstName && <span className={styles.errorMessage}>{errors.firstName}</span>}
                </div>
                
                <div className={styles.field}>
                  <label htmlFor="lastName">LAST NAME</label>
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  {errors.lastName && <span className={styles.errorMessage}>{errors.lastName}</span>}
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="email">EMAIL ADDRESS</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
              </div>

              <div className={styles.field}>
                <label htmlFor="password">PASSWORD</label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="phone">PHONE NUMBER</label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                
                <div className={styles.field}>
                  <label htmlFor="dob">DATE OF BIRTH</label>
                  <input
                    id="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>ADDRESS</h2>
              
              <div className={styles.field}>
                <label htmlFor="street">STREET, HOUSE NUMBER, APARTMENT</label>
                <input
                  id="street"
                  type="text"
                  value={formData.street}
                  onChange={handleChange}
                />
                {errors.street && <span className={styles.errorMessage}>{errors.street}</span>}
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="city">CITY</label>
                  <input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                  />
                  {errors.city && <span className={styles.errorMessage}>{errors.city}</span>}
                </div>
                
                <div className={styles.field}>
                  <label htmlFor="postcode">POST CODE</label>
                  <input
                    id="postcode"
                    type="text"
                    value={formData.postcode}
                    onChange={handleChange}
                  />
                  {errors.postcode && <span className={styles.errorMessage}>{errors.postcode}</span>}
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="country">COUNTRY</label>
                <div className={styles.selectWrapper}>
                  <select
                    id="country"
                    value={formData.country}
                    onChange={handleChange}
                  >
                    <option value="" disabled>Select your country</option>
                    {countries.map(country => (
                      <option key={country.code} value={country.code}>{country.name}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined">expand_more</span>
                </div>
                {errors.country && <span className={styles.errorMessage}>{errors.country}</span>}
              </div>
            </div>

            {/* Terms */}
            <div className={styles.agreements}>
              <label className={styles.checkboxLabel}>
                <div className={styles.checkboxWrapper}>
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className={styles.checkbox}
                  />
                  <div className={styles.checkboxCustom} aria-hidden="true" />
                </div>
                <span>
                  I agree to the{' '}
                  <Link href="/terms">Terms & Conditions</Link> and{' '}
                  <Link href="/privacy">Privacy Policy</Link>
                </span>
              </label>
              {errors.termsAccepted && <span className={styles.errorMessage}>{errors.termsAccepted}</span>}
            </div>

            {/* Submit */}
            <div className={styles.actions}>
              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className={styles.loginPrompt}>
            <Link href="/login">
              Already have an account? <span>Sign In</span>
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.imageContainer}>
        <div className={styles.imageBg}></div>
        <div className={styles.imageOverlayCard}>
          <h3>Secure Global Shopping.</h3>
          <p>Virtual cards for luxury boutiques worldwide.</p>
        </div>
      </div>
    </main>
  )
}