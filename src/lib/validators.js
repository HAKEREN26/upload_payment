function isValidEmail(value) {
  if (!value) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidPhone(value) {
  const trimmed = (value || '').trim();
  if (!/^[\d\s\-\+\(\)]{7,15}$/.test(trimmed)) return false;
  const digitCount = (trimmed.match(/\d/g) || []).length;
  // Israeli numbers: 9 digits (no leading 0), 10 digits (local, leading 0),
  // or 12 digits (with 972 country code, with or without a leading +).
  return digitCount >= 9 && digitCount <= 12;
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
