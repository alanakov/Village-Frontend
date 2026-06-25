/**
 * Formats a phone number as (XX) XXXXX-XXXX (mobile) or (XX) XXXX-XXXX (landline).
 * Strips non-digits and limits to 11 digits.
 */
export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)

  if (digits.length === 0) return ''
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

/**
 * Normalizes an email: forces lowercase and removes spaces.
 */
export function maskEmail(value: string): string {
  return value.toLowerCase().replace(/\s/g, '')
}
