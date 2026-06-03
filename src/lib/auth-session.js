/** Clear server cookie + client token storage */
export async function clearAuthSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth-token')
    window.dispatchEvent(new Event('auth-change'))
  }

  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
  } catch (err) {
    console.error('Logout request failed:', err)
  }
}
