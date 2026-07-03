function isValidEmail(value) {
  if (!value) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidPhone(value) {
  const trimmed = (value || '').trim();
  if (!/^[\d\s\-\(\)]{7,12}$/.test(trimmed)) return false;
  // Israeli local format only: 05X-XXXXXXX — a leading 0 followed by 9 more digits (10 digits total).
  const digitsOnly = trimmed.replace(/\D/g, '');
  return /^0\d{9}$/.test(digitsOnly);
}

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;
const ALLOWED_FILE_TYPE_PREFIXES = ['image/', 'application/pdf'];

function isValidFile(file) {
  if (!file) return false;
  if (typeof file.size !== 'number' || file.size > MAX_FILE_SIZE_BYTES) return false;
  return ALLOWED_FILE_TYPE_PREFIXES.some(prefix => (file.type || '').startsWith(prefix));
}

function validateForm({ name, phone, email, file }) {
  const errors = {};
  if (!name || !name.trim()) errors.name = 'Full name is required';
  if (!phone || !phone.trim()) errors.phone = 'Phone is required';
  else if (!isValidPhone(phone)) errors.phone = 'Enter a valid phone number';
  if (email && !isValidEmail(email)) errors.email = 'Enter a valid email address';
  if (!file) errors.file = 'Please attach proof of bank transfer';
  else if (!isValidFile(file)) errors.file = 'File must be an image or PDF under 20MB';
  return errors;
}

module.exports = { isValidEmail, isValidPhone, isValidFile, validateForm, MAX_FILE_SIZE_BYTES };
