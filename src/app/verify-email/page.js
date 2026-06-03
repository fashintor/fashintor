'use client'
import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { dashboardRoutes } from '@/lib/routes'
import styles from './page.module.scss'

const ERROR_MESSAGES = {
  'invalid-token': 'Invalid verification link. Please request a new email.',
  'invalid-or-expired': 'This link has expired or was already used. Resend a new verification email below.',
  server: 'Something went wrong. Please try again or contact support.',
}

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get('email') || ''
  const errorCode = searchParams.get('error') || ''

  const [resendCount, setResendCount] = useState(0)
  const [countdown, setCountdown] = useState(0)
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [errors, setErrors] = useState({})
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  useEffect(() => {
    if (errorCode) {
      setErrors({ page: ERROR_MESSAGES[errorCode] || 'Verification failed.' })
    }
  }, [errorCode])

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
        body: JSON.stringify({ email }),
      })

      const data = await resp.json()

      if (resp.ok && data.success) {
        setErrors(prev => {
          const next = { ...prev }
          delete next.resend
          delete next.page
          return next
        })
        setResendCount(prev => prev + 1)
        setResendSuccess(true)
        setCountdown(60)
        setTimeout(() => setResendSuccess(false), 5000)
      } else {
        setErrors(prev => ({ ...prev, resend: data.error || 'Resend failed' }))
      }
    } catch (error) {
      console.error('Failed to resend email:', error)
      setErrors(prev => ({ ...prev, resend: 'Network error while resending email' }))
    } finally {
      setIsResending(false)
    }
  }

  const handleChangeEmail = () => {
    window.location.href = '/register?changeEmail=true'
  }

  const handleContinue = async () => {
    setIsChecking(true)
    setErrors(prev => {
      const next = { ...prev }
      delete next.continue
      return next
    })

    try {
      const headers = {}
      const savedToken = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
      if (savedToken) headers['Authorization'] = `Bearer ${savedToken}`

      const resp = await fetch('/api/auth/me', { credentials: 'same-origin', headers })
      if (resp.ok) {
        const data = await resp.json()
        if (data.user?.emailVerified) {
          router.push(dashboardRoutes.wallet)
          return
        }
      }

      setErrors(prev => ({
        ...prev,
        continue: 'Email not verified yet. Click the link in your inbox, or resend the email below.',
      }))
    } catch (error) {
      console.error('Error checking verification:', error)
      setErrors(prev => ({ ...prev, continue: 'Could not check status. Try again.' }))
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.contentWrapper}>
          <div className={styles.card}>
            <div className={styles.cardBg}></div>

            <div className={styles.iconWrapper}>
              <span className="material-symbols-outlined">mail</span>
            </div>

            <h1 className={styles.title}>Verify Your Email</h1>
            <p className={styles.subtitle}>
              We&apos;ve sent a secure confirmation link to <br />
              {email ? (
                <span className={styles.emailHighlight}>{email}</span>
              ) : (
                <span className={styles.emailHighlight}>No email provided — please use CHANGE EMAIL</span>
              )}
            </p>

            {errors.page && (
              <div className={styles.errorMessage}>
                <span className="material-symbols-outlined">error</span>
                <span>{errors.page}</span>
              </div>
            )}

            <div className={styles.instructions}>
              <ul className={styles.stepsList}>
                <li className={styles.stepItem}>
                  <span className={styles.stepNumber}>01</span>
                  <span>Open your email inbox</span>
                </li>
                <li className={styles.stepItem}>
                  <span className={styles.stepNumber}>02</span>
                  <span>Click the verification button</span>
                </li>
                <li className={styles.stepItem}>
                  <span className={styles.stepNumber}>03</span>
                  <span>You will be taken to your wallet automatically</span>
                </li>
              </ul>
            </div>

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
                      : 'RESEND EMAIL'}
                </span>
                <span className={`${styles.arrowIcon} ${!isResending && countdown === 0 ? styles.visible : ''}`}>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </span>
              </button>

              {resendSuccess && (
                <div className={styles.successMessage}>
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>Email sent! Check your inbox and spam folder.</span>
                </div>
              )}

              {errors.resend && (
                <div className={styles.errorMessage}>
                  <span className="material-symbols-outlined">error</span>
                  <span>{errors.resend}</span>
                </div>
              )}

              {errors.continue && (
                <div className={styles.errorMessage}>
                  <span className="material-symbols-outlined">info</span>
                  <span>{errors.continue}</span>
                </div>
              )}

              <div className={styles.secondaryActions}>
                <button onClick={handleChangeEmail} className={styles.changeEmailBtn}>
                  CHANGE EMAIL
                </button>
                <button
                  onClick={handleContinue}
                  disabled={isChecking}
                  className={styles.continueBtn}
                >
                  {isChecking ? 'CHECKING...' : 'ALREADY VERIFIED? CONTINUE'}
                </button>
              </div>
            </div>

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
