import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function BookingDetailsScreen() {
  const {
  bookingId,
  equipmentId,
  equipmentName,
  startDate,
  endDate,
  totalAmount,
  status,
} = useLocalSearchParams();

  const currentStatus = String(status).toLowerCase();

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        📋 Booking Details
      </Text>

      <View style={styles.card}>

        <Text style={styles.info}>
          🆔 Booking ID: {bookingId}
        </Text>

        <Text style={styles.info}>
          🚜 Equipment ID: {equipmentId}
        </Text>

        <Text style={styles.info}>
          🚜 Equipment: {equipmentName}
        </Text>

        <Text style={styles.info}>
          📅 Start Date: {startDate}
        </Text>

        <Text style={styles.info}>
          📅 End Date: {endDate}
        </Text>

        <Text style={styles.price}>
          💰 Total Amount: ₹{totalAmount}
        </Text>

        <Text style={styles.status}>
          {currentStatus === 'pending'
            ? '🟡 Pending'
            : currentStatus === 'accepted'
            ? '🟢 Accepted'
            : currentStatus === 'cancelled'
            ? '🔴 Cancelled'
            : currentStatus === 'completed'
            ? '🔵 Completed'
            : `⚪ ${status}`}
        </Text>

      </View>

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
    padding: 20,
    borderRadius: 12,
  },

  info: {
    fontSize: 17,
    marginBottom: 15,
  },

  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  status: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});