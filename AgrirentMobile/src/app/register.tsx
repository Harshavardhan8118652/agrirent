import React, { useState } from 'react';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function RegisterScreen() {
  const [name, setName] = useState('');
const [phone, setPhone] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [role, setRole] = useState('');
const [village, setVillage] = useState('');
const [district, setDistrict] = useState('');
const [state, setState] = useState('');
const [latitude, setLatitude] = useState<number | null>(null);
const [longitude, setLongitude] = useState<number | null>(null);


const getCurrentLocation = async () => {
  try {
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Location Permission',
        'Please allow location access to continue.'
      );
      return;
    }

    const location =
      await Location.getCurrentPositionAsync({});

    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);

    Alert.alert(
      'Location Saved',
      'Your current location has been captured.'
    );
  } catch (error) {
    console.log('LOCATION ERROR:', error);

    Alert.alert(
      'Location Error',
      'Unable to get your current location.'
    );
  }
};
  const handleRegister = async () => {
  if (
    !name ||
    !phone ||
    !email ||
    !password ||
    !village ||
    !district ||
    !state ||
    !role
  ) {
    Alert.alert(
      'Missing Details',
      'Please fill in all fields.'
    );
    return;
  }

  try {
    const response = await fetch(
      'http://10.3.11.46:8000/register',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
  name,
  phone,
  email,
  password,
  role,
  village,
  district,
  state,
  latitude,
  longitude,
}),
      }
    );

    const responseText = await response.text();

let data: any = {};

try {
  data = JSON.parse(responseText);
} catch {
  data = {
    detail: responseText,
  };
}

    if (response.ok) {

  if (
    role === 'farmer' &&
    latitude !== null &&
    longitude !== null &&
    data.user_id
  ) {
    try {
      await fetch(
        'http://10.3.11.46:8000/notify-nearby-owners',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            farmer_id: data.user_id,
            latitude,
            longitude,
            radius_km: 10,
          }),
        }
      );
    } catch (error) {
      console.log('NEARBY OWNER NOTIFICATION ERROR:', error);
    }
  }

  Alert.alert(
    'Registration Successful',
        'Your AgriRent account has been created.'
      );

      router.replace('/login');
    } else {
      Alert.alert(
        'Registration Failed',
        data.detail || data.message || JSON.stringify(data)
      );
    }
  } catch (error) {
    console.log('REGISTER ERROR:', error);

    Alert.alert(
      'Connection Error',
      'Could not connect to AgriRent server.'
    );
  }
};

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.logo}>🌾</Text>

        <Text style={styles.title}>Create Account</Text>

        <Text style={styles.subtitle}>
          Join AgriRent today
        </Text>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Phone Number</Text>
<TextInput
  style={styles.input}
  placeholder="Enter your phone number"
  placeholderTextColor="#888"
  value={phone}
  onChangeText={setPhone}
  keyboardType="phone-pad"
/>

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
  <TextInput
    style={styles.passwordInput}
    placeholder="Create a password"
    placeholderTextColor="#888"
    value={password}
    onChangeText={setPassword}
    secureTextEntry={!showPassword}
  />

  <Pressable onPress={() => setShowPassword(!showPassword)}>
    <Text style={styles.eyeText}>
      {showPassword ? '🙈' : '👁️'}
    </Text>
  </Pressable>
</View>

        <Text style={styles.label}>Email</Text>
<TextInput
  style={styles.input}
  placeholder="Enter your email"
  placeholderTextColor="#888"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  autoCapitalize="none"
/>

        
        <Text style={styles.label}>State</Text>
<TextInput
  style={styles.input}
  placeholder="Enter your state"
  placeholderTextColor="#888"
  value={state}
  onChangeText={setState}
/>
        <Text style={styles.label}>District</Text>
<TextInput
  style={styles.input}
  placeholder="Enter your district"
  placeholderTextColor="#888"
  value={district}
  onChangeText={setDistrict}
/>
        <Text style={styles.label}>Village</Text>
<TextInput
  style={styles.input}
  placeholder="Enter your village"
  placeholderTextColor="#888"
  value={village}
  onChangeText={setVillage}
/>

        <Text style={styles.label}>Role</Text>
        <View style={styles.roleContainer}>
          <Pressable
            style={[
              styles.roleButton,
              role === 'farmer' && styles.selectedRole,
            ]}
            onPress={() => {
  setRole('farmer');
  getCurrentLocation();
}}
          >
            <Text
              style={[
                styles.roleText,
                role === 'farmer' && styles.selectedRoleText,
              ]}
            >
              👨Farmer
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.roleButton,
              role === 'owner' && styles.selectedRole,
            ]}
            onPress={() => {
  setRole('owner');
  getCurrentLocation();
}}
          >
            <Text
              style={[
                styles.roleText,
                role === 'owner' && styles.selectedRoleText,
              ]}
            >
              🚜 Equipment Owner
            </Text>
          </Pressable>
        </View>

        <Pressable style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Create Account</Text>
        </Pressable>

        <Pressable onPress={() => router.push('/(tabs)')}>
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.loginBold}>Login</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8F2',
  },

  content: {
    paddingHorizontal: 28,
    paddingTop: 50,
    paddingBottom: 40,
  },

  logo: {
    fontSize: 55,
    textAlign: 'center',
    marginBottom: 8,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2E7D32',
  },

  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
    marginBottom: 30,
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
    marginBottom: 18,
  },

  roleContainer: {
    gap: 12,
    marginBottom: 25,
  },

  roleButton: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D5D5D5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectedRole: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },

  roleText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },

  selectedRoleText: {
    color: '#FFFFFF',
  },

  registerButton: {
    height: 52,
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  loginText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 24,
    fontSize: 14,
  },

  loginBold: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },

  passwordContainer: {
  height: 52,
  backgroundColor: '#FFFFFF',
  borderWidth: 1,
  borderColor: '#D5D5D5',
  borderRadius: 10,
  paddingLeft: 16,
  paddingRight: 12,
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 18,
},

passwordInput: {
  flex: 1,
  fontSize: 16,
},

eyeText: {
  fontSize: 20,
},
});