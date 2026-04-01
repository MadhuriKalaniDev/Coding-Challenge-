import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCustomers } from '../src/hooks/useCustomers';
import { TabBar } from '../src/components/TabBar';
import { CustomerItem } from '../src/components/CustomerItem';
import { SearchBar } from '../src/components/SearchBar';

const TABS = ['All', 'Admin', 'Manager'];

export default function HomeScreen() {
  const router = useRouter();
  const {
    customers,
    loading,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    refresh,
    deleteCustomer,
  } = useCustomers();
  const [searchVisible, setSearchVisible] = useState(false);

  const handleCustomerPress = useCallback((id: string) => {
    router.push({ pathname: '/edit', params: { id } });
  }, [router]);

  const renderItem = useCallback(({ item }: { item: any }) => (
    <CustomerItem
      customer={item}
      onPress={() => handleCustomerPress(item.id)}
      onDelete={() => deleteCustomer(item.id)}
      showRole={activeTab === 'All'}
    />
  ), [activeTab, handleCustomerPress, deleteCustomer]);

  const renderEmpty = useCallback(() => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No customers found</Text>
      </View>
    );
  }, [loading]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TabBar tabs={TABS} activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as any)} />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => setSearchVisible(!searchVisible)}
          testID="search-toggle"
        >
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
      />

      {loading && customers.length === 0 ? (
        <ActivityIndicator size="large" color="#0073CF" style={styles.loader} />
      ) : (
        <FlatList
          data={customers}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refresh} tintColor="#0073CF" />
          }
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={customers.length === 0 ? styles.emptyList : undefined}
          testID="customer-list"
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/add')}
        testID="add-button"
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  searchButton: {
    padding: 8,
  },
  searchIcon: {
    fontSize: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  emptyList: {
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0073CF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '300',
  },
});
