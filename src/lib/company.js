/** Shared company defaults (override via NEXT_PUBLIC_* env vars) */
export const companyDefaults = {
  name: process.env.NEXT_PUBLIC_COMPANY_NAME || 'FASHINTOR',
  registration: process.env.NEXT_PUBLIC_COMPANY_NUMBER || '17207665',
  vat: process.env.NEXT_PUBLIC_COMPANY_VAT || '',
  address:
    process.env.NEXT_PUBLIC_COMPANY_ADDRESS ||
    'Dept 6792, 196 High Road, Wood Green, London, United Kingdom, N22 8HH',
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'info@fashintor.com',
  phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || '+44 7863 779241',
}

export function getCompanyShortName() {
  return (process.env.NEXT_PUBLIC_COMPANY_NAME || 'Fashintor').split(' ')[0]
}
