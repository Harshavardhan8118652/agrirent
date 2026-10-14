import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import { router } from 'expo-router';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');

      if (!token) {
        router.replace('/login');
        return;
      }

      const tokenParts = token.split('.');

      if (tokenParts.length !== 3) {
        throw new Error('Invalid login token');
      }

      const payload = JSON.parse(
        globalThis.atob(
          tokenParts[1]
            .replace(/-/g, '+')
            .replace(/_/g, '/')
        )
      );

      const currentUserId = Number(payload.user_id);

      setUserId(currentUserId);

      const response = await fetch(
        'http://10.3.11.46:8000/notifications'
      );

      const data = await response.json();

      const userNotifications = Array.isArray(data)
        ? data.filter(
            (item) =>
              Number(item.user_id) === currentUserId
          )
        : [];

      setNotifications(userNotifications);
    } catch (error) {
      console.log('NOTIFICATIONS ERROR:', error);
    }
  };

  fetchNotifications();
}, []);

  return (
  <View style={styles.container}>

    <TouchableOpacity
      style={styles.backButton}
      onPress={() => router.back()}
    >
      <Text style={styles.backText}>← Back</Text>
    </TouchableOpacity>

    <Text style={styles.title}>
      🔔 Notifications
    </Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) =>
          String(item.notification_id || item.id)
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No notifications yet.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.message}>
              {item.message || 'New notification'}
            </Text>

            {item.created_at && (
              <Text style={styles.date}>
                {String(item.created_at)}
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F5',
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 50,
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  message: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },

  date: {
    fontSize: 12,
    color: '#777777',
    marginTop: 8,
  },

  emptyText: {
    fontSize: 16,
    color: '#777777',
    textAlign: 'center',
    marginTop: 40,
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
});