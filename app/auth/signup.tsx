import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function SignUpScreen() {
  const { register, state, resendConfirmationEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const [resendStatus, setResendStatus] = useState<
    'idle' | 'sending' | 'sent' | 'error'
  >('idle');

  const handleSignUp = async () => {
    setIsLoading(true);
    setShowResendButton(false);
    setResendStatus('idle');
    try {
      await register({ email, password, name });
    } catch (error: any) {
      if (error.message.includes('Email confirmation required')) {
        setShowResendButton(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    setResendStatus('sending');
    const { success, error } = await resendConfirmationEmail(email);
    if (success) {
      setResendStatus('sent');
    } else {
      setResendStatus('error');
      console.error('Failed to resend confirmation email:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      {state.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{state.error}</Text>
          {showResendButton && (
            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResendConfirmation}
              disabled={resendStatus === 'sending'}
            >
              <Text style={styles.resendButtonText}>
                {resendStatus === 'sending'
                  ? 'Sending...'
                  : resendStatus === 'sent'
                  ? 'Email Sent!'
                  : resendStatus === 'error'
                  ? 'Failed to Send'
                  : 'Resend Confirmation Email'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {/* Rest of your form */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  errorText: {
    color: '#c62828',
    marginBottom: 5,
  },
  resendButton: {
    backgroundColor: '#2196f3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  resendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
