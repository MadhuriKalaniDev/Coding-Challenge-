import { useState, useEffect, useCallback } from 'react';
import * as db from '../database/db';
import { ZellerCustomer } from '../types';

export function useCustomers() {
  const [customers, setCustomers] = useState<ZellerCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'All' | 'Admin' | 'Manager'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await loadCustomers();
    setLoading(false);
  };

  const loadCustomers = useCallback(async () => {
    let result: ZellerCustomer[];

    if (searchQuery) {
      result = await db.searchCustomers(searchQuery);
    } else if (activeTab === 'All') {
      result = await db.getAllCustomers();
    } else {
      result = await db.getCustomersByRole(activeTab);
    }

    setCustomers(result);
  }, [activeTab, searchQuery]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const addCustomer = async (customer: Omit<ZellerCustomer, 'id'>) => {
    const newCustomer = { ...customer, id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}` };
    await db.insertCustomer(newCustomer);
    await loadCustomers();
  };

  const updateCustomer = async (customer: ZellerCustomer) => {
    await db.updateCustomer(customer);
    await loadCustomers();
  };

  const deleteCustomer = async (id: string) => {
    await db.deleteCustomer(id);
    await loadCustomers();
  };

  return {
    customers,
    loading,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  };
}