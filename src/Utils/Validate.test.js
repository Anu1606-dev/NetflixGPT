import { checkValidData } from './Validate';

describe('checkValidData', () => {
  test('returns an error message for an invalid email', () => {
    const result = checkValidData('not-an-email', 'Valid@123');
    expect(result).toBe('Email ID is not valid.');
  });

  test('returns an error message for a weak password', () => {
    const result = checkValidData('test@example.com', 'weak');
    expect(result).toMatch(/Password must be/);
  });

  test('returns null when both email and password are valid', () => {
    const result = checkValidData('test@example.com', 'Valid@123');
    expect(result).toBeNull();
  });
});