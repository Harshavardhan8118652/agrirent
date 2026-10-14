import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

const API_URL = 'http://10.3.11.46:8000';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const loginPhone = await AsyncStorage.getItem('login_phone');

      if (!token) {
        router.replace('/login');
        return;
      }

      setPhone(loginPhone || '');

      const tokenParts = token.split('.');

      if (tokenParts.length !== 3) {
        throw new Error('Invalid login token');
      }

      const payload = JSON.parse(
        atob(
          tokenParts[1]
            .replace(/-/g, '+')
            .replace(/_/g, '/')
        )
      );

      const currentUserId = payload.user_id;

      const response = await fetch(`${API_URL}/users`);
      const users = await response.json();

      const currentUser = users.find(
        (user: any) =>
          Number(user.user_id) === Number(currentUserId)
      );

      if (!currentUser) {
        throw new Error('User not found');
      }

      setName(currentUser.name || '');
      setRole(currentUser.role || '');
    } catch (error) {
      console.log('PROFILE ERROR:', error);

      Alert.alert(
        'Profile Error',
        'Unable to load profile details.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity
  style={styles.backButton}
  onPress={() => router.back()}
>
  <Text style={styles.backText}>← Back</Text>
</TouchableOpacity>
      <Text style={styles.icon}>👤</Text>

      <Text style={styles.title}>
        My Profile
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>
  {loading ? 'Loading...' : name}
</Text>
        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>
  {loading ? 'Loading...' : role}
</Text>

        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>
  {loading ? 'Loading...' : phone}
</Text>
      </View>
            <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => router.replace('/login')}
      >
        <Text style={styles.logoutText}>
          🔴 Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F5',
    padding: 20,
    alignItems: 'center',
  },

  icon: {
    fontSize: 60,
    marginTop: 50,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 25,
  },

  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
  },

  label: {
    fontSize: 14,
    color: '#777',
    marginTop: 10,
  },

  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },

  backButton: {
  alignSelf: 'flex-start',
  marginTop: 10,
  marginBottom: 10,
},

backText: {
  fontSize: 17,
  color: '#2E7D32',
  fontWeight: 'bold',
},

  logoutButton: {
    width: '100%',
    backgroundColor: '#D32F2F',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },

  logoutText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
});