import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Spacing, BorderRadius } from '@/constants/Spacing';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function RegisterScreen() {
  const { state, register, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      return;
    }
    await register({ name, email, password });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={[Colors.primary[600], Colors.primary[800]]}
        style={styles.header}
      >
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Start your journey to success</Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor={Colors.neutral[400]}
              value={name}
              onChangeText={setName}
              onFocus={clearError}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={Colors.neutral[400]}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              onFocus={clearError}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Create a password"
              placeholderTextColor={Colors.neutral[400]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              onFocus={clearError}
            />
          </View>

          {state.error && <Text style={styles.errorText}>{state.error}</Text>}

          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={state.isLoading}
          >
            {state.isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Text style={styles.loginTextBold}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  title: {
    ...Typography.h1,
    color: '#fff',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body1,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: Spacing.lg,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.subtitle2,
    color: Colors.neutral[700],
    marginBottom: Spacing.xs,
  },
  input: {
    backgroundColor: Colors.neutral[100],
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: 16,
    color: Colors.neutral[900],
  },
  button: {
    backgroundColor: Colors.primary[600],
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  buttonText: {
    ...Typography.button,
    color: '#fff',
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error[500],
    marginTop: Spacing.sm,
  },
  loginLink: {
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
  loginText: {
    ...Typography.body2,
    color: Colors.neutral[600],
  },
  loginTextBold: {
    color: Colors.primary[600],
    fontWeight: '600',
  },
});
