const test = require('node:test');
const assert = require('node:assert/strict');
const { isValidEmail, isValidPhone, isValidFile, validateForm } = require('../src/lib/validators');

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

test('validateForm requires name, phone, and file; email is optional', () => {
  const errors = validateForm({ name: '', phone: '', email: '', file: null });
  assert.equal(errors.name, 'Full name is required');
  assert.equal(errors.phone, 'Phone is required');
  assert.equal(errors.file, 'Please attach proof of bank transfer');
  assert.equal(errors.email, undefined);
});

test('validateForm passes with required fields filled and no email', () => {
  const errors = validateForm({
    name: 'Maria Santos',
    phone: '050-1234567',
    email: '',
    file: { size: 1000, type: 'image/jpeg' },
  });
  assert.deepEqual(errors, {});
});

test('validateForm flags an invalid email only when one is provided', () => {
  const errors = validateForm({
    name: 'Maria Santos',
    phone: '050-1234567',
    email: 'not-an-email',
    file: { size: 1000, type: 'image/jpeg' },
  });
  assert.equal(errors.email, 'Enter a valid email address');
});
