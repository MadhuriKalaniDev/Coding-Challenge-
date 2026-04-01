import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CustomerItem } from '../../src/components/CustomerItem';
import { RoleSelector } from '../../src/components/RoleSelector';

// Mock reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

describe('CustomerItem', () => {
  const mockCustomer = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin' as const,
  };

  it('should render customer name', () => {
    const { getByText } = render(
      <CustomerItem customer={mockCustomer} onPress={jest.fn()} onDelete={jest.fn()} />
    );
    expect(getByText('John Doe')).toBeTruthy();
  });

  it('should render first letter avatar', () => {
    const { getByText } = render(
      <CustomerItem customer={mockCustomer} onPress={jest.fn()} onDelete={jest.fn()} />
    );
    expect(getByText('J')).toBeTruthy();
  });

  it('should show role tag for Admin when showRole is true', () => {
    const { getByText } = render(
      <CustomerItem customer={mockCustomer} onPress={jest.fn()} onDelete={jest.fn()} showRole={true} />
    );
    expect(getByText('Admin')).toBeTruthy();
  });

  it('should not show role tag when showRole is false', () => {
    const { queryByText } = render(
      <CustomerItem customer={mockCustomer} onPress={jest.fn()} onDelete={jest.fn()} showRole={false} />
    );
    // "Admin" should not appear as a role tag (it may appear in name if name contained it)
    // Since name is "John Doe", Admin should not be present
    expect(queryByText('Admin')).toBeNull();
  });

  it('should not show role tag for Manager even when showRole is true', () => {
    const managerCustomer = { ...mockCustomer, role: 'Manager' as const };
    const { queryByText } = render(
      <CustomerItem customer={managerCustomer} onPress={jest.fn()} onDelete={jest.fn()} showRole={true} />
    );
    expect(queryByText('Manager')).toBeNull();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <CustomerItem customer={mockCustomer} onPress={onPress} onDelete={jest.fn()} />
    );
    fireEvent.press(getByTestId('customer-item-1'));
    expect(onPress).toHaveBeenCalled();
  });
});

describe('RoleSelector', () => {
  it('should render Admin and Manager options', () => {
    const { getByText } = render(
      <RoleSelector value="Admin" onChange={jest.fn()} />
    );
    expect(getByText('Admin')).toBeTruthy();
    expect(getByText('Manager')).toBeTruthy();
  });

  it('should call onChange when a role is selected', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <RoleSelector value="Admin" onChange={onChange} />
    );
    fireEvent.press(getByTestId('role-Manager'));
    expect(onChange).toHaveBeenCalledWith('Manager');
  });
});
