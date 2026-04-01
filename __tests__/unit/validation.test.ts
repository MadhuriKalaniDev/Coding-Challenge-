import { validateName, validateEmail, validateCustomerForm } from '../../src/utils/validation';

describe('validateName', () => {
  it('should return error for empty name', () => {
    expect(validateName('')).toBe('Name is required');
  });

  it('should return error for name with special characters', () => {
    expect(validateName('John@Doe')).toBe('Name must contain only alphabets and spaces');
  });

  it('should return error for name with numbers', () => {
    expect(validateName('John123')).toBe('Name must contain only alphabets and spaces');
  });

  it('should return error for name exceeding 50 characters', () => {
    const longName = 'A'.repeat(51);
    expect(validateName(longName)).toBe('Name must be at most 50 characters');
  });

  it('should return null for valid name', () => {
    expect(validateName('John Doe')).toBeNull();
  });

  it('should return null for name with only spaces between words', () => {
    expect(validateName('John Michael Doe')).toBeNull();
  });

  it('should return error for whitespace-only name', () => {
    expect(validateName('   ')).toBe('Name is required');
  });
});

describe('validateEmail', () => {
  it('should return null for empty email (optional field)', () => {
    expect(validateEmail('')).toBeNull();
  });

  it('should return error for invalid email', () => {
    expect(validateEmail('notanemail')).toBe('Please enter a valid email address');
  });

  it('should return error for email without domain', () => {
    expect(validateEmail('test@')).toBe('Please enter a valid email address');
  });

  it('should return error for email without @', () => {
    expect(validateEmail('testexample.com')).toBe('Please enter a valid email address');
  });

  it('should return null for valid email', () => {
    expect(validateEmail('test@example.com')).toBeNull();
  });

  it('should return null for valid email with subdomain', () => {
    expect(validateEmail('user@mail.example.com')).toBeNull();
  });
});

describe('validateCustomerForm', () => {
  it('should return empty object for valid form', () => {
    const result = validateCustomerForm({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: 'Admin',
    });
    expect(result).toEqual({});
  });

  it('should return errors for empty first and last names', () => {
    const result = validateCustomerForm({
      firstName: '',
      lastName: '',
      email: '',
      role: 'Manager',
    });
    expect(result).toHaveProperty('firstName');
    expect(result).toHaveProperty('lastName');
  });

  it('should validate email when provided', () => {
    const result = validateCustomerForm({
      firstName: 'John',
      lastName: 'Doe',
      email: 'invalid-email',
      role: 'Admin',
    });
    expect(result).toHaveProperty('email');
  });

  it('should accept empty email', () => {
    const result = validateCustomerForm({
      firstName: 'John',
      lastName: 'Doe',
      email: '',
      role: 'Admin',
    });
    expect(result).not.toHaveProperty('email');
  });

  it('should return error for firstName with numbers', () => {
    const result = validateCustomerForm({
      firstName: 'John123',
      lastName: 'Doe',
      email: '',
      role: 'Admin',
    });
    expect(result).toHaveProperty('firstName');
  });
});
