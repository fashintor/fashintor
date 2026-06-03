'use client'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './page.module.scss'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/wallet'
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      setErrors({ general: 'Email and password are required' })
      return
    }
    
    setIsLoading(true)
    setErrors({})
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // Зберігаємо токен
        if (data.token) {
          localStorage.setItem('auth-token', data.token)
        }
        
        // 🔥 Відправляємо подію для оновлення Header
        window.dispatchEvent(new Event('focus'))
        
        // 🔥 Використовуємо window.location для повного перезавантаження
        window.location.href = redirectTo
      } else {
        setErrors({ general: data.error || 'Invalid email or password' })
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ general: 'Something went wrong. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <main className={styles.main}>
          <div className={styles.formWrapper}>
            <div className={styles.formHeader}>
              <h1 className={styles.title}>Welcome Back</h1>
              <p className={styles.subtitle}>Access your wallet and virtual cards.</p>
            </div>

            {errors.general && (
              <div className={styles.errorBanner}>{errors.general}</div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.fieldGroup}>
                <label htmlFor="email" className={styles.label}>Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                />
                {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="password" className={styles.label}>Password</label>
                <div className={styles.passwordWrapper}>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`${styles.input} ${styles.passwordInput} ${errors.password ? styles.inputError : ''}`}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className={styles.passwordToggle}
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
              </div>

              <div className={styles.formOptions}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <span>Remember me</span>
                </label>
                <Link href="/forgot-password" className={styles.forgotLink}>
                  Forgot password?
                </Link>
              </div>

              <div className={styles.submitSection}>
                <button 
                  type="submit" 
                  className={styles.submitBtn}
                  disabled={isLoading}
                >
                  {isLoading ? 'Authenticating...' : 'Log In'}
                </button>
              </div>
            </form>

            <div className={styles.signupPrompt}>
              <p>Don't have an account? <Link href="/register">Sign Up</Link></p>
            </div>

            <div className={styles.trustElements}>
              <div className={styles.trustItem}>
                <span className="material-symbols-outlined">lock</span>
                <span>Secure Login</span>
              </div>
              <div className={styles.trustItem}>
                <span className="material-symbols-outlined">shield</span>
                <span>Data Encryption</span>
              </div>
              <div className={styles.trustItem}>
                <span className="material-symbols-outlined">verified_user</span>
                <span>PCI DSS Compliant</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      <div className={styles.imageContainer}>
        <div className={styles.imageGradient}></div>
         <img 
    src="/01.jpg"
    alt="High-end fashion accessory"
    className={styles.heroImage}
  />
      </div>
    </div>
  )
}

export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}