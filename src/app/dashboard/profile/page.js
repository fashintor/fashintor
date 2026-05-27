'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.scss'

export default function ProfileDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    street: '',
    city: '',
    postcode: '',
    country: '',
  })

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setFormData({
          firstName: data.user.firstName || '',
          lastName: data.user.lastName || '',
          phone: data.user.phone || '',
          street: data.user.address?.street || '',
          city: data.user.address?.city || '',
          postcode: data.user.address?.postcode || '',
          country: data.user.address?.country || '',
        })
      } else {
        setErrorMsg('Failed to load user profile.')
      }
    } catch (error) {
      console.error('Fetch profile error:', error)
      setErrorMsg('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUpdating(true)
    setSuccessMsg('')
    setErrorMsg('')

    try {
      const response = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: {
            street: formData.street,
            city: formData.city,
            postcode: formData.postcode,
            country: formData.country,
          },
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setIsEditing(false)
        setSuccessMsg('Profile updated successfully.')
        setTimeout(() => setSuccessMsg(''), 4000)
      } else {
        const data = await response.json()
        setErrorMsg(data.error || 'Failed to update profile.')
      }
    } catch (error) {
      console.error('Update profile error:', error)
      setErrorMsg('Failed to connect to the server.')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your Profile…</p>
      </div>
    )
  }

  const getKycStatusLabel = (status) => {
    switch (status) {
      case 'verified':
        return { text: 'Verified', class: styles.statusVerified, icon: 'verified' }
      case 'rejected':
        return { text: 'Rejected', class: styles.statusRejected, icon: 'cancel' }
      case 'pending':
      default:
        return { text: 'Pending Verification', class: styles.statusPending, icon: 'hourglass_empty' }
    }
  }

  const kyc = getKycStatusLabel(user?.kycStatus)

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Account Profile</h1>
          <p className={styles.pageSubtitle}>
            Manage your personal information, address, and verification status.
          </p>
        </div>
      </header>

      {successMsg && <div className={styles.successBar}>{successMsg}</div>}
      {errorMsg && <div className={styles.errorBar}>{errorMsg}</div>}

      <main className={styles.main}>
        {/* Background blur bubbles for glassmorphic design */}
        <div className={styles.blurBubble1}></div>
        <div className={styles.blurBubble2}></div>

        <div className={styles.grid}>
          {/* Left Column: Quick Profile Details */}
          <div className={styles.leftColumn}>
            <section className={`${styles.card} ${styles.profileSummaryCard}`}>
              <div className={styles.avatarContainer}>
                <span className="material-symbols-outlined">account_circle</span>
              </div>
              <h2 className={styles.profileName}>
                {user?.firstName} {user?.lastName}
              </h2>
              <p className={styles.profileEmail}>{user?.email}</p>

              <div className={styles.badgeGrid}>
                {/* Email verification badge */}
                <div className={`${styles.badge} ${user?.emailVerified ? styles.badgeSuccess : styles.badgeWarning}`}>
                  <span className="material-symbols-outlined">
                    {user?.emailVerified ? 'mark_email_read' : 'mail'}
                  </span>
                  <span>{user?.emailVerified ? 'Email Verified' : 'Unverified Email'}</span>
                </div>

                {/* KYC Badge */}
                <div className={`${styles.badge} ${kyc.class}`}>
                  <span className="material-symbols-outlined">{kyc.icon}</span>
                  <span>{kyc.text}</span>
                </div>
              </div>

              <div className={styles.metaInfo}>
                <div className={styles.metaRow}>
                  <span>Member Since</span>
                  <span>
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' }) : '—'}
                  </span>
                </div>
                <div className={styles.metaRow}>
                  <span>Account Type</span>
                  <span>Standard User</span>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Detailed Info Form */}
          <div className={styles.rightColumn}>
            <form onSubmit={handleSubmit} className={styles.card}>
              <div className={styles.formHeader}>
                <h3 className={styles.sectionTitle}>Personal Details</h3>
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className={styles.editBtn}
                  >
                    <span className="material-symbols-outlined">edit</span>
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className={styles.actionBtns}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false)
                        setErrorMsg('')
                      }}
                      className={styles.cancelBtn}
                      disabled={updating}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={styles.saveBtn}
                      disabled={updating}
                    >
                      {updating ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                )}
              </div>

              <div className={styles.formSection}>
                <div className={styles.row}>
                  <div className={styles.formField}>
                    <label className={styles.label}>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.label}>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.formField}>
                    <label className={styles.label}>Email Address</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className={`${styles.input} ${styles.disabledInput}`}
                    />
                    <span className={styles.inputHint}>Email address cannot be changed</span>
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.label}>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="e.g. +380991234567"
                      className={styles.input}
                    />
                  </div>
                </div>
              </div>

              <h3 className={styles.sectionTitle} style={{ marginTop: '2.5rem', borderTop: '1px solid rgba(0, 0, 0, 0.06)', paddingTop: '2rem' }}>
                Residential Address
              </h3>

              <div className={styles.formSection}>
                <div className={styles.formField}>
                  <label className={styles.label}>Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Street name and number"
                    className={styles.input}
                  />
                </div>

                <div className={styles.row}>
                  <div className={styles.formField}>
                    <label className={styles.label}>City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="City"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.label}>Postal Code</label>
                    <input
                      type="text"
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Postcode"
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Country"
                    className={styles.input}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
