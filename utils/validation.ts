import { UserRole } from '../types';

export function validateName(name: string): string | null {
  if (!name || name.trim().length === 0) {
    return 'Name is required';
  }
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return 'Name must contain only alphabets and spaces';
  }
  if (name.length > 50) {
    return 'Name must be at most 50 characters';
  }
  return null;
}

export function validateEmail(email: string): string | null {
  if (!email || email.trim().length === 0) {
    return null;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
}

export function validateCustomerForm(data: {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}): Record<string, string> {
  const errors: Record<string, string> = {};

  const firstNameError = validateName(data.firstName);
  if (firstNameError) {
    errors.firstName = firstNameError;
  }

  const lastNameError = validateName(data.lastName);
  if (lastNameError) {
    errors.lastName = lastNameError;
  }

  const emailError = validateEmail(data.email);
  if (emailError) {
    errors.email = emailError;
  }

  return errors;
}
