import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { UserRole } from '../types';

interface RoleSelectorProps {
  value: UserRole;
  onChange: (role: UserRole) => void;
}

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <View style={styles.container}>
      {(['Admin', 'Manager'] as UserRole[]).map((role) => (
        <TouchableOpacity
          key={role}
          style={[styles.option, value === role && styles.activeOption]}
          onPress={() => onChange(role)}
          testID={`role-${role}`}
        >
          <Text style={[styles.optionText, value === role && styles.activeOptionText]}>
            {role}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 0,
  },
  option: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#F1F3F4',
  },
  activeOption: {
    backgroundColor: '#E8F0FE',
    borderWidth: 1.5,
    borderColor: '#0073CF',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
  },
  activeOptionText: {
    color: '#0073CF',
    fontWeight: '600',
  },
});
