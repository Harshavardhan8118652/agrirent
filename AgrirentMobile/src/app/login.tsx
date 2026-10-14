import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function HomeScreen() {
  const [phone , setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    console.log('LOGIN BUTTON PRESSED');
  if (!phone || !password) {
    Alert.alert('Missing Details', 'Please enter phone number and password.');
    return;
  }

  try {
    console.log('SENDING LOGIN REQUEST');

const response = await fetch('http://10.3.11.46:8000/login', {
      
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `username=${encodeURIComponent(phone)}&password=${encodeURIComponent(password)}`,
    });

    const data = await response.json();

    if (!response.ok) {
      Alert.alert('Login Failed', data.detail || 'Invalid login details.');
      return;
    }
    await AsyncStorage.setItem('access_token', data.access_token);
    await AsyncStorage.setItem('login_phone', phone);

    Alert.alert(
  'Login Successful',
  'Welcome to AgriRent!',
  [
    {
      text: 'Continue',
      onPress: () => router.replace('/(tabs)'),


    },
  ]
);
  } catch (error) {
  console.log('LOGIN ERROR:', error);
  Alert.alert('Connection Error', String(error));
}
};

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.logo}>🌾</Text>

        <Text style={styles.title}>AgriRent</Text>

        <Text style={styles.subtitle}>
          Farmer Equipment Rental Marketplace
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Phone Number</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            placeholderTextColor="#888"
            value={phone}
            onChangeText={setPhone}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>

          <View style={styles.passwordContainer}>
  <TextInput
    style={styles.passwordInput}
    placeholder="Enter your password"
    placeholderTextColor="#888"
    value={password}
    onChangeText={setPassword}
    secureTextEntry={!showPassword}
    autoCapitalize="none"
  />

  <Pressable
    style={styles.eyeButton}
    onPress={() => setShowPassword(!showPassword)}
  >
    <Text style={styles.eyeText}>
      {showPassword ? '🙈' : '👁️'}
    </Text>
  </Pressable>
</View>

          <Pressable style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginText}>Login</Text>
          </Pressable>

          <Pressable onPress={() => router.push('/register')}>
            <Text style={styles.registerText}>
              Don't have an account? <Text style={styles.registerBold}>Create Account</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8F2',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },

  logo: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 8,
  },

  title: {
    fontSize: 38,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2E7D32',
  },

  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
    marginBottom: 40,
  },

  form: {
    width: '100%',
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 7,
  },

  input: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D5D5D5',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
  },

  loginButton: {
    height: 52,
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  loginText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  registerText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 24,
    fontSize: 14,
  },

  registerBold: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },

  passwordContainer: {
  position: 'relative',
  marginBottom: 20,
},

passwordInput: {
  height: 52,
  backgroundColor: '#FFFFFF',
  borderWidth: 1,
  borderColor: '#D5D5D5',
  borderRadius: 10,
  paddingHorizontal: 16,
  paddingRight: 52,
  fontSize: 16,
},

eyeButton: {
  position: 'absolute',
  right: 14,
  top: 0,
  height: 52,
  justifyContent: 'center',
  alignItems: 'center',
},

eyeText: {
  fontSize: 20,
},
});