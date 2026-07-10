function isValidEmail(value) {
  if (!value) return true;
  // English/ASCII characters only — answers must be in Hebrew or English,
  // and email addresses are English-only by nature.
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value.trim());
}

function isValidPhone(value) {
  const trimmed = (value || '').trim();
  if (!/^[\d\s\-\(\)]{7,12}$/.test(trimmed)) return false;
  // Israeli local format only: 05X-XXXXXXX — a leading 0 followed by 9 more digits (10 digits total).
  const digitsOnly = trimmed.replace(/\D/g, '');
  return /^0\d{9}$/.test(digitsOnly);
}

// Hebrew (א-ת) or English letters, plus spaces/hyphens/apostrophes/periods for names.
const NAME_CHARS_REGEX = /^[a-zA-Zא-ת\s\-'.]+$/;
// Hebrew or English letters plus digits/hyphens/spaces for ID/passport numbers.
const PASSPORT_ID_CHARS_REGEX = /^[a-zA-Z0-9א-ת\s\-]+$/;

function isValidNameChars(value) {
  return NAME_CHARS_REGEX.test((value || '').trim());
}

function isValidPassportIdChars(value) {
  return PASSPORT_ID_CHARS_REGEX.test((value || '').trim());
}

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;
const ALLOWED_FILE_TYPE_PREFIXES = ['image/', 'application/pdf'];

function isValidFile(file) {
  if (!file) return false;
  if (typeof file.size !== 'number' || file.size > MAX_FILE_SIZE_BYTES) return false;
  return ALLOWED_FILE_TYPE_PREFIXES.some(prefix => (file.type || '').startsWith(prefix));
}

const SERVICE_OPTIONS = [
  'Salary Rights Calculation',
  'Visa & Immigration',
  'Pikadon (Deposit) Release',
  'Driver License Conversion',
  'E-Bike & Scooter Plate',
];
const DEFAULT_SERVICE = SERVICE_OPTIONS[0];

function validateForm({ name, passportId, phone, email, service, file }) {
  const errors = {};
  if (!name || !name.trim()) errors.name = 'Full name is required';
  else if (!isValidNameChars(name)) errors.name = 'Full name must be in Hebrew or English only';
  if (!passportId || !passportId.trim()) errors.passportId = 'Passport/ID is required';
  else if (!isValidPassportIdChars(passportId)) errors.passportId = 'Passport/ID must be in Hebrew or English only';
  if (!phone || !phone.trim()) errors.phone = 'Phone is required';
  else if (!isValidPhone(phone)) errors.phone = 'Enter a valid phone number';
  if (email && !isValidEmail(email)) errors.email = 'Enter a valid email address';
  if (!service || !SERVICE_OPTIONS.includes(service)) errors.service = 'Please select a service';
  if (!file) errors.file = 'Please attach proof of bank transfer';
  else if (!isValidFile(file)) errors.file = 'File must be an image or PDF under 20MB';
  return errors;
}

module.exports = {
  isValidEmail,
  isValidPhone,
  isValidFile,
  isValidNameChars,
  isValidPassportIdChars,
  validateForm,
  MAX_FILE_SIZE_BYTES,
  SERVICE_OPTIONS,
  DEFAULT_SERVICE,
};
