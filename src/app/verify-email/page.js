'use client'
import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import styles from './page.module.scss'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const [resendCount, setResendCount] = useState(0)
  const [countdown, setCountdown] = useState(0)
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [errors, setErrors] = useState({})
  const [previewUrl, setPreviewUrl] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const handleResendEmail = async () => {
    if (countdown > 0 || isResending) return
    if (!email) {
      setErrors(prev => ({ ...prev, resend: 'Email not provided' }))
      return
    }

    setIsResending(true)
    setResendSuccess(false)

    try {
      const resp = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await resp.json()

      if (resp.ok && data.success) {
        // If server returned a previewUrl, store it for clickable UI
        if (data.previewUrl) {
          setPreviewUrl(data.previewUrl)
          setErrors(prev => ({ ...prev, resend: data.warning || 'Email delivered to test inbox (preview available).' }))
        } else if (data.warning) {
          setErrors(prev => ({ ...prev, resend: data.warning }))
        } else {
          setResendCount(prev => prev + 1)
          setResendSuccess(true)
          setCountdown(60)
          setTimeout(() => setResendSuccess(false), 3000)
        }
      } else {
        console.error('Resend failed:', data)
        setErrors(prev => ({ ...prev, resend: data.error || data.warning || 'Resend failed' }))
      }
    } catch (error) {
      console.error('Failed to resend email:', error)
      setErrors(prev => ({ ...prev, resend: 'Network error while resending email' }))
    } finally {
      setIsResending(false)
    }
  }

  const handleChangeEmail = () => {
    // Redirect to registration with email pre-filled
    window.location.href = '/register?changeEmail=true'
  }

  const handleContinue = async () => {
    setIsVerifying(true)
    
    // Check verification status (simulate API call)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Check if email is verified (in production, this would check with backend)
      const isVerified = localStorage.getItem('emailVerified') === 'true'
      
      if (isVerified) {
        window.location.href = '/virtual-card'
      } else {
        // For demo purposes, show verification needed
        alert('Please verify your email first by clicking the link sent to your inbox')
      }
    } catch (error) {
      console.error('Error checking verification:', error)
    } finally {
      setIsVerifying(false)
    }
  }

  // For demo purposes - simulate verification when coming back from email
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const verified = urlParams.get('verified')
    if (verified === 'true') {
      localStorage.setItem('emailVerified', 'true')
      // Show success message and redirect after 2 seconds
      setTimeout(() => {
        window.location.href = '/virtual-card'
      }, 2000)
    }
  }, [])

  return (
    <div className={styles.container}>
      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.contentWrapper}>
          {/* Glassmorphism Card */}
          <div className={styles.card}>
            {/* Background Decorative Element */}
            <div className={styles.cardBg}></div>
            
            {/* Icon */}
            <div className={styles.iconWrapper}>
              <span className="material-symbols-outlined">mail</span>
            </div>

            {/* Typography */}
            <h1 className={styles.title}>Verify Your Email</h1>
            <p className={styles.subtitle}>
              We've sent a secure confirmation link to <br />
              {email ? (
                <span className={styles.emailHighlight}>{email}</span>
              ) : (
                <span className={styles.emailHighlight}>No email provided — please use CHANGE EMAIL</span>
              )}
            </p>

            {/* Instructions Block */}
            <div className={styles.instructions}>
              <ul className={styles.stepsList}>
                <li className={styles.stepItem}>
                  <span className={styles.stepNumber}>01</span>
                  <span>Open your email inbox</span>
                </li>
                <li className={styles.stepItem}>
                  <span className={styles.stepNumber}>02</span>
                  <span>Click the verification link</span>
                </li>
                <li className={styles.stepItem}>
                  <span className={styles.stepNumber}>03</span>
                  <span>Return here to continue</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <button 
                onClick={handleResendEmail}
                disabled={countdown > 0 || isResending || !email}
                className={styles.resendBtn}
              >
                <span>
                  {isResending 
                    ? 'SENDING...' 
                    : countdown > 0 
                      ? `RESEND IN ${countdown}s` 
                      : 'RESEND EMAIL'
                  }
                </span>
                <span className={`${styles.arrowIcon} ${(!isResending && countdown === 0) ? styles.visible : ''}`}>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </span>
              </button>

              {resendSuccess && (
                <div className={styles.successMessage}>
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>Verification email resent successfully!</span>
                </div>
              )}

              {errors.resend && (
                <div className={styles.errorMessage}>
                  <span className="material-symbols-outlined">error</span>
                  <span>{errors.resend}</span>
                </div>
              )}

              {previewUrl && (
                <div className={styles.previewRow}>
                  <a href={previewUrl} target="_blank" rel="noreferrer" className={styles.previewLink}>
                    Open email preview
                  </a>
                  <button
                    type="button"
                    className={styles.copyBtn}
                    onClick={() => {
                      try { navigator.clipboard.writeText(previewUrl); setErrors(prev => ({ ...prev, resendCopy: 'Preview link copied' })); }
                      catch (e) { setErrors(prev => ({ ...prev, resendCopy: 'Copy failed' })); }
                    }}
                  >
                    Copy link
                  </button>
                </div>
              )}

              {errors.resendCopy && (
                <div className={styles.copyMessage}>{errors.resendCopy}</div>
              )}

              <div className={styles.secondaryActions}>
                <button 
                  onClick={handleChangeEmail}
                  className={styles.changeEmailBtn}
                >
                  CHANGE EMAIL
                </button>
                <button 
                  onClick={handleContinue}
                  disabled={isVerifying}
                  className={styles.continueBtn}
                >
                  {isVerifying ? 'CHECKING...' : 'ALREADY VERIFIED? CONTINUE'}
                </button>
              </div>
            </div>

            {/* Security Note */}
            <div className={styles.securityNote}>
              <span className="material-symbols-outlined">lock</span>
              <span>This step helps us keep your account secure.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}