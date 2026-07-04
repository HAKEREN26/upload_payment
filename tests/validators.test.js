const test = require('node:test');
const assert = require('node:assert/strict');
const { isValidEmail, isValidPhone, isValidFile, validateForm, SERVICE_OPTIONS, DEFAULT_SERVICE } = require('../src/lib/validators');

test('isValidEmail accepts empty string (optional field)', () => {
  assert.equal(isValidEmail(''), true);
});

test('isValidEmail accepts a well-formed address', () => {
  assert.equal(isValidEmail('worker@example.com'), true);
});

test('isValidEmail rejects a malformed address', () => {
  assert.equal(isValidEmail('not-an-email'), false);
});

test('isValidPhone accepts a well-formed number', () => {
  assert.equal(isValidPhone('050-1234567'), true);
});

test('isValidPhone rejects a too-short value', () => {
  assert.equal(isValidPhone('123'), false);
});

test('isValidPhone rejects separators with no digits', () => {
  assert.equal(isValidPhone('-------'), false);
});

test('isValidPhone rejects too few digits padded with separators', () => {
  assert.equal(isValidPhone('05-----'), false);
});

test('isValidPhone rejects a number with too many digits (13)', () => {
  assert.equal(isValidPhone('0506561651616'), false);
});

test('isValidPhone rejects a 9-digit number without a leading zero', () => {
  assert.equal(isValidPhone('501234567'), false);
});

test('isValidPhone rejects a 12-digit number with the 972 country code', () => {
  assert.equal(isValidPhone('+972501234567'), false);
});

test('isValidPhone accepts a well-formed number without dashes', () => {
  assert.equal(isValidPhone('0501234567'), true);
});

test('isValidPhone rejects a 10-digit number not starting with 0', () => {
  assert.equal(isValidPhone('1501234567'), false);
});

test('isValidFile rejects a missing file', () => {
  assert.equal(isValidFile(null), false);
});

test('isValidFile rejects a file over 20MB', () => {
  assert.equal(isValidFile({ size: 21 * 1024 * 1024, type: 'image/png' }), false);
});

test('isValidFile rejects an unsupported type', () => {
  assert.equal(isValidFile({ size: 1000, type: 'application/zip' }), false);
});

test('isValidFile accepts a PDF under the size limit', () => {
  assert.equal(isValidFile({ size: 1000, type: 'application/pdf' }), true);
});

test('isValidFile accepts an image under the size limit', () => {
  assert.equal(isValidFile({ size: 1000, type: 'image/jpeg' }), true);
});

test('validateForm requires name, passportId, phone, service, and file; email is optional', () => {
  const errors = validateForm({ name: '', passportId: '', phone: '', email: '', service: '', file: null });
  assert.equal(errors.name, 'Full name is required');
  assert.equal(errors.passportId, 'Passport/ID is required');
  assert.equal(errors.phone, 'Phone is required');
  assert.equal(errors.service, 'Please select a service');
  assert.equal(errors.file, 'Please attach proof of bank transfer');
  assert.equal(errors.email, undefined);
});

test('validateForm passes with required fields filled and no email', () => {
  const errors = validateForm({
    name: 'Maria Santos',
    passportId: 'AB1234567',
    phone: '050-1234567',
    email: '',
    service: DEFAULT_SERVICE,
    file: { size: 1000, type: 'image/jpeg' },
  });
  assert.deepEqual(errors, {});
});

test('validateForm flags an invalid email only when one is provided', () => {
  const errors = validateForm({
    name: 'Maria Santos',
    passportId: 'AB1234567',
    phone: '050-1234567',
    email: 'not-an-email',
    service: DEFAULT_SERVICE,
    file: { size: 1000, type: 'image/jpeg' },
  });
  assert.equal(errors.email, 'Enter a valid email address');
});

test('validateForm rejects a service value outside SERVICE_OPTIONS', () => {
  const errors = validateForm({
    name: 'Maria Santos',
    passportId: 'AB1234567',
    phone: '050-1234567',
    email: '',
    service: 'Not A Real Service',
    file: { size: 1000, type: 'image/jpeg' },
  });
  assert.equal(errors.service, 'Please select a service');
});

test('validateForm accepts any option from SERVICE_OPTIONS', () => {
  for (const service of SERVICE_OPTIONS) {
    const errors = validateForm({
      name: 'Maria Santos',
      passportId: 'AB1234567',
      phone: '050-1234567',
      email: '',
      service,
      file: { size: 1000, type: 'image/jpeg' },
    });
    assert.equal(errors.service, undefined, `expected "${service}" to be a valid service`);
  }
});

test('DEFAULT_SERVICE is Salary Rights Calculation', () => {
  assert.equal(DEFAULT_SERVICE, 'Salary Rights Calculation');
});
