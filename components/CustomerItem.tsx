import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ZellerCustomer } from '../types';

interface CustomerItemProps {
  customer: ZellerCustomer;
  onPress: () => void;
  onDelete: () => void;
  showRole?: boolean;
}

export function CustomerItem({ customer, onPress, onDelete, showRole = true }: CustomerItemProps) {
  const initial = customer.name ? customer.name.charAt(0).toUpperCase() : '?';

  const handleLongPress = () => {
    Alert.alert(
      'Delete Customer',
      `Are you sure you want to delete ${customer.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      onLongPress={handleLongPress}
      testID={`customer-item-${customer.id}`}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{customer.name}</Text>
      </View>
      {showRole && customer.role === 'Admin' && (
        <Text style={styles.roleTag}>Admin</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0073CF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  roleTag: {
    fontSize: 13,
    color: '#666',
    fontWeight: '400',
  },
});
