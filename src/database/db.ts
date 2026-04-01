import * as SQLite from 'expo-sqlite';
import { ZellerCustomer } from '../types';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('zeller_customers.db');
  }
  return db;
}

export async function initDatabase(): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    `CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      role TEXT NOT NULL,
      synced INTEGER DEFAULT 0
    )`
  );
}

export async function getAllCustomers(): Promise<ZellerCustomer[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<{
    id: string;
    name: string;
    email: string;
    role: string;
  }>('SELECT id, name, email, role FROM customers');
  return rows.map(mapRowToCustomer);
}

export async function getCustomersByRole(role: string): Promise<ZellerCustomer[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<{
    id: string;
    name: string;
    email: string;
    role: string;
  }>('SELECT id, name, email, role FROM customers WHERE role = ?', [role]);
  return rows.map(mapRowToCustomer);
}

export async function searchCustomers(query: string): Promise<ZellerCustomer[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<{
    id: string;
    name: string;
    email: string;
    role: string;
  }>('SELECT id, name, email, role FROM customers WHERE name LIKE ?', [`%${query}%`]);
  return rows.map(mapRowToCustomer);
}

export async function insertCustomer(customer: ZellerCustomer): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    'INSERT INTO customers (id, name, email, role, synced) VALUES (?, ?, ?, ?, 0)',
    [customer.id, customer.name, customer.email, customer.role]
  );
}

export async function insertCustomers(customers: ZellerCustomer[]): Promise<void> {
  const database = await getDatabase();
  for (const customer of customers) {
    await database.runAsync(
      'INSERT OR REPLACE INTO customers (id, name, email, role, synced) VALUES (?, ?, ?, ?, 1)',
      [customer.id, customer.name, customer.email, customer.role]
    );
  }
}

export async function updateCustomer(customer: ZellerCustomer): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    'UPDATE customers SET name = ?, email = ?, role = ? WHERE id = ?',
    [customer.name, customer.email, customer.role, customer.id]
  );
}

export async function deleteCustomer(id: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM customers WHERE id = ?', [id]);
}

export async function clearRemoteCustomers(): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM customers WHERE synced = 1');
}

function mapRowToCustomer(row: {
  id: string;
  name: string;
  email: string;
  role: string;
}): ZellerCustomer {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role as ZellerCustomer['role'],
  };
}
