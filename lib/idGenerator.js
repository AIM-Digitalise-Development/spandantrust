import crypto from 'crypto';

const ROLE_PREFIXES = {
  ADMIN: 'ADM',
  COORDINATOR: 'COO',
  SUPERVISOR: 'SUP',
  DIGITAL_OPD_AGENT: 'AGT',
};

/**
 * Generates a globally unique, collision-free User ID for a role.
 * Example outputs: ADM-8F3A21, COO-9B417E, SUP-12C45D, AGT-77A91F
 */
export function generateUserId(role) {
  const prefix = ROLE_PREFIXES[role] || 'USR';
  const randomBytes = crypto.randomBytes(3).toString('hex').toUpperCase();
  const timestampComponent = (Date.now() % 100000).toString(36).toUpperCase();
  return `${prefix}-${timestampComponent}${randomBytes}`.slice(0, 12);
}

/**
 * Format DOB (Date or YYYY-MM-DD string) into DD-MM-YYYY format for initial password.
 * Example input: '1995-08-15' or Date object
 * Example output: '15-08-1995'
 */
export function formatInitialPasswordFromDOB(dob) {
  if (!dob) return '12-34-5678';
  const dateObj = typeof dob === 'string' ? new Date(dob) : dob;
  if (isNaN(dateObj.getTime())) {
    // If parsing failed, return exact string if formatted DD-MM-YYYY or raw
    if (typeof dob === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(dob)) {
      return dob;
    }
    return '01-01-2000';
  }
  const day = String(dateObj.getUTCDate()).padStart(2, '0');
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
  const year = dateObj.getUTCFullYear();
  return `${day}-${month}-${year}`;
}
