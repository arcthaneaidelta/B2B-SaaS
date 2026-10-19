export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePostcode(code: string, country: string = 'US'): boolean {
  if (!code || !code.trim()) return false;
  const clean = code.trim().toUpperCase();
  if (country === 'US') {
    return /^\d{5}(-\d{4})?$/.test(clean);
  }
  if (country === 'UK') {
    return /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/.test(clean);
  }
  if (country === 'CA') {
    return /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/.test(clean);
  }
  return clean.length >= 3;
}

export function validateDriveUrl(url: string): boolean {
  if (!url) return false;
  return /drive\.google\.com\/(file\/d\/|drive\/folders\/|open\?id=)[a-zA-Z0-9_-]+/.test(url) || url.startsWith('https://');
}

export function validateCsvHeaders(headerRow: string): { valid: boolean; missing: string[] } {
  const normalized = headerRow.toLowerCase().split(',').map(h => h.trim());
  const required = ['recipient_name', 'recipient_address', 'city', 'postcode', 'account_id'];
  const missing = required.filter(r => !normalized.some(h => h.includes(r) || h.includes(r.replace('_', ''))));
  return {
    valid: missing.length === 0,
    missing,
  };
}
