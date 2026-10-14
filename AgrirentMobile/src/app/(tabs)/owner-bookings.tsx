import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const API_URL = 'http://10.3.11.46:8000';

type Booking = {
  booking_id: number;
  farmer_id: number;
  equipment_id: number;
  equipment_name: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  status: string;
};

export default function OwnerBookingsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const ownerId = 1;

  useFocusEffect(
  useCallback(() => {
    fetchOwnerBookings();
  }, [])
);

  const fetchOwnerBookings = async () => {
    try {
      const response = await fetch(
        `${API_URL}/owner-bookings/${ownerId}`
      );

      const data = await response.json();
      console.log('OWNER BOOKINGS DATA:', data);

      if (response.ok) {
        setBookings(data);
      } else {
        console.log('Owner bookings error:', data);
      }
    } catch (error) {
      console.log('Error fetching owner bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
  const [year, month, day] = date.split('-');
  return `${day}-${month}-${year}`;
};

const getStatusColor = (status: string) => {
  const value = status.toLowerCase();

    if (value === 'accepted') {
      return '#2e7d32';
    }

    if (value === 'cancelled') {
      return '#c62828';
    }

    return '#f9a825';
  };

  const updateBookingStatus = async (
  bookingId: number,
  action: 'accept' | 'cancel'
) => {
  try {
    const response = await fetch(
      `${API_URL}/bookings/${bookingId}/${action}`,
      {
        method: 'PUT',
      }
    );

    const data = await response.json();

    if (response.ok) {
      Alert.alert(
        'Success',
        action === 'accept'
          ? 'Booking accepted successfully'
          : 'Booking cancelled successfully'
      );

      fetchOwnerBookings();
    } else {
      Alert.alert('Error', data.detail || 'Failed to update booking');
    }
  } catch (error) {
    console.log('Booking status error:', error);
    Alert.alert('Error', 'Unable to update booking');
  }
};


  const renderBooking = ({ item }: { item: Booking }) => {
  console.log('RENDERING BOOKING:', item.booking_id, item.status);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        🚜 Booking ID: {item.booking_id}
      </Text>

      <Text style={styles.info}>
         🚜 Equipment: {item.equipment_name}
      </Text>

      <Text style={styles.info}>
        📅 Start Date: {formatDate(item.start_date)}
      </Text>

      <Text style={styles.info}>
         📅 End Date: {formatDate(item.end_date)}
      </Text>

      <Text style={styles.amount}>
        💰 Amount: ₹{item.total_amount}
      </Text>

      <Text
        style={[
          styles.status,
          { color: getStatusColor(item.status) },
        ]}
      >
        {item.status.toUpperCase()}
      </Text>

      {item.status.toLowerCase() !== 'accepted' &&
 item.status.toLowerCase() !== 'cancelled' && (
  <View style={styles.buttonRow}>
    <TouchableOpacity
      style={styles.acceptButton}
      onPress={() => updateBookingStatus(item.booking_id, 'accept')}
    >
      <Text style={styles.buttonText}>Accept</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.cancelButton}
      onPress={() => updateBookingStatus(item.booking_id, 'cancel')}
    >
      <Text style={styles.buttonText}>Cancel</Text>
    </TouchableOpacity>
  </View>
)}
    </View>
  );
};

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>
          Loading owner bookings...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Owner Bookings</Text>

      {bookings.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>
            No bookings found.
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.booking_id.toString()}
          renderItem={renderBooking}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },

  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  list: {
    paddingBottom: 20,
  },

  card: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 14,
    elevation: 3,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  info: {
    fontSize: 15,
    marginBottom: 6,
  },

  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 6,
  },

  status: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },

  emptyText: {
    fontSize: 18,
    color: '#666',
  },

  buttonRow: {
  flexDirection: 'row',
  marginTop: 14,
  gap: 10,
},

acceptButton: {
  flex: 1,
  backgroundColor: '#2e7d32',
  padding: 12,
  borderRadius: 8,
  alignItems: 'center',
},

cancelButton: {
  flex: 1,
  backgroundColor: '#c62828',
  padding: 12,
  borderRadius: 8,
  alignItems: 'center',
},

buttonText: {
  color: '#ffffff',
  fontSize: 15,
  fontWeight: 'bold',
},
});