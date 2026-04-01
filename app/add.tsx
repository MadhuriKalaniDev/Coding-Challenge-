import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCustomers } from '../src/hooks/useCustomers';
import { RoleSelector } from '../src/components/RoleSelector';
import { validateCustomerForm } from '../src/utils/validation';
import { UserRole } from '../src/types';

export default function AddScreen() {
  const router = useRouter();
  const { addCustomer } = useCustomers();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Manager');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const validationErrors = validateCustomerForm({ firstName, lastName, email, role });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      const name = `${firstName.trim()} ${lastName.trim()}`.trim();
      await addCustomer({ name, email: email.trim(), role });
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton} testID="close-button">
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.title}>New User</Text>

          <View style={styles.field}>
            <TextInput
              style={[styles.input, errors.firstName && styles.inputError]}
              placeholder="First Name"
              placeholderTextColor="#999"
              value={firstName}
              onChangeText={setFirstName}
              testID="input-firstName"
            />
            {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
          </View>

          <View style={styles.field}>
            <TextInput
              style={[styles.input, errors.lastName && styles.inputError]}
              placeholder="Last Name"
              placeholderTextColor="#999"
              value={lastName}
              onChangeText={setLastName}
              testID="input-lastName"
            />
            {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
          </View>

          <View style={styles.field}>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              testID="input-email"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>User Role</Text>
            <RoleSelector value={role} onChange={setRole} />
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
            testID="submit-button"
          >
            <Text style={styles.submitText}>
              {submitting ? 'Creating...' : 'Create User'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },
  scrollContent: { padding: 20 },
  closeButton: { padding: 4, alignSelf: 'flex-start' },
  closeText: { fontSize: 24, color: '#0073CF', fontWeight: '300' },
  title: { fontSize: 28, fontWeight: '700', color: '#333', marginTop: 12, marginBottom: 32 },
  field: { marginBottom: 24 },
  input: {
    fontSize: 16, borderBottomWidth: 1, borderBottomColor: '#E0E0E0',
    paddingVertical: 12, color: '#333',
  },
  inputError: { borderBottomColor: '#E53935' },
  errorText: { color: '#E53935', fontSize: 12, marginTop: 4 },
  label: { fontSize: 16, fontWeight: '500', color: '#333', marginBottom: 12 },
  buttonContainer: { padding: 20, paddingBottom: 30 },
  submitButton: {
    backgroundColor: '#0073CF', borderRadius: 28, paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
