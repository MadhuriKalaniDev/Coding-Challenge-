export interface ZellerCustomer {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager';
}

export type UserRole = 'Admin' | 'Manager';

export interface ZellerCustomerConnection {
  items: ZellerCustomer[];
  nextToken: string | null;
}
