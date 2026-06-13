'use client'
import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { dashboardRoutes } from '@/lib/routes'
import styles from './page.module.scss'

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const [transactionData, setTransactionData] = useState({
    transactionId: 'TXN-8472-FASHINTOR',
    date: 'Oct 24, 2024',
    time: '14:32 CET',
    amount: '500.00',
    newBalance: '12,500.00',
    paymentMethod: 'Visa **** 1234',
    status: 'Completed'
  })
  
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
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
    
    try {
      const { jsPDF } = await import('jspdf')
      
      const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'WALLETOR LTD'
      const doc = new jsPDF({ unit: 'pt', format: 'a4' })
      
      const pageW = doc.internal.pageSize.getWidth()
      const margin = 56
      let y = 60

      // Header bar
      doc.setFillColor(254, 214, 91)
      doc.rect(0, 0, pageW, 8, 'F')

      // Company name
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(22)
      doc.setTextColor(0, 0, 0)
      doc.text(companyName.toUpperCase(), margin, y)
      y += 28

      // Subtitle
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)
      doc.setTextColor(100, 100, 100)
      doc.text('TRANSACTION RECEIPT', margin, y)
      y += 36

      // Divider
      doc.setDrawColor(220, 220, 220)
      doc.setLineWidth(0.5)
      doc.line(margin, y, pageW - margin, y)
      y += 28

      // Status badge
      doc.setFillColor(240, 255, 240)
      doc.roundedRect(margin, y, pageW - margin * 2, 44, 6, 6, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(13)
      doc.setTextColor(22, 120, 22)
      doc.text('✓  Payment Successful', margin + 16, y + 27)
      y += 68

      // New Balance section
      doc.setFillColor(251, 249, 249)
      doc.roundedRect(margin, y, pageW - margin * 2, 72, 6, 6, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.setTextColor(120, 120, 120)
      doc.text('NEW WALLET BALANCE', margin + 16, y + 22)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(28)
      doc.setTextColor(0, 0, 0)
      doc.text(`€${transactionData.newBalance}`, margin + 16, y + 54)
      y += 96

      // Transaction details heading
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.setTextColor(120, 120, 120)
      doc.text('TRANSACTION DETAILS', margin, y)
      y += 10
      doc.setDrawColor(220, 220, 220)
      doc.line(margin, y, pageW - margin, y)
      y += 18

      // Detail rows
      const rows = [
        ['Transaction ID', transactionData.transactionId],
        ['Date & Time', `${transactionData.date} - ${transactionData.time}`],
        ['Payment Method', transactionData.paymentMethod],
        ['Amount Added', `€${transactionData.amount}`],
        ['Status', transactionData.status],
      ]

      rows.forEach(([label, value], i) => {
        const rowY = y + i * 36
        if (i % 2 === 0) {
          doc.setFillColor(248, 248, 248)
          doc.rect(margin, rowY - 12, pageW - margin * 2, 36, 'F')
        }
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(11)
        doc.setTextColor(80, 80, 80)
        doc.text(label, margin + 12, rowY + 12)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(0, 0, 0)
        const valW = doc.getTextWidth(value)
        doc.text(value, pageW - margin - 12 - valW, rowY + 12)
      })

      y += rows.length * 36 + 28

      // Footer divider
      doc.setDrawColor(220, 220, 220)
      doc.line(margin, y, pageW - margin, y)
      y += 20

      // Footer text
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(150, 150, 150)
      doc.text(`Thank you for using ${companyName}`, margin, y)
      doc.text(
        `Generated: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`,
        pageW - margin,
        y,
        { align: 'right' }
      )

      // Bottom bar
      doc.setFillColor(254, 214, 91)
      doc.rect(0, doc.internal.pageSize.getHeight() - 8, pageW, 8, 'F')

      doc.save(`receipt_${transactionData.transactionId}.pdf`)

    } catch (error) {
      console.error('Failed to download PDF receipt:', error)
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
      <div className={styles.bgDecorations}>
        <div className={styles.bgBlur1}></div>
        <div className={styles.bgBlur2}></div>
      </div>

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.cardHighlight}></div>

          <div className={styles.heroSection}>
            <div className={styles.successIcon}>
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <h1 className={styles.title}>Payment Successful</h1>
            <p className={styles.subtitle}>Your balance has been updated</p>
          </div>

          <div className={styles.balanceSection}>
            <p className={styles.balanceLabel}>NEW WALLET BALANCE</p>
            <p className={styles.balanceAmount}>€{transactionData.newBalance}</p>
          </div>

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

          <div className={styles.trustSection}>
            <div className={styles.securityNote}>
              <span className="material-symbols-outlined">lock</span>
              <p>ALL TRANSACTIONS ARE ENCRYPTED AND PROTECTED</p>
            </div>
            <div className={styles.paymentBadges}>
              <Image
                src="/visa-logo.svg"
                alt="Visa"
                width={64}
                height={40}
                className={styles.badgeLogo}
              />
              <Image
                src="/ma_symbol.svg"
                alt="Mastercard"
                width={52}
                height={40}
                className={styles.badgeLogo}
              />
              <Image
                src="/pci-dss-compliant-logo-vector.svg"
                alt="PCI DSS Compliant"
                width={52}
                height={40}
                className={styles.badgeLogo}
              />
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