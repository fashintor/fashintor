import Image from 'next/image'
import styles from './PaymentLogos.module.scss'

export default function PaymentLogos({ className = '' }) {
  return (
    <div className={`${styles.logos} ${className}`.trim()}>
      <div className={styles.logoItem}>
        <Image
          src="/pci-dss-compliant-logo-vector.svg"
          alt="PCI DSS Compliant"
          width={40}
          height={40}
          className={styles.pciImage}
        />
      </div>
      <div className={styles.logoItem}>
        <Image
          src="/visa-logo.svg"
          alt="Visa"
          width={50}
          height={35}
          className={styles.visaImage}
        />
      </div>
      <div className={styles.logoItem}>
        <Image
          src="/ma_symbol.svg"
          alt="Mastercard"
          width={50}
          height={35}
          className={styles.mastercardImage}
        />
      </div>
    </div>
  )
}
