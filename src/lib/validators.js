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

// Service names and IDs mirror the Origami CRM services list
// (hakeren.origami.ms/-/services/services) — names verbatim, IDs are the
// CRM's Service Number. Keep both in sync with the CRM.
const SERVICE_IDS = {
  'Automatic Calculation': 1,
  'Pay slip calculation': 2,
  'Health Insurance with visa': 3,
  'Health Insurance for tourist': 4,
  'Open legal case labor law': 5,
  'Open legal case injury': 6,
  'Traffic case': 7,
  'Lawyer meeting for advice': 8,
  'Pikadon release': 9,
  'Pikadon check': 10,
  'Driver License Conversion': 11,
  'Driver License Conversion with notary': 12,
  'Car Ownership Transfer': 13,
  'Car insurance': 14,
  'Traffic Fine & tolls Payments': 15,
  'E-Bike and Scooter Registration': 16,
  'Police Clearance Certificate': 17,
  'Apostille & Translation': 18,
  'Visas': 19,
  'DNA test for fatherhood prove': 20,
  'Refugee application': 21,
  'Refugee interview': 22,
  'Refugee status check': 23,
  'Refugee Rescheduling an appointment': 24,
  'Hakeren talk': 25,
  'Hakeren mani': 26,
  'Job Search Counseling': 27,
};
const SERVICE_OPTIONS = Object.keys(SERVICE_IDS);
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
  SERVICE_IDS,
  DEFAULT_SERVICE,
};
