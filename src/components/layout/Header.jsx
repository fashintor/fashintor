'use client'
import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Header.module.scss'

export default function Header() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [authResolved, setAuthResolved] = useState(false)
  const isMounted = useRef(true)

  // Гість без токена: authResolved одразу в layout effect (до paint), щоб не «висів» скелетон на Login/Sign Up.
  // З токеном: лишаємо скелетон у actions, доки /api/auth/me не відповість.
  useLayoutEffect(() => {
    isMounted.current = true

    const token = localStorage.getItem('auth-token')
    if (!token) {
      setIsLoggedIn(false)
      setUserName('')
      setAuthResolved(true)
      return () => {
        isMounted.current = false
      }
    }

    let cancelled = false

    ;(async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'same-origin',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (cancelled || !isMounted.current) return

        if (response.ok) {
          const data = await response.json()
          setIsLoggedIn(true)
          setUserName(data.user?.firstName || '')
        } else {
          localStorage.removeItem('auth-token')
          setIsLoggedIn(false)
          setUserName('')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        if (!cancelled && isMounted.current) {
          setIsLoggedIn(false)
          setUserName('')
        }
      } finally {
        if (!cancelled && isMounted.current) {
          setAuthResolved(true)
        }
      }
    })()

    return () => {
      cancelled = true
      isMounted.current = false
    }
  }, [])

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    }
    localStorage.removeItem('auth-token')
    setIsLoggedIn(false)
    setUserName('')
    window.location.href = '/login'
  }

  // Navigation items
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/faq', label: 'FAQ' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <Link href={authResolved && isLoggedIn ? '/wallet' : '/'} className={styles.logo}>
          {(process.env.NEXT_PUBLIC_COMPANY_NAME || 'AURA').split(' ')[0]}
        </Link>

        <nav className={styles.desktopNav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${pathname === item.href ? styles.active : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          {!authResolved ? (
            <>
              <div className={styles.skeletonBtn} aria-hidden />
              <div className={styles.skeletonBtn} aria-hidden />
            </>
          ) : isLoggedIn ? (
            <>
              <button type="button" className={styles.iconBtn}>
                <span className="material-symbols-outlined">shopping_bag</span>
              </button>
              <div className={styles.userMenu}>
                <Link href="/dashboard/profile" className={styles.userBtn}>
                  <span className="material-symbols-outlined">account_circle</span>
                  <span className={styles.userName}>{userName || 'Account'}</span>
                </Link>
                <div className={styles.dropdown}>
                  <Link href="/dashboard/profile">Profile</Link>
                  <button type="button" onClick={handleLogout}>Logout</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.loginBtn}>Login</Link>
              <Link href="/register" className={styles.signupBtn}>Sign Up</Link>
            </>
          )}

          <button
            type="button"
            className={styles.mobileMenuBtn}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="material-symbols-outlined">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.mobileMenuContent}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.mobileNavLink}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {authResolved && !isLoggedIn && (
            <div className={styles.mobileAuthBtns}>
              <Link href="/login" className={styles.mobileLoginBtn} onClick={() => setIsMobileMenuOpen(false)}>
                Login
              </Link>
              <Link href="/register" className={styles.mobileSignupBtn} onClick={() => setIsMobileMenuOpen(false)}>
                Sign Up
              </Link>
            </div>
          )}
          {authResolved && isLoggedIn && (
            <button type="button" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className={styles.mobileLogoutBtn}>
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  )
}