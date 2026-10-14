import { useEffect, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';

export default function MyBookingsScreen() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);

  const updateBookingStatus = async (
    bookingId: number,
    newStatus: string
  ) => {
    try {
      const response = await fetch(
        `http://10.3.11.46:8000/bookings/${bookingId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setBookings((currentBookings) =>
          currentBookings.map((booking) =>
            booking.booking_id === bookingId
              ? { ...booking, status: newStatus }
              : booking
          )
        );
      } else {
        console.log('STATUS UPDATE ERROR:', data);
      }
    } catch (error) {
      console.log('STATUS UPDATE ERROR:', error);
    }
  };

  useFocusEffect(
  useCallback(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(
          'http://10.3.11.46:8000/bookings'
        );

        const data = await response.json();

        const myBookings = data.filter(
          (booking: any) => booking.farmer_id === 23
        );

        setBookings(myBookings);
      } catch (error) {
        console.log('BOOKINGS ERROR:', error);
      }
    };

    fetchBookings();
  }, [])
);
    useEffect(() => {
  const fetchEquipment = async () => {
    try {
      const response = await fetch(
        'http://10.3.11.46:8000/equipment'
      );

      const data = await response.json();

      setEquipment(data);
    } catch (error) {
      console.log('EQUIPMENT ERROR:', error);
    }
  };

  fetchEquipment();
}, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        📋 My Bookings
      </Text>

      <FlatList
        data={bookings}
        keyExtractor={(item) =>
          item.booking_id.toString()
        }
        renderItem={({ item }) => (
          <View style={styles.card}>

            <Text style={styles.info}>
              🆔 Booking ID: {item.booking_id}
            </Text>

            <Text style={styles.equipment}>
              🚜{' '}
              {equipment.find(
                (eq) =>
                  eq.equipment_id === item.equipment_id
              )?.name || 'Equipment'}
            </Text>

            <Text style={styles.info}>
              📅 {item.start_date} - {item.end_date}
            </Text>

            <Text style={styles.price}>
              💰 ₹{item.total_amount}
            </Text>

            <TouchableOpacity
  style={styles.button}
  onPress={() =>
    router.push({
      pathname: '/booking-details',
      params: {
  bookingId: item.booking_id,
  equipmentId: item.equipment_id,
  equipmentName:
    equipment.find(
      (eq) =>
        eq.equipment_id === item.equipment_id
    )?.name || 'Equipment',
  startDate: item.start_date,
  endDate: item.end_date,
  totalAmount: item.total_amount,
  status: item.status,
},
    })
  }
>
  <Text style={styles.buttonText}>
    View Details
  </Text>
</TouchableOpacity>

            <Text style={styles.status}>
  {String(item.status).toLowerCase() === 'pending'
    ? '🟡 Pending'
    : String(item.status).toLowerCase() === 'accepted'
    ? '🟢 Accepted'
    : String(item.status).toLowerCase() === 'cancelled'
    ? '🔴 Cancelled'
    : String(item.status).toLowerCase() === 'completed'
    ? '🔵 Completed'
    : `⚪ ${item.status}`}
</Text>

            {String(item.status).toLowerCase() ===
              'pending' && (
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  updateBookingStatus(
                    item.booking_id,
                    'Accepted'
                  )
                }
              >
                <Text style={styles.buttonText}>
                  Accept Booking
                </Text>
              </TouchableOpacity>
            )}

            {String(item.status).toLowerCase() === 
              'pending' && (
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  updateBookingStatus(
                    item.booking_id,
                    'cancelled'
                  )
                }
              >
    <Text style={styles.buttonText}>
      Cancel Booking
    </Text>
  </TouchableOpacity>
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
    marginBottom: 25,
  },

  card: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
  },

  equipment: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  info: {
    fontSize: 16,
    marginBottom: 8,
  },

  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  status: {
    fontSize: 16,
    marginBottom: 12,
  },

  button: {
    backgroundColor: '#2E7D32',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  cancelButton: {
  backgroundColor: '#D32F2F',
  padding: 12,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 10,
},

cancelButtonText: {
  color: '#FFFFFF',
  fontSize: 16,
  fontWeight: 'bold',
},

detailsButton: {
  backgroundColor: '#1976D2',
  padding: 12,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 10,
},

detailsButtonText: {
  color: '#FFFFFF',
  fontSize: 16,
  fontWeight: 'bold',
},
});