'use client'
import styles from './VirtualCard.module.scss'

export default function VirtualCard({ cardNumber = '**** **** **** 8829', expiry = '12/28' }) {
  return (
    <div className={styles.card}>
      <div className={styles.bgOverlay}></div>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.logo}>{(process.env.NEXT_PUBLIC_COMPANY_NAME || 'AURA').split(' ')[0]}</div>
          <span className="material-symbols-outlined">contactless</span>
        </div>
        <div className={styles.cardInfo}>
          <div className={styles.cardNumber}>{cardNumber}</div>
          <div className={styles.details}>
            <div>Valued Member</div>
            <div>Exp {expiry}</div>
          </div>
        </div>
      </div>
      <div className={styles.blurEffect}></div>
    </div>
  )
}