import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCustomers } from '../src/hooks/useCustomers';
import { RoleSelector } from '../src/components/RoleSelector';
import { validateName, validateEmail } from '../src/utils/validation';
import { UserRole, ZellerCustomer } from '../src/types';
import * as db from '../src/database/db';

export default function EditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { updateCustomer, deleteCustomer } = useCustomers();
  const [customer, setCustomer] = useState<ZellerCustomer | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Manager');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      await db.initDatabase();
      const all = await db.getAllCustomers();
      const found = all.find(c => c.id === id);
      if (found) {
        setCustomer(found);
        setName(found.name);
        setEmail(found.email || '');
        setRole(found.role);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    const nameError = validateName(name);
    if (nameError) newErrors.name = nameError;
    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    try {
      await updateCustomer({ id: id!, name: name.trim(), email: email.trim(), role });
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Failed to update user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete User', `Delete ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteCustomer(id!);
          router.back();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0073CF" style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.closeButton} testID="close-button">
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} testID="delete-button">
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>Edit User</Text>

          <View style={styles.field}>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              testID="input-name"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
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
            <Text style={styles.submitText}>{submitting ? 'Saving...' : 'Save Changes'}</Text>
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
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  closeButton: { padding: 4 },
  closeText: { fontSize: 24, color: '#0073CF', fontWeight: '300' },
  deleteText: { fontSize: 16, color: '#E53935', fontWeight: '500' },
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
