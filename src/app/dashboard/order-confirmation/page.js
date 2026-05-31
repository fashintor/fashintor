'use client'
import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { dashboardRoutes } from '@/lib/routes'
import styles from './page.module.scss'

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const [transactionData, setTransactionData] = useState({
    transactionId: 'TXN-8472-AURA',
    date: 'Oct 24, 2024',
    time: '14:32 CET',
    amount: '500.00',
    newBalance: '12,500.00',
    paymentMethod: 'Visa **** 1234',
    status: 'Completed'
  })
  
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    // Get transaction data from URL params or localStorage
    const txId = searchParams.get('tx')
    const amount = searchParams.get('amount')
    const currency = searchParams.get('currency')
    const newBalance = searchParams.get('newBalance')
    
    if (amount) {
      setTransactionData(prev => ({
        ...prev,
        amount: parseFloat(amount).toFixed(2),
        transactionId: txId || prev.transactionId,
        newBalance: newBalance ? parseFloat(newBalance).toFixed(2) : prev.newBalance
      }))
    }
    
    // In real app, fetch transaction details from API
    const fetchTransactionDetails = async () => {
      try {
        if (txId) {
          const response = await fetch(`/api/transactions/${txId}`)
          if (response.ok) {
            const data = await response.json()
            setTransactionData(prev => ({
              ...prev,
              ...data,
              amount:
                data.amount != null && !Number.isNaN(parseFloat(data.amount))
                  ? parseFloat(data.amount).toFixed(2)
                  : prev.amount,
              newBalance:
                data.newBalance != null &&
                data.newBalance !== '' &&
                !Number.isNaN(parseFloat(data.newBalance))
                  ? parseFloat(data.newBalance).toFixed(2)
                  : prev.newBalance
            }))
          }
        }
      } catch (error) {
        console.error('Failed to fetch transaction:', error)
      }
    }
    
    if (txId) {
      fetchTransactionDetails()
    }
  }, [searchParams])

  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    
    // Simulate PDF generation
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In production, this would call an API to generate PDF
      console.log('Downloading receipt...', transactionData)
      
      // Create a simple text receipt for demo
      const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'AURA FINANCE'
      const receipt = `
        ${companyName.toUpperCase()} - TRANSACTION RECEIPT
        =================================
        Transaction ID: ${transactionData.transactionId}
        Date: ${transactionData.date}
        Time: ${transactionData.time}
        Amount: €${transactionData.amount}
        Payment Method: ${transactionData.paymentMethod}
        Status: ${transactionData.status}
        New Balance: €${transactionData.newBalance}
        =================================
        Thank you for using ${companyName}
      `
      
      // Create blob and download
      const blob = new Blob([receipt], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `receipt_${transactionData.transactionId}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Failed to download receipt:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleGoToWallet = () => {
    window.location.href = dashboardRoutes.wallet
  }

  const handleCreateVirtualCard = () => {
    window.location.href = dashboardRoutes.cards
  }

  return (
    <div className={styles.container}>
      {/* Decorative Background Elements */}
      <div className={styles.bgDecorations}>
        <div className={styles.bgBlur1}></div>
        <div className={styles.bgBlur2}></div>
      </div>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Central Card Container */}
        <div className={styles.card}>
          {/* Glassmorphic Inner Highlight */}
          <div className={styles.cardHighlight}></div>

          {/* Hero Success Section */}
          <div className={styles.heroSection}>
            <div className={styles.successIcon}>
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <h1 className={styles.title}>Payment Successful</h1>
            <p className={styles.subtitle}>Your balance has been updated</p>
          </div>

          {/* Balance Update Section */}
          <div className={styles.balanceSection}>
            <p className={styles.balanceLabel}>NEW WALLET BALANCE</p>
            <p className={styles.balanceAmount}>€{transactionData.newBalance}</p>
          </div>

          {/* Transaction Details */}
          <div className={styles.transactionSection}>
            <p className={styles.sectionTitle}>TRANSACTION DETAILS</p>
            <div className={styles.detailsList}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Transaction ID</span>
                <span className={styles.detailValue}>{transactionData.transactionId}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Date & Time</span>
                <span className={styles.detailValue}>
                  {transactionData.date} - {transactionData.time}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Payment Method</span>
                <div className={styles.paymentMethod}>
                  <span className="material-symbols-outlined">credit_card</span>
                  <span className={styles.detailValue}>{transactionData.paymentMethod}</span>
                </div>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Amount Added</span>
                <span className={`${styles.detailValue} ${styles.amount}`}>
                  €{transactionData.amount}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Status</span>
                <div className={styles.statusBadge}>
                  <span className={styles.statusDot}></span>
                  <span className={styles.statusText}>{transactionData.status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Receipt Action */}
          <div className={styles.receiptSection}>
            <div className={styles.receiptInfo}>
              <span className="material-symbols-outlined">mark_email_read</span>
              <p>A confirmation email with your receipt has been sent.</p>
            </div>
            <button 
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className={styles.downloadBtn}
            >
              <span className="material-symbols-outlined">download</span>
              <span>{isDownloading ? 'GENERATING...' : 'DOWNLOAD PDF'}</span>
            </button>
          </div>

          {/* Next Actions */}
          <div className={styles.actionsSection}>
            <button 
              onClick={handleGoToWallet}
              className={styles.primaryBtn}
            >
              GO TO WALLET
            </button>
            <button 
              onClick={handleCreateVirtualCard}
              className={styles.secondaryBtn}
            >
              GET A CARD
            </button>
          </div>

          {/* Trust/Security Section */}
          <div className={styles.trustSection}>
            <div className={styles.securityNote}>
              <span className="material-symbols-outlined">lock</span>
              <p>ALL TRANSACTIONS ARE ENCRYPTED AND PROTECTED</p>
            </div>
            <div className={styles.paymentBadges}>
              <span>VISA</span>
              <span>MASTERCARD</span>
              <span>PCI DSS</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function OrderConfirmation() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  )
}