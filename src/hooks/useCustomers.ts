import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@apollo/client/react';
import { LIST_ZELLER_CUSTOMERS } from '../graphql/queries';
import * as db from '../database/db';
import { ZellerCustomer, UserRole } from '../types';

export function useCustomers() {
  const [customers, setCustomers] = useState<ZellerCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'All' | 'Admin' | 'Manager'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, loading: networkLoading, error: queryError, refetch } = useQuery<{
    listZellerCustomers: { items: ZellerCustomer[]; nextToken: string | null };
  }>(LIST_ZELLER_CUSTOMERS, {
    variables: { limit: 100 },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (queryError) {
      console.warn('GraphQL fetch failed, using local data:', queryError.message);
    }
  }, [queryError]);

  // Sync remote data to local DB
  useEffect(() => {
    if (data?.listZellerCustomers?.items) {
      const syncData = async () => {
        try {
          await db.initDatabase();
          const remoteCustomers = data.listZellerCustomers.items.map((item: any) => ({
            ...item,
            synced: true,
          }));
          await db.insertCustomers(remoteCustomers);
          await loadCustomers();
        } catch (e) {
          console.error('Sync error:', e);
        }
      };
      syncData();
    }
  }, [data]);

  // Load from local DB on mount
  useEffect(() => {
    const init = async () => {
      try {
        await db.initDatabase();
        await loadCustomers();
      } catch (e) {
        setError('Failed to load customers');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const loadCustomers = useCallback(async () => {
    try {
      let result: ZellerCustomer[];
      if (searchQuery) {
        result = await db.searchCustomers(searchQuery);
      } else if (activeTab === 'All') {
        result = await db.getAllCustomers();
      } else {
        result = await db.getCustomersByRole(activeTab);
      }
      setCustomers(result);
    } catch (e) {
      setError('Failed to load customers');
    }
  }, [activeTab, searchQuery]);

  // Reload when tab or search changes
  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await refetch();
      await loadCustomers();
    } catch (e) {
      // Fallback to local data
      await loadCustomers();
    } finally {
      setLoading(false);
    }
  }, [refetch, loadCustomers]);

  const addCustomer = useCallback(async (customer: Omit<ZellerCustomer, 'id'>) => {
    const { v4: uuidv4 } = require('uuid');
    const newCustomer: ZellerCustomer = {
      ...customer,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    };
    await db.insertCustomer(newCustomer);
    await loadCustomers();
    return newCustomer;
  }, [loadCustomers]);

  const updateCustomer = useCallback(async (customer: ZellerCustomer) => {
    await db.updateCustomer(customer);
    await loadCustomers();
  }, [loadCustomers]);

  const deleteCustomer = useCallback(async (id: string) => {
    await db.deleteCustomer(id);
    await loadCustomers();
  }, [loadCustomers]);

  // Filter customers based on active tab when searching
  const filteredCustomers = searchQuery && activeTab !== 'All'
    ? customers.filter(c => c.role === activeTab)
    : customers;

  return {
    customers: filteredCustomers,
    loading: loading || networkLoading,
    error,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    refresh,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  };
}
