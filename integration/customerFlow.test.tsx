import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({ id: '1' }),
  Stack: ({ children }: any) => children,
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
  SafeAreaProvider: ({ children }: any) => children,
}));

// Mock reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock Apollo
jest.mock('@apollo/client', () => ({
  gql: jest.fn((strings: TemplateStringsArray) => strings[0]),
}));

jest.mock('@apollo/client/react', () => ({
  useQuery: () => ({
    data: null,
    loading: false,
    error: null,
    refetch: jest.fn(),
  }),
  ApolloProvider: ({ children }: any) => children,
}));

// Mock expo-sqlite
const mockDb = {
  runAsync: jest.fn(),
  getAllAsync: jest.fn().mockResolvedValue([]),
  execAsync: jest.fn(),
};

jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn().mockResolvedValue(mockDb),
}));

// Mock uuid
jest.mock('uuid', () => ({
  v4: () => 'test-uuid-123',
}));

import { validateCustomerForm } from '../../src/utils/validation';

describe('Customer Form Integration', () => {
  it('should validate and reject invalid form data', () => {
    const errors = validateCustomerForm({
      firstName: '',
      lastName: '',
      email: 'bad-email',
      role: 'Admin',
    });
    expect(Object.keys(errors).length).toBeGreaterThan(0);
    expect(errors.firstName).toBeDefined();
    expect(errors.lastName).toBeDefined();
    expect(errors.email).toBeDefined();
  });

  it('should validate and accept valid form data', () => {
    const errors = validateCustomerForm({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      role: 'Manager',
    });
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('should validate form with special characters in name', () => {
    const errors = validateCustomerForm({
      firstName: 'Jane!',
      lastName: 'Smith@123',
      email: 'jane@example.com',
      role: 'Admin',
    });
    expect(errors.firstName).toBeDefined();
    expect(errors.lastName).toBeDefined();
  });

  it('should allow empty email in form', () => {
    const errors = validateCustomerForm({
      firstName: 'Jane',
      lastName: 'Smith',
      email: '',
      role: 'Manager',
    });
    expect(errors.email).toBeUndefined();
  });
});

describe('Customer Database Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDb.getAllAsync.mockResolvedValue([]);
  });

  it('should initialize database and fetch customers', async () => {
    const db = require('../../src/database/db');
    await db.initDatabase();
    expect(mockDb.runAsync).toHaveBeenCalled();
  });

  it('should insert and retrieve customers', async () => {
    const db = require('../../src/database/db');

    const customer = {
      id: '1',
      name: 'Test User',
      email: 'test@test.com',
      role: 'Admin',
    };

    await db.initDatabase();
    await db.insertCustomer(customer);
    expect(mockDb.runAsync).toHaveBeenCalled();

    mockDb.getAllAsync.mockResolvedValueOnce([customer]);
    const customers = await db.getAllCustomers();
    expect(customers).toHaveLength(1);
    expect(customers[0].name).toBe('Test User');
  });

  it('should filter customers by role', async () => {
    const db = require('../../src/database/db');

    const admins = [
      { id: '1', name: 'Admin User', email: 'admin@test.com', role: 'Admin' },
    ];

    mockDb.getAllAsync.mockResolvedValueOnce(admins);
    await db.initDatabase();
    const result = await db.getCustomersByRole('Admin');
    expect(result).toHaveLength(1);
    expect(result[0].role).toBe('Admin');
  });

  it('should search customers by name', async () => {
    const db = require('../../src/database/db');

    const matches = [
      { id: '1', name: 'John Doe', email: 'john@test.com', role: 'Admin' },
    ];

    mockDb.getAllAsync.mockResolvedValueOnce(matches);
    await db.initDatabase();
    const result = await db.searchCustomers('John');
    expect(result).toHaveLength(1);
  });

  it('should delete a customer', async () => {
    const db = require('../../src/database/db');
    await db.initDatabase();
    await db.deleteCustomer('1');
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('DELETE'),
      expect.anything()
    );
  });

  it('should update a customer', async () => {
    const db = require('../../src/database/db');
    await db.initDatabase();
    await db.updateCustomer({
      id: '1',
      name: 'Updated Name',
      email: 'updated@test.com',
      role: 'Manager',
    });
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE'),
      expect.anything()
    );
  });
});
